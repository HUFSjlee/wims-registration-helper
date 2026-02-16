package com.wims.server.domain.port;

import com.wims.server.domain.model.AuthSession;

import java.util.Optional;

public interface AuthSessionRepositoryPort {
    AuthSession save(AuthSession session);

    Optional<AuthSession> findByToken(String token);
}
