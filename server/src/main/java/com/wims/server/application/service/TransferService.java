package com.wims.server.application.service;

import com.wims.server.application.dto.TransferDtos;
import com.wims.server.application.exception.AppException;
import com.wims.server.application.port.TokenGenerator;
import com.wims.server.application.usecase.TransferUseCase;
import com.wims.server.domain.model.SpeciesCatalog;
import com.wims.server.domain.model.TransferLink;
import com.wims.server.domain.model.TransferRequest;
import com.wims.server.domain.model.TransferStatus;
import com.wims.server.domain.model.User;
import com.wims.server.domain.port.SpeciesRepositoryPort;
import com.wims.server.domain.port.TransferLinkRepositoryPort;
import com.wims.server.domain.port.TransferRepositoryPort;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class TransferService implements TransferUseCase {
    private final TransferRepositoryPort transferRepository;
    private final TransferLinkRepositoryPort transferLinkRepository;
    private final SpeciesRepositoryPort speciesRepository;
    private final AuthService authService;
    private final TokenGenerator tokenGenerator;
    private final long linkTtlHours;

    public TransferService(
            TransferRepositoryPort transferRepository,
            TransferLinkRepositoryPort transferLinkRepository,
            SpeciesRepositoryPort speciesRepository,
            AuthService authService,
            TokenGenerator tokenGenerator,
            @Value("${app.link.ttl-hours:24}") long linkTtlHours
    ) {
        this.transferRepository = transferRepository;
        this.transferLinkRepository = transferLinkRepository;
        this.speciesRepository = speciesRepository;
        this.authService = authService;
        this.tokenGenerator = tokenGenerator;
        this.linkTtlHours = linkTtlHours;
    }

    @Override
    public TransferDtos.CreateTransferResponse create(String token, TransferDtos.CreateTransferRequest request) {
        User transferor = authService.requireUser(token);
        SpeciesCatalog species = speciesRepository.findById(request.speciesId())
                .orElseThrow(() -> new AppException(HttpStatus.BAD_REQUEST, "존재하지 않는 생물종입니다."));

        TransferRequest transfer = transferRepository.save(new TransferRequest(
                null,
                transferor.id(),
                request.receiverPhone(),
                species.id(),
                request.quantity(),
                request.purpose(),
                request.reason(),
                TransferStatus.PENDING,
                null,
                null,
                null,
                LocalDateTime.now()
        ));

        TransferLink link = transferLinkRepository.save(new TransferLink(
                null,
                transfer.id(),
                tokenGenerator.nextToken(),
                LocalDateTime.now().plusHours(linkTtlHours),
                null
        ));

        return new TransferDtos.CreateTransferResponse(transfer.id(), link.token(), link.expiresAt());
    }

    @Override
    public TransferDtos.LinkViewResponse viewByLink(String token, String linkToken) {
        authService.requireUser(token);
        TransferLink link = transferLinkRepository.findByToken(linkToken)
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "유효하지 않은 링크입니다."));
        TransferRequest transfer = transferRepository.findById(link.transferRequestId())
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "양도/양수 신청 정보를 찾을 수 없습니다."));
        SpeciesCatalog species = speciesRepository.findById(transfer.speciesId())
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "생물종 정보를 찾을 수 없습니다."));

        boolean expired = link.expiresAt().isBefore(LocalDateTime.now());
        return new TransferDtos.LinkViewResponse(
                link.token(),
                transfer.status(),
                link.expiresAt(),
                expired,
                species.category(),
                species.scientificName(),
                species.koreanName(),
                transfer.quantity()
        );
    }

    @Override
    public TransferDtos.TransferStatusResponse completeByLink(
            String token,
            String linkToken,
            TransferDtos.CompleteTransferRequest request
    ) {
        authService.requireUser(token);
        TransferLink link = transferLinkRepository.findByToken(linkToken)
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "유효하지 않은 링크입니다."));

        if (link.expiresAt().isBefore(LocalDateTime.now())) {
            throw new AppException(HttpStatus.GONE, "만료된 링크입니다.");
        }
        if (link.usedAt() != null) {
            throw new AppException(HttpStatus.CONFLICT, "이미 사용된 링크입니다.");
        }

        TransferRequest transfer = transferRepository.findById(link.transferRequestId())
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "양도/양수 신청 정보를 찾을 수 없습니다."));

        TransferRequest saved = transferRepository.save(new TransferRequest(
                transfer.id(),
                transfer.transferorUserId(),
                transfer.receiverPhone(),
                transfer.speciesId(),
                transfer.quantity(),
                transfer.purpose(),
                transfer.reason(),
                TransferStatus.ACCEPTED,
                request.receiverName(),
                request.receiverAddress(),
                request.receiverPhone(),
                transfer.createdAt()
        ));

        transferLinkRepository.save(new TransferLink(
                link.id(),
                link.transferRequestId(),
                link.token(),
                link.expiresAt(),
                LocalDateTime.now()
        ));

        return new TransferDtos.TransferStatusResponse(saved.id(), saved.status(), LocalDateTime.now());
    }
}
