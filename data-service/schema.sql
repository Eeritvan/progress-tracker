CREATE TABLE colors (
    id SERIAL PRIMARY KEY,
    name TEXT UNIQUE NOT NULL
);

INSERT INTO colors (name) VALUES
    ('darkseagreen'), ('lightgreen'), ('mediumaquamarine'), 
    ('greenyellow'), ('aqua'), ('paleturquoise'),
    ('skyblue'), ('teal'), ('slateblue'), ('plum'),
    ('pink'), ('hotpink'), ('fuchsia'), ('tomato'), ('orangered');

CREATE TABLE icons (
    id SERIAL PRIMARY KEY,
    name TEXT UNIQUE NOT NULL
);

INSERT INTO icons (name) VALUES
    ('Book'), ('Code'), ('TentTree'), ('School'),
    ('AlarmClock'), ('Brush'), ('CalendarDays'),
    ('Gamepad2'), ('NotebookPen'), ('Coffee'), ('Wallet');

CREATE TABLE cards (
	id SERIAL PRIMARY KEY,
	owner VARCHAR(50) NOT NULL,
	name VARCHAR(50) NOT NULL CHECK (LENGTH(name) >= 3),
	description VARCHAR(50),
	completed_days TEXT[] DEFAULT ARRAY[]::TEXT[],
	color_id INTEGER NOT NULL REFERENCES colors(id),
    icon_id INTEGER NOT NULL REFERENCES icons(id),
	UNIQUE(owner, name)
);
