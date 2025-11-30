import psycopg2
from psycopg2.extras import RealDictCursor

DB_CONFIG = {
    "dbname": "Lykomor",
    "user": "postgres", 
    "password": "root",
    "host": "localhost",
    "port": 5432
}

CREATE_TABLES_QUERIES = [
    """
    CREATE TABLE IF NOT EXISTS roles (
        id SERIAL PRIMARY KEY,
        role_name VARCHAR(50) UNIQUE NOT NULL
    );
    """,
    """
    CREATE TABLE IF NOT EXISTS teams (
        id SERIAL PRIMARY KEY,
        team_name VARCHAR(100) UNIQUE NOT NULL
    );
    """,
    """
    CREATE TABLE IF NOT EXISTS regions (
        id SERIAL PRIMARY KEY,
        country VARCHAR(100) NOT NULL,
        city VARCHAR(100) NOT NULL,
        street VARCHAR(200),
        CONSTRAINT uq_region UNIQUE (country, city, street)
    );
    """,
    """
    CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role_id INTEGER NOT NULL REFERENCES roles(id) ON DELETE RESTRICT,
        team_id INTEGER REFERENCES teams(id) ON DELETE SET NULL,
        first_name VARCHAR(50) NOT NULL,
        surname VARCHAR(50) NOT NULL,
        age INTEGER NOT NULL CHECK (age >= 6 AND age <= 130),
        mail VARCHAR(255) UNIQUE NOT NULL,
        phone_number VARCHAR(20) UNIQUE NOT NULL
    );
    """,
    """
    CREATE TABLE IF NOT EXISTS marks (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
        longitude DOUBLE PRECISION NOT NULL CHECK (longitude BETWEEN -180 AND 180),
        latitude  DOUBLE PRECISION NOT NULL CHECK (latitude BETWEEN -90 AND 90),
        mark_name VARCHAR(150) UNIQUE,
        CONSTRAINT uq_coordinates UNIQUE (longitude, latitude)
    );
    """,
    """
    CREATE TABLE IF NOT EXISTS games (
        id SERIAL PRIMARY KEY,
        start_time TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        end_time TIMESTAMPTZ,
        id_region INTEGER REFERENCES regions(id) ON DELETE SET NULL,
        CHECK (end_time IS NULL OR end_time > start_time)
    );
    """,
    """
    CREATE TABLE IF NOT EXISTS tasks (
        id SERIAL PRIMARY KEY,
        description VARCHAR(1000) UNIQUE NOT NULL,
        reward INTEGER NOT NULL DEFAULT 100 CHECK (reward >= 0)
    );
    """,
    """
    CREATE TABLE IF NOT EXISTS game_marks (
        id SERIAL PRIMARY KEY,
        mark_id INTEGER NOT NULL REFERENCES marks(id) ON DELETE CASCADE,
        game_id INTEGER NOT NULL REFERENCES games(id) ON DELETE CASCADE,
        CONSTRAINT uq_game_mark UNIQUE (game_id, mark_id),
        CONSTRAINT uq_game_mark_id UNIQUE (game_id, id)
    );
    """,
    """
    CREATE TABLE IF NOT EXISTS game_tasks (
        id SERIAL PRIMARY KEY,
        task_id INTEGER NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
        game_id INTEGER NOT NULL REFERENCES games(id) ON DELETE CASCADE,
        CONSTRAINT uq_game_task UNIQUE (game_id, task_id),
        CONSTRAINT uq_game_task_id UNIQUE (game_id, id)
    );
    """,
    """
    CREATE TABLE IF NOT EXISTS correct_answers (
        id SERIAL PRIMARY KEY,
        game_id INTEGER NOT NULL,
        game_task_id INTEGER NOT NULL,
        game_mark_id INTEGER NOT NULL,
        CONSTRAINT fk_task_in_game 
            FOREIGN KEY (game_id, game_task_id) REFERENCES game_tasks(game_id, id) ON DELETE CASCADE,
        CONSTRAINT fk_mark_in_game 
            FOREIGN KEY (game_id, game_mark_id) REFERENCES game_marks(game_id, id) ON DELETE CASCADE,
        CONSTRAINT uq_one_answer_per_task UNIQUE (game_task_id),
        CONSTRAINT uq_one_task_per_mark UNIQUE (game_id, game_mark_id)
    );
    """,
    """
    CREATE TABLE IF NOT EXISTS team_game_progress (
        id SERIAL PRIMARY KEY,
        team_id INTEGER NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
        game_id INTEGER NOT NULL REFERENCES games(id) ON DELETE CASCADE,
        score INTEGER NOT NULL DEFAULT 0 CHECK (score >= 0),
        completed_at TIMESTAMPTZ,
        CONSTRAINT uq_team_in_game UNIQUE (team_id, game_id)
    );
    """,
    """
    CREATE INDEX IF NOT EXISTS idx_marks_location ON marks (longitude, latitude);
    """,
    """
    CREATE INDEX IF NOT EXISTS idx_games_active ON games(start_time DESC);
    """,
    """
    CREATE INDEX IF NOT EXISTS idx_progress_leaderboard ON team_game_progress(game_id, score DESC);
    """,
    """
    CREATE INDEX IF NOT EXISTS idx_game_tasks_game ON game_tasks(game_id);
    """,
    """
    CREATE INDEX IF NOT EXISTS idx_game_marks_game ON game_marks(game_id);
    """
]

def create_tables():
    conn = None
    try:
        conn = psycopg2.connect(**DB_CONFIG)
        cur = conn.cursor()

        for query in CREATE_TABLES_QUERIES:
            cur.execute(query)

        cur.execute("""
            INSERT INTO roles (role_name) VALUES 
            ('player'), ('judge'), ('moderator'), ('admin')
            ON CONFLICT (role_name) DO NOTHING;
        """)

        conn.commit()
        cur.close()
        print("Все таблицы успешно созданы!")

    except Exception as e:
        print(f"Ошибка при создании таблиц: {e}")
        if conn:
            conn.rollback()
    finally:
        if conn:
            conn.close()

def get_db_connection():
    conn = psycopg2.connect(**DB_CONFIG, cursor_factory=RealDictCursor)
    try:
        yield conn
    finally:
        conn.close()