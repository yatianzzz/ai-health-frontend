CREATE TABLE user (
                      id BIGINT AUTO_INCREMENT PRIMARY KEY,
                      username VARCHAR(50) NOT NULL UNIQUE,
                      password VARCHAR(100) NOT NULL,
                      email VARCHAR(100) NOT NULL UNIQUE,
                      create_time DATETIME
);
