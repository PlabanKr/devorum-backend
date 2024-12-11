create table users(
	user_id serial primary key,
	name varchar,
	user_name varchar(255) not null unique,
	email varchar not null unique,
	profile_photo varchar,
	hashed_password varchar not null,
	bio varchar,
	created_at timestamp default current_timestamp,
    address varchar,
    qualification varchar,
    skills varchar,
    gender varchar(20),
    roles varchar(20)
);

create table certifications(
    certification_id serial primary key,
    title varchar not null,
    link varchar not null,
    user_id int references users(user_id)
)

create table forums(
	forum_id serial primary key,
	title varchar not null unique,
    devorum varchar not null unique,
	details varchar,
	rules varchar,
	created_at timestamp default current_timestamp
);

create type idea_status as enum ('searching', 'found', 'completed', 'on hold', 'abandoned');

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

create table forum_joined(
	joined_id serial primary key,
	user_id int references users(user_id),
	forums_id int references forums(forum_id)
);

create table connections(
	connection_id serial primary key,
	sender_id int references users(user_id) not null,
	receiver_id int references users(user_id) not null,
	accepted boolean default false not null,
	sent_at timestamp default current_timestamp
);

INSERT INTO forums (title, details, rules, created_at, devorum)
VALUES (
    'Front-End Development',
    'This forum is dedicated to all things front-end development. Whether you are a beginner learning the ropes or an experienced developer looking to discuss the latest trends and technologies, this is the place for you. Share your knowledge, ask questions, and collaborate with fellow front-end enthusiasts on topics ranging from HTML, CSS, and JavaScript to frameworks like React, Angular, and Vue.js.',
    'Be respectful and professional in all interactions, No self-promotion or advertising without prior approval, Use descriptive titles for your posts, Provide clear and concise information when asking questions, Avoid posting duplicate topics, Stay on topic and ensure discussions are relevant to front-end development, Report any inappropriate content to the moderators.',
    CURRENT_TIMESTAMP,
	'front-end-dev'
);

INSERT INTO forums (title, details, rules, created_at, devorum)
VALUES (
    'Back-End Development',
    'This forum is a hub for back-end developers to discuss server-side technologies, database management, API development, and more. Whether you''re working with Node.js, Python, Java, or any other back-end technology, join the conversation to share your insights, solve problems, and stay updated on best practices in back-end development.',
    'Keep discussions focused on back-end topics, Provide detailed explanations when asking or answering questions, Respect all community members and their opinions, No spamming or advertising, Keep code snippets concise and relevant, Avoid posting duplicate content, Report any inappropriate behavior to the moderators.',
    CURRENT_TIMESTAMP,
	'back-end-dev'
);

INSERT INTO forums (title, details, rules, created_at, devorum)
VALUES (
    'Game Programming',
    'This forum is designed for game programmers of all levels to discuss coding techniques, game engines, algorithms, and performance optimization. Whether you''re developing for mobile, console, or PC, this is the place to exchange knowledge, troubleshoot issues, and explore the complexities of game programming.',
    'Focus on game programming-related content, Share code examples to support your explanations, Be courteous and constructive in your feedback, No off-topic posts or advertising, Ensure your questions and answers are clear and informative, Report any content that violates community guidelines, Keep discussions relevant and on-topic.',
    CURRENT_TIMESTAMP,
	'game-programming'
);

INSERT INTO forums (title, details, rules, created_at, devorum)
VALUES (
    'Game Art',
    'This forum is a creative space for game artists to share their work, discuss techniques, and collaborate on projects. Whether you''re into 2D or 3D art, character design, environment creation, or animation, you''ll find like-minded artists here to help you refine your skills and find inspiration.',
    'Respect the creative work of others, Provide constructive criticism and feedback, No unsolicited promotion of your work, Keep discussions focused on game art topics, Share resources and tips generously, Avoid posting offensive or inappropriate content, Report any misuse of the forum to the moderators.',
    CURRENT_TIMESTAMP,
	'game-art'
);

INSERT INTO forums (title, details, rules, created_at, devorum)
VALUES (
    'Game Design',
    'This forum is for game designers to explore the principles of game mechanics, level design, storytelling, and player experience. Whether you''re crafting puzzles, balancing gameplay, or designing immersive worlds, join discussions that dive deep into the art and science of game design.',
    'Stay on topic with game design discussions, Respect differing opinions and ideas, Avoid self-promotion without permission, Use examples to illustrate your points, Encourage thoughtful debate and creative solutions, No spamming or irrelevant posts, Report any inappropriate content to the moderators.',
    CURRENT_TIMESTAMP,
	'game-design'
);

-- peek into all tables and schemas
SELECT * FROM pg_catalog.pg_tables WHERE schemaname != 'pg_catalog' AND schemaname != 'information_schema';

-- peek into data 
select * from users;
select * from certifications;
select * from connections;
select * from forums;
select * from ideas;
select * from idea_interested;
select * from forum_joined;




