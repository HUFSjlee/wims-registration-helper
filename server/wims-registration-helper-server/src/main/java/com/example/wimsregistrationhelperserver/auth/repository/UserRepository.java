package com.example.wimsregistrationhelperserver.auth.repository;

import com.example.wimsregistrationhelperserver.auth.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
  boolean existsByEmail(String email);
  boolean existsByPhone(String phone);
  Optional<User> findByEmail(String email);
  Optional<User> findByPhone(String phone);
}
