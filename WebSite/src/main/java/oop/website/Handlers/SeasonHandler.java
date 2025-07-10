package oop.website.Handlers;

import jakarta.websocket.server.PathParam;
import oop.website.Models.Episode;
import oop.website.Models.File;
import oop.website.Models.Season;
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

import java.util.List;

@Controller
@RequestMapping("/api/seasons")
public class SeasonHandler
{
    @Autowired
    JdbcTemplate jdbcTemplate;

    @Autowired
    FileHandler fileHandler;

    public SeasonHandler()
    {
        super();
    }
    public SeasonHandler(JdbcTemplate jdbcTemplate)
    {
        super();
        this.jdbcTemplate = jdbcTemplate;
    }

    @PostMapping(path = "/one", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @ResponseBody
    public ResponseEntity<Object> postOne(@RequestPart(name = "season", required = true) Season season, @RequestParam(name = "serieName", required = true) String serieName, @RequestParam(name = "year", required = true) int year, @RequestPart("files") MultipartFile ...files)
    {
        try
        {
            SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(jdbcTemplate).withProcedureName("insertSeason");
            simpleJdbcCall.execute(serieName, year, season.getSeasonNumber(), season.getName());

            if(season.getEpisodes()!=null && season.getEpisodes().size()== files.length)
            {
                EpisodeHandler episodeHandler = new EpisodeHandler(jdbcTemplate);
                episodeHandler.postEpisodes(season.getEpisodes(),serieName,year, season.getSeasonNumber(), files);
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
            String sql = "select seasonName, seasonNumber from seasonsOut where year = ? and serieName = ? and seasonNumber = ?";
            Season season = jdbcTemplate.queryForObject(sql, new Object[]{year,serieName,seasonNumber},new BeanPropertyRowMapper<>(Season.class));

            String sql1 = "select episodeName, episodeNumber, fileName from episodesOut where serieName=? and year=? and seasonNumber=?";
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
            String sql = "select seasonName, seasonNumber from seasonOut where year = ? and serieName = ?";

            List<Season> seasons = jdbcTemplate.query(sql, new Object[]{year,serieName},new BeanPropertyRowMapper<>(Season.class));
            for(Season season:seasons)
            {
                String sql1 = "select episodeName, episodeNumber, fileName from episodeOut where serieName=? and year=? and seasonNumber=?";
                season.setEpisodes(jdbcTemplate.query(sql1,new Object[]{serieName,year,season.getSeasonNumber()},new BeanPropertyRowMapper<>(Episode.class)));
            }
            return new ResponseEntity<>(seasons, HttpStatus.OK);
        }
        catch (Exception e)
        {
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

            String sql = "DELETE FROM seasons WHERE year = ? and serieName = ? and seasonNumber = ?";
            jdbcTemplate.update(sql, new Object[]{year,serieName,seasonNumber});
            return new ResponseEntity<>(HttpStatus.OK);
        }
        catch (Exception e)
        {
            e.printStackTrace();
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
