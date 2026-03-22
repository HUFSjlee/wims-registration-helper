package com.example.wimsregistrationhelperserver.species.dto;

import lombok.Getter;

/**
 * 사용자별 보유 개체(순수량 = 등록 합 − 폐사 합) 조회 결과입니다.
 */
@Getter
public class SpeciesHoldingResponse {

  private final Long speciesId;
  private final String scientificName;
  private final String commonName;
  private final long quantity;

  /** JPQL {@code new ...} 및 서비스에서 사용 */
  public SpeciesHoldingResponse(
    Long speciesId,
    String scientificName,
    String commonName,
    Long quantity
  ) {
    this.speciesId = speciesId;
    this.scientificName = scientificName != null ? scientificName : "";
    this.commonName = commonName != null ? commonName : "";
    this.quantity = quantity != null ? quantity : 0L;
  }
}
