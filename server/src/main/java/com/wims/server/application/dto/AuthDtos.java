package com.wims.server.application.dto;

import com.wims.server.domain.model.UserType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public final class AuthDtos {
    private AuthDtos() {
    }

    public record SignupRequest(
            @NotBlank String name,
            @NotBlank @Size(min = 4, max = 30) String loginId,
            @NotBlank @Size(min = 8, max = 100) String password,
            @NotBlank @Pattern(regexp = "^[0-9\\-]{9,20}$") String phone,
            @NotBlank String address,
            UserType type,
            String businessRegistrationNumber
    ) {
    }

    public record LoginRequest(
            @NotBlank String loginId,
            @NotBlank String password
    ) {
    }

    public record AuthResponse(
            String token,
            String loginId,
            String name,
            UserType type
    ) {
    }

    public record MeResponse(
            Long id,
            String loginId,
            String name,
            String phone,
            String address,
            UserType type,
            String businessRegistrationNumber
    ) {
    }
}
