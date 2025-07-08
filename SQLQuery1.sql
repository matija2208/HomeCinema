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


DELIMITER //
create procedure insertMovie (in movieName varchar(200), in year int, in category varchar(100), in fileName varchar(36))
begin
	set @fileId = (select id from files where files.fileName = fileName);

	insert into movies(name,year,category,fileId)
	values(movieName,year,category,@fileId);
end//
DELIMITER ;

DELIMITER //
create procedure insertEpisode(in seriesName varchar(200), in seriesYear int, in seasonNumber int, in episodeNumber int,in episodeName varchar(100),in fileName varchar(36))
begin

	set @serieId = (select id from series where name = seriesName and year = seriesYear);
	set @seasonId = (select id from seasons where serieId = @serieId and seasonNumber=seasonNumber);
	set @fileId = (select id from files where files.fileName = fileName);

	insert into episodes(seasonId,episodeNumber,episodeName,fileId)
	values(@seasonId,episodeNumber,episodeName,@fileId);
end//
DELIMITER ;
drop procedure insertSeason
DELIMITER //
create procedure insertSeason(in serieName varchar(200), in serieYear int, in seasonNumber int, in seasonName varchar(100))
begin
	set @serieId = (select id from series where name=serieName and year = serieYear);

	insert into seasons(seasonNumber, name, serieId)
	values(seasonNumber,seasonName,@serieId);
end//
DELIMITER ;
DELIMITER //
create procedure insertSong(in name varchar(200), in artist varchar(200), in album varchar(200), in year int, in genre varchar(50), in fileName varchar(36))
begin

	set @fileId = (select id from files where files.fileName = fileName);

	insert into songs(name,artist,album,year,genre,fileId)
	values(name,artist,album,year,genre,@fileId);
end//
DELIMITER ;

DELIMITER //
create procedure addSongToPlaylist(in playListName varchar(200), in songFileName varchar(36))
begin
	set @songId = (select id from songs where fileId = (select id from files where fileName = songFileName));
	set @playlistId = (select id from playlists where name = playListName);

	insert into songs_playlists
	values(@songId,@playlistId);
end//
DELIMITER ;

drop view seriesOut;

create view moviesOut as
select name,year,category,concat(files.fileName,files.fileExtension) as fileName 
from movies join files 
where movies.fileId = files.id;

create view seriesOut as
select series.name as name,year,category,count(seasons.id) as noOfSeasons 
from series join seasons where series.id = seasons.serieId
group by series.id;

select * from movies inner join files where movies.fileId=files.id;

insert into files(fileName,fileExtension)
values ("ef35ca8f-5d6e-4711-8eb2-ccf974727977",".mp4");

select * from seriesOut;


call insertMovie("The Scarlet Claw",1944,"Mystery","ef35ca8f-5d6e-4711-8eb2-ccf974727977");

insert into series(name,year)
values("Criminal Minds",2005);

call insertSeason("Criminal Minds",2005,4,null)