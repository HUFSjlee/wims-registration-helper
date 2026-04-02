# wims-registration-helper

WIMS Registration Helper는 양서파충류 개체의 등록, 폐사, 양도 요청 생성, 양수 완료 흐름을 정리하기 위한 서비스 프로젝트입니다.  
현재 저장소는 `client`, `server`, `infra` 구조로 나뉘어 있으며, 서버는 JWT 인증과 PostgreSQL 기반으로 핵심 업무 흐름을 처리하고, 클라이언트는 사용자 화면과 API 연동을 담당하고 있습니다.

## 프로젝트 개요

이 프로젝트의 핵심 목적은 아래 흐름을 실제 서비스 형태로 구현하는 것입니다.

- 회원가입 및 로그인
- 개체 등록
- 보유 개체 조회
- 폐사 처리
- 양도 요청 생성
- 양수자 상세 조회 및 양수 완료

현재 서버는 개체 보유량을 별도 재고 테이블이 아니라 상태 이력 로그의 누적 합으로 계산하고 있습니다.  
즉, 등록, 폐사, 양도출고, 양도입고 이력을 저장하고 이를 합산하여 현재 보유 수량을 계산하는 구조입니다.

## 핵심 프로세스

### 1. 개체 등록

1. 로그인한 사용자가 학명, 일반명, 수량을 입력합니다.
2. 서버는 기존 종 정보를 조회하고, 없으면 새 종 정보를 생성합니다.
3. 개체 등록 이벤트를 상태 로그에 저장합니다.
4. 이후 보유 개체 조회 시 등록 로그가 수량 계산에 반영됩니다.

### 2. 폐사 처리

1. 로그인한 사용자가 보유 개체 목록을 조회합니다.
2. 폐사할 종과 수량을 선택합니다.
3. 서버는 현재 보유 수량을 계산하여 폐사 가능 여부를 검증합니다.
4. 검증이 통과되면 폐사 로그를 저장하고 보유 수량에서 차감되도록 반영합니다.

### 3. 양도자 양도 요청 생성

1. 양도자가 로그인합니다.
2. 양도할 종과 수량, 양수자 전화번호를 입력합니다.
3. 서버는 전화번호로 양수자 회원을 조회합니다.
4. 서버는 고유한 `transferKey`를 생성하여 양도 요청을 저장합니다.
5. 클라이언트는 반환된 키 또는 링크를 양수자에게 전달합니다.

### 4. 양수자 양수 완료

1. 양수자가 전달받은 링크 또는 키로 양도 상세를 조회합니다.
2. 서버는 현재 로그인 사용자가 실제 양수자인지 검증합니다.
3. 양수 완료 요청 시 서버는 양도자의 보유 수량이 충분한지 확인합니다.
4. 검증이 통과되면 양도자에게는 출고 로그를, 양수자에게는 입고 로그를 각각 기록합니다.
5. 양도 요청을 완료 상태로 갱신합니다.

## 저장소 구조

```text
wims-registration-helper/
├─ client/   # Next.js 기반 프론트엔드
├─ server/   # Spring Boot 기반 백엔드
└─ infra/    # 인프라/배포용 디렉터리
```

### `client`

- 사용자 웹 화면을 담당합니다.
- 로그인, 회원가입, 개체 등록, 양도/양수 화면을 제공합니다.
- 서버 API와 연동합니다.

### `server`

- 회원 인증을 처리합니다.
- 개체 상태 이력을 관리합니다.
- 양도 요청 및 완료 처리를 담당합니다.
- PostgreSQL 영속성 처리를 수행합니다.

현재 주요 서버 문서는 아래 파일에 정리되어 있습니다.

- [server-guide.md](C:\Users\user\Coding-related%20Set\wims-registration-helper\server\wims-registration-helper-server\docs\server-docs\server-guide.md)

## 기술 스택

### Frontend

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4

### Backend

- Java 17
- Spring Boot 3.5.11
- Spring Web
- Spring Data JPA
- Spring Security
- JWT (`jjwt` 0.12.6)
- PostgreSQL
- Gradle

## 주요 기능 현황

| 구분 | 기능 | 상태 |
| --- | --- | --- |
| Auth | 회원가입 | 완료 |
| Auth | 로그인 | 완료 |
| Auth | 내 정보 조회 | 완료 |
| Species | 일반명으로 학명 조회 | 완료 |
| Species | 개체 등록 | 완료 |
| Species | 보유 개체 조회 | 완료 |
| Species | 폐사 처리 | 완료 |
| Transfer | 양도 요청 생성 | 완료 |
| Transfer | 양도 상세 조회 | 완료 |
| Transfer | 양수 완료 | 완료 |
| Transfer | 내 양도/양수 목록 조회 | 완료 |
| Status Log | 전용 이력 조회 API | 미구현 |
| Transfer | 취소/거절/명시적 상태값 관리 | 미구현 |

## 실행 방법

### 1. 클라이언트 실행

```bash
cd client
npm install
npm run dev
```

기본 개발 서버 주소는 아래와 같습니다.

- `http://localhost:3000`

### 2. 서버 실행

```bash
cd server/wims-registration-helper-server
./gradlew bootRun
```

Windows에서는 아래처럼 실행하실 수 있습니다.

```powershell
cd server\wims-registration-helper-server
.\gradlew.bat bootRun
```

### 3. 서버 로컬 설정

서버 실행 전에 로컬 설정 파일을 준비해야 합니다.

```powershell
Copy-Item `
  server\wims-registration-helper-server\src\main\resources\application-local.yml.example `
  server\wims-registration-helper-server\src\main\resources\application-local.yml
```

`application-local.yml`에는 아래 값을 채워야 합니다.

- PostgreSQL 접속 정보
- JWT secret

## 현재 서버 데이터 모델

현재 서버는 아래 4개 테이블을 중심으로 동작합니다.

- `user_info`: 회원 정보
- `species_info`: 종 마스터 정보
- `species_status_info`: 등록/폐사/양도출고/양도입고 이력
- `transfer_info`: 양도 요청 및 완료 이력

보유 수량은 `species_status_info`를 합산하여 계산합니다.

## 문서

- 서버 상세 문서: [server-guide.md](C:\Users\user\Coding-related%20Set\wims-registration-helper\server\wims-registration-helper-server\docs\server-docs\server-guide.md)
- 세션 맥락 메모: [context-window-first.md](C:\Users\user\Coding-related%20Set\wims-registration-helper\server\wims-registration-helper-server\docs\server-docs\context-window-first.md)

## 향후 보완 항목

- 양도 요청 상태값 분리 (`PENDING`, `COMPLETED`, `CANCELED`, `REJECTED`)
- 상태 로그 전용 조회 API 추가
- 프로필 요약 API 확장
- 보유 수량 계산 구조를 별도 holdings 테이블로 분리할지 검토
- 테스트 보강 및 통합 시나리오 자동화
