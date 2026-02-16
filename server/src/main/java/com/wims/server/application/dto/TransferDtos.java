package com.wims.server.application.dto;

import com.wims.server.domain.model.TransferStatus;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

import java.time.LocalDateTime;

public final class TransferDtos {
    private TransferDtos() {
    }

    public record CreateTransferRequest(
            @NotNull Long speciesId,
            @NotNull @Min(1) Integer quantity,
            @NotBlank String purpose,
            @NotBlank String reason,
            @NotBlank @Pattern(regexp = "^[0-9\\-]{9,20}$") String receiverPhone
    ) {
    }

    public record CreateTransferResponse(
            Long transferId,
            String token,
            LocalDateTime expiresAt
    ) {
    }

    public record LinkViewResponse(
            String token,
            TransferStatus status,
            LocalDateTime expiresAt,
            boolean expired,
            String category,
            String scientificName,
            String koreanName,
            Integer quantity
    ) {
    }

    public record CompleteTransferRequest(
            @NotBlank String receiverName,
            @NotBlank String receiverPhone,
            @NotBlank String receiverAddress
    ) {
    }

    public record TransferStatusResponse(
            Long transferId,
            TransferStatus status,
            LocalDateTime completedAt
    ) {
    }
}
