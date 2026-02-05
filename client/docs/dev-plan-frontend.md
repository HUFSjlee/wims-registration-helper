개발 단계(프론트)
참고 문서: `frontend-brief.md`(개요/요구사항), `cursor-codex-playbook.md`(작업 규칙/PR 규칙)

Sprint F1: UI/UX 확정(현재)

- 메인 탭 UI 고정(등록/폐사/양도양수/프로필)
- 양도 등록 화면(폼/버튼/검증 UX)
- 양수 링크 접수 화면(토큰 표시, 입력폼, 다음 버튼)
- 최종 컨펌 화면(요약 + 동의 체크)
- WIMS 제출 도우미 화면(복사/체크/WIMS 열기)
- 에러/빈 상태 UI(토큰 만료, 필수값 누락 등)

완료 기준: “더미여도 전체 플로우 데모가 끊기지 않음”

Sprint F2: 코드 품질/구조 정리

- pages/components 분리 정돈
- 공통 UI 컴포넌트화(버튼/카드/폼)
- 입력 검증(간단한 규칙) 통일
- 접근성/모바일 터치 영역 개선

Sprint F3: 백엔드 연동 준비(선택)

- API 호출 레이어 준비(fetch/axios wrapper)
- mock ↔ api 전환 쉽게 만들기
- 환경변수(VITE_API_BASE_URL) 도입