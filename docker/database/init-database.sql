CREATE TABLE IF NOT EXISTS Project (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    last_update DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at DATE NOT NULL DEFAULT CURRENT_DATE
);

CREATE TYPE UserRole AS ENUM (
    'USER',
    'ADMIN'
);

CREATE TABLE IF NOT EXISTS UserAccount (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role UserRole NOT NULL
);

CREATE TABLE IF NOT EXISTS Comment (
    id SERIAL PRIMARY KEY,
    author INT NOT NULL,
    text TEXT NOT NULL,
    project INT NOT NULL,
    CONSTRAINT fk_user FOREIGN KEY (author) REFERENCES UserAccount (id) ON DELETE CASCADE,
    CONSTRAINT fk_project FOREIGN KEY (project) REFERENCES Project (id) ON DELETE CASCADE
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
    project INT NOT NULL,
    CONSTRAINT fk_project_task FOREIGN KEY (project) REFERENCES Project (id) ON DELETE CASCADE
);

INSERT INTO UserAccount (email, password, role) VALUES ('test@gmail.com', '1234', 'USER');
INSERT INTO Project (name, description, last_update, created_at) VALUES ('Projet 1', 'Description...', NOW(), NOW());
INSERT INTO Comment (author, text, project) VALUES (1, '.........', 1);
INSERT INTO Task (title, state, project) VALUES ('Tâche 1', 'IN_PROGRESS', 1);