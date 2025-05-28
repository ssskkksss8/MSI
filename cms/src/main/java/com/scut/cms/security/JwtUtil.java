package com.scut.cms.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;
import org.springframework.security.core.userdetails.UserDetails;

import javax.crypto.SecretKey;
import java.util.Date;

@Component
public class JwtUtil {
    private final SecretKey secretKey = Keys.hmacShaKeyFor("your-very-long-and-secure-secret-key-123456".getBytes());
    private final long validityMs = 24*60*60*1000;

    public String generateToken(UserDetails user) {
        return Jwts.builder()
            .setSubject(user.getUsername())
            .claim("role", user.getAuthorities().iterator().next().getAuthority())
            .setIssuedAt(new Date())
            .setExpiration(new Date(System.currentTimeMillis() + validityMs))
            .signWith(secretKey)
            .compact();
    }

    public boolean validateToken(String token, UserDetails user) {
        try {
            String username = Jwts.parserBuilder().setSigningKey(secretKey).build()
                .parseClaimsJws(token).getBody().getSubject();
            return username.equals(user.getUsername()) && !isExpired(token);
        } catch (JwtException|IllegalArgumentException e) {
            return false;
        }
    }

    private boolean isExpired(String token) {
        Date exp = Jwts.parserBuilder().setSigningKey(secretKey).build()
            .parseClaimsJws(token).getBody().getExpiration();
        return exp.before(new Date());
    }

    public String extractUsername(String token) {
        return Jwts.parserBuilder().setSigningKey(secretKey).build()
            .parseClaimsJws(token).getBody().getSubject();
    }
}