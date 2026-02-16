package com.wims.server.domain.port;

import com.wims.server.domain.model.User;

import java.util.Optional;

public interface UserRepositoryPort {
    User save(User user);

    Optional<User> findById(Long id);

    Optional<User> findByLoginId(String loginId);

    boolean existsByLoginId(String loginId);
}
