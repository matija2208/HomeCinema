create table files(
	id int  identity(1,1) primary key,
	fileName uniqueidentifier not null,
	fileExtension varchar(5) not null )

create table movies(
	id int identity(1,1) primary key,
	name varchar(200) not null,
	year int not null,
	category varchar(100),
	fileID int not null,
	foreign key (fileID) references files)

create table series(
	id int identity(1,1) primary key,
	name varchar(200) not null,
	year int not null,
	category varchar(100))

create table seasons(
	id int identity(1,1) primary key,
	seasonNumber int not null,
	name varchar(100),
	serieId int not null,
	foreign key(serieId) references series)

create table episodes(
	seasonId int not null,
	episodeNumber int not null,
	name varchar(100),
	fileId int not null,
	primary key(seasonId,episodeNumber),
	foreign key(seasonId) references seasons,
	foreign key(fileId) references files)

create table songs(
	id int identity(1,1) primary key,
	name varchar(200) not null,
	artist varchar(200),
	album varchar(200),
	year int,
	genre varchar(50),
	fileId int not null,
	foreign key(fileId) references files)

create table playlists(
	id int identity(1,1) primary key,
	name varchar(200) not null)

create table songs_playlists(
	idSong int not null,
	idPlaylist int not null,
	primary key(idSong,idPlaylist),
	foreign key(idSong) references songs,
	foreign key(idPlaylist) references playlists)


create trigger insertMovie
on movies 
instead of insert 
as 
begin
	declare @fileName uniqueidentifier;
	declare @fileId int;

	set @fileName = (select fileID from inserted);
	set @fileId = (select id from files where files.fileName = @fileName);

	insert into movies(name,year,category,)
	select name,year,category,fileID
	from inserted;

end;

