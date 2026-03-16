package com.example.wimsregistrationhelperserver.transfer.controller;

import com.example.wimsregistrationhelperserver.transfer.dto.CreateTransferRequest;
import com.example.wimsregistrationhelperserver.transfer.dto.CreateTransferResponse;
import com.example.wimsregistrationhelperserver.transfer.dto.CompleteTransferResponse;
import com.example.wimsregistrationhelperserver.transfer.dto.GetTransferDetailResponse;
import com.example.wimsregistrationhelperserver.transfer.service.TransferService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

/**
 * 양도 관련 HTTP 요청을 받는 컨트롤러입니다.
 */
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/transfers")
public class TransferController {
  private final TransferService transferService;

  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  public CreateTransferResponse createTransfer(
    Authentication authentication,
    @Valid @RequestBody CreateTransferRequest request
  ) {
    Long loginUserId = (Long) authentication.getPrincipal();
    return transferService.createTransfer(loginUserId, request);
  }

  /**
   * 양수자가 링크로 진입한 뒤 양도 상세를 확인하는 API입니다.
   */
  @GetMapping("/{transferKey}")
  public GetTransferDetailResponse getTransferByKey(
    Authentication authentication,
    @PathVariable String transferKey
  ) {
    Long loginUserId = (Long) authentication.getPrincipal();
    return transferService.getTransferByKey(loginUserId, transferKey);
  }

  /**
   * 양수자가 양도 요청을 최종 수락하는 API입니다.
   */
  @PostMapping("/{transferKey}/complete")
  public CompleteTransferResponse completeTransfer(
    Authentication authentication,
    @PathVariable String transferKey
  ) {
    Long loginUserId = (Long) authentication.getPrincipal();
    return transferService.completeTransfer(loginUserId, transferKey);
  }
}
