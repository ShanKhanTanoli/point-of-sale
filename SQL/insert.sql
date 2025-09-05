-- Services
INSERT INTO `services`(service_name,service_price,is_active) 
VALUES('shave','5',1);

INSERT INTO `services`(service_name,service_price,is_active) 
VALUES('Hair Cut','5',1);

INSERT INTO `services`(service_name,service_price,is_active) 
VALUES('Apple Hair Color','10',1);

INSERT INTO `services`(service_name,service_price,is_active) 
VALUES('Keune Hair Color','10',1);

INSERT INTO `services`(service_name,service_price,is_active) 
VALUES('Body Massage','50',1);

INSERT INTO `services`(service_name,service_price,is_active) 
VALUES('Facial','20',1);


-- Roles
INSERT INTO roles(role_name,role_description,is_active) 
VALUES('editor','edits only',1);

INSERT INTO roles(role_name,role_description,is_active) 
VALUES('view','views only',1);

INSERT INTO roles(role_name,role_description,is_active) 
VALUES('admin','full access',1);

-- Permissions
insert into permissions (role_id) VALUES(1);

-- Users
INSERT INTO users (user_name, user_email, user_password, user_role, is_active)  
VALUES('Shan Khan', 'shankhantanoli1@gmail.com',md5('SHANkhan123'), 'super-admin', 1);

INSERT INTO users (user_name, user_email, user_password, user_role, is_active)  
VALUES('Test User', 'testuser@email.com',md5('SHANkhan123'), 'user', 1);