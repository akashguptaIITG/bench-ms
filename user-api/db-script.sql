create table user(id tinyint unsigned primary key auto_increment,
username varchar(32),
email varchar(64),
age tinyint unsigned
);

insert into user(username,email,age)
values ('jhon','jon.doe@gmail.com',23);