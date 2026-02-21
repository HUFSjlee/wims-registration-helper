package com.wims.server.infrastructure.persistence.adapter;

import com.wims.server.domain.model.TransferRequest;
import com.wims.server.domain.port.TransferRepositoryPort;
import com.wims.server.infrastructure.persistence.entity.TransferRequestEntity;
import com.wims.server.infrastructure.persistence.repository.JpaTransferRequestRepository;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class TransferRepositoryAdapter implements TransferRepositoryPort {
    private final JpaTransferRequestRepository repository;

    public TransferRepositoryAdapter(JpaTransferRequestRepository repository) {
        this.repository = repository;
    }

    @Override
    public TransferRequest save(TransferRequest transferRequest) {
        TransferRequestEntity e = new TransferRequestEntity();
        e.setId(transferRequest.id());
        e.setTransferorUserId(transferRequest.transferorUserId());
        e.setReceiverPhone(transferRequest.receiverPhone());
        e.setSpeciesId(transferRequest.speciesId());
        e.setQuantity(transferRequest.quantity());
        e.setPurpose(transferRequest.purpose());
        e.setReason(transferRequest.reason());
        e.setStatus(transferRequest.status());
        e.setReceiverName(transferRequest.receiverName());
        e.setReceiverAddress(transferRequest.receiverAddress());
        e.setReceiverInputPhone(transferRequest.receiverInputPhone());
        e.setCreatedAt(transferRequest.createdAt());

        return toDomain(repository.save(e));
    }

    @Override
    public Optional<TransferRequest> findById(Long id) {
        return repository.findById(id).map(this::toDomain);
    }

    private TransferRequest toDomain(TransferRequestEntity e) {
        return new TransferRequest(
                e.getId(),
                e.getTransferorUserId(),
                e.getReceiverPhone(),
                e.getSpeciesId(),
                e.getQuantity(),
                e.getPurpose(),
                e.getReason(),
                e.getStatus(),
                e.getReceiverName(),
                e.getReceiverAddress(),
                e.getReceiverInputPhone(),
                e.getCreatedAt()
        );
    }
}
