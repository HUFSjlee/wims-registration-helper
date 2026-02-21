package com.wims.server.domain.model;

import java.time.LocalDateTime;

public record TransferLink(
        Long id,
        Long transferRequestId,
        String token,
        LocalDateTime expiresAt,
        LocalDateTime usedAt
) {
}
