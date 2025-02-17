CREATE TYPE UserRole AS ENUM (
    'USER',
    'ADMIN'
);

CREATE TABLE IF NOT EXISTS UserAccount (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role UserRole NOT NULL
);

CREATE TABLE IF NOT EXISTS Project (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    last_update DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at DATE NOT NULL DEFAULT CURRENT_DATE,
    owner_id INT NOT NULL,
    FOREIGN KEY (owner_id) REFERENCES UserAccount(id)
);

CREATE TYPE TaskState AS ENUM (
    'TO_DO',
    'IN_PROGRESS',
    'DONE'
);

CREATE TABLE IF NOT EXISTS Task (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    state TaskState NOT NULL,
    project_id INT NOT NULL,
    FOREIGN KEY (project_id) REFERENCES Project(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Comment (
    id SERIAL PRIMARY KEY,
    author_id INT NOT NULL,
    project_id INT NOT NULL,
    text TEXT NOT NULL,
    FOREIGN KEY (author_id) REFERENCES UserAccount(id) ON DELETE CASCADE,
    FOREIGN KEY (project_id) REFERENCES Project(id) ON DELETE CASCADE
);
