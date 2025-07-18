delimiter //
create trigger deleteMovie
after delete 
on movies for each row
begin
	set @fileId = old.fileId;
    set @posterId = old.posterId;
    delete from files where id = @fileId or (@posterId is not null and id = @posterId);
end//
delimiter ;

delimiter //
create trigger deleteEpisode
after delete 
on episodes for each row
begin
	set @fileId = old.fileId;
    delete from files where id = @fileId;
end//
delimiter ;

delimiter //
create trigger deleteSong
after delete 
on songs for each row
begin
	set @fileId = old.fileId;
    delete from files where id = @fileId;
end//
delimiter ;

delimiter //
create trigger removeSongFromPlaylists
before delete 
on songs for each row
begin
	set @songId = old.id;
    delete from songs_playlists where songs_playlists.idSong = @songId;
end//
delimiter ;

delimiter //
create trigger deleteSeason
before delete
on seasons for each row
begin
	set @seasonId = old.id;
    delete from episodes where episodes.seasonId = @seasonId;
end//
delimiter ;

delimiter //
create trigger deleteSerie
before delete
on series for each row
begin
	set @serieId = old.id;
    delete from seasons where seasons.serieId = @serieId;
end//
delimiter ;

drop trigger checkExtension;
delimiter //
create trigger deleteSeriePoster
after delete
on series for each row
begin
	set @posterId = old.posterId;
    if(@posterId is not null)
		then delete from files where id = @posterId;
	end if;
end//
delimiter ;

DELIMITER //
CREATE TRIGGER checkExtension
BEFORE INSERT ON files
FOR EACH ROW
BEGIN
    IF LEFT(NEW.fileExtension, 1) != '.' THEN
        SET NEW.fileExtension = CONCAT('.', NEW.fileExtension);
    END IF;
END//
DELIMITER ;

delimiter //
CREATE TRIGGER deleteMovieTimeStamps
BEFORE DELETE ON movies
FOR EACH ROW
BEGIN
	set @movieId = (SELECT id FROM movies WHERE name = OLD.name AND year = OLD.year);
    
    DELETE FROM users_movies_continue_watching
    WHERE movieId = @movieId;
END//
delimiter ;


delimiter //
CREATE TRIGGER deleteEpisodeTimeStamps
BEFORE DELETE ON episodes
FOR EACH ROW
BEGIN
	set @episodeId = OLD.id;
    
    DELETE FROM users_episodes_continue_watching
    WHERE episodeId = @episodeId;
END//
delimiter ;