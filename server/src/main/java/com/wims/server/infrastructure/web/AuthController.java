package com.wims.server.infrastructure.web;

import com.wims.server.application.dto.AuthDtos;
import com.wims.server.application.usecase.AuthUseCase;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthUseCase authUseCase;
    private final AuthHeaderTokenResolver tokenResolver;

    public AuthController(AuthUseCase authUseCase, AuthHeaderTokenResolver tokenResolver) {
        this.authUseCase = authUseCase;
        this.tokenResolver = tokenResolver;
    }

    @PostMapping("/signup")
    public AuthDtos.AuthResponse signup(@Valid @RequestBody AuthDtos.SignupRequest request) {
        return authUseCase.signup(request);
    }

    @PostMapping("/login")
    public AuthDtos.AuthResponse login(@Valid @RequestBody AuthDtos.LoginRequest request) {
        return authUseCase.login(request);
    }

    @GetMapping("/me")
    public AuthDtos.MeResponse me(@RequestHeader(value = "Authorization", required = false) String authorization) {
        return authUseCase.me(tokenResolver.resolve(authorization));
    }
}
