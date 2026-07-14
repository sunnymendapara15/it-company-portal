# IT Company Portal

This repository contains a single-page React experience for the IT company homepage, login, and registration views, plus a Laravel API backend that provides authentication flows backed by Sanctum.

## Project Overview
- **Frontend:** React app that showcases the company, services, testimonials, and provides login/register pages wired to the backend.
- **Backend:** Laravel API exposing `/api/login`, `/api/register`, and `/api/user` endpoints. Uses Sanctum for SPA-friendly authentication plus request validation.

## Frontend Setup (in `frontend/`)
1. Install dependencies: `npm install`
2. Start dev server: `npm start`
3. The homepage, login, and register pages live under React Router-managed routes. Adjust `REACT_APP_API_BASE_URL` in `.env` to point to the Laravel API.

## Backend Setup (in `backend/`)
1. Install PHP dependencies: `composer install`
2. Duplicate `.env.example` to `.env` and set the database + `SESSION_DOMAIN`, `SANCTUM_STATEFUL_DOMAINS`, and `API_URL`.
3. Run database migrations: `php artisan migrate`
4. Start PHP server (e.g., `php artisan serve`) to expose the API endpoints.
5. Enable Sanctum: `php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"` (if not already) and ensure `SANCTUM_STATEFUL_DOMAINS` includes the frontend host.

## Testing the Flow
- Visit the React homepage via `npm start` and use the navigation links to reach login/register pages.
- Submit the forms; they POST to the Laravel API and expect JSON responses. Handle validation and error messaging as shown in the React components.
- Protect backend routes by including the Sanctum token cookie when authenticated (cross-site cookies require proper CORS and session configuration).
