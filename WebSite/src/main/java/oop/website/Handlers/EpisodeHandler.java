package oop.website.Handlers;

import oop.website.Models.Episode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.simple.SimpleJdbcCall;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.MediaType;

import java.util.List;
import java.util.UUID;

@Controller
@RequestMapping("/api/episodes")
public class EpisodeHandler
{
    @Autowired
    JdbcTemplate jdbcTemplate;

    public EpisodeHandler()
    {
        super();
    }
    public EpisodeHandler(JdbcTemplate jdbcTemplate)
    {
        super();
        this.jdbcTemplate = jdbcTemplate;
    }

    @PostMapping(path = "/one/", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Object> postEpisode(@RequestPart("episode") Episode episode, @RequestPart("serieName") String serieName, @RequestPart("year") int year, @RequestPart("seasonNumber") int seasonNumber)
    {
        try {
            String fileName = episode.getFileName().split("\\.")[0];
            String fileExtension = "." + episode.getFileName().split("\\.")[1];
            episode.setFileName(UUID.randomUUID().toString());

            String sql = "INSERT INTO files(fileName, fileExtension) VALUES(?,?)";
            jdbcTemplate.update(sql, episode.getFileName(), fileExtension);

            SimpleJdbcCall call = new SimpleJdbcCall(jdbcTemplate).withProcedureName("insertEpisode");

            System.out.println(episode);

            call.execute(serieName, year, seasonNumber, episode.getEpisodeNumber(), episode.getName(), episode.getFileName());
            return new ResponseEntity<>(HttpStatus.CREATED);
        }
        catch (Exception e)
        {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    @PostMapping(path = "/lot", consumes = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<Object> postEpisodes(@RequestPart("episodes") List<Episode> episodes,@RequestPart("serieName") String serieName, @RequestPart("year") int year, @RequestPart("seasonNumber") int seasonNumber)
    {
        try
        {
            if(episodes !=null)
            {
                for(Episode episode : episodes)
                {
                    postEpisode(episode, serieName, year, seasonNumber);
                }
                return new ResponseEntity<>(HttpStatus.CREATED);
            }
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
        catch (Exception e)
        {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
