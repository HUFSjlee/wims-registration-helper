package com.example.wimsregistrationhelperserver.transfer.repository;

import com.example.wimsregistrationhelperserver.transfer.domain.TransferInfo;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TransferInfoRepository extends JpaRepository<TransferInfo, Long> {
  boolean existsByTransferKey(String transferKey);

  // 공개 링크 키로 양도 요청 1건을 조회할 때 사용합니다.
  Optional<TransferInfo> findByTransferKey(String transferKey);
}
