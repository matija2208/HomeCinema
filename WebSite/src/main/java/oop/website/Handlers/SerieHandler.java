package oop.website.Handlers;

import oop.website.Models.Episode;
import oop.website.Models.Season;
import oop.website.Models.Serie;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@RequestMapping("/api/series")
public class SerieHandler
{
    @Autowired
    JdbcTemplate jdbcTemplate;

    @GetMapping("/all")
    @ResponseBody
    public List<Serie> getAllSeries()
    {
        String sql = "select * from seriesOut";
        List<Serie> series = jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(Serie.class));
        for (Serie serie : series)
        {
            String sql1 = "select seasonNumber, seasonName as name from seasonsOut where serieName = \"" + serie.getName() + "\" and year = " + serie.getYear() + ";";
            serie.setSeasons(jdbcTemplate.query(sql1, new BeanPropertyRowMapper<>(Season.class)));

            for (Season season : serie.getSeasons())
            {
                String sql2 = "select episodeNumber, episodeName as name, filename from episodesOut where serieName = \"" + serie.getName() + "\" and year = " + serie.getYear() + " and seasonNumber = " + season.getSeasonNumber()+";";
                season.setEpisodes(jdbcTemplate.query(sql2, new BeanPropertyRowMapper<>(Episode.class)));
            }
        }
        return series;
    }

    @PostMapping(path = "/one", consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
    @ResponseBody
    public String postSeries(@RequestPart("serie") Serie serie)
    {
        try
        {
            String sql = "INSERT INTO series(name, year, category) VALUES(?,?,?)";
            jdbcTemplate.update(sql, serie.getName(), serie.getYear(), serie.getCategory());

            if(serie.getSeasons()!=null)
            {
                SeasonHandler seasonHandler = new SeasonHandler(jdbcTemplate);
                EpisodeHandler episodeHandler = new EpisodeHandler(jdbcTemplate);
                for(Season season : serie.getSeasons())
                {
                    seasonHandler.postOne(season, serie.getName(), serie.getYear());
                }
            }
            return "Error:false";
        }
        catch(Exception e)
        {
            e.printStackTrace();
            return "{Error: \"" + e.getMessage() + "\"}";
        }
    }
}
