package com.wims.server.application.usecase;

import com.wims.server.application.dto.AuthDtos;

public interface AuthUseCase {
    AuthDtos.AuthResponse signup(AuthDtos.SignupRequest request);

    AuthDtos.AuthResponse login(AuthDtos.LoginRequest request);

    AuthDtos.MeResponse me(String token);
}
