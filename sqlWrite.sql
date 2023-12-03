create database study_partner default character set utf8 collate utf8_general_ci;

CREATE USER 'hwany'@'localhost' IDENTIFIED BY '1q2w3e4r!';
GRANT ALL PRIVILEGES ON *.* TO 'hwany'@'localhost';
FLUSH PRIVILEGES;

CREATE TABLE user_auth_info (
	id        INT NOT NULL AUTO_INCREMENT,
	email     VARCHAR(255) UNIQUE,
	pwd    VARCHAR(255),
	created_at timestamp  default current_timestamp,
	updated_at timestamp  default current_timestamp on update current_timestamp,
	PRIMARY KEY(id)
);

INSERT INTO user_auth_info (id, user_id, user_pw, nick_name)
	   	    VALUE(NULL, 'admin',  'admin', 'admin');

ALTER TABLE `tableName` ADD CONSTRAINT 
FOREIGN KEY (`tableName의 foreignKey`) 
REFERENCES `referencedTableName`(`referencedColumn`) 
ON UPDATE CASCADE 
ON DELETE CASCADE;
