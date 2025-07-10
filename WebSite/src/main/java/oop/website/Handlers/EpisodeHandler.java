package oop.website.Handlers;

import jakarta.websocket.server.PathParam;
import oop.website.Models.Episode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.simple.SimpleJdbcCall;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.MediaType;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

@Controller
@RequestMapping("/api/episodes")
public class EpisodeHandler
{
    @Autowired
    JdbcTemplate jdbcTemplate;

    @Autowired
    FileHandler fh;

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
    public ResponseEntity<Object> postEpisode(@RequestPart("episode") Episode episode, @RequestParam("serieName") String serieName, @RequestParam("year") int year, @RequestParam("seasonNumber") int seasonNumber, @RequestPart("file") MultipartFile file)
    {
        try {

            String fileName = fh.saveFile(file);
            String fileExtension = "." + fileName.split("\\.")[1];
            fileName = fileName.split("\\.")[0];
            episode.setFileName(fileName);

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
    public ResponseEntity<Object> postEpisodes(@RequestPart("episodes") List<Episode> episodes,@RequestParam("serieName") String serieName, @RequestParam("year") int year, @RequestParam("seasonNumber") int seasonNumber, @RequestPart("files") MultipartFile ...args)
    {
        try
        {
            if(episodes !=null && episodes.size() == args.length)
            {
                int count = 0;
                for(Episode episode : episodes)
                {
                    postEpisode(episode, serieName, year, seasonNumber, args[count++]);
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

    @GetMapping("/one")
    @ResponseBody
    public ResponseEntity<Object> getEpisode(@PathParam("serieName") String serieName, @PathParam("year") int year, @PathParam("seasonNumber") int seasonNumber, @PathParam("episodeNumber") int episodeNumber)
    {
        try
        {
            String sql = "SELECT episodeNumber, episodeName,fileName from episodesOut where serieName = ? and year = ? and seasonNumber = ? and episodeNumber = ?";
            Episode e = jdbcTemplate.queryForObject(sql, new Object[]{serieName,year,seasonNumber,episodeNumber}, new BeanPropertyRowMapper<>(Episode.class));
            return new ResponseEntity<>(e, HttpStatus.OK);
        }
        catch (Exception e)
        {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/all")
    @ResponseBody
    public ResponseEntity<Object> getEpisodes(@PathParam("serieName") String serieName, @PathParam("year") int year, @PathParam("seasonNumber") int seasonNumber)
    {
        try
        {
            String sql = "SELECT episodeNumber, episodeName, fileName from episodesOut where serieName = ? and year = ? and seasonNumber = ?";
            List<Episode> episodes = jdbcTemplate.query(sql, new Object[]{serieName,year,seasonNumber}, new BeanPropertyRowMapper<>(Episode.class));
            return new ResponseEntity<>(episodes, HttpStatus.OK);
        }
        catch (Exception e)
        {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/one")
    @ResponseBody
    public ResponseEntity deleteEpisode(@PathParam("serieName") String serieName, @PathParam("year") int year, @PathParam("seasonNumber") int seasonNumber, @PathParam("episodeNumber") int episodeNumber)
    {
        try
        {
            String sql1 = "SELECT fileName from episodesOut where serieName = ? and year = ? and seasonNumber = ? and episodeNumber = ?";
            String fileName = jdbcTemplate.queryForObject(sql1,new Object[]{serieName,year,seasonNumber,episodeNumber},String.class);
            fh.deleteFile(fileName);

            String sql = "DELETE FROM episodes WHERE serieName = ? and year = ? and seasonNumber = ? and episodeNumber = ?";
            jdbcTemplate.update(sql, new Object[]{serieName,year,seasonNumber,episodeNumber});
            return new ResponseEntity<>(HttpStatus.OK);
        }
        catch (Exception e)
        {
            e.printStackTrace();
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
