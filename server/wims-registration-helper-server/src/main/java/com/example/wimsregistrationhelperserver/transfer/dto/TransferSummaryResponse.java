package com.example.wimsregistrationhelperserver.transfer.dto;

import lombok.Builder;
import lombok.Getter;

import java.time.OffsetDateTime;

@Getter
@Builder
public class TransferSummaryResponse {
  private Long transferId;
  private String transferKey;
  private Long transferorId;
  private Long transfereeId;
  private Long speciesId;
  private Long speciesQuantity;
  private String scientificName;
  private String commonName;
  private boolean completed;
  private OffsetDateTime createdAt;
  private OffsetDateTime updatedAt;
}
