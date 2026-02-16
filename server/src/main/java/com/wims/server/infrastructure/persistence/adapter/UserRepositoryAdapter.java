package com.wims.server.infrastructure.persistence.adapter;

import com.wims.server.domain.model.User;
import com.wims.server.domain.port.UserRepositoryPort;
import com.wims.server.infrastructure.persistence.entity.UserEntity;
import com.wims.server.infrastructure.persistence.repository.JpaUserRepository;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class UserRepositoryAdapter implements UserRepositoryPort {
    private final JpaUserRepository repository;

    public UserRepositoryAdapter(JpaUserRepository repository) {
        this.repository = repository;
    }

    @Override
    public User save(User user) {
        UserEntity entity = new UserEntity();
        entity.setId(user.id());
        entity.setLoginId(user.loginId());
        entity.setPasswordHash(user.passwordHash());
        entity.setName(user.name());
        entity.setPhone(user.phone());
        entity.setAddress(user.address());
        entity.setType(user.type());
        entity.setBusinessRegistrationNumber(user.businessRegistrationNumber());
        entity.setCreatedAt(user.createdAt());

        UserEntity saved = repository.save(entity);
        return toDomain(saved);
    }

    @Override
    public Optional<User> findById(Long id) {
        return repository.findById(id).map(this::toDomain);
    }

    @Override
    public Optional<User> findByLoginId(String loginId) {
        return repository.findByLoginId(loginId).map(this::toDomain);
    }

    @Override
    public boolean existsByLoginId(String loginId) {
        return repository.existsByLoginId(loginId);
    }

    private User toDomain(UserEntity entity) {
        return new User(
                entity.getId(),
                entity.getLoginId(),
                entity.getPasswordHash(),
                entity.getName(),
                entity.getPhone(),
                entity.getAddress(),
                entity.getType(),
                entity.getBusinessRegistrationNumber(),
                entity.getCreatedAt()
        );
    }
}
