package com.example.wimsregistrationhelperserver.auth.service;

import com.example.wimsregistrationhelperserver.auth.domain.User;
import com.example.wimsregistrationhelperserver.auth.dto.LoginRequest;
import com.example.wimsregistrationhelperserver.auth.dto.LoginResponse;
import com.example.wimsregistrationhelperserver.auth.dto.MeResponse;
import com.example.wimsregistrationhelperserver.auth.dto.SignupRequest;
import com.example.wimsregistrationhelperserver.auth.dto.SignupResponse;
import com.example.wimsregistrationhelperserver.auth.repository.UserRepository;
import com.example.wimsregistrationhelperserver.common.exception.DuplicateResourceException;
import com.example.wimsregistrationhelperserver.common.exception.NotFoundException;
import com.example.wimsregistrationhelperserver.common.exception.UnauthorizedException;
import com.example.wimsregistrationhelperserver.common.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {
  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;
  private final JwtTokenProvider jwtTokenProvider;

  @Transactional
  public SignupResponse signup(SignupRequest request) {
    if (userRepository.existsByEmail(request.getEmail())) {
      throw new DuplicateResourceException("이미 사용 중인 이메일입니다.");
    }
    if (userRepository.existsByPhone(request.getPhone())) {
      throw new DuplicateResourceException("이미 사용 중인 전화번호입니다.");
    }

    String encodedPassword = passwordEncoder.encode(request.getPassword());

    User user = User.create(
      request.getUserType(),
      request.getName(),
      request.getEmail(),
      request.getPhone(),
      request.getAddress(),
      encodedPassword
    );

    User saved = userRepository.save(user);
    return SignupResponse.from(saved);
  }

  @Transactional(readOnly = true)
  public LoginResponse login(LoginRequest request) {
    User user = userRepository.findByEmail(request.getEmail())
      .orElseThrow(() -> new UnauthorizedException("이메일 또는 비밀번호가 올바르지 않습니다."));

    if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
      throw new UnauthorizedException("이메일 또는 비밀번호가 올바르지 않습니다.");
    }

    String accessToken = jwtTokenProvider.generateAccessToken(user.getId());

    return LoginResponse.builder()
      .accessToken(accessToken)
      .tokenType("Bearer")
      .expiresIn(jwtTokenProvider.getAccessTokenExpirationSeconds())
      .build();
  }

  @Transactional(readOnly = true)
  public MeResponse getMe(Long userId) {
    User user = userRepository.findById(userId)
      .orElseThrow(() -> new NotFoundException("사용자를 찾을 수 없습니다."));
    return MeResponse.from(user);
  }
}
