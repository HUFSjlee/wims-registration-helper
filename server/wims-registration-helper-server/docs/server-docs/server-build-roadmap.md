c# Server Build Roadmap (Simple)

## 기술 스택
- Spring Boot
- PostgreSQL (AWS 인스턴스 사용 중)
- Clean Architecture 적용

## 목표
- 프론트 mock 동작을 실제 서버 + DB 동작으로 전환한다.
- 신입/주니어 백엔드 포트폴리오 기준으로 핵심 기능을 완성한다.

## 용어
- `AnimalStock`: 보유 개체 재고
- `TransferRequest`: 양도/양수 요청
- `StockMovement`: 수량 변동 이력

## 진행 순서
1. ERD 확정
- 테이블: `users`, `animal_stocks`, `transfer_requests`, `stock_movements`
- 제약: 수량 음수 불가, token unique, email/phone unique

2. DB 마이그레이션 작성(Flyway)
- `V1 users`
- `V2 animal_stocks`
- `V3 transfer_requests`
- `V4 stock_movements`

3. API 명세 확정
- Auth: `signup`, `login`, `me`
- AnimalStock: `create`, `my list`, `death`
- TransferRequest: `create`, `public token read`, `complete`
- Profile: `me summary`

4. 백엔드 기본 구조 세팅
- 패키지: `auth`, `animalstock`, `transferrequest`, `profile`, `common`
- 공통: 예외 처리, 보안(JWT), 응답 포맷

5. 기능 구현 (슬라이스 순서)
- `auth` -> `animalstock` -> `transferrequest` -> `profile`

6. 테스트
- 서비스 단위 테스트
- API 테스트(MockMvc)
- 핵심 시나리오 통합 테스트(양수 완료 시 수량 OUT/IN)

7. 프론트 연동
- localStorage mock 제거
- 실제 API 호출로 교체

8. 브랜치 전략 반영 후 GitHub Push
- 기능별 브랜치: `feature/auth`, `feature/animal-stock`, `feature/transfer-request`, `feature/profile`
- 기능 완료 후 PR 생성
- 커밋 메시지는 한글로 작성
- 리뷰 반영 후 머지 및 원격 저장소 push

## 핵심 완료 기준
- 회원가입/로그인/개체등록/폐사/양도생성/양수완료가 DB에 반영된다.
- `TransferRequest complete` 시 트랜잭션으로 수량 일관성이 보장된다.
- `./gradlew test` 통과, Swagger 호출 가능.
