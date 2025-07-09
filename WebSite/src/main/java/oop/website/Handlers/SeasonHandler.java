package oop.website.Handlers;

import oop.website.Models.Season;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.simple.SimpleJdbcCall;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/api/seasons")
public class SeasonHandler
{
    @Autowired
    JdbcTemplate jdbcTemplate;

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
    public ResponseEntity<Object> postOne(@RequestPart("season") Season season, @RequestPart("serieName") String serieName, @RequestPart("year") int year)
    {
        try
        {
            SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(jdbcTemplate).withProcedureName("insertSeason");
            simpleJdbcCall.execute(serieName, year, season.getSeasonNumber(), season.getName());

            if(season.getEpisodes()!=null)
            {
                EpisodeHandler episodeHandler = new EpisodeHandler(jdbcTemplate);
                episodeHandler.postEpisodes(season.getEpisodes(),serieName,year, season.getSeasonNumber());
            }

            return new ResponseEntity<>(HttpStatus.CREATED);
        }
        catch (Exception e)
        {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
