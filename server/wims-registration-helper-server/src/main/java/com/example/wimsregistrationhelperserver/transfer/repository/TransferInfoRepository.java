package com.example.wimsregistrationhelperserver.transfer.repository;

import com.example.wimsregistrationhelperserver.transfer.domain.TransferInfo;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TransferInfoRepository extends JpaRepository<TransferInfo, Long> {
  boolean existsByTransferKey(String transferKey);

  Optional<TransferInfo> findByTransferKey(String transferKey);

  List<TransferInfo> findByTransferorIdOrTransfereeIdOrderByRegistDateDesc(Long transferorId, Long transfereeId);
}
