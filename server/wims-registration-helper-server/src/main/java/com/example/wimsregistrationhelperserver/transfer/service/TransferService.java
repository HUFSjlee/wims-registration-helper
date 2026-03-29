package com.example.wimsregistrationhelperserver.transfer.service;

import com.example.wimsregistrationhelperserver.auth.domain.User;
import com.example.wimsregistrationhelperserver.auth.repository.UserRepository;
import com.example.wimsregistrationhelperserver.common.exception.BadRequestException;
import com.example.wimsregistrationhelperserver.common.exception.NotFoundException;
import com.example.wimsregistrationhelperserver.common.exception.UnauthorizedException;
import com.example.wimsregistrationhelperserver.transfer.domain.TransferInfo;
import com.example.wimsregistrationhelperserver.transfer.dto.CompleteTransferResponse;
import com.example.wimsregistrationhelperserver.transfer.dto.CreateTransferRequest;
import com.example.wimsregistrationhelperserver.transfer.dto.CreateTransferResponse;
import com.example.wimsregistrationhelperserver.transfer.dto.GetTransferDetailResponse;
import com.example.wimsregistrationhelperserver.transfer.dto.TransferSummaryResponse;
import com.example.wimsregistrationhelperserver.transfer.repository.TransferInfoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TransferService {
  private final TransferInfoRepository transferInfoRepository;
  private final UserRepository userRepository;

  @Transactional
  public CreateTransferResponse createTransfer(Long loginUserId, CreateTransferRequest request) {
    User transferor = userRepository.findById(loginUserId)
      .orElseThrow(() -> new NotFoundException("양도자를 찾을 수 없습니다."));

    User transferee = userRepository.findByPhone(request.transfereePhone())
      .orElseThrow(() -> new NotFoundException("양수자 전화번호에 해당하는 회원이 없습니다."));

    if (transferor.getId().equals(transferee.getId())) {
      throw new BadRequestException("본인에게 양도 요청을 보낼 수 없습니다.");
    }

    String transferKey = generateUniqueTransferKey();

    TransferInfo transferInfo = TransferInfo.create(
      transferKey,
      transferor.getId(),
      transferee.getId(),
      request.speciesId(),
      request.speciesQuantity(),
      request.scientificName(),
      request.commonName()
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

  @Transactional(readOnly = true)
  public List<TransferSummaryResponse> getMyTransfers(Long loginUserId) {
    userRepository.findById(loginUserId)
      .orElseThrow(() -> new NotFoundException("사용자 정보를 찾을 수 없습니다."));

    return transferInfoRepository.findByTransferorIdOrTransfereeIdOrderByRegistDateDesc(loginUserId, loginUserId)
      .stream()
      .map(transferInfo -> TransferSummaryResponse.builder()
        .transferId(transferInfo.getId())
        .transferKey(transferInfo.getTransferKey())
        .transferorId(transferInfo.getTransferorId())
        .transfereeId(transferInfo.getTransfereeId())
        .speciesId(transferInfo.getSpeciesId())
        .speciesQuantity(transferInfo.getSpeciesQuantity())
        .scientificName(transferInfo.getScientificName())
        .commonName(transferInfo.getCommonName())
        .completed(transferInfo.isCompleted())
        .createdAt(transferInfo.getRegistDate())
        .updatedAt(transferInfo.getModifyDate())
        .build())
      .toList();
  }

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

  private String generateUniqueTransferKey() {
    String transferKey = UUID.randomUUID().toString().replace("-", "");

    while (transferInfoRepository.existsByTransferKey(transferKey)) {
      transferKey = UUID.randomUUID().toString().replace("-", "");
    }

    return transferKey;
  }

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
