package com.example.wimsregistrationhelperserver.common.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Date;

@Component
public class JwtTokenProvider {

  @Value("${jwt.secret}")
  private String secret;

  @Value("${jwt.access-token-expiration-seconds}")
  private long accessTokenExpirationSeconds;

  private SecretKey key;

  @PostConstruct
  void init() {
    this.key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
  }

  public String generateAccessToken(Long userId) {
    Instant now = Instant.now();
    Instant expiry = now.plusSeconds(accessTokenExpirationSeconds);

    return Jwts.builder()
      .subject(String.valueOf(userId))
      .issuedAt(Date.from(now))
      .expiration(Date.from(expiry))
      .signWith(key)
      .compact();
  }

  public Long validateAndGetUserId(String token) {
    Claims claims = Jwts.parser()
      .verifyWith(key)
      .build()
      .parseSignedClaims(token)
      .getPayload();

    return Long.parseLong(claims.getSubject());
  }

  public long getAccessTokenExpirationSeconds() {
    return accessTokenExpirationSeconds;
  }
}
