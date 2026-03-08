package com.example.wimsregistrationhelperserver.auth.controller;

import com.example.wimsregistrationhelperserver.auth.dto.LoginRequest;
import com.example.wimsregistrationhelperserver.auth.dto.LoginResponse;
import com.example.wimsregistrationhelperserver.auth.dto.MeResponse;
import com.example.wimsregistrationhelperserver.auth.dto.SignupRequest;
import com.example.wimsregistrationhelperserver.auth.dto.SignupResponse;
import com.example.wimsregistrationhelperserver.auth.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth")
public class AuthController {

  private final AuthService authService;

  @PostMapping("/signup")
  @ResponseStatus(HttpStatus.CREATED)
  public SignupResponse signup(@Valid @RequestBody SignupRequest request) {
    return authService.signup(request);
  }

  @PostMapping("/login")
  public LoginResponse login(@Valid @RequestBody LoginRequest request) {
    return authService.login(request);
  }

  @GetMapping("/me")
  public MeResponse me(Authentication authentication) {
    Long userId = (Long) authentication.getPrincipal();
    return authService.getMe(userId);
  }
}
