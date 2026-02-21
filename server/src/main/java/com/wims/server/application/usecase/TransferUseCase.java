package com.wims.server.application.usecase;

import com.wims.server.application.dto.TransferDtos;

public interface TransferUseCase {
    TransferDtos.CreateTransferResponse create(String token, TransferDtos.CreateTransferRequest request);

    TransferDtos.LinkViewResponse viewByLink(String token, String linkToken);

    TransferDtos.TransferStatusResponse completeByLink(String token, String linkToken, TransferDtos.CompleteTransferRequest request);
}
