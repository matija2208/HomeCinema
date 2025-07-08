package oop.website.Handlers;

import oop.website.Models.Movie;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;

@Controller
@RequestMapping("/api/movies")
public class MovieHandler
{
    @Autowired
    private JdbcTemplate jdbcTemplate;

    @GetMapping("/all")
    @ResponseBody
    public List<Movie> GetAllMovies()
    {
        String sqlQuery = "SELECT * FROM moviesOut";
        return jdbcTemplate.query(sqlQuery, new BeanPropertyRowMapper<>(Movie.class));
    }
}
