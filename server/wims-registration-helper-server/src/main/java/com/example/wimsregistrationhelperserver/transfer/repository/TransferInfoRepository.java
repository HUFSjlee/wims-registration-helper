package com.example.wimsregistrationhelperserver.transfer.repository;

import com.example.wimsregistrationhelperserver.transfer.domain.TransferInfo;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TransferInfoRepository extends JpaRepository<TransferInfo, Long> {
  boolean existsByTransferKey(String transferKey);
}
