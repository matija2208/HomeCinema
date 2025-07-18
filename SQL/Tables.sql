create table files(
	id int   primary key auto_increment,
	fileName varchar(36) not null unique,
	fileExtension varchar(5) not null );

drop table movies;

create table movies(
	id int primary key auto_increment,
	name varchar(200) not null,
	year int not null,
	category varchar(100),
	fileId int not null,
    posterId int,
    foreign key(posterId) references files,
	foreign key (fileId) references files,
    unique key(name,year));

create table series(
	id int primary key auto_increment,
	name varchar(200) not null,
	year int not null,
	category varchar(100),
    posterId int,
    unique key(name,year),
    foreign key(posterId) references files);


create table seasons(
	id int primary key auto_increment,
	seasonNumber int not null,
	name varchar(100),
	serieId int not null,
	foreign key(serieId) references series,
    unique key(serieId, seasonNumber));

create table episodes(
	id int primary key auto_increment,
	seasonId int not null,
	episodeNumber int not null,
	name varchar(100),
	fileId int not null,
	foreign key(seasonId) references seasons,
	foreign key(fileId) references files,
    unique key(seasonId, episodeNumber));

create table songs(
	id int primary key auto_increment,
	name varchar(200) not null,
	artist varchar(200) not null,
	album varchar(200),
	year int,
	genre varchar(50),
	fileId int not null,
	foreign key(fileId) references files,
    unique key(name, artist));

create table playlists(
	id int auto_increment primary key,
	name varchar(200) not null unique);

create table songs_playlists(
	idSong int not null,
	idPlaylist int not null,
	primary key(idSong,idPlaylist),
	foreign key(idSong) references songs,
	foreign key(idPlaylist) references playlists);
    
    
create table users(
	id int primary key auto_increment,
    name varchar(100) not null unique,
    password varchar(100) not null,
    token varchar(500));
    
create table users_movies_continue_watching(
	userId int not null,
    movieId int not null,
    timeStamp varchar(8) not null default "00:00:00",
    lastWatched datetime not null,
    primary key(userId, movieId),
    unique key(userId,movieId),
    foreign key(userId) references users(id),
    foreign key(movieId) references movies(id));
    

create table users_episodes_continue_watching(
	userId int not null,
    episodeId int not null,
    timeStamp varchar(8) not null default "00:00:00",
    lastWatched datetime not null,
    primary key(userId, episodeId),
    unique key(userId,episodeId),
    foreign key(userId) references users(id),
    foreign key(episodeId) references episodes(id));
    
drop table users_movies_continue_watching