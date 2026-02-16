package com.wims.server.infrastructure.persistence.adapter;

import com.wims.server.domain.model.AuthSession;
import com.wims.server.domain.port.AuthSessionRepositoryPort;
import com.wims.server.infrastructure.persistence.entity.AuthSessionEntity;
import com.wims.server.infrastructure.persistence.repository.JpaAuthSessionRepository;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class AuthSessionRepositoryAdapter implements AuthSessionRepositoryPort {
    private final JpaAuthSessionRepository repository;

    public AuthSessionRepositoryAdapter(JpaAuthSessionRepository repository) {
        this.repository = repository;
    }

    @Override
    public AuthSession save(AuthSession session) {
        AuthSessionEntity entity = new AuthSessionEntity();
        entity.setId(session.id());
        entity.setUserId(session.userId());
        entity.setToken(session.token());
        entity.setExpiresAt(session.expiresAt());
        AuthSessionEntity saved = repository.save(entity);
        return toDomain(saved);
    }

    @Override
    public Optional<AuthSession> findByToken(String token) {
        return repository.findByToken(token).map(this::toDomain);
    }

    private AuthSession toDomain(AuthSessionEntity entity) {
        return new AuthSession(entity.getId(), entity.getUserId(), entity.getToken(), entity.getExpiresAt());
    }
}
