package com.wims.server.domain.port;

import com.wims.server.domain.model.TransferLink;

import java.util.Optional;

public interface TransferLinkRepositoryPort {
    TransferLink save(TransferLink link);

    Optional<TransferLink> findByToken(String token);
}
