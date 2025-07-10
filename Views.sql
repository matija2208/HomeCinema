create view moviesOut as
select name,year,category,concat(files.fileName,files.fileExtension) as fileName 
from movies join files 
where movies.fileId = files.id;

alter view seriesOut as
select series.name as name,year,category,count(seasons.id) as noOfSeasons 
from series join seasons where series.id = seasons.serieId
group by series.id;

create view seasonsOut as
select seasonNumber, seasons.name as seasonName, series.name as serieName, year
from seasons join series on serieId = series.id;

create or replace view episodesOut as
select episodeNumber, episodes.name as episodeName, seasonNumber, series.name as serieName, year, concat(files.fileName,files.fileExtension) as fileName
from episodes 
join files on files.id = fileId
join seasons on seasonId = seasons.id
join series on serieId = series.id;