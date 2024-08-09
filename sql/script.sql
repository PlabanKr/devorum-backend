-- create db
create database devorum_express;

-- create tables and data types
create type account_type as enum ('basic', 'premium', 'ultra');

create table users(
	user_id serial primary key,
	name varchar,
	user_name varchar(255) not null unique,
	email varchar not null unique,
	is_admin bool not null,
	profile_photo varchar,
	hashed_password varchar not null,
	bio varchar,
	account_type account_type not null default 'basic',
	created_at timestamp default current_timestamp
);

-- seed database
insert into users(name, user_name, email, is_admin, profile_photo, hashed_password, bio, account_type)
values ('Test User', 'test_user_1234', 'test@test.com', false, 'http://test.com/photo', 'password', 'First account of this app', 'ultra');
insert into users(name, user_name, email, is_admin, profile_photo, hashed_password, bio)
values 	('Test User 2', 'test_user_1235', 'test1@test.com', false, 'http://test.com/photo', 'password', 'Second account of this app'),
		('Test User 3', 'test_user_1236', 'test3@test.com', false, 'http://test.com/photo', 'password', 'Third account of this app');

-- peek into data 
select * from users;