package com.wims.server.infrastructure.persistence.repository;

import com.wims.server.infrastructure.persistence.entity.TransferRequestEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface JpaTransferRequestRepository extends JpaRepository<TransferRequestEntity, Long> {
}
