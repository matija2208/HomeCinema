drop procedure insertMovie;
DELIMITER //
create procedure insertMovie (in movieName varchar(200), in year int, in category varchar(100), in fileName varchar(36), in posterName varchar(36))
begin
	set @fileId = (select id from files where files.fileName = fileName);
    
    if(not posterName = "" and posterName is not null)
		then set @posterId = (select id from files where files.fileName = posterName);
		else set @posterId = null;
	end if;
	insert into movies(name,year,category,fileId, posterId)
	values(movieName,year,category,@fileId, @posterId);
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

drop procedure insertSerie;
DELIMITER //
create procedure insertSerie(in serieName varchar(200), in year int, in category varchar(100), in posterName varchar(36))
begin
	if(not posterName = "" and posterName is not null)
		then set @posterId = (select id from files where files.fileName = posterName);
		else set @posterId = 0;
    end if;
    insert into series(name, year, category, posterId)
    values(serieName,year,category,@posterId);
end//
delimiter ;

delimiter //
create procedure saveWatchingTime(in userName varchar(100), in timeStamp varchar(8), in fileName varchar(36))
begin
	set @lastWatched = now();
    set @movieId = (
		select movies.id 
        from movies 
		join files on movies.fileId = files.id 
        where files.fileName=fileName);
    
    set @episodeId = (
		select episodes.id 
        from episodes 
        join files on episodes.fileId = files.id 
        where files.fileName=fileName);
    
    set @userId = (
		select id 
        from users 
        where name = userName);
    
    if(@movieId is not null) then 
		insert into users_movies_continue_watching(userId, movieId, timeStamp,lastWatched)
		values(@userId,@movieId,timeStamp,@lastWatched);
	elseif(@episodeId is not null) then
		insert into users_episodes_continue_watching(userId, episodeId, timeStamp, lastWatched)
        values(@userId,@episodeId,timeStamp,@lastWatched);
	end if;
end//
delimiter ;

    