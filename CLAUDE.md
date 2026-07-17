# CLAUDE.md

## 프로젝트 개요

영화 검색 후 관심 등록·기록을 남기는 개인 트래커

## 스택

React 18 + TypeScript + Vite, Tailwind CSS, Firebase(Auth+Firestore),
TMDB API(영화), 배포는 Vercel

## 폴더 구조

src/
├─ pages # 라우트 페이지 컴포넌트 (Home, Search, MovieDetail, MovieModify, Login)
├─ components/ui # 공용 컴포넌트
├─ components/layout # 공통 레이아웃(헤더 등)
├─ lib/firebase.ts, lib/api/tmdb.ts
└─ types/

## 컨벤션

- 컴포넌트는 함수형 + named export
- API 응답은 lib/api/tmdb.ts에서 공통 타입으로 정규화 후 반환
- 커밋 메시지는 conventional commits (feat:, fix:, chore:)

## 하지 말 것

- API 키를 코드에 하드코딩하지 않기 (.env만 사용)
- Firestore 보안 규칙 없이 배포하지 않기
