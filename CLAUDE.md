# CLAUDE.md

## 프로젝트 개요

영화 검색 후 관심 등록·기록을 남기는 개인 트래커

## 스택

React 19 + TypeScript + Vite, Tailwind CSS v4, Firebase(Auth+Firestore),
TMDB API(영화), TanStack Query, React Router, Zustand, 배포는 Vercel

## 폴더 구조

```text
src/
├─ pages             # 라우트 페이지 컴포넌트
├─ components/ui     # 공용 컴포넌트
├─ components/movie  # 영화 카드 등 도메인 컴포넌트
├─ components/layout # 공통 레이아웃(헤더 등)
├─ hooks             # 커스텀 훅
├─ store             # 전역 상태
├─ lib               # Firebase 초기화, TMDB/Firestore 데이터 연동
└─ types/
```

## 컨벤션

- 컴포넌트는 함수형 + named export
- API 응답은 lib/api/tmdb.ts에서 공통 타입으로 정규화 후 반환
- 커밋 메시지는 conventional commits (feat:, fix:, chore:)
- TypeScript는 strict 모드(tsconfig.app.json의 strict, noUncheckedIndexedAccess) 기준으로 작성
- 라우트는 Home(첫 진입 화면)만 정적 import하고, 나머지 페이지는 App.tsx에서 React.lazy + Layout의 `<Suspense>`로 지연 로딩 (새 라우트 추가 시 동일 패턴 적용)

## 하지 말 것

- API 키를 코드에 하드코딩하지 않기 (.env만 사용)
- Firestore 보안 규칙 없이 배포하지 않기
- `user!.uid`처럼 non-null assertion으로 타입을 얼버무리지 않기 — React Query의 skipToken으로 enabled/queryFn을 함께 좁히기 (src/hooks/useWishlist.ts 참고)
- Firestore `docSnapshot.data()`(사실상 any)를 타입 없이 그대로 쓰지 않기 — 로컬 XDoc 인터페이스로 캐스팅 후 사용 (src/lib/entries.ts 참고)
