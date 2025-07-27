CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS workout_programs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    program_name VARCHAR(255) NOT NULL,
    program_description TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS weeks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    program_id UUID NOT NULL REFERENCES workout_programs(id) ON DELETE CASCADE,
    week_number INTEGER NOT NULL,
    UNIQUE (program_id, week_number)
);

CREATE TABLE IF NOT EXISTS days (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    week_id UUID NOT NULL REFERENCES weeks(id) ON DELETE CASCADE,
    day_number INTEGER NOT NULL,
    title VARCHAR(255) NOT NULL,
    UNIQUE (week_id, day_number)
);

CREATE TABLE IF NOT EXISTS exercises (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    day_id UUID NOT NULL REFERENCES days(id) ON DELETE CASCADE,
    circuit VARCHAR(100) NOT NULL,
    exercise_name VARCHAR(255) NOT NULL,
    sets INTEGER NOT NULL,
    reps VARCHAR(100) NOT NULL,
    rest VARCHAR(100) NOT NULL,
    notes VARCHAR(500)
);
