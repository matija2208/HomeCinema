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
	name varchar(200) not null unique)

create table songs_playlists(
	idSong int not null,
	idPlaylist int not null,
	primary key(idSong,idPlaylist),
	foreign key(idSong) references songs,
	foreign key(idPlaylist) references playlists)


create procedure insertMovie @movieName varchar(200), @year int, @category varchar(100), @fileName uniqueidentifier
as
begin
	declare @fileId int;
	set @fileId = (select id from files where fileName = @fileName);

	insert into movies
	values(@movieName,@year,@category,@fileId);
end;

create procedure insertEpisode @seriesName varchar(200), @seriesYear int, @seasonNumber int, @episodeNumber int,@episodeName varchar(100),@fileName uniqueidentifier
as
begin
	declare @serieId int;
	declare @seasonId int;
	declare @fileId int;

	set @serieId = (select id from series where name = @seriesName and year = @seriesYear);
	set @seasonId = (select id from seasons where serieId = @serieId and seasonNumber=@seasonNumber);
	set @fileId = (select id from files where fileName = @fileName);

	insert into episodes
	values(@seasonId,@episodeNumber,@episodeName,@fileId);
end;

create procedure insertSeason @serieName varchar(200), @serieYear int, @seasonNumber int,@seasonName varchar(100)
as
begin
	declare @serieId int;

	set @serieId = (select id from series where name=@serieName and year = @serieYear);

	insert into seasons
	values(@seasonNumber,@seasonName,@serieId);

end;

create procedure insertSong @name varchar(200),@artist varchar(200),@album varchar(200),@year int,@genre varchar(50),@fileName uniqueidentifier
as
begin
	declare @fileId int;
	set @fileId = (select id from files where fileName = @fileName);

	insert into songs
	values(@name,@artist,@album,@year,@genre,@fileId);
end;

create procedure addSongToPlaylist @playListName varchar(200), @songFileName uniqueidentifier
as
begin
	declare @songId int;
	declare @playlistId int;

	set @songId = (select id from songs where fileId = (select id from files where fileName = @songFileName));
	set @playlistId = (select id from playlists where name = @playListName);

	insert into songs_playlists
	values(@songId,@playlistId);
end