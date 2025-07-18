create or replace view moviesOut as
select name,year,category, concat(poster.fileName,poster.fileExtension) as posterName, concat(video.fileName,video.fileExtension) as fileName 
from movies 
left join files as poster 
	on movies.posterId=poster.id 
join files as video 
	on movies.fileId = video.id
order by name, year;

create or replace view seriesOut as
select series.name as name,year,category,count(seasons.id) as noOfSeasons, concat(files.fileName,files.fileExtension) as posterName
from series 
left join files on series.posterId = files.id
join seasons where series.id = seasons.serieId
group by series.id
order by name, year;

create or replace view seasonsOut as
select seasonNumber, seasons.name as seasonName, series.name as serieName, year
from seasons join series on serieId = series.id
order by series.name, seasonNumber;

create or replace view episodesOut as
select episodeNumber, episodes.name as episodeName, seasonNumber, series.name as serieName, year, concat(files.fileName,files.fileExtension) as fileName
from episodes 
join files on files.id = fileId
join seasons on seasonId = seasons.id
join series on serieId = series.id
order by series.name, year, seasonNumber, episodeNumber;

create or replace view lastWatchedMoviesOut
as
select users.name as username, movies.name as movieName, movies.year,movies.category, concat(F.fileName,F.fileExtension) as fileName, concat(P.fileName,P.fileExtension) as posterName, timeStamp, lastWatched
from users
join users_movies_continue_watching on users.id=users_movies_continue_watching.userId
join movies on users_movies_continue_watching.movieId=movies.id
join files as F on F.id = movies.fileId
left join files as P on P.id = movies.posterId
order by lastWatched desc;

create or replace view lastWatchedSeriesOut
as
select users.name as username, episodeNumber, episodes.name as episodeName, S.seasonNumber, S.name as seasonName, series.name, series.year, category,COUNT(N.id) as noOfSeasons, timeStamp, lastWatched, concat(F.fileName,F.fileExtension) as fileName, concat(P.fileName,P.fileExtension) as posterName
from users
join users_episodes_continue_watching on users.id = userId
join episodes on episodes.id = episodeId
join files as F on F.id = episodes.fileId
join seasons as S on S.id = episodes.seasonId
join series on S.serieId = series.id
join seasons as N on N.serieId = series.id
left join files as P on P.id = series.posterId
GROUP BY N.serieId, users.name, episodeNumber, episodeName, S.seasonNumber, S.name, series.name,series.year,category,timeStamp,lastWatched,F.fileName,F.fileExtension,P.fileName,P.fileExtension
order by lastWatched desc;

select * from lastWatchedSeriesOut;

create or replace view search
as
select concat_ws(" ",movies.name,"-", movies.year, category) as searchParam, 'movie' as type, name, year, category, null as seasonNumber, null as seasonName, null as episodeNumber, null as episodeName
	from movies
union all 
select concat_ws(" ",series.name,"-", series.year, category) as searchParam, 'serie' as type, name, year, category, null as seasonNumber, null as seasonName, null as episodeNumber, null as episodeName
	from series;

create or replace view searchAll
as
select concat_ws(" ",movies.name,"-", movies.year, category) as searchParam, 'movie' as type, name, year, category, null as seasonNumber, null as seasonName, null as episodeNumber, null as episodeName
	from movies
union all select concat_ws(" ",series.name,"-",series.year,category) as searchParam, 'serie' as type, name, year, category, null as seasonNumber, null as seasonName, null as episodeNumber, null as episodeName
	from series
union all select concat_ws(" ",seasons.name,series.name,"-",series.year, "S", seasonNumber) as searchParam, 'season' as type, series.name, series.year, category, seasonNumber, seasons.name as seasonName, null as episodeNumber, null as episodeName
	from seasons join series on series.id=seasons.serieId
union all select concat_ws(" ",episodes.name,series.name,"-",series.year, "S", seasonNumber,seasons.name,"E",episodeNumber) as searchParam, 'episode' as type, series.name, series.year, category, seasonNumber, seasons.name as seasonName, episodeNumber, episodes.name as episodeName
	from episodes
    join seasons on seasons.id = episodes.seasonId
    join series on series.id = seasons.serieId;
    
select * from search where LOWER(searchParam) LIKE LOWER("%Ispr%");

create or replace view seriesLastWatched as
with serieLW as(
	select series.name,year,max(lastWatched) as lastWatched, userId
	from series
	join seasons on series.id = seasons.serieId
	join episodes on seasons.id = episodes.seasonId
	left join users_episodes_continue_watching on episodes.id = users_episodes_continue_watching.episodeId
	group by series.name, series.year, userId
    )
select series.name, series.year, series.category, noOfSeasons, seasonNumber, seasons.name as seasonName, episodeNumber, episodes.name as episodeName, users.name as username, timestamp, lastWatched, CONCAT(files.fileName,files.fileExtension) as fileName, posterName
from series
join seriesOut on series.name = seriesOut.name and series.year = seriesOut.year
join seasons on series.id=seasons.serieId
join episodes on seasons.id=episodes.seasonId
join files on episodes.fileId=files.id
left join users_episodes_continue_watching on episodes.id = users_episodes_continue_watching.episodeId
right join users on users.id = users_episodes_continue_watching.userId
where lastWatched = (select lastWatched from serieLW where name = series.name and year = series.year and userId= users.id); 

create or replace view episodesLastWatched
as
select episodeNumber, episodes.name as episodeName, seasonNumber, series.name, year, CONCAT(files.fileName,files.fileExtension) as fileName, timeStamp, lastWatched, users.name as username
from episodes
join files on files.id=episodes.fileId
join seasons on episodes.seasonId = seasons.id
join series on seasons.serieId = series.id
left join users_episodes_continue_watching on episodes.id = users_episodes_continue_watching.episodeId
join users on users.id=users_episodes_continue_watching.userId;


select* from episodesLastWatched;

select concat_ws(" ",movies.name,"-", movies.year, category) as searchParam, 'movie' as type, name, year, category, null as seasonNumber, null as seasonName, null as episodeNumber, null as episodeName
	from series;