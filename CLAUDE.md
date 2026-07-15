# CLAUDE.md

## 프로젝트 개요

영화/책 검색 후 관심 등록·기록을 남기는 개인 트래커

## 스택

React 18 + TypeScript + Vite, Tailwind CSS, Firebase(Auth+Firestore),
TMDB API(영화), 알라딘 API(도서), 배포는 Vercel

## 폴더 구조

src/
├─ features/movie, features/book, features/entries # 기능 단위 폴더
├─ components/ui # 공용 컴포넌트
├─ lib/firebase.ts, lib/api/tmdb.ts, lib/api/aladin.ts
└─ types/

## 컨벤션

- 컴포넌트는 함수형 + named export
- API 응답은 lib/api/\*.ts에서 공통 타입(MediaItem)으로 정규화 후 반환
- 커밋 메시지는 conventional commits (feat:, fix:, chore:)

## 하지 말 것

- API 키를 코드에 하드코딩하지 않기 (.env만 사용)
- Firestore 보안 규칙 없이 배포하지 않기
