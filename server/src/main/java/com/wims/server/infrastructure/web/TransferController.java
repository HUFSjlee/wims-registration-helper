package com.wims.server.infrastructure.web;

import com.wims.server.application.dto.TransferDtos;
import com.wims.server.application.usecase.TransferUseCase;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/transfers")
public class TransferController {
    private final TransferUseCase transferUseCase;
    private final AuthHeaderTokenResolver tokenResolver;

    public TransferController(TransferUseCase transferUseCase, AuthHeaderTokenResolver tokenResolver) {
        this.transferUseCase = transferUseCase;
        this.tokenResolver = tokenResolver;
    }

    @PostMapping
    public TransferDtos.CreateTransferResponse create(
            @RequestHeader(value = "Authorization", required = false) String authorization,
            @Valid @RequestBody TransferDtos.CreateTransferRequest request
    ) {
        return transferUseCase.create(tokenResolver.resolve(authorization), request);
    }

    @GetMapping("/link/{token}")
    public TransferDtos.LinkViewResponse viewByLink(
            @RequestHeader(value = "Authorization", required = false) String authorization,
            @PathVariable("token") String token
    ) {
        return transferUseCase.viewByLink(tokenResolver.resolve(authorization), token);
    }

    @PostMapping("/link/{token}/complete")
    public TransferDtos.TransferStatusResponse completeByLink(
            @RequestHeader(value = "Authorization", required = false) String authorization,
            @PathVariable("token") String token,
            @Valid @RequestBody TransferDtos.CompleteTransferRequest request
    ) {
        return transferUseCase.completeByLink(tokenResolver.resolve(authorization), token, request);
    }
}
