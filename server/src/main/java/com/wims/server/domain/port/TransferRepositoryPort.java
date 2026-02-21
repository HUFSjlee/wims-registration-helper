package com.wims.server.domain.port;

import com.wims.server.domain.model.TransferRequest;

import java.util.Optional;

public interface TransferRepositoryPort {
    TransferRequest save(TransferRequest transferRequest);

    Optional<TransferRequest> findById(Long id);
}
