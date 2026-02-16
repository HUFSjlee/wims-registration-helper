package com.wims.server.domain.model;

import java.time.LocalDateTime;

public record TransferRequest(
        Long id,
        Long transferorUserId,
        String receiverPhone,
        Long speciesId,
        Integer quantity,
        String purpose,
        String reason,
        TransferStatus status,
        String receiverName,
        String receiverAddress,
        String receiverInputPhone,
        LocalDateTime createdAt
) {
}
