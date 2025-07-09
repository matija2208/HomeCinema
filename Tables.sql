create table files(
	id int   primary key auto_increment,
	fileName varchar(36) not null unique,
	fileExtension varchar(5) not null );

create table movies(
	id int primary key auto_increment,
	name varchar(200) not null,
	year int not null,
	category varchar(100),
	fileId int not null,
	foreign key (fileId) references files,
    unique key(name,year));

create table series(
	id int primary key auto_increment,
	name varchar(200) not null,
	year int not null,
	category varchar(100),
    unique key(name,year));

create table seasons(
	id int primary key auto_increment,
	seasonNumber int not null,
	name varchar(100),
	serieId int not null,
	foreign key(serieId) references series,
    unique key(serieId, seasonNumber));

create table episodes(
	seasonId int not null,
	episodeNumber int not null,
	name varchar(100),
	fileId int not null,
	primary key(seasonId,episodeNumber),
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
