# Archivy

영화 검색 후 관심 등록·기록을 남기는 개인 영화 트래커

## 데모

🔗 https://archivy-delta.vercel.app/

<!-- 스크린샷 추가: 홈/검색/상세/찜 목록 화면 캡처를 여기에 삽입하세요 -->

## 주요 기능

- **Google 로그인** — Firebase Auth 기반 소셜 로그인
- **영화 검색** — TMDB API로 영화 검색
- **영화 상세** — 포스터, 개봉일, 평점, 러닝타임, 장르, 줄거리 확인
- **찜하기** — 관심 영화를 위시리스트에 등록/해제
- **관람 기록** — 별점과 코멘트로 관람 기록 작성/수정
- **홈 정렬** — 기록을 최신순/별점 높은순으로 정렬
- **비로그인 접근 제어** — 찜/기록 버튼 클릭 시 로그인 팝업 유도, 기록 화면 직접 접근 시 홈으로 리다이렉트

## 기술 스택

- React 19 + TypeScript + Vite
- Tailwind CSS v4
- Firebase (Auth, Firestore)
- TMDB API
- TanStack Query
- Zustand
- 배포: Vercel

## 실행 방법

```bash
npm install
cp .env.example .env   # Firebase / TMDB 키 입력
npm run dev
```

| 명령어            | 설명                       |
| ----------------- | -------------------------- |
| `npm run dev`     | 개발 서버 실행             |
| `npm run build`   | 타입 체크 후 프로덕션 빌드 |
| `npm run lint`    | ESLint 검사                |
| `npm run preview` | 빌드 결과 로컬 미리보기    |

## <!-- ## 회고 / 배운 점 -->
