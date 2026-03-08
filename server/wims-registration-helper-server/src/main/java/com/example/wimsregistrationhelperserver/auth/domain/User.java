package com.example.wimsregistrationhelperserver.auth.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@NoArgsConstructor
@Entity
@Table(name = "users")
public class User {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  /**
   * PERSONAL / BUSINESS를 문자열로 저장해 가독성을 높인다.
   * */
  @Enumerated(EnumType.STRING)
  @Column(name = "user_type", nullable = false, length = 20)
  private UserType userType;

  @Column(nullable = false, length = 100)
  private String name;

  @Column(nullable = false, unique = true, length = 255)
  private String email;

  @Column(nullable = false, unique = true, length = 30)
  private String phone;

  @Column(nullable = false, length = 255)
  private String address;

  @Column(name = "password_hash", nullable = false, length = 255)
  private String passwordHash;

  @Column(name = "created_at", nullable = false)
  private LocalDateTime createdAt;

  @Column(name = "updated_at", nullable = false)
  private LocalDateTime updatedAt;

  /**
   * 회원가입 시 사용할 생성 메서드
   * createdAt/updatedAt을 여기서 동시에 초기화한다.
   * */
  public static User create(
    UserType userType,
    String name,
    String email,
    String phone,
    String address,
    String passwordHash
  ) {
    User user = new User();
    user.userType = userType;
    user.name = name;
    user.email = email;
    user.phone = phone;
    user.address = address;
    user.passwordHash = passwordHash;
    user.createdAt = LocalDateTime.now();
    user.updatedAt = LocalDateTime.now();
    return user;
  }
}
