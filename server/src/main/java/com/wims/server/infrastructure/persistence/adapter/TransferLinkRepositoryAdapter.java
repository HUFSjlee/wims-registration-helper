package com.wims.server.infrastructure.persistence.adapter;

import com.wims.server.domain.model.TransferLink;
import com.wims.server.domain.port.TransferLinkRepositoryPort;
import com.wims.server.infrastructure.persistence.entity.TransferLinkEntity;
import com.wims.server.infrastructure.persistence.repository.JpaTransferLinkRepository;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class TransferLinkRepositoryAdapter implements TransferLinkRepositoryPort {
    private final JpaTransferLinkRepository repository;

    public TransferLinkRepositoryAdapter(JpaTransferLinkRepository repository) {
        this.repository = repository;
    }

    @Override
    public TransferLink save(TransferLink link) {
        TransferLinkEntity e = new TransferLinkEntity();
        e.setId(link.id());
        e.setTransferRequestId(link.transferRequestId());
        e.setToken(link.token());
        e.setExpiresAt(link.expiresAt());
        e.setUsedAt(link.usedAt());
        return toDomain(repository.save(e));
    }

    @Override
    public Optional<TransferLink> findByToken(String token) {
        return repository.findByToken(token).map(this::toDomain);
    }

    private TransferLink toDomain(TransferLinkEntity e) {
        return new TransferLink(e.getId(), e.getTransferRequestId(), e.getToken(), e.getExpiresAt(), e.getUsedAt());
    }
}
