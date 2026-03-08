package com.example.wimsregistrationhelperserver.common.config;

import com.example.wimsregistrationhelperserver.common.security.JwtAuthenticationFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig {

  @Bean
  SecurityFilterChain securityFilterChain(
    HttpSecurity http,
    JwtAuthenticationFilter jwtAuthenticationFilter
  ) throws Exception {
    http
      .csrf(csrf -> csrf.disable())
      .formLogin(form -> form.disable())
      .httpBasic(Customizer.withDefaults())
      .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
      .authorizeHttpRequests(auth -> auth
        .requestMatchers("/api/auth/signup", "/api/auth/login").permitAll()
        .requestMatchers("/h2-console/**").permitAll()
        .anyRequest().authenticated()
      )
      .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

    http.headers(headers -> headers.frameOptions(frame -> frame.sameOrigin()));

    return http.build();
  }
}
