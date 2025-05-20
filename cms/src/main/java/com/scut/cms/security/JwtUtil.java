package com.scut.cms.security;

import io.jsonwebtoken.*;
import org.springframework.stereotype.Component;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Date;

@Component
public class JwtUtil {
    private final String secret = "your-very-long-and-secure-secret-key-123456"; 
    private final long validityMs = 24*60*60*1000;    

    public String generateToken(UserDetails user) {
        return Jwts.builder()
            .setSubject(user.getUsername())
            .claim("role", user.getAuthorities().iterator().next().getAuthority())
            .setIssuedAt(new Date())
            .setExpiration(new Date(System.currentTimeMillis() + validityMs))
            .signWith(SignatureAlgorithm.HS256, secret)
            .compact();
    }

    public boolean validateToken(String token, UserDetails user) {
        try {
            String username = Jwts.parser().setSigningKey(secret)
                .parseClaimsJws(token).getBody().getSubject();
            return username.equals(user.getUsername()) && !isExpired(token);
        } catch (JwtException|IllegalArgumentException e) {
            return false;
        }
    }

    private boolean isExpired(String token) {
        Date exp = Jwts.parser().setSigningKey(secret)
            .parseClaimsJws(token).getBody().getExpiration();
        return exp.before(new Date());
    }

    public String extractUsername(String token) {
        return Jwts.parser().setSigningKey(secret)
            .parseClaimsJws(token).getBody().getSubject();
    }
}
