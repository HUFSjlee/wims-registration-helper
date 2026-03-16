package com.example.wimsregistrationhelperserver.transfer.dto;

import lombok.Builder;
import lombok.Getter;

/**
 * 양수자가 링크로 진입했을 때 확인하는 양도 상세 응답 DTO입니다.
 */
@Getter
@Builder
public class GetTransferDetailResponse {
  private Long transferId;
  private String transferKey;

  private Long transferorId;
  private String transferorName;
  private String transferorPhone;
  private String maskedTransferorAddress;

  private Long transfereeId;
  private String transfereeName;
  private String transfereePhone;

  private Long speciesId;
  private Long speciesQuantity;
  private String scientificName;
  private String commonName;
}
