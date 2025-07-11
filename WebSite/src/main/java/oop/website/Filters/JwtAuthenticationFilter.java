package oop.website.Filters;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import oop.website.Models.User;
import oop.website.Utilities.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private final JwtService jwtService;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public JwtAuthenticationFilter(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        final String authHeader = request.getHeader("Authorization");
        final String jwt;
        final String username;

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            System.out.println("Error: Auth header: " + authHeader);
            return;
        }


        jwt = authHeader.substring(7);

        if(jwtService.isTokenValid(jwt))
        {
            username = jwtService.extractUsername(jwt);

            if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {


                try {
                    String sql = "SELECT name, password FROM users WHERE name = ?";
                    User user = jdbcTemplate.queryForObject(sql, new BeanPropertyRowMapper<>(User.class), username);

                    if (user != null) {
                        var UserAuth = new UsernamePasswordAuthenticationToken(user.getName(), user.getPassword(), null);
                        SecurityContextHolder.getContext().setAuthentication(UserAuth);
                    } else {
                        System.out.println("Error: Authentication Failed");
                    }

                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        }
        else
        {
            System.out.println("Error: Invalid JWT");
        }

        filterChain.doFilter(request, response);
    }
}
