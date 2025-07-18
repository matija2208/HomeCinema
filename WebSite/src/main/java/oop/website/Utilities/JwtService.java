package oop.website.Utilities;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import oop.website.Config.JwtKeyConfig;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;

@Service
public class JwtService {

    private final Key key;

    @Autowired
    public JwtService(JwtKeyConfig jwtKeyConfig)
    {
        this.key = Keys.hmacShaKeyFor(jwtKeyConfig.getKey().getBytes(StandardCharsets.UTF_8));
    }
    // 24 hour expiration
    private static final long EXPIRATION = 1000 * 60 * 60 * 24;

    public String generateToken(String username) {
        return Jwts.builder()
                .setSubject(username)
                .setIssuer("HomeCinema")
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION))
                .signWith(key)
                .compact();
    }

    public boolean isTokenValid(String token) {
        try {
            Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public String extractUsername(String token) {
        return Jwts.parserBuilder().setSigningKey(key)
                .build().parseClaimsJws(token)
                .getBody().getSubject();
    }
}