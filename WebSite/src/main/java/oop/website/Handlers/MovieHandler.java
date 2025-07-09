package oop.website.Handlers;

import oop.website.Models.Movie;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.simple.SimpleJdbcCall;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@Controller
@RequestMapping("/api/movies")
public class MovieHandler
{
    @Autowired
    private JdbcTemplate jdbcTemplate;

    @GetMapping("/all")
    @ResponseBody
    public List<Movie> getAllMovies()
    {
        String sqlQuery = "SELECT * FROM moviesOut";
        return jdbcTemplate.query(sqlQuery, new BeanPropertyRowMapper<>(Movie.class));
    }

    @GetMapping("/one/{name}/{year}")
    @ResponseBody
    public Movie getOneMovie(@PathVariable String name, @PathVariable int year)
    {
        String sqlQuery = "SELECT * FROM moviesOut WHERE name=? AND year=?";
        return jdbcTemplate.queryForObject(sqlQuery, new Object[]{name, year}, new BeanPropertyRowMapper<>(Movie.class));
    }

    @PostMapping(path = "/", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @ResponseBody
    public Object setMovie(@RequestPart("movie") Movie movie)
    {
        String fileName = movie.getFileName().split("\\.")[0];
        String fileExtension = "."+movie.getFileName().split("\\.")[1];

        movie.setFileName(UUID.randomUUID().toString());

        String sql = "INSERT INTO files(fileName,fileExtension) VALUES(?,?)";
        jdbcTemplate.update(sql,movie.getFileName(),fileExtension);

        SimpleJdbcCall call = new SimpleJdbcCall(jdbcTemplate).withProcedureName("insertMovie");

        try {
            return call.execute(movie.getName(), movie.getYear(), movie.getCategory(), movie.getFileName());
        }
        catch (Exception e)
        {
            return e.getMessage();
        }
    }

    @DeleteMapping("/one/{name}/{year}")
    @ResponseBody
    public Object deleteMovie(@PathVariable String name, @PathVariable int year)
    {
        String sql = "DELETE FROM movies WHERE name=? AND year=?";
        return jdbcTemplate.update(sql,name,year);
    }
}
