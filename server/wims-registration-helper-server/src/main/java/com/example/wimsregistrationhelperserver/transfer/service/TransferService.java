package com.example.wimsregistrationhelperserver.transfer.service;

import com.example.wimsregistrationhelperserver.auth.domain.User;
import com.example.wimsregistrationhelperserver.auth.repository.UserRepository;
import com.example.wimsregistrationhelperserver.common.exception.BadRequestException;
import com.example.wimsregistrationhelperserver.common.exception.NotFoundException;
import com.example.wimsregistrationhelperserver.transfer.domain.TransferInfo;
import com.example.wimsregistrationhelperserver.transfer.dto.CreateTransferRequest;
import com.example.wimsregistrationhelperserver.transfer.dto.CreateTransferResponse;
import com.example.wimsregistrationhelperserver.transfer.repository.TransferInfoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.Optional;
import java.util.UUID;

/**
 * 양도 접수 비즈니스 로직.
 * 현재 단계에서는 "양도 접수 생성"까지만 구현
 * 즉, transfer_info 테이블에 한 건 저장하고 transferKey를 발급하는 역할
 * */

@Service
@RequiredArgsConstructor
public class TransferService {
  private final TransferInfoRepository transferInfoRepository;
  private final UserRepository userRepository;

  public CreateTransferResponse createTransfer(Long loginUserId, CreateTransferRequest request) {
    //로그인한 사용자가 실제 존재하는지 확인
    User transferor = userRepository.findById(loginUserId)
      .orElseThrow(() -> new NotFoundException("양도자를 찾을 수 없습니다."));

    //현재 스키마상 transferee_id가 null이면 안 되므로
    //전화번호로 양수자를 반드시 조회할 수 있어야 함
    User transferee = userRepository.findByPhone(request.getTransfereePhone())
      .orElseThrow(() -> new NotFoundException("양수자 전화번호에 해당하는 회원이 없습니다."));

    // 자기 자신에게 양도 요청을 보내는 경우 방지
    if (transferor.getId().equals(transferee.getId())) {
      throw new BadRequestException("본인에게 양도 요청을 보낼 수 없습니다.");
    }

    // species_info 모듈이 아직 없으므로,
    // 현재는 speciesId / 학명 / 일반명 / 수량을 요청값으로 그대로 받습니다.
    // 나중에는 반드시 아래 검증이 추가되어야 합니다.
    // 1) 로그인한 사용자가 실제 해당 species를 보유하고 있는지
    // 2) 요청 수량이 현재 보유 수량 이하인지
    // 3) scientificName / commonName / speciesId가 실제 DB와 일치하는지
    String transferKey = generateUniqueTransferKey();

    TransferInfo transferInfo = TransferInfo.create(
      transferKey,
      transferor.getId(),
      transferee.getId(),
      request.getSpeciesId(),
      request.getSpeciesQuantity(),
      request.getScientificName(),
      request.getCommonName()
    );

    TransferInfo saved = transferInfoRepository.save(transferInfo);
    return CreateTransferResponse.from(saved);
  }

  /**
   * 외부 공유용 키를 생성합니다.
   * 중복 가능성을 더 낮추기 위해 UUID 기반 문자열을 사용합니다.
   */
  private String generateUniqueTransferKey() {
    String transferKey = UUID.randomUUID().toString().replace("-", "");

    while (transferInfoRepository.existsByTransferKey(transferKey)) {
      transferKey = UUID.randomUUID().toString().replace("-", "");
    }

    return transferKey;
  }
}
