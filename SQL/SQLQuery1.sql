insert into episodes(seasonId,episodeNumber, name, fileId) 
values(1,1,null,12);
insert into episodes(seasonId,episodeNumber, name, fileId) 
values(1,2,null,13);
insert into episodes(seasonId,episodeNumber, name, fileId) 
values(7,1,null,14);

insert into files(files.fileName,files.fileExtension)
values("7d577c58-f0a0-4069-bb43-dcb8e11dfd42",".mp4");

delete from files where (id not in (select fileId from movies) and id not in (select fileId from episodes) and id not in (select fileId from songs));

select * from episodesOut;

drop procedure insertEpisode;

select fileName
from episodesOut 
where serieName = "House of Cards" and year = 2013 and seasonNumber = 1;

insert into users(name,password,token)
values('root','01061944','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InJvb3QifQ.f5_-CfV6szlbP0YkrravxKTWP1KQWhnIMe_QYetxzS8');


select json_arrayagg(
	json_object("name",name,"password",password)
)as json_output
from users;

SELECT JSON_ARRAYAGG(
  JSON_OBJECT(
    "name", s.name,
    "year", s.year,
    "posterName", s.posterName,
    "category", s.category,
    "timeStamp", s.timeStamp,
    "lastWatched", s.lastWatched,
    "username", s.username,
    "noOfSeasons", s.noOfSeasons,
    "seasons", (
      SELECT JSON_ARRAYAGG(
               JSON_OBJECT(
                 "seasonName", t.seasonName,
                 "seasonNumber", t.seasonNumber,
                 "episodes", (
                   SELECT JSON_ARRAYAGG(
                            JSON_OBJECT(
                              "episodeName", e.episodeName,
                              "episodeNumber", e.episodeNumber,
                              "filename", e.filename,
                              "timeStmp",e.timestamp,
                              "lastWatched",e.lastWatched
                            )
                          )
                   FROM lastWatchedSeriesOut e
                   WHERE e.name = t.name
                     AND e.year = t.year
                     AND e.seasonNumber = t.seasonNumber
                     and e.username = t.username
                 )
               )
             )
      FROM 
      (select distinct name, year, seasonName, seasonNumber, username from lastWatchedSeriesOut k
      WHERE k.name = s.name
        AND k.year = s.year
        and k.username = s.username) as t
    )
  )
) AS json_output
FROM (
  SELECT
    name,
    year,
    posterName,
    category,
    username,
    lastWatched,
    noOfSeasons,
    timestamp
  FROM seriesLastWatched
            
) s;

SELECT JSON_ARRAYAGG(
  JSON_OBJECT(
    "name", s.name,
    "year", s.year,
    "posterName", s.posterName,
    "category", s.category,
    "noOfSeasons", s.noOfSeasons,
    "seasons", (
      SELECT JSON_ARRAYAGG(
               JSON_OBJECT(
                 "seasonName", t.seasonName,
                 "seasonNumber", t.seasonNumber,
                 "episodes", (
                   SELECT JSON_ARRAYAGG(
                            JSON_OBJECT(
                              "episodeName", e.episodeName,
                              "episodeNumber", e.episodeNumber,
                              "filename", e.filename
                            )
                          )
                   FROM episodesOut e
                   WHERE e.serieName = t.serieName
                     AND e.year = t.year
                     AND e.seasonNumber = t.seasonNumber
                 )
               )
             )
      FROM 
      (select * from seasonsOut 
		where s.name = serieName
        AND year = s.year
        ) as t
    )
  )
) AS json_output
FROM seriesOut s;

select json_arrayagg(
	json_object(
		"searchParam",searchParam,
        "type",type,
        "name",name,
        "year",year,
        "category",category
    )
)as json_output
from search s;












