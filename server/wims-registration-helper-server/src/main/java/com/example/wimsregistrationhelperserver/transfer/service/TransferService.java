package com.example.wimsregistrationhelperserver.transfer.service;

import com.example.wimsregistrationhelperserver.auth.domain.User;
import com.example.wimsregistrationhelperserver.auth.repository.UserRepository;
import com.example.wimsregistrationhelperserver.common.exception.BadRequestException;
import com.example.wimsregistrationhelperserver.common.exception.NotFoundException;
import com.example.wimsregistrationhelperserver.common.exception.UnauthorizedException;
import com.example.wimsregistrationhelperserver.transfer.domain.TransferInfo;
import com.example.wimsregistrationhelperserver.transfer.dto.CreateTransferRequest;
import com.example.wimsregistrationhelperserver.transfer.dto.CreateTransferResponse;
import com.example.wimsregistrationhelperserver.transfer.dto.CompleteTransferResponse;
import com.example.wimsregistrationhelperserver.transfer.dto.GetTransferDetailResponse;
import com.example.wimsregistrationhelperserver.transfer.repository.TransferInfoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

/**
 * 양도 요청 생성과 조회를 담당하는 서비스입니다.
 */
@Service
@RequiredArgsConstructor
public class TransferService {
  private final TransferInfoRepository transferInfoRepository;
  private final UserRepository userRepository;

  @Transactional
  public CreateTransferResponse createTransfer(Long loginUserId, CreateTransferRequest request) {
    // 로그인한 사용자가 실제 존재하는지 먼저 확인합니다.
    User transferor = userRepository.findById(loginUserId)
      .orElseThrow(() -> new NotFoundException("양도자를 찾을 수 없습니다."));

    // 현재 스키마에서는 transferee_id가 null일 수 없으므로
    // 양수자 전화번호로 가입된 사용자를 바로 찾아야 합니다.
    User transferee = userRepository.findByPhone(request.getTransfereePhone())
      .orElseThrow(() -> new NotFoundException("양수자 전화번호에 해당하는 회원이 없습니다."));

    // 본인에게 양도 요청을 보내는 경우는 비즈니스상 허용하지 않습니다.
    if (transferor.getId().equals(transferee.getId())) {
      throw new BadRequestException("본인에게 양도 요청을 보낼 수 없습니다.");
    }

    // species 도메인이 아직 완성되지 않았으므로 현재 단계에서는
    // 개체 ID, 학명, 일반명, 수량을 요청값으로 그대로 받습니다.
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

  @Transactional(readOnly = true)
  public GetTransferDetailResponse getTransferByKey(Long loginUserId, String transferKey) {
    TransferInfo transferInfo = transferInfoRepository.findByTransferKey(transferKey)
      .orElseThrow(() -> new NotFoundException("양도 요청을 찾을 수 없습니다."));

    User transferor = userRepository.findById(transferInfo.getTransferorId())
      .orElseThrow(() -> new NotFoundException("양도자 정보를 찾을 수 없습니다."));

    User transferee = userRepository.findById(transferInfo.getTransfereeId())
      .orElseThrow(() -> new NotFoundException("양수자 정보를 찾을 수 없습니다."));

    // 링크를 알아도 실제 양수자 본인이 아니면 상세 조회를 막습니다.
    if (!transferee.getId().equals(loginUserId)) {
      throw new UnauthorizedException("해당 양도 요청을 조회할 권한이 없습니다.");
    }

    return GetTransferDetailResponse.builder()
      .transferId(transferInfo.getId())
      .transferKey(transferInfo.getTransferKey())
      .transferorId(transferor.getId())
      .transferorName(transferor.getName())
      .transferorPhone(transferor.getPhone())
      .maskedTransferorAddress(maskAddress(transferor))
      .transfereeId(transferee.getId())
      .transfereeName(transferee.getName())
      .transfereePhone(transferee.getPhone())
      .speciesId(transferInfo.getSpeciesId())
      .speciesQuantity(transferInfo.getSpeciesQuantity())
      .scientificName(transferInfo.getScientificName())
      .commonName(transferInfo.getCommonName())
      .build();
  }

  /**
   * 양수자가 양도 요청을 최종 수락하는 메서드입니다.
   *
   * 현재 단계에서는 species 수량 반영과 로그 적재는 제외하고,
   * 완료 여부만 검증한 뒤 완료 시점 정보를 업데이트합니다.
   */
  @Transactional
  public CompleteTransferResponse completeTransfer(Long loginUserId, String transferKey) {
    TransferInfo transferInfo = transferInfoRepository.findByTransferKey(transferKey)
      .orElseThrow(() -> new NotFoundException("양도 요청을 찾을 수 없습니다."));

    User transferee = userRepository.findById(transferInfo.getTransfereeId())
      .orElseThrow(() -> new NotFoundException("양수자 정보를 찾을 수 없습니다."));

    if (!transferee.getId().equals(loginUserId)) {
      throw new UnauthorizedException("해당 양도 요청을 완료할 권한이 없습니다.");
    }

    if (transferInfo.isCompleted()) {
      throw new BadRequestException("이미 완료된 양도 요청입니다.");
    }

    transferInfo.completeBy(loginUserId);

    return CompleteTransferResponse.builder()
      .transferId(transferInfo.getId())
      .transferKey(transferInfo.getTransferKey())
      .completed(true)
      .completedBy(loginUserId)
      .completedAt(transferInfo.getModifyDate())
      .build();
  }

  /**
   * 외부 공유용 키를 생성합니다.
   */
  private String generateUniqueTransferKey() {
    String transferKey = UUID.randomUUID().toString().replace("-", "");

    while (transferInfoRepository.existsByTransferKey(transferKey)) {
      transferKey = UUID.randomUUID().toString().replace("-", "");
    }

    return transferKey;
  }

  /**
   * PRD 요구사항에 맞춰 양도자 주소는 일부만 노출합니다.
   */
  private String maskAddress(User user) {
    String address = user.getAddress1();

    if (address == null || address.isBlank()) {
      return "";
    }

    if (address.length() <= 6) {
      return address.substring(0, 1) + "***";
    }

    return address.substring(0, 6) + "***";
  }
}
