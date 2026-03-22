package com.example.wimsregistrationhelperserver.species.service;

import com.example.wimsregistrationhelperserver.common.exception.BadRequestException;
import com.example.wimsregistrationhelperserver.common.exception.NotFoundException;
import com.example.wimsregistrationhelperserver.species.domain.SpeciesStatusInfo;
import com.example.wimsregistrationhelperserver.species.dto.RecordDeathRequest;
import com.example.wimsregistrationhelperserver.species.dto.RecordDeathResponse;
import com.example.wimsregistrationhelperserver.species.dto.SpeciesHoldingResponse;
import com.example.wimsregistrationhelperserver.species.repository.SpeciesInfoRepository;
import com.example.wimsregistrationhelperserver.species.repository.SpeciesStatusInfoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * 보유 개체 조회(등록 − 폐사) 및 폐사 로그({@code log_type = 2}) 기록.
 */
@Service
@RequiredArgsConstructor
public class SpeciesDeathService {

  private final SpeciesStatusInfoRepository speciesStatusInfoRepository;
  private final SpeciesInfoRepository speciesInfoRepository;

  @Transactional(readOnly = true)
  public List<SpeciesHoldingResponse> listHoldings(Long userId) {
    return speciesStatusInfoRepository.findHoldingsByUserId(userId);
  }

  @Transactional
  public RecordDeathResponse recordDeath(Long loginUserId, RecordDeathRequest request) {
    var species = speciesInfoRepository
      .findById(request.getSpeciesId())
      .orElseThrow(() -> new NotFoundException("해당 종 정보를 찾을 수 없습니다."));

    long deathQty;
    try {
      deathQty = Long.parseLong(request.getQuantity().trim());
    } catch (NumberFormatException e) {
      throw new BadRequestException("폐사 수량은 숫자로 입력해 주세요.");
    }
    if (deathQty < 1) {
      throw new BadRequestException("폐사 수량은 1 이상이어야 합니다.");
    }

    Long net = speciesStatusInfoRepository.computeNetQuantityByUserIdAndSpeciesId(
      loginUserId,
      request.getSpeciesId()
    );
    long available = net != null ? net : 0L;
    if (deathQty > available) {
      throw new BadRequestException("폐사 수량은 현재 보유 수량(" + available + ")을 초과할 수 없습니다.");
    }

    SpeciesStatusInfo log = SpeciesStatusInfo.create(
      loginUserId,
      species.getId(),
      species.getScientificName(),
      species.getCommonName(),
      deathQty,
      SpeciesStatusInfo.LOG_TYPE_DEATH
    );

    SpeciesStatusInfo saved = speciesStatusInfoRepository.save(log);
    return new RecordDeathResponse(saved.getLogId());
  }
}
