package com.hanyang.lovepin.auth;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import javax.crypto.SecretKey;
import java.util.Date;

@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String secret;

    private static final long ACCESS_TOKEN_EXPIRY = 1000 * 60 * 60;        // 1시간
    private static final long REFRESH_TOKEN_EXPIRY = 1000 * 60 * 60 * 24 * 7; // 7일

    private SecretKey getKey() {
        return Keys.hmacShaKeyFor(secret.getBytes());
    }

    public String generateAccessToken(Long userId) {
        return Jwts.builder()
                .subject(String.valueOf(userId))
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + ACCESS_TOKEN_EXPIRY))
                .signWith(getKey())
                .compact();
    }

    public String generateRefreshToken(Long userId) {
        return Jwts.builder()
                .subject(String.valueOf(userId))
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + REFRESH_TOKEN_EXPIRY))
                .signWith(getKey())
                .compact();
    }

    public Long getUserId(String token) {
        return Long.parseLong(
                Jwts.parser().verifyWith(getKey()).build()
                        .parseSignedClaims(token).getPayload().getSubject()
        );
    }

    public boolean isValid(String token) {
        try {
            Jwts.parser().verifyWith(getKey()).build().parseSignedClaims(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}