create or replace view moviesOut as
select name,year,category, concat(poster.fileName,poster.fileExtension) as posterName, concat(video.fileName,video.fileExtension) as fileName 
from movies 
left join files as poster 
	on movies.posterId=poster.id 
join files as video 
	on movies.fileId = video.id;

create or replace view seriesOut as
select series.name as name,year,category,count(seasons.id) as noOfSeasons, concat(files.fileName,files.fileExtension) as posterName
from series 
left join files on series.posterId = files.id
join seasons where series.id = seasons.serieId
group by series.id;

create or replace view seasonsOut as
select seasonNumber, seasons.name as seasonName, series.name as serieName, year
from seasons join series on serieId = series.id;

create or replace view episodesOut as
select episodeNumber, episodes.name as episodeName, seasonNumber, series.name as serieName, year, concat(files.fileName,files.fileExtension) as fileName
from episodes 
join files on files.id = fileId
join seasons on seasonId = seasons.id
join series on serieId = series.id;

