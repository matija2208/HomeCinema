package oop.website.Handlers;

import jakarta.servlet.annotation.MultipartConfig;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.websocket.server.PathParam;
import oop.website.Models.User;
import oop.website.Utilities.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@RequestMapping("/auth")
public class UserHandler
{
    @Autowired
    JdbcTemplate jdbcTemplate;

    @Autowired
    JwtService jwtService;

    @PostMapping(value = "/login", consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE)
    @ResponseBody
    public ResponseEntity<Object> login(@RequestParam("username") String username, @RequestParam("password") String password, HttpServletResponse response)
    {
        try
        {
            User user = new User();
            user.setName(username);
            user.setPassword(password);
            System.out.println(user.getName());
            System.out.println(user.getPassword());
            String sql = "select name, password from users where name = ?";
            User u = jdbcTemplate.queryForObject(sql, new BeanPropertyRowMapper<>(User.class), user.getName());

            if(u == null)
            {
                return new ResponseEntity<>("<!DOCTYPE html><html><head></head><body style='background-color: #446;'><script>location.href='https://homecinema.servehttp.com/login?error=Invalid username&username="+username+"&password="+password+"'</script></body></html>", HttpStatus.UNAUTHORIZED);
            }

            System.out.println(u.getPassword());
            System.out.println(user.getPassword());
            if(!u.getPassword().equals(user.getPassword()) && !user.isPasswordEqual(u.getPassword()))
            {
                return new ResponseEntity<>("<!DOCTYPE html><html><head></head><body style='background-color: #446;'><script>location.href='https://homecinema.servehttp.com/login?error=Invalid password&username="+username+"&password="+password+"'</script></body></html>", HttpStatus.UNAUTHORIZED);
            }
            else
            {
                ResponseCookie cookie = ResponseCookie.from("jwt",jwtService.generateToken(user.getName()))
                        .httpOnly(true)
                        .secure(true)
                        .path("/")
                        .maxAge(86400)
                        .sameSite("Lax")
                        .build();

                response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());

                return ResponseEntity.ok("<!DOCTYPE html><html><head></head><body style='background-color: #446;'><script>location.href='https://homecinema.servehttp.com'</script></body></html>");
            }
        }
        catch(Exception e)
        {
            e.printStackTrace();
            return new ResponseEntity<>("<!DOCTYPE html><html><head></head><body style='background-color: #446;'><script>location.href='https://homecinema.servehttp.com/login?error="+e.getMessage()+"&username="+username+"&password="+password+"'</script></body></html>", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/logout")
    @ResponseBody
    public ResponseEntity<Object> logOut(HttpServletResponse response)
    {
        try
        {
            ResponseCookie cookie = ResponseCookie.from("jwt","")
                    .httpOnly(true)
                    .secure(true)
                    .path("/")
                    .maxAge(0)
                    .sameSite("Lax")
                    .build();
            response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());

            return ResponseEntity.ok("Login successful");
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

            return new ResponseEntity<>(HttpStatus.OK);
        }
        catch(Exception e)
        {
            e.printStackTrace();
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @GetMapping("/all")
    @ResponseBody
    public ResponseEntity<Object> allUsernames()
    {
        try
        {
            String sql = "select name from users";
            List<String> users = jdbcTemplate.queryForList(sql, String.class);

            return new ResponseEntity<>(users, HttpStatus.OK);
        }
        catch(Exception e)
        {
            e.printStackTrace();
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/one")
    @ResponseBody
    public ResponseEntity<Object> deleteUser(@PathParam("username") String username)
    {
        try
        {
            String sql = "delete from users where name = ?";
            jdbcTemplate.update(sql, username);
            return new ResponseEntity<>(HttpStatus.OK);
        }
        catch(Exception e)
        {
            e.printStackTrace();
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @GetMapping("/check")
    @ResponseBody
    public ResponseEntity<Object> checkCookie(HttpServletRequest request)
    {
        try
        {
            Cookie[] cookies = request.getCookies();
            if (cookies == null) {
                return ResponseEntity.badRequest().build();
            }

            for (Cookie cookie : cookies) {
                if ("jwt".equals(cookie.getName())) {
                    if(jwtService.isTokenValid(cookie.getValue()))
                        return ResponseEntity.ok().build();
                }
            }

            return ResponseEntity.badRequest().build();

        }
        catch(Exception e)
        {
            e.printStackTrace();
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}
