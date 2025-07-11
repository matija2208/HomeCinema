package oop.website.Handlers;

import oop.website.Models.User;
import oop.website.Utilities.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/auth")
public class UserHandler
{
    @Autowired
    JdbcTemplate jdbcTemplate;

    @Autowired
    JwtService jwtService;

    @PostMapping("/login")
    @ResponseBody
    public ResponseEntity<Object> login(@RequestBody User user)
    {
        try
        {
            String sql = "select name, password from users where name = ?";
            User u = jdbcTemplate.queryForObject(sql, new BeanPropertyRowMapper<>(User.class), user.getName());

            if(u == null)
            {
                return new ResponseEntity<>("Invalid username", HttpStatus.UNAUTHORIZED);
            }

            System.out.println(u.getPassword());
            System.out.println(user.getPassword());
            if(!u.getPassword().equals(user.getPassword()) && !user.isPasswordEqual(u.getPassword()))
            {
                return new ResponseEntity<>("Invalid password", HttpStatus.UNAUTHORIZED);
            }
            else
            {
                return new ResponseEntity<>(jwtService.generateToken(user.getName()), HttpStatus.OK);
            }
        }
        catch(Exception e)
        {
            e.printStackTrace();
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/register")
    @ResponseBody
    public ResponseEntity<Object> register(@RequestBody User user)
    {
        try
        {
            String sql = "insert into users (name, password) values (?, ?)";
            user.hashPassword();
            jdbcTemplate.update(sql, user.getName(), user.getPassword());

            return new ResponseEntity<>(jwtService.generateToken(user.getName()), HttpStatus.OK);
        }
        catch(Exception e)
        {
            e.printStackTrace();
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
