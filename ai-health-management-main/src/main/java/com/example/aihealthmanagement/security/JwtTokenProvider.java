package com.example.aihealthmanagement.security;

import com.example.aihealthmanagement.entity.User;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
public class JwtTokenProvider {

    // 密钥（生产环境中请使用更安全的管理方式）
    private final Key key = Keys.secretKeyFor(SignatureAlgorithm.HS256);
    // 令牌有效期（例如 1 小时）
    private final long validityInMilliseconds = 3600000;

    public String generateToken(User user) {
        // 只把用户的 id 作为 subject
        Claims claims = Jwts.claims().setSubject(user.getId().toString());

        Date now = new Date();
        Date expiry = new Date(now.getTime() + validityInMilliseconds);

        return Jwts.builder()
                .setClaims(claims)
                .setIssuedAt(now)
                .setExpiration(expiry)
                .signWith(key)
                .compact();
    }

    /**
     * 从 token 的 subject 中解析出 userId
     */
    public Long getUserIdFromToken(String token) {
        String subject = Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
        return Long.parseLong(subject);
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            // 解析失败：包括过期、签名错误等
            return false;
        }
    }
}
