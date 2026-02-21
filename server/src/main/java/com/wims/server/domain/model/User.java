package com.wims.server.domain.model;

import java.time.LocalDateTime;

public record User(
        Long id,
        String loginId,
        String passwordHash,
        String name,
        String phone,
        String address,
        UserType type,
        String businessRegistrationNumber,
        LocalDateTime createdAt
) {
}
