ALTER TABLE users MODIFY passwordHash VARCHAR(255) NULL;
ALTER TABLE users ADD COLUMN googleId VARCHAR(128) NULL;
CREATE UNIQUE INDEX users_googleId_key ON users(googleId);
