CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    streak INTEGER DEFAULT 0,         -- Current streak
    last_activity DATE                -- Last day when a challenge was completed
);

CREATE TABLE user_activity (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),  -- Foreign key to users table
    activity_date DATE NOT NULL,           -- Date the activity was completed
    activity_type VARCHAR(255) NOT NULL,   -- Type of activity, e.g., 'deep breathing', 'journaling'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP  -- When the record was created
);
