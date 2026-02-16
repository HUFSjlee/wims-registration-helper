package com.wims.server.application.service;

import com.wims.server.application.dto.AuthDtos;
import com.wims.server.application.exception.AppException;
import com.wims.server.application.port.PasswordHasher;
import com.wims.server.application.port.TokenGenerator;
import com.wims.server.application.usecase.AuthUseCase;
import com.wims.server.domain.model.AuthSession;
import com.wims.server.domain.model.User;
import com.wims.server.domain.model.UserType;
import com.wims.server.domain.port.AuthSessionRepositoryPort;
import com.wims.server.domain.port.UserRepositoryPort;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class AuthService implements AuthUseCase {
    private final UserRepositoryPort userRepository;
    private final AuthSessionRepositoryPort authSessionRepository;
    private final PasswordHasher passwordHasher;
    private final TokenGenerator tokenGenerator;
    private final long sessionTtlHours;

    public AuthService(
            UserRepositoryPort userRepository,
            AuthSessionRepositoryPort authSessionRepository,
            PasswordHasher passwordHasher,
            TokenGenerator tokenGenerator,
            @Value("${app.auth.session-ttl-hours:24}") long sessionTtlHours
    ) {
        this.userRepository = userRepository;
        this.authSessionRepository = authSessionRepository;
        this.passwordHasher = passwordHasher;
        this.tokenGenerator = tokenGenerator;
        this.sessionTtlHours = sessionTtlHours;
    }

    @Override
    public AuthDtos.AuthResponse signup(AuthDtos.SignupRequest request) {
        if (userRepository.existsByLoginId(request.loginId())) {
            throw new AppException(HttpStatus.CONFLICT, "이미 사용 중인 아이디입니다.");
        }

        UserType type = request.type() == null ? UserType.PERSONAL : request.type();
        if (type == UserType.BUSINESS && (request.businessRegistrationNumber() == null || request.businessRegistrationNumber().isBlank())) {
            throw new AppException(HttpStatus.BAD_REQUEST, "사업자 회원은 사업자등록번호가 필수입니다.");
        }

        User saved = userRepository.save(new User(
                null,
                request.loginId(),
                passwordHasher.hash(request.password()),
                request.name(),
                request.phone(),
                request.address(),
                type,
                request.businessRegistrationNumber(),
                LocalDateTime.now()
        ));
        return issueSession(saved);
    }

    @Override
    public AuthDtos.AuthResponse login(AuthDtos.LoginRequest request) {
        User user = userRepository.findByLoginId(request.loginId())
                .orElseThrow(() -> new AppException(HttpStatus.UNAUTHORIZED, "아이디 또는 비밀번호가 올바르지 않습니다."));

        if (!passwordHasher.matches(request.password(), user.passwordHash())) {
            throw new AppException(HttpStatus.UNAUTHORIZED, "아이디 또는 비밀번호가 올바르지 않습니다.");
        }

        return issueSession(user);
    }

    @Override
    public AuthDtos.MeResponse me(String token) {
        User user = requireUser(token);
        return new AuthDtos.MeResponse(
                user.id(),
                user.loginId(),
                user.name(),
                user.phone(),
                user.address(),
                user.type(),
                user.businessRegistrationNumber()
        );
    }

    public User requireUser(String token) {
        if (token == null || token.isBlank()) {
            throw new AppException(HttpStatus.UNAUTHORIZED, "로그인이 필요합니다.");
        }
        AuthSession session = authSessionRepository.findByToken(token)
                .orElseThrow(() -> new AppException(HttpStatus.UNAUTHORIZED, "유효하지 않은 토큰입니다."));

        if (session.expiresAt().isBefore(LocalDateTime.now())) {
            throw new AppException(HttpStatus.UNAUTHORIZED, "만료된 토큰입니다.");
        }

        return userRepository.findById(session.userId())
                .orElseThrow(() -> new AppException(HttpStatus.UNAUTHORIZED, "사용자를 찾을 수 없습니다."));
    }

    private AuthDtos.AuthResponse issueSession(User user) {
        String token = tokenGenerator.nextToken();
        authSessionRepository.save(new AuthSession(
                null,
                user.id(),
                token,
                LocalDateTime.now().plusHours(sessionTtlHours)
        ));
        return new AuthDtos.AuthResponse(token, user.loginId(), user.name(), user.type());
    }
}
