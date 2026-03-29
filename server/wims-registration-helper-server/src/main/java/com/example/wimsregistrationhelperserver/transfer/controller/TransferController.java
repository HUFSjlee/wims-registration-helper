package com.example.wimsregistrationhelperserver.transfer.controller;

import com.example.wimsregistrationhelperserver.transfer.dto.CompleteTransferResponse;
import com.example.wimsregistrationhelperserver.transfer.dto.CreateTransferRequest;
import com.example.wimsregistrationhelperserver.transfer.dto.CreateTransferResponse;
import com.example.wimsregistrationhelperserver.transfer.dto.GetTransferDetailResponse;
import com.example.wimsregistrationhelperserver.transfer.dto.TransferSummaryResponse;
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

import java.util.List;

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

  @GetMapping("/{transferKey}")
  public GetTransferDetailResponse getTransferByKey(
    Authentication authentication,
    @PathVariable String transferKey
  ) {
    Long loginUserId = (Long) authentication.getPrincipal();
    return transferService.getTransferByKey(loginUserId, transferKey);
  }

  @PostMapping("/{transferKey}/complete")
  public CompleteTransferResponse completeTransfer(
    Authentication authentication,
    @PathVariable String transferKey
  ) {
    Long loginUserId = (Long) authentication.getPrincipal();
    return transferService.completeTransfer(loginUserId, transferKey);
  }

  @GetMapping
  public List<TransferSummaryResponse> getMyTransfers(Authentication authentication) {
    Long loginUserId = (Long) authentication.getPrincipal();
    return transferService.getMyTransfers(loginUserId);
  }
}
