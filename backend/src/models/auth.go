package models

type Signup struct {
	Name                 string `json:"name" validate:"required,max=100"`
	Password             string `json:"password" validate:"required,min=8,max=100"`
	PasswordConfirmation string `json:"passwordConfirmation" validate:"required,eqfield=Password,min=8,max=100"`
}

type Login struct {
	Name     string `json:"name" validate:"required,max=100"`
	Password string `json:"password" validate:"required,max=100"`
}
