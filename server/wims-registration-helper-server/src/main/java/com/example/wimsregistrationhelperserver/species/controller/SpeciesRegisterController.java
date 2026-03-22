package com.example.wimsregistrationhelperserver.species.controller;

import com.example.wimsregistrationhelperserver.species.dto.RegisterSpeciesRequest;
import com.example.wimsregistrationhelperserver.species.dto.RegisterSpeciesResponse;
import com.example.wimsregistrationhelperserver.species.service.SpeciesRegisterService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

/**
 * 개체 등록(보관) API입니다. 로그인 사용자 ID는 JWT에서 가져옵니다.
 */
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/species")
public class SpeciesRegisterController {

  private final SpeciesRegisterService speciesRegisterService;

  @PostMapping("/register")
  @ResponseStatus(HttpStatus.CREATED)
  public RegisterSpeciesResponse register(
    Authentication authentication,
    @Valid @RequestBody RegisterSpeciesRequest request
  ) {
    Long loginUserId = (Long) authentication.getPrincipal();
    return speciesRegisterService.register(loginUserId, request);
  }
}
