package com.wims.server.infrastructure.persistence.repository;

import com.wims.server.infrastructure.persistence.entity.AuthSessionEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface JpaAuthSessionRepository extends JpaRepository<AuthSessionEntity, Long> {
    Optional<AuthSessionEntity> findByToken(String token);
}
