DROP TABLE IF EXISTS moviestable ;

CREATE TABLE moviestable(

id SERIAL PRIMARY KEY,
name VARCHAR(255),
country VARCHAR(255),
image VARCHAR(255),
overview VARCHAR(255)
);