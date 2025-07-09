
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

	insert into episodes(seasonId,episodeNumber,name,fileId)
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
