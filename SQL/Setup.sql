CREATE DATABASE HomeCinema;

CREATE USER 'WebSite'@'127.0.0.1' IDENTIFIED BY '01061944';
GRANT all privileges ON HomeCinema.* to 'WebSite'@'127.0.0.1';

CREATE USER 'WebSite'@'172.17.0.1' IDENTIFIED BY '01061944';
GRANT ALL privileges ON HomeCinema.* to 'WebSite'@'172.17.0.1';