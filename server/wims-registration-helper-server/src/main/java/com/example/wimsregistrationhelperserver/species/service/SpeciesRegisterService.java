package com.example.wimsregistrationhelperserver.species.service;

import com.example.wimsregistrationhelperserver.common.exception.BadRequestException;
import com.example.wimsregistrationhelperserver.species.domain.SpeciesInfo;
import com.example.wimsregistrationhelperserver.species.domain.SpeciesStatusInfo;
import com.example.wimsregistrationhelperserver.species.dto.RegisterSpeciesRequest;
import com.example.wimsregistrationhelperserver.species.dto.RegisterSpeciesResponse;
import com.example.wimsregistrationhelperserver.species.repository.SpeciesInfoRepository;
import com.example.wimsregistrationhelperserver.species.repository.SpeciesStatusInfoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

/**
 * 개체 등록(보관) 시 {@code species_info} 조회/생성 후 {@code species_status_info}에 삽입합니다.
 */
@Service
@RequiredArgsConstructor
public class SpeciesRegisterService {

  private final SpeciesInfoRepository speciesInfoRepository;
  private final SpeciesStatusInfoRepository speciesStatusInfoRepository;

  @Transactional
  public RegisterSpeciesResponse register(Long loginUserId, RegisterSpeciesRequest request) {
    String sci = request.getScientificName() != null ? request.getScientificName().trim() : "";
    String com = request.getCommonName() != null ? request.getCommonName().trim() : "";

    if (!StringUtils.hasText(sci) && !StringUtils.hasText(com)) {
      throw new BadRequestException("학명 또는 일반명 중 하나는 입력해야 합니다.");
    }

    long quantity;
    try {
      quantity = Long.parseLong(request.getQuantity().trim());
    } catch (NumberFormatException e) {
      throw new BadRequestException("수량은 숫자로 입력해 주세요.");
    }
    if (quantity < 1) {
      throw new BadRequestException("수량은 1 이상이어야 합니다.");
    }

    SpeciesInfo species = resolveSpecies(sci, com);

    SpeciesStatusInfo log = SpeciesStatusInfo.create(
      loginUserId,
      species.getId(),
      sci,
      com,
      quantity,
      SpeciesStatusInfo.LOG_TYPE_REGISTER
    );

    SpeciesStatusInfo saved = speciesStatusInfoRepository.save(log);
    return new RegisterSpeciesResponse(saved.getLogId());
  }

  /**
   * 학명으로 먼저 조회하고, 없으면 일반명으로 조회합니다. 둘 다 없으면 신규 {@link SpeciesInfo}를 저장합니다.
   */
  private SpeciesInfo resolveSpecies(String scientificName, String commonName) {
    if (StringUtils.hasText(scientificName)) {
      var bySci = speciesInfoRepository.findFirstByScientificNameIgnoreCase(scientificName);
      if (bySci.isPresent()) {
        return bySci.get();
      }
    }
    if (StringUtils.hasText(commonName)) {
      var byCom = speciesInfoRepository.findFirstByCommonNameIgnoreCase(commonName);
      if (byCom.isPresent()) {
        return byCom.get();
      }
    }
    return speciesInfoRepository.save(SpeciesInfo.create(scientificName, commonName));
  }
}
