package oop.website.Handlers;

import jakarta.websocket.server.PathParam;
import oop.website.Models.SearchResult;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.simple.SimpleJdbcCall;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;

@Controller
@RequestMapping("/api/search")
public class SearchHandler
{
    @Autowired
    JdbcTemplate jdbcTemplate;

    @GetMapping("/all")
    @ResponseBody
    public ResponseEntity<Object> searchAll(@PathParam("searchParam") String searchParam)
    {
        try
        {
            System.out.println(searchParam);



            String sql = "SELECT * FROM searchAll WHERE LOWER(searchParam) LIKE LOWER(?) ORDER BY CASE WHEN LOWER(searchParam) LIKE LOWER(?) THEN 1 WHEN LOWER(searchParam) LIKE LOWER(?) THEN 2 WHEN LOWER(searchParam) LIKE LOWER(?) THEN 3 ELSE 4 END, CASE WHEN type='movie' OR type='serie' THEN 1 WHEN type='season' THEN 2 WHEN type='episode' THEN 3 ELSE 4 END,  SearchParam";

            List<SearchResult> result = jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(SearchResult.class), "%"+searchParam+"%", searchParam, searchParam+"%", "%"+searchParam+"%");
            return new ResponseEntity<>(result, HttpStatus.OK);
        }
        catch (Exception e)
        {
            e.printStackTrace();
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}
