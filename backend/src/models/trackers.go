package models

type AddTracker struct {
	Title       string  `json:"title" validate:"required,max=100"`
	Description *string `json:"description,omitempty" validate:"omitempty,min=1,max=1000"`
}

type EditTracker struct {
	Title       *string `json:"title,omitempty" validate:"omitempty,min=1,max=100"`
	Description *string `json:"description,omitempty" validate:"omitempty,min=1,max=1000"`
}
