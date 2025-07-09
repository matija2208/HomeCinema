delimiter //
create trigger deleteMovie
after delete 
on movies for each row
begin
	set @fileId = old.fileId;
    delete from files where id = @fileId;
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