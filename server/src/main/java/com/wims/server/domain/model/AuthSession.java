package com.wims.server.domain.model;

import java.time.LocalDateTime;

public record AuthSession(
        Long id,
        Long userId,
        String token,
        LocalDateTime expiresAt
) {
}
