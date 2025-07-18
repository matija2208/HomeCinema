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
        final String cookieHeader = request.getHeader("Cookie");
        String jwt=null;
        final String username;

        String uri=(request.getRequestURI());
        System.out.println(uri);

        if(uri.contains("login") || uri.contains("auth/login"))
        {
            filterChain.doFilter(request, response);
            return;
        }


        if (cookieHeader == null || cookieHeader.isEmpty()) {
            if (!uri.contains("/login") && request.getMethod().equals("GET") && !uri.contains("/favicon.ico")) {
                String server = "https://" + request.getServerName();
                response.sendRedirect(server + "/login/index.html");
            }
            else
            {

                filterChain.doFilter(request, response);
            }
            return;
        }
        System.out.println("Cookie header: " + cookieHeader);

        String[] cookies = cookieHeader.split("; ");

        for (String cookie : cookies)
        {
            System.out.println(cookie);
            if(cookie.startsWith("jwt="))
                jwt=cookie.substring(4);
        }

        if(jwt==null)
        {
            if (!uri.contains("/login") && request.getMethod().equals("GET") && !uri.contains("/favicon.ico")) {
                String server = "https://" + request.getServerName();
                response.sendRedirect(server + "/login/index.html");
            }
            else
            {

                filterChain.doFilter(request, response);
            }
            return;
        }

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
                        filterChain.doFilter(request, response);
                        return;
                    } else {
                        if (!uri.contains("/login") && request.getMethod().equals("GET")) {
                            String server = "https://" + request.getServerName();
                            response.sendRedirect(server + "/login/index.html");
                            return;
                        }
                        else
                        {
                            filterChain.doFilter(request, response);
                            return;
                        }
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
