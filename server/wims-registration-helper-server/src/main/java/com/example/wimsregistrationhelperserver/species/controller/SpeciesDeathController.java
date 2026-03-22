package com.example.wimsregistrationhelperserver.species.controller;

import com.example.wimsregistrationhelperserver.species.dto.RecordDeathRequest;
import com.example.wimsregistrationhelperserver.species.dto.RecordDeathResponse;
import com.example.wimsregistrationhelperserver.species.dto.SpeciesHoldingResponse;
import com.example.wimsregistrationhelperserver.species.service.SpeciesDeathService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * 보유 개체 조회 및 폐사(삭제) 처리 API입니다.
 */
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/species")
public class SpeciesDeathController {

  private final SpeciesDeathService speciesDeathService;

  @GetMapping("/holdings")
  public List<SpeciesHoldingResponse> getHoldings(Authentication authentication) {
    Long loginUserId = (Long) authentication.getPrincipal();
    return speciesDeathService.listHoldings(loginUserId);
  }

  @PostMapping("/death")
  @ResponseStatus(HttpStatus.CREATED)
  public RecordDeathResponse recordDeath(
    Authentication authentication,
    @Valid @RequestBody RecordDeathRequest request
  ) {
    Long loginUserId = (Long) authentication.getPrincipal();
    return speciesDeathService.recordDeath(loginUserId, request);
  }
}
