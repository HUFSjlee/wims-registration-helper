package com.example.wimsregistrationhelperserver.transfer.dto;

import lombok.Builder;
import lombok.Getter;

import java.time.OffsetDateTime;

/**
 * 양도 완료 처리 결과를 내려주는 응답 DTO입니다.
 */
@Getter
@Builder
public class CompleteTransferResponse {
  private Long transferId;
  private String transferKey;
  private boolean completed;
  private Long completedBy;
  private OffsetDateTime completedAt;
}
