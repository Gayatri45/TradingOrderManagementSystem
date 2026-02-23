CREATE DATABASE markets_db;
CREATE USER 'markets_user'@'localhost' IDENTIFIED BY 'markets_password';
GRANT ALL PRIVILEGES ON markets_db.* TO 'markets_user'@'localhost';
FLUSH PRIVILEGES;
DROP database markets_db;