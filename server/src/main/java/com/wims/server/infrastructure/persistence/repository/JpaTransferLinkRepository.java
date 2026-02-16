package com.wims.server.infrastructure.persistence.repository;

import com.wims.server.infrastructure.persistence.entity.TransferLinkEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface JpaTransferLinkRepository extends JpaRepository<TransferLinkEntity, Long> {
    Optional<TransferLinkEntity> findByToken(String token);
}
