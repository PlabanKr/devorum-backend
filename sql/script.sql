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

alter table users add column address varchar;
alter table users add column qualification varchar;
alter table users add column certifications varchar;
alter table users add column skills_temp varchar;
alter table users add column gender varchar(20);

create table forums(
	forum_id serial primary key,
	title varchar not null unique,
	details varchar,
	rules varchar,
	created_at timestamp default current_timestamp
);

create type idea_status as enum ('abandoned', 'completed', 'hold', 'searching');

create table ideas(
	idea_id serial primary key,
	title varchar not null,
	body varchar not null,
	status idea_status not null default 'searching',
	user_id int references users(user_id),
	forum_id int references forums(forum_id),
	created_at timestamp default current_timestamp
);

create table idea_interested(
	interested_id serial primary key,
	user_id int references users(user_id),
	ideas_id int references ideas(idea_id)
);


-- peek into all tables and schemas
SELECT * FROM pg_catalog.pg_tables WHERE schemaname != 'pg_catalog' AND schemaname != 'information_schema';

-- seed database
insert into users(name, user_name, email, is_admin, profile_photo, hashed_password, bio, account_type)
values ('Test User', 'test_user_1234', 'test@test.com', false, 'http://test.com/photo', 'password', 'First account of this app', 'ultra');
insert into users(name, user_name, email, is_admin, profile_photo, hashed_password, bio)
values 	('Test User 2', 'test_user_1235', 'test1@test.com', false, 'http://test.com/photo', 'password', 'Second account of this app'),
		('Test User 3', 'test_user_1236', 'test3@test.com', false, 'http://test.com/photo', 'password', 'Third account of this app');

-- peek into data 
select * from users;
select * from forums;
select * from ideas;
select * from idea_interested;