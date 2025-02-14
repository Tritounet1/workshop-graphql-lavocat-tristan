CREATE TABLE IF NOT EXISTS Project (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    lastUpdate BIGINT NOT NULL
);

CREATE TABLE IF NOT EXISTS UserAccount (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS Comment (
    id SERIAL PRIMARY KEY,
    userId INT NOT NULL,
    text TEXT NOT NULL,
    idProject INT NOT NULL,
    CONSTRAINT fk_user FOREIGN KEY (userId) REFERENCES UserAccount (id) ON DELETE CASCADE
);

CREATE TYPE TaskState AS ENUM (
    'En cours.',
    'A faire.'
);

CREATE TABLE IF NOT EXISTS Task (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    taskState TaskState NOT NULL,
    idProject INT NOT NULL
);

INSERT INTO UserAccount (email, password) VALUES ('test@gmail.com', '1234')