package com.example.wimsregistrationhelperserver.auth.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.OffsetDateTime;

@Getter
@NoArgsConstructor
@Entity
@Table(name = "user_info")
public class User {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "user_id")
  private Long id;

  /**
   * PERSONAL / BUSINESS를 문자열로 저장해 가독성을 높인다.
   * */
  @Enumerated(EnumType.STRING)
  @Column(name = "user_type", nullable = false, length = 20)
  private UserType userType;

  @Column(name = "user_name", nullable = false, length = 100)
  private String name;

  @Column(name = "user_email", nullable = false, unique = true, length = 255)
  private String email;

  @Column(name = "user_phone", nullable = false, unique = true, length = 30)
  private String phone;

  @Column(name = "user_address1", nullable = false, length = 255)
  private String address1;

  @Column(name = "user_address2", nullable = false, length = 255)
  private String address2;

  @Column(name = "user_address3", nullable = false, length = 255)
  private String address3;

  @Column(name = "user_birth", nullable = false, length = 20)
  private String birth;

  @Column(name = "user_gender", nullable = false, length = 20)
  private String gender;

  @Column(name = "user_password_hash", nullable = false, length = 255)
  private String passwordHash;

  @Column(name = "regist_date", nullable = false)
  private OffsetDateTime registDate;

  @Column(name = "modify_date", nullable = false)
  private OffsetDateTime modifyDate;

  /**
   * 회원가입 시 사용할 생성 메서드
   * createdAt/updatedAt을 여기서 동시에 초기화한다.
   * */
  public static User create(
    UserType userType,
    String name,
    String email,
    String phone,
    String address1,
    String address2,
    String address3,
    String birth,
    String gender,
    String passwordHash
  ) {
    User user = new User();
    user.userType = userType;
    user.name = name;
    user.email = email;
    user.phone = phone;
    user.address1 = address1;
    user.address2 = address2;
    user.address3 = address3;
    user.birth = birth;
    user.gender = gender;
    user.passwordHash = passwordHash;
    user.registDate = OffsetDateTime.now();
    user.modifyDate = OffsetDateTime.now();
    return user;
  }
}
