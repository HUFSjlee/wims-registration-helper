# 서버 API 개요

서비스 완성을 위해 필요한 핵심 API를 정리한 문서입니다.

| 상태 | 도메인 | 기능명 | 메서드 이름 | HTTP 메서드 | API 경로 | 간단 설명 |
| --- | --- | --- | --- | --- | --- | --- |
| 구현됨 | Auth | 회원가입 | `signup` | `POST` | `/api/auth/signup` | 신규 회원 계정을 생성한다. |
| 구현됨 | Auth | 로그인 | `login` | `POST` | `/api/auth/login` | 자격 증명을 검증하고 JWT를 발급한다. |
| 구현됨 | Auth | 내 정보 조회 | `getMe` | `GET` | `/api/auth/me` | 로그인한 사용자의 프로필을 조회한다. |
| 미구현 | Species | 개체 등록 | `createSpecies` | `POST` | `/api/species` | 로그인한 사용자의 보유 개체를 등록한다. |
| 미구현 | Species | 내 개체 목록 조회 | `getMySpeciesList` | `GET` | `/api/species/me` | 로그인한 사용자의 보유 개체 목록을 조회한다. |
| 미구현 | Species | 개체 상세 조회 | `getSpeciesDetail` | `GET` | `/api/species/{speciesId}` | 개체 1건의 상세 정보를 조회한다. |
| 미구현 | Species | 폐사 처리 | `markSpeciesDeath` | `POST` | `/api/species/{speciesId}/death` | 폐사로 인한 수량 차감을 처리한다. |
| 진행 중 | Transfer | 양도 접수 생성 | `createTransfer` | `POST` | `/api/transfers` | 양도 요청을 생성하고 전송용 키를 발급한다. |
| 미구현 | Transfer | 양도 상세 조회 | `getTransferByKey` | `GET` | `/api/transfers/{transferKey}` | 공개 키 기준으로 양도 요청 상세를 조회한다. |
| 미구현 | Transfer | 양수 접수 완료 | `completeTransfer` | `POST` | `/api/transfers/{transferKey}/complete` | 양수자가 양도 요청을 수락하고 완료 처리한다. |
| 미구현 | Transfer | 내 양도 목록 조회 | `getMyTransferList` | `GET` | `/api/transfers/me` | 로그인한 사용자가 생성한 양도 요청 목록을 조회한다. |
| 미구현 | StatusLog | 변동 이력 조회 | `getMyStatusLogs` | `GET` | `/api/status-logs/me` | 로그인한 사용자의 개체 변동 이력을 조회한다. |

## 상태 기준

- `구현됨`: 서버 코드 작성과 기본 컴파일 검증이 끝난 상태
- `진행 중`: 핵심 API는 만들었지만 연관 도메인 검증이나 후속 절차가 남아 있는 상태
- `미구현`: 아직 서버 코드 작성 전인 상태

## Post-MVP 기능 후보

- 회원정보 수정
- 회원탈퇴
- 양도 요청 취소
- 양도 요청 거절
- 양도 상태값 관리 (`PENDING`, `COMPLETED`, `CANCELED`, `REJECTED`)
- 개체명 검색 자동완성
- 수량 검증 강화
- 양도 이력 페이징 조회
- 상태 로그 조건 검색
- 관리자용 회원, 개체, 양도 조회 기능
