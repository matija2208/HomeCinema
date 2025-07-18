package oop.website.Handlers;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.websocket.server.PathParam;
import oop.website.Models.Episode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.simple.SimpleJdbcCall;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.MediaType;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
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
    public EpisodeHandler(JdbcTemplate jdbcTemplate, FileHandler fh)
    {
        super();
        this.jdbcTemplate = jdbcTemplate;
        this.fh = fh;
    }

    @PostMapping(path = "/one", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Object> postEpisode(@RequestParam("episode") String e, @RequestParam("serieName") String serieName, @RequestParam("year") int year, @RequestParam("seasonNumber") int seasonNumber, @RequestPart("file") MultipartFile file)
    {
        try {
            ObjectMapper mapper = new ObjectMapper();
            Episode episode = mapper.readValue(e, Episode.class);
            String fileName = fh.saveFile(file);

            int lastIndexOfDot = fileName.lastIndexOf('.');
            if (lastIndexOfDot > 0) {
                String fileExtension = fileName.substring(lastIndexOfDot);
                fileName = fileName.substring(0, lastIndexOfDot);
                episode.setFileName(fileName);

                String sql = "INSERT INTO files(fileName, fileExtension) VALUES(?,?)";
                jdbcTemplate.update(sql, episode.getFileName(), fileExtension);

                SimpleJdbcCall call = new SimpleJdbcCall(jdbcTemplate).withProcedureName("insertEpisode");

                System.out.println(episode);

                call.execute(serieName, year, seasonNumber, episode.getEpisodeNumber(), episode.getName(), episode.getFileName());
                return new ResponseEntity<>(HttpStatus.CREATED);

            }
            else
            {
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }
        }
        catch (Exception err)
        {
            err.printStackTrace();
            return new ResponseEntity<>(err.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    @PostMapping(path = "/lot", consumes = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<Object> postEpisodes(@RequestPart("episodes") String eps,@RequestParam("serieName") String serieName, @RequestParam("year") int year, @RequestParam("seasonNumber") int seasonNumber, @RequestPart("files") MultipartFile ...args)
    {
        try
        {
            ObjectMapper mapper = new ObjectMapper();
            List<Episode> episodes = mapper.readValue(eps, new TypeReference<List<Episode>>(){});

            if(episodes !=null && episodes.size() == args.length)
            {
                int count = 0;
                for(Episode episode : episodes)
                {
                    String ep = mapper.writeValueAsString(episode);
                    postEpisode(ep, serieName, year, seasonNumber, args[count++]);
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

            String sql = "DELETE FROM episodes WHERE seasonId = (SELECT id FROM seasons WHERE serieId = (SELECT id FROM series WHERE series.name = ? AND year = ?) AND seasonNumber = ? ) and episodeNumber = ?";
            jdbcTemplate.update(sql, new Object[]{serieName,year,seasonNumber,episodeNumber});
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
    public ResponseEntity<Object> lastWatched(@PathParam("name") String name, @PathParam("year") int year, @PathParam("seasonNumber") int seasonNumber, @PathParam("episodeNumber") int episodeNumber)
    {
        try
        {
            String username = SecurityContextHolder.getContext().getAuthentication().getName();
            String sql = "SELECT timeStamp FROM episodesLastWatched WHERE name = ? and year = ? and seasonNumber = ? and episodeNumber = ? AND username = ?;";

            String timeStamp = jdbcTemplate.queryForObject(sql, new Object[]{name,year,seasonNumber,episodeNumber,username},String.class);

            return new ResponseEntity<>(timeStamp, HttpStatus.OK);
        }
        catch (Exception e)
        {
            e.printStackTrace();
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
