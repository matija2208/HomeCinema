package oop.website.Handlers;

import oop.website.Models.Movie;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.Collections;
import java.util.List;

@Controller
@RequestMapping("/api/movies")
public class MovieHandler
{
    @GetMapping("/all")
    @ResponseBody
    public List<Movie> GetAllMovies()
    {
        return Collections.emptyList();
    }
}
