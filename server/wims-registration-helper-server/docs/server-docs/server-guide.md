# WIMS Registration Helper Server Guide

## 1. 프로젝트 소개

WIMS Registration Helper Server는 양서파충류 개체의 등록, 폐사 처리, 양도 요청 생성, 양수 완료까지의 흐름을 관리하는 백엔드 서버다.  
현재 서버는 회원 인증과 개체 변동 이력 저장을 중심으로 동작하며, 양도자와 양수자 간의 양도/양수 접수 과정을 JWT 기반 인증과 PostgreSQL 영속성 위에서 처리한다.

핵심 도메인은 아래 4개 테이블을 중심으로 구성된다.

- `user_info`: 회원 정보
- `species_info`: 종 마스터 정보
- `species_status_info`: 등록, 폐사, 양도출고, 양도입고 이력
- `transfer_info`: 양도 요청 및 완료 이력

현재 보유 수량은 별도 holdings 테이블이 아니라 `species_status_info`의 누적 합계로 계산한다.

## 2. 핵심 프로세스

### 2.1 회원가입 및 로그인

1. 사용자가 회원가입 요청을 보낸다.
2. 서버는 이메일과 전화번호 중복을 검사한다.
3. 비밀번호를 암호화해 `user_info`에 저장한다.
4. 사용자가 로그인 요청을 보내면 서버는 이메일과 비밀번호를 검증한다.
5. 검증이 통과되면 JWT access token을 발급한다.
6. 이후 보호된 API는 `Authorization: Bearer {token}` 헤더로 접근한다.

### 2.2 개체 등록

1. 로그인한 사용자가 학명, 일반명, 수량을 입력해 등록 요청을 보낸다.
2. 서버는 학명 또는 일반명 중 하나 이상이 들어왔는지 확인한다.
3. 서버는 수량을 숫자로 파싱하고 1 이상인지 검증한다.
4. `species_info`에서 기존 종 정보를 찾고, 없으면 새 종 정보를 생성한다.
5. `species_status_info`에 `R` 로그를 적재한다.
6. 이후 보유 현황 조회에서는 해당 로그가 가산 항목으로 반영된다.

### 2.3 보유 개체 조회 및 폐사 처리

1. 로그인한 사용자가 보유 개체 목록을 조회한다.
2. 서버는 `species_status_info`에서 등록(`R`)과 양수입고(`TR`)는 더하고, 폐사(`D`)와 양도출고(`TD`)는 빼서 종별 보유 수량을 계산한다.
3. 폐사 요청이 들어오면 서버는 대상 종이 존재하는지 확인한다.
4. 요청 수량을 숫자로 파싱하고 1 이상인지 검증한다.
5. 현재 보유 수량보다 폐사 수량이 크면 요청을 거절한다.
6. 검증이 통과되면 `species_status_info`에 `D` 로그를 적재한다.

### 2.4 양도자 양도 접수 생성

1. 양도자가 로그인한다.
2. 양도자는 본인 보유 개체 중 양도할 종과 수량을 선택한다.
3. 양도자는 양수자의 전화번호를 입력해 양도 요청을 생성한다.
4. 서버는 전화번호로 양수자 회원을 조회한다.
5. 서버는 본인에게 양도하는 요청인지 검사한다.
6. 서버는 고유한 `transferKey`를 생성하고 `transfer_info`에 요청을 저장한다.
7. 서버는 `transferKey`와 `transferLink`를 응답으로 반환한다.
8. 프론트는 이 키 또는 링크를 양수자에게 전달한다.

### 2.5 양수자 양수 접수 조회

1. 양수자가 전달받은 링크 또는 키로 상세 조회를 시도한다.
2. 양수자는 로그인 상태여야 한다.
3. 서버는 `transferKey`로 `transfer_info`를 조회한다.
4. 서버는 요청의 실제 양수자와 현재 로그인 사용자가 같은지 검증한다.
5. 검증이 통과되면 양도자 이름, 전화번호, 마스킹된 주소, 종 정보, 수량을 반환한다.

### 2.6 양수자 양수 완료

1. 양수자가 양수 완료 요청을 보낸다.
2. 서버는 `transferKey`로 요청을 조회하고, 양수자 본인인지 다시 검증한다.
3. 이미 완료된 요청이면 중복 완료를 거절한다.
4. 서버는 양도자의 현재 보유 수량을 계산한다.
5. 양도 가능 수량이 부족하면 완료를 거절한다.
6. 검증이 통과되면 `species_status_info`에 아래 로그를 순서대로 적재한다.
7. 양도자 기준 `TD` 로그를 저장해 수량을 차감한다.
8. 양수자 기준 `TR` 로그를 저장해 수량을 증가시킨다.
9. `transfer_info`를 완료 상태로 갱신한다.
10. 서버는 완료 여부와 완료 시각을 응답한다.

## 3. 기능 목록

| 구분 | 기능 | 상태 | 비고 |
| --- | --- | --- | --- |
| Auth | 회원가입 | 구현 완료 | 개인/사업자 회원 공용 구조 |
| Auth | 로그인 | 구현 완료 | JWT access token 발급 |
| Auth | 내 정보 조회 | 구현 완료 | 로그인 사용자 프로필 조회 |
| Species | 일반명으로 학명 조회 | 구현 완료 | 공백 무시 조회 |
| Species | 개체 등록 | 구현 완료 | 등록 로그 적재 방식 |
| Species | 보유 개체 조회 | 구현 완료 | 로그 합산으로 수량 계산 |
| Species | 폐사 처리 | 구현 완료 | 보유 수량 초과 차감 방지 |
| Transfer | 양도 요청 생성 | 구현 완료 | 양수자 전화번호 기반 회원 조회 |
| Transfer | 양도 상세 조회 | 구현 완료 | 양수자 본인만 조회 가능 |
| Transfer | 양수 완료 | 구현 완료 | 양도출고/양도입고 로그 동시 반영 |
| Transfer | 내 양도/양수 목록 조회 | 구현 완료 | 양도자/양수자 공용 목록 |
| Profile | 보유 현황 및 이력 확장 | 부분 완료 | 서버는 프로필/보유 목록 제공, 전용 요약 API는 없음 |
| Status Log | 변동 이력 조회 API | 미구현 | 별도 조회 엔드포인트 없음 |
| Transfer | 상태값 세분화 | 미구현 | 현재는 완료 여부를 `modifyId`, `modifyDate`로 해석 |
| Transfer | 취소/거절 | 미구현 | Post-MVP 후보 |
| Search | 종 검색 자동완성 | 미구현 | Post-MVP 후보 |
| Admin | 관리자 조회 기능 | 미구현 | Post-MVP 후보 |

## 4. API 명세

### 4.1 Auth API

| 메서드 | 경로 | 인증 | 설명 | 요청 본문 | 응답 핵심 필드 |
| --- | --- | --- | --- | --- | --- |
| `POST` | `/api/auth/signup` | 불필요 | 회원가입 | `userType`, `name`, `email`, `phone`, `address1`, `address2`, `address3`, `birth`, `gender`, `password` | `id`, `userType`, `name`, `email`, `phone` |
| `POST` | `/api/auth/login` | 불필요 | 로그인 및 토큰 발급 | `email`, `password` | `accessToken`, `tokenType`, `expiresIn` |
| `GET` | `/api/auth/me` | 필요 | 내 정보 조회 | 없음 | `id`, `userType`, `name`, `email`, `phone`, `address1`, `address2`, `address3`, `birth`, `gender` |

### 4.2 Species API

| 메서드 | 경로 | 인증 | 설명 | 요청 값 | 응답 핵심 필드 |
| --- | --- | --- | --- | --- | --- |
| `GET` | `/api/species/scientific-name-by-common-name?commonName=` | 필요 | 일반명으로 학명 조회 | 쿼리스트링 `commonName` | `scientificName` |
| `POST` | `/api/species/register` | 필요 | 개체 등록 | `scientificName`, `commonName`, `quantity` | `logId` |
| `GET` | `/api/species/holdings` | 필요 | 현재 보유 개체 목록 조회 | 없음 | 배열: `speciesId`, `scientificName`, `commonName`, `quantity` |
| `POST` | `/api/species/death` | 필요 | 폐사 처리 | `speciesId`, `quantity` | `logId` |

### 4.3 Transfer API

| 메서드 | 경로 | 인증 | 설명 | 요청 값 | 응답 핵심 필드 |
| --- | --- | --- | --- | --- | --- |
| `POST` | `/api/transfers` | 필요 | 양도 요청 생성 | `speciesId`, `scientificName`, `commonName`, `speciesQuantity`, `transfereePhone` | `transferId`, `transferKey`, `transferLink`, `transferorId`, `transfereeId` |
| `GET` | `/api/transfers/{transferKey}` | 필요 | 양도 상세 조회 | 경로변수 `transferKey` | `transferorName`, `transferorPhone`, `maskedTransferorAddress`, `transfereeName`, `speciesId`, `speciesQuantity` |
| `POST` | `/api/transfers/{transferKey}/complete` | 필요 | 양수 완료 처리 | 경로변수 `transferKey` | `transferId`, `transferKey`, `completed`, `completedBy`, `completedAt` |
| `GET` | `/api/transfers` | 필요 | 내 양도/양수 목록 조회 | 없음 | 배열: `transferId`, `transferKey`, `transferorId`, `transfereeId`, `speciesId`, `speciesQuantity`, `completed`, `createdAt`, `updatedAt` |

### 4.4 공통 예외 응답

모든 예외 응답은 기본적으로 아래 형태를 사용한다.

```json
{
  "message": "에러 메시지"
}
```

주요 상태 코드는 아래와 같다.

- `400 Bad Request`: 입력값 오류, 수량 검증 실패, 이미 완료된 양도 요청 등
- `401 Unauthorized`: 토큰 없음, 토큰 무효, 권한 없는 조회/완료 요청
- `404 Not Found`: 회원, 종, 양도 요청 미존재
- `409 Conflict`: 이메일 또는 전화번호 중복 회원가입

## 5. 아키텍처

### 5.1 패키지 구조

현재 서버는 Spring Boot 기반의 도메인별 계층형 구조를 사용한다.

- `auth`
  - 회원가입, 로그인, 내 정보 조회
- `species`
  - 종 조회, 개체 등록, 보유 현황 계산, 폐사 처리
- `transfer`
  - 양도 요청 생성, 상세 조회, 완료 처리, 목록 조회
- `common.config`
  - 보안, 비밀번호 인코더 설정
- `common.security`
  - JWT 발급 및 인증 필터
- `common.exception`
  - 예외 타입과 전역 예외 처리

### 5.2 요청 처리 흐름

1. 클라이언트가 HTTP 요청을 전송한다.
2. `JwtAuthenticationFilter`가 Bearer 토큰을 읽어 사용자 ID를 추출한다.
3. `Controller`가 요청 DTO를 받고 인증 사용자 ID를 꺼낸다.
4. `Service`가 핵심 비즈니스 규칙과 검증을 수행한다.
5. `Repository`가 JPA로 PostgreSQL 테이블에 접근한다.
6. 결과를 DTO로 변환해 응답한다.
7. 예외 발생 시 `GlobalExceptionHandler`가 표준 에러 응답을 반환한다.

### 5.3 데이터 모델 해석

- `user_info`
  - 회원 계정과 연락처, 주소, 비밀번호 해시를 저장한다.
- `species_info`
  - 종의 일반명과 학명을 저장하는 마스터 역할을 한다.
- `species_status_info`
  - 실제 재고 테이블이 아니라 이벤트 로그 테이블이다.
  - `R`: 등록
  - `D`: 폐사
  - `TD`: 양도 출고
  - `TR`: 양도 입고
- `transfer_info`
  - 양도 요청 생성 시점과 완료 시점을 저장한다.
  - 현재 별도 상태 컬럼 없이 완료 여부를 계산한다.

### 5.4 현재 구조의 특징

- 장점
  - 개체 변동 이력이 모두 로그로 남아 감사 추적이 쉽다.
  - 양수 완료 시 양도출고와 양도입고를 한 트랜잭션에서 처리한다.
  - 회원, 종, 양도 흐름이 도메인별로 분리되어 있다.
- 유의점
  - 별도 holdings 테이블이 없어 보유 수량을 매번 로그 합산으로 계산한다.
  - `transfer_info`에 상태 컬럼이 없어 완료/미완료 표현이 제한적이다.
  - 문서상 Clean Architecture 목표가 있었지만, 현재 구현은 전형적인 Spring MVC 계층형 구조에 더 가깝다.

## 6. 기술 스택

| 구분 | 내용 |
| --- | --- |
| Language | Java 17 |
| Framework | Spring Boot 3.5.11 |
| Web | Spring Web |
| Persistence | Spring Data JPA |
| Database | PostgreSQL |
| Validation | Jakarta Validation |
| Security | Spring Security, JWT |
| JWT Library | `jjwt` 0.12.6 |
| Build Tool | Gradle |
| Boilerplate Reduction | Lombok |
| Local Client CORS | `http://localhost:3000` 허용 |

## 향후 보완 우선순위

1. `transfer_info`에 명시적 상태 컬럼을 추가해 취소, 거절, 완료를 구분한다.
2. 보유 수량 계산 비용과 무결성 요구를 보고 별도 holdings 테이블 도입 여부를 결정한다.
3. 상태 로그 조회 API와 프로필 요약 API를 추가해 프론트 의존 API를 정리한다.
4. 서비스/통합 테스트를 보강해 양도 완료 시 수량 일관성을 자동 검증한다.
