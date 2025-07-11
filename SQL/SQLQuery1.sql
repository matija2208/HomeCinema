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