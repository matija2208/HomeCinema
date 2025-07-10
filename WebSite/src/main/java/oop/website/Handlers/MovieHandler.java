package oop.website.Handlers;

import jakarta.websocket.server.PathParam;
import oop.website.Models.Movie;
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
@RequestMapping("/api/movies")
public class MovieHandler
{
    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Autowired
    private FileHandler fh;

    @GetMapping("/all")
    @ResponseBody
    public ResponseEntity getAllMovies()
    {
        try
        {
            String sqlQuery = "SELECT * FROM moviesOut";
            List<Movie> movies = jdbcTemplate.query(sqlQuery, new BeanPropertyRowMapper<>(Movie.class));
            return new ResponseEntity(movies, HttpStatus.OK);
        }
        catch (Exception e)
        {
            return new ResponseEntity(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/one/")
    @ResponseBody
    public ResponseEntity<Object> getOneMovie(@PathParam("name") String name, @PathParam("year") int year)
    {
        try
        {
            String sqlQuery = "SELECT * FROM moviesOut WHERE name=? AND year=?";
            Movie m = jdbcTemplate.queryForObject(sqlQuery, new Object[]{name, year}, new BeanPropertyRowMapper<>(Movie.class));
            return new ResponseEntity<>(m, HttpStatus.OK);
        }
        catch (Exception e)
        {
            return new ResponseEntity<>(e.getMessage(),HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping(path = "/", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @ResponseBody
    public ResponseEntity<Object> setMovie(@RequestPart(value = "movie", required = true) Movie movie, @RequestPart(name="file",required = true) MultipartFile file)
    {
        try
        {

            String fileName = fh.saveFile(file);
            String fileExtension = "." + fileName.split("\\.")[1];
            fileName = fileName.split("\\.")[0];
            movie.setFileName(fileName);

            System.out.println(fileName);

            String sql = "INSERT INTO files(fileName,fileExtension) VALUES(?,?)";
            jdbcTemplate.update(sql, fileName, fileExtension);

            SimpleJdbcCall call = new SimpleJdbcCall(jdbcTemplate).withProcedureName("insertMovie");

            call.execute(movie.getName(), movie.getYear(), movie.getCategory(), movie.getFileName());
            return new ResponseEntity<>(HttpStatus.CREATED);
        }
        catch (Exception e)
        {
            e.printStackTrace();
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @DeleteMapping("/one/")
    @ResponseBody
    public ResponseEntity<Object> deleteMovie(@PathParam("name") String name, @PathParam("year") int year)
    {
        try
        {
            String sql1 = "SELECT fileName from moviesOut where name = ? and year = ?;";
            String fileName = jdbcTemplate.queryForObject(sql1,new Object[]{name,year},String.class);
            fh.deleteFile(fileName);

            String sql = "DELETE FROM movies WHERE name=? AND year=?;";
            jdbcTemplate.update(sql,name,year);
            return new ResponseEntity<>(HttpStatus.OK);
        }
        catch (Exception e)
        {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }

    }
}
