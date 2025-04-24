package com.github.oezeb.server.service;

import com.github.oezeb.server.dto.TokenResponse;
import com.github.oezeb.server.dto.UserResponse;
import io.jsonwebtoken.SignatureAlgorithm;
import lombok.AllArgsConstructor;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.stereotype.Service;
import io.jsonwebtoken.Jwts;

import java.security.interfaces.RSAPrivateKey;
import java.time.Instant;
import java.util.Date;

@Service
@AllArgsConstructor
public class JwtService {
    JwtDecoder jwtDecoder;
    final RSAPrivateKey privateKey;
    final String keyId;

    public TokenResponse generateToken(UserResponse userResponse) {
        return generateToken(userResponse, 3600); // 1 hour expiration
    }

    public TokenResponse generateToken(UserResponse userResponse, long expiration) {
        Instant now = Instant.now();

        String token = Jwts.builder()
                .setSubject(String.valueOf(userResponse.id))
                .claim("name", userResponse.name)
                .claim("email", userResponse.email)
                .claim("emailVerified", userResponse.emailVerified)
                .claim("enabled", userResponse.enabled)
                .setIssuedAt(Date.from(now))
                .setExpiration(Date.from(now.plusSeconds(expiration)))
                .setHeaderParam("kid", keyId)
                .signWith(privateKey, SignatureAlgorithm.RS256)
                .compact();

        return TokenResponse.builder()
                .token(token)
                .type("Bearer")
                .expiration(expiration)
                .build();
    }

    public UserResponse verifyToken(Jwt jwt) {
        return UserResponse.builder()
                .id(Long.parseLong(jwt.getSubject()))
                .name(jwt.getClaim("name"))
                .email(jwt.getClaim("email"))
                .emailVerified(jwt.getClaim("emailVerified"))
                .enabled(jwt.getClaim("enabled"))
                .build();
    }

    public UserResponse verifyToken(String token) {
        return verifyToken(jwtDecoder.decode(token));
    }
}
