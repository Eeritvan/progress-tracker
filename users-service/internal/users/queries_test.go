package users

import (
	"context"
	"testing"
	"users-service/graph/model"

	"github.com/pashagolub/pgxmock/v4"
)

func TestQueryUser(t *testing.T) {
	mockDB, err := pgxmock.NewConn()
	if err != nil {
		t.Fatalf("failed to create mock: %v", err)
	}
	defer mockDB.Close(context.Background())

	tests := []struct {
		name     string
		username string
		mockFn   func()
		want     *model.User
		wantErr  error
	}{
		{
			name:     "valid query",
			username: "testuser",
			mockFn: func() {
				rows := pgxmock.NewRows([]string{"username", "password_hash", "totp"}).
					AddRow("testuser", "hashed_password", nil)
				mockDB.ExpectQuery("SELECT username, password_hash, COALESCE\\(totp, ''\\)").
					WithArgs("testuser").
					WillReturnRows(rows)
			},
			want: &model.User{
				Username: "testuser",
				Password: "hashed_password",
				Totp:     nil,
			},
			wantErr: nil,
		},
		{
			name:     "nonexistent username",
			username: "fakeuser",
			mockFn: func() {
				rows := pgxmock.NewRows([]string{"username", "password_hash", "totp"}).
					AddRow("testuser", "hashed_password", nil)
				mockDB.ExpectQuery("SELECT username, password_hash, COALESCE\\(totp, ''\\)").
					WithArgs("testuser").
					WillReturnRows(rows)
			},
			want:    nil,
			wantErr: ErrInformationFetch,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			tt.mockFn()

			result, err := QueryUser(context.Background(), mockDB, tt.username)
			if err != tt.wantErr {
				t.Errorf("QueryUser(): %v, want %v", err, tt.want)
			}

			if result != nil && tt.want != nil {
				if result.ID != tt.want.ID || result.Username != tt.want.Username || result.Password != tt.want.Password || result.Totp != tt.want.Totp {
					t.Errorf("QueryUser() = %v, want %v", result, tt.want)
				}
			} else if result != tt.want {
				t.Errorf("QueryUser() = %v, want %v", result, tt.want)
			}
		})
	}
}

func TestUpdateUserTotp(t *testing.T) {
	mockDB, err := pgxmock.NewConn()
	if err != nil {
		t.Fatalf("failed to create mock: %v", err)
	}
	defer mockDB.Close(context.Background())

	tests := []struct {
		name       string
		username   string
		totpSecret string
		mockFn     func()
		wantErr    error
	}{
		{
			name:       "Updating totp secret",
			username:   "testuser",
			totpSecret: "testtotp",
			mockFn: func() {
				mockDB.ExpectBegin()
				pgxmock.NewRows([]string{"username", "password_hash", "totp"}).
					AddRow("testuser", "hashed_password", nil)
				mockDB.ExpectExec("UPDATE users SET totp = \\$2 WHERE username = \\$1").
					WithArgs("testuser", "testtotp").
					WillReturnResult(pgxmock.NewResult("UPDATE", 1))
				mockDB.ExpectCommit()
			},
			wantErr: nil,
		},
		{
			name:       "Updating totp to null",
			username:   "testuser",
			totpSecret: "",
			mockFn: func() {
				mockDB.ExpectBegin()
				pgxmock.NewRows([]string{"username", "password_hash", "totp"}).
					AddRow("testuser", "hashed_password", "totp_secret")
				mockDB.ExpectExec("UPDATE users SET totp = \\$2 WHERE username = \\$1").
					WithArgs("testuser", "").
					WillReturnResult(pgxmock.NewResult("UPDATE", 1))
				mockDB.ExpectCommit()
			},
			wantErr: nil,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			tt.mockFn()
			err := UpdateUserTotp(context.Background(), mockDB, tt.username, tt.totpSecret)
			if err != tt.wantErr {
				t.Errorf("UpdateUserTotp(): %v, wanted %v", err, tt.wantErr)
			}
		})
	}
}

func TestCreateUser(t *testing.T) {
	mockDB, err := pgxmock.NewConn()
	if err != nil {
		t.Fatalf("failed to create mock: %v", err)
	}
	defer mockDB.Close(context.Background())

	tests := []struct {
		name     string
		username string
		password []byte
		mockFn   func()
		want     *model.User
		wantErr  error
	}{
		{
			name:     "Creating new user",
			username: "testuser",
			password: []byte("hashed_password"),
			mockFn: func() {
				mockDB.ExpectBegin()
				rows := pgxmock.NewRows([]string{"id", "username", "password_hash", "totp"}).
					AddRow("00000000-0000-0000-0000-000000000000", "testuser", "hashed_password", nil)
				mockDB.ExpectQuery("INSERT INTO users \\(username, password_hash\\) VALUES \\(\\$1, \\$2\\) RETURNING id, username, password_hash, totp").
					WithArgs("testuser", []byte("hashed_password")).
					WillReturnRows(rows)
				mockDB.ExpectCommit()
			},
			want: &model.User{
				Username: "testuser",
				Password: "hashed_password",
			},
			wantErr: nil,
		},
		{
			name:     "Creating too short username",
			username: "x",
			password: []byte("hashed_password"),
			mockFn: func() {
				mockDB.ExpectBegin()
				mockDB.ExpectQuery("INSERT INTO users \\(username, password_hash\\) VALUES \\(\\$1, \\$2\\) RETURNING id, username, password_hash, totp").
					WithArgs("x", []byte("hashed_password")).
					WillReturnError(ErrUserCreationFailed)
				mockDB.ExpectRollback()
			},
			want:    nil,
			wantErr: ErrUserCreationFailed,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			tt.mockFn()
			result, err := CreateUser(context.Background(), mockDB, tt.username, tt.password)
			if err != tt.wantErr {
				t.Errorf("CreateUser(): %v, wanted %v", err, tt.wantErr)
			}
			if result != nil && tt.want != nil {
				if result.Username != tt.want.Username || result.Password != tt.want.Password {
					t.Errorf("CreateUser() = %v, want %v", result, tt.want)
				}
			} else if result != tt.want {
				t.Errorf("CreateUser() = %v, want %v", result, tt.want)
			}
		})
	}
}
