package com.example.wimsregistrationhelperserver.transfer.controller;


import com.example.wimsregistrationhelperserver.transfer.dto.CreateTransferRequest;
import com.example.wimsregistrationhelperserver.transfer.dto.CreateTransferResponse;
import com.example.wimsregistrationhelperserver.transfer.service.TransferService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

/**
 * 양도 관련 HTTP 요청을 받는 컨트롤러
 *
 * 현재는 '양도 접수 생성' API만 구현
 * */

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/transfers")
public class TransferController {
  private final TransferService transferService;

  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  public CreateTransferResponse createTransfer(Authentication authentication, @Valid @RequestBody CreateTransferRequest request) {
    //JWT 필터에서 Authentication pricipal에 userId(Long)를 넣어주고 있으므로
    //그대로 꺼내서 서비스에 전달
    Long loginUserId = (Long) authentication.getPrincipal();
    return  transferService.createTransfer(loginUserId, request);
  }

}
