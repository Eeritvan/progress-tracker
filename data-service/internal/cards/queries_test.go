package cards

import (
	"context"
	"errors"
	"fmt"
	"testing"
	"time"

	"github.com/pashagolub/pgxmock/v4"
)

func TestDB_DeleteCard(t *testing.T) {
	mockDB, err := pgxmock.NewConn()
	if err != nil {
		t.Fatalf("failed to create mock: %v", err)
	}
	defer mockDB.Close(context.Background())

	tests := []struct {
		name     string
		username string
		cardID   string
		mockFn   func()
		want     bool
		wantErr  error
	}{
		{
			name:     "successful delete",
			username: "testuser",
			cardID:   "card123",
			mockFn: func() {
				mockDB.ExpectBegin()
				mockDB.ExpectExec("DELETE FROM cards").
					WithArgs("testuser", "card123").
					WillReturnResult(pgxmock.NewResult("UPDATE", 1))
				mockDB.ExpectCommit()
				mockDB.ExpectRollback()
			},
			want:    true,
			wantErr: nil,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			tt.mockFn()
			result, err := DB_DeleteCard(context.Background(), mockDB, tt.username, tt.cardID)

			if !errors.Is(err, tt.wantErr) {
				t.Errorf("DB_DeleteCard(): %v", err)
				return
			}
			if result != tt.want {
				t.Errorf("DB_DeleteCard(): %v", result)
			}
		})
	}
}
func TestDB_CompleteDay(t *testing.T) {
	mockDB, err := pgxmock.NewConn()
	if err != nil {
		t.Fatalf("failed to create mock: %v", err)
	}
	defer mockDB.Close(context.Background())

	currentTime := time.Now().Format("2006-01-02")

	tests := []struct {
		name     string
		username string
		cardID   string
		mockFn   func()
		want     bool
		wantErr  error
	}{
		{
			name:     "successful complete day",
			username: "testuser",
			cardID:   "card123",
			mockFn: func() {
				mockDB.ExpectBegin()
				mockDB.ExpectQuery("UPDATE cards").
					WithArgs("testuser", "card123", currentTime).
					WillReturnRows(pgxmock.NewRows([]string{"completed"}).AddRow(true))
				mockDB.ExpectCommit()
				mockDB.ExpectRollback()
			},
			want:    true,
			wantErr: nil,
		},
		{
			name:     "successful uncomplete day",
			username: "testuser",
			cardID:   "card123",
			mockFn: func() {
				mockDB.ExpectBegin()
				mockDB.ExpectQuery("UPDATE cards").
					WithArgs("testuser", "card123", currentTime).
					WillReturnRows(pgxmock.NewRows([]string{"completed"}).AddRow(false))
				mockDB.ExpectCommit()
			},
			want:    false,
			wantErr: nil,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			tt.mockFn()
			result, err := DB_CompleteDay(context.Background(), mockDB, tt.username, tt.cardID)

			if !errors.Is(err, tt.wantErr) {
				t.Errorf("DB_CompleteDay(): %v", err)
				return
			}
			if result != tt.want {
				t.Errorf("DB_CompleteDay(): %v", result)
			}
		})
	}
}

func TestDB_ReorderCards(t *testing.T) {
	mockDB, err := pgxmock.NewConn()
	if err != nil {
		t.Fatalf("failed to create mock: %v", err)
	}
	defer mockDB.Close(context.Background())

	tests := []struct {
		name     string
		username string
		input    []string
		mockFn   func()
		want     bool
		wantErr  error
	}{
		{
			name:     "successful reorder",
			username: "testuser",
			input:    []string{"card1", "card2", "card3"},
			mockFn: func() {
				mockDB.ExpectBegin()
				mockDB.ExpectExec("UPDATE cards SET order_index = \\$1").
					WithArgs(0, "testuser", "card1").
					WillReturnResult(pgxmock.NewResult("UPDATE", 1))
				mockDB.ExpectExec("UPDATE cards SET order_index = \\$1").
					WithArgs(1, "testuser", "card2").
					WillReturnResult(pgxmock.NewResult("UPDATE", 1))
				mockDB.ExpectExec("UPDATE cards SET order_index = \\$1").
					WithArgs(2, "testuser", "card3").
					WillReturnResult(pgxmock.NewResult("UPDATE", 1))
				mockDB.ExpectCommit()
				mockDB.ExpectRollback()
			},
			want:    true,
			wantErr: nil,
		},
		{
			name:     "update fails",
			username: "testuser",
			input:    []string{"card1"},
			mockFn: func() {
				mockDB.ExpectBegin()
				mockDB.ExpectExec("UPDATE cards SET order_index = \\$1").
					WithArgs(0, "testuser", "card1").
					WillReturnError(fmt.Errorf("update failed"))
				mockDB.ExpectRollback()
			},
			want:    false,
			wantErr: fmt.Errorf("update failed"),
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			tt.mockFn()
			result, err := DB_ReorderCards(context.Background(), mockDB, tt.username, tt.input)
			if err != nil && tt.wantErr != nil && err.Error() != tt.wantErr.Error() {
				t.Errorf("DB_ReorderCards(): %v", err)
			}
			if result != tt.want {
				t.Errorf("DB_ReorderCards(): %v", result)
			}
		})
	}
}

func Test_DB_ResetALlCards(t *testing.T) {
	mockDB, err := pgxmock.NewConn()
	if err != nil {
		t.Fatalf("failed to create mock: %v", err)
	}
	defer mockDB.Close(context.Background())

	tests := []struct {
		name     string
		username string
		mockFn   func()
		want     bool
		wantErr  error
	}{
		{
			name:     "successful reset",
			username: "testuser",
			mockFn: func() {
				mockDB.ExpectBegin()
				mockDB.ExpectExec("DELETE FROM cards WHERE owner = \\$1").
					WithArgs("testuser").
					WillReturnResult(pgxmock.NewResult("DELETE", 1))
				mockDB.ExpectCommit()
				mockDB.ExpectRollback()
			},
			want:    true,
			wantErr: nil,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			tt.mockFn()
			result, err := DB_ResetAllCards(context.Background(), mockDB, tt.username)
			if err != tt.wantErr {
				t.Errorf("DB_ReorderCards(): %v", err)
			}
			if result != tt.want {
				t.Errorf("DB_ReorderCards(): %v", result)
			}
		})
	}
}
