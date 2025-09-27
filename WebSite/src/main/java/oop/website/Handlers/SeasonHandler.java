package oop.website.Handlers;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import jakarta.websocket.server.PathParam;
import oop.website.Models.Episode;
import oop.website.Models.EpisodeLastWatched;
import oop.website.Models.File;
import oop.website.Models.Season;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.simple.SimpleJdbcCall;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Controller
@RequestMapping("/api/seasons")
public class SeasonHandler
{
    @Autowired
    JdbcTemplate jdbcTemplate;

    @Autowired
    FileHandler fileHandler;

    @Autowired
    public SeasonHandler(JdbcTemplate jdbcTemplate, FileHandler fileHandler)
    {
        super();
        this.jdbcTemplate = jdbcTemplate;
        this.fileHandler = fileHandler;
    }

    @PostMapping(path = "/one", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @ResponseBody
    public ResponseEntity<Object> postOne(@RequestPart(name = "season", required = true) String s, @RequestParam(name = "serieName", required = true) String serieName, @RequestParam(name = "year", required = true) int year, @RequestPart(value = "files",required = false) MultipartFile ...files)
    {
        try
        {

            ObjectMapper mapper = new ObjectMapper();
            Season season = mapper.readValue(s, Season.class);
            System.out.println(s);
            System.out.println(season);
            System.out.println(Arrays.toString(files));

            SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(jdbcTemplate).withCatalogName("HomeCinema").withProcedureName("insertSeason");
            simpleJdbcCall.execute(serieName, year, season.getSeasonNumber(), season.getName());

            if(season.getEpisodes()!=null && season.getEpisodes().size()== files.length)
            {
                EpisodeHandler episodeHandler = new EpisodeHandler(jdbcTemplate, fileHandler);

                String eps = mapper.writeValueAsString(season.getEpisodes());
                episodeHandler.postEpisodes(eps,serieName,year, season.getSeasonNumber(), files);
            }

            return new ResponseEntity<>(HttpStatus.CREATED);
        }
        catch (Exception e)
        {
            e.printStackTrace();
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping(path="/one")
    @ResponseBody
    public ResponseEntity<Object> getSeason(@PathParam("serieName") String serieName, @PathParam("year") int year, @PathParam("seasonNumber") int seasonNumber)
    {
        try
        {
            String sql = "select seasonName as name, seasonNumber from seasonsOut where year = ? and serieName = ? and seasonNumber = ?";
            Season season = jdbcTemplate.queryForObject(sql, new Object[]{year,serieName,seasonNumber},new BeanPropertyRowMapper<>(Season.class));

            String sql1 = "select episodeName as name, episodeNumber, fileName from episodesOut where serieName=? and year=? and seasonNumber=?";
            season.setEpisodes(jdbcTemplate.query(sql1,new Object[]{serieName,year,seasonNumber},new BeanPropertyRowMapper<>(Episode.class)));

            return new ResponseEntity<>(season, HttpStatus.OK);
        }
        catch (Exception e)
        {
            e.printStackTrace();
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/all")
    @ResponseBody
    public ResponseEntity<Object> getSeasons(@PathParam("seriName") String serieName, @PathParam("year") int year)
    {
        try
        {
            String sql = "select seasonName as name, seasonNumber from seasonsOut where year = ? and serieName = ?";

            List<Season> seasons = jdbcTemplate.query(sql, new Object[]{year,serieName},new BeanPropertyRowMapper<>(Season.class));
            for(Season season:seasons)
            {
                String sql1 = "select episodeName as name, episodeNumber, fileName from episodesOut where serieName=? and year=? and seasonNumber=?";
                season.setEpisodes(jdbcTemplate.query(sql1,new Object[]{serieName,year,season.getSeasonNumber()},new BeanPropertyRowMapper<>(Episode.class)));
            }
            return new ResponseEntity<>(seasons, HttpStatus.OK);
        }
        catch (Exception e)
        {
            e.printStackTrace();
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/one")
    @ResponseBody
    public ResponseEntity<Object> deleteSeason(@PathParam("serieName") String serieName, @PathParam("year") int year, @PathParam("seasonNumber") int seasonNumber)
    {
        try
        {
            String sql1 = "select fileName from episodesOut where serieName = ? and year = ? and seasonNumber = ?;";
            List<String> fileNames = jdbcTemplate.queryForList(sql1,new Object[]{serieName,year, seasonNumber},String.class);
            for(String fileName:fileNames)
            {
                fileHandler.deleteFile(fileName);
            }

            String sql = "DELETE FROM seasons WHERE serieId = (SELECT id FROM series WHERE series.name = ? AND year = ?) and seasonNumber = ?";
            jdbcTemplate.update(sql, new Object[]{serieName,year,seasonNumber});
            return new ResponseEntity<>(HttpStatus.OK);
        }
        catch (Exception e)
        {
            e.printStackTrace();
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/one/lastWatched")
    @ResponseBody
    public ResponseEntity<Object> lastWatched(@PathParam("name") String name, @PathParam("year") int year, @PathParam("seasonNumber") int seasonNumber)
    {
        try
        {
            String username = SecurityContextHolder.getContext().getAuthentication().getName();

            System.out.println(name);
            System.out.println(username);
            System.out.println(year);
            System.out.println(seasonNumber);

            String sql = "SELECT episodeNumber, timeStamp FROM episodesLastWatched WHERE name = ? and year = ? and seasonNumber = ? AND username = ? ORDER BY episodeNumber;";

            List<EpisodeLastWatched> timeStamps = jdbcTemplate.query(sql, new Object[]{name,year,seasonNumber,username},new BeanPropertyRowMapper<>(EpisodeLastWatched.class));

            return new ResponseEntity<>(timeStamps, HttpStatus.OK);
        }
        catch (Exception e)
        {
            e.printStackTrace();
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
