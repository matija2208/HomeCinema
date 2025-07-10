package oop.website.Handlers;

import jakarta.websocket.server.PathParam;
import oop.website.Models.Episode;
import oop.website.Models.Season;
import oop.website.Models.Serie;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.simple.SimpleJdbcCall;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Controller
@RequestMapping("/api/series")
public class SerieHandler
{
    @Autowired
    JdbcTemplate jdbcTemplate;

    @Autowired
    FileHandler fileHandler;

    @GetMapping("/all")
    @ResponseBody
    public ResponseEntity<Object> getAllSeries()
    {
        try {
            String sql = "select * from seriesOut";
            List<Serie> series = jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(Serie.class));
            for (Serie serie : series) {
                String sql1 = "select seasonNumber, seasonName as name from seasonsOut where serieName = \"" + serie.getName() + "\" and year = " + serie.getYear() + ";";
                serie.setSeasons(jdbcTemplate.query(sql1, new BeanPropertyRowMapper<>(Season.class)));

                for (Season season : serie.getSeasons()) {
                    String sql2 = "select episodeNumber, episodeName as name, filename from episodesOut where serieName = \"" + serie.getName() + "\" and year = " + serie.getYear() + " and seasonNumber = " + season.getSeasonNumber() + ";";
                    season.setEpisodes(jdbcTemplate.query(sql2, new BeanPropertyRowMapper<>(Episode.class)));
                }
            }
            return new ResponseEntity<>(series, HttpStatus.OK);
        }
        catch (Exception e)
        {
            return new ResponseEntity<>(e.getMessage(),HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/one")
    @ResponseBody
    public ResponseEntity<Object> getSerie(@PathParam("serieName") String serieName, @PathParam("year") int year)
    {
        try {
            System.out.println(serieName);
            System.out.println(year);
            String sql = "select * from seriesOut where name = ? and year = ?;";
            Serie serie = jdbcTemplate.queryForObject(sql, new Object[]{serieName,year}, new BeanPropertyRowMapper<>(Serie.class));

            String sql1 = "select seasonNumber, seasonName as name from seasonsOut where serieName = \"" + serie.getName() + "\" and year = " + serie.getYear() + ";";
            serie.setSeasons(jdbcTemplate.query(sql1, new BeanPropertyRowMapper<>(Season.class)));

            for (Season season : serie.getSeasons()) {
                String sql2 = "select episodeNumber, episodeName as name, filename from episodesOut where serieName = \"" + serie.getName() + "\" and year = " + serie.getYear() + " and seasonNumber = " + season.getSeasonNumber() + ";";
                season.setEpisodes(jdbcTemplate.query(sql2, new BeanPropertyRowMapper<>(Episode.class)));
            }

            return new ResponseEntity<>(serie, HttpStatus.OK);
        }
        catch (Exception e)
        {
            e.printStackTrace();
            return new ResponseEntity<>(e.getMessage(),HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping(path = "/one", consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
    @ResponseBody
    public ResponseEntity<Object> postSeries(@RequestPart("serie") Serie serie, @RequestPart(value = "poster",required = false) MultipartFile poster,  @RequestPart(value = "files",required = false) MultipartFile ...files)
    {
        try
        {
            String fileName=null;
            if(poster!=null)
            {
                String fileExtension = "."+poster.getOriginalFilename().split("\\.")[1];
                fileName = fileHandler.saveFile(poster).split("\\.")[0];


                String sql = "INSERT INTO files(fileName, fileExtension) VALUES(?,?)";
                jdbcTemplate.update(sql, fileName, fileExtension);
            }
            SimpleJdbcCall call = new SimpleJdbcCall(jdbcTemplate).withProcedureName("insertSerie");
            call.execute(serie.getName(),serie.getYear(), serie.getCategory(), fileName);

            if(serie.getSeasons()!=null)
            {
                SeasonHandler seasonHandler = new SeasonHandler(jdbcTemplate);

                for(Season season : serie.getSeasons())
                {
                    List<MultipartFile> fileList = new ArrayList<MultipartFile>();
                    if(season.getEpisodes()!=null)
                    {
                        for (Episode episode : season.getEpisodes()) {
                            boolean t = false;

                            for (MultipartFile file : files) {
                                if (Objects.equals(file.getOriginalFilename(), episode.getFileName())) {
                                    fileList.add(file);
                                    t = true;
                                    break;
                                }
                            }
                            if (!t) {
                                return new ResponseEntity<>("No file parsed for episode: " + episode.getFileName(), HttpStatus.BAD_REQUEST);
                            }
                        }
                    }
                    seasonHandler.postOne(season, serie.getName(), serie.getYear(), fileList.toArray(new MultipartFile[0]));
                }
            }
            return new ResponseEntity<>(HttpStatus.CREATED);
        }
        catch(Exception e)
        {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/one")
    @ResponseBody
    public ResponseEntity<Object> deleteSerie(@PathParam("serieName") String serieName, @PathParam("year") int year)
    {
        try
        {
            String sql1 = "select fileName from episodesOut where serieName = ? and year = ?;";
            List<String> fileNames = jdbcTemplate.queryForList(sql1,new Object[]{serieName,year},String.class);
            for(String fileName:fileNames)
            {
                fileHandler.deleteFile(fileName);
            }

            String sql = "DELETE FROM series WHERE name =? and year =?";
            jdbcTemplate.update(sql, serieName, year);

            return new ResponseEntity<>(HttpStatus.OK);
        }
        catch (Exception e)
        {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
