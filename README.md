# IMP Assessment Monorepo

## Overview
Monorepo berisi dua implementasi untuk assessment:
- `laravel/` — REST API (Laravel 12 + Sanctum + Breeze API) untuk Authentication dan Post CRUD (pagination).
- `nextjs/` — Frontend (Next.js App Router + TypeScript + Tailwind v4 + DaisyUI).

Docker Compose disediakan untuk menjalankan stack secara lokal:
- Nginx (serve Laravel) pada http://localhost:8080
- PHP-FPM 8.3 (Laravel runtime)
- MySQL 8 (port host 3307)
- Node 20 (Next.js dev server http://localhost:3000)

## Fitur
- Authentication: Sign Up, Sign In, Sign Out (Sanctum cookie-based)
- Post CRUD: List (pagination), Detail, Create, Edit, Delete
- UI: DaisyUI komponen default, clean

## Prasyarat
- Docker Desktop (Windows/Mac/Linux)

## Menjalankan (Docker)
1. Start stack
   ```bash
   docker compose up -d --build
   ```
2. Akses:
   - API: http://localhost:8080
   - Next.js: http://localhost:3000
3. Health check
   - http://localhost:8080/ping.php → ok
   - http://localhost:8080/api/posts?per_page=5 → JSON

Jika port 3306 host terpakai (XAMPP), compose sudah memetakan MySQL ke host port 3307.

## Kredensial Seed
- Email: `demo@example.com`
- Password: `password`

## Endpoint API Utama
- GET `/api/posts` — pagination via `?page=` dan `?per_page=`
- GET `/api/posts/{id}`
- POST `/api/posts` (auth)
- PUT `/api/posts/{id}` (auth, owner)
- DELETE `/api/posts/{id}` (auth, owner)

## Arsitektur & Catatan Teknis
- Laravel
  - Breeze API + Sanctum untuk auth cookie. CORS mengizinkan origin `http://localhost:3000` dan `supports_credentials=true`.
  - `posts` table: `id`, `user_id`, `title`, `content`, `timestamps`.
  - Policy `PostPolicy` membatasi update/delete ke pemilik.
  - Seeder membuat 1 user demo dan 25 posts.
- Nginx
  - `SCRIPT_FILENAME` menggunakan `$document_root$fastcgi_script_name` (stabil di Windows volume) dan `fastcgi_read_timeout 120s`.
- Next.js
  - Tailwind v4 + DaisyUI (aktif via `@plugin "daisyui"` pada `app/globals.css`).
  - Halaman: `/auth/sign-in`, `/auth/sign-up`, `/auth/sign-out`, `/posts`, `/posts/[id]`, `/posts/new`, `/posts/[id]/edit`.
  - Helper `lib/api.ts` mengatur CSRF cookie + fetch ber-credentials ke Laravel.

## Perintah Pengembangan
- Lihat container:
  ```bash
  docker compose ps
  docker compose logs -f nginx
  docker compose logs -f php
  ```
- Migrasi & seeding ulang:
  ```bash
  docker compose exec php php artisan migrate:fresh --seed
  ```

## Tanpa Docker (opsional)
Tidak direkomendasikan untuk Windows karena versi PHP/ekstensi dan port conflict. Gunakan Docker untuk keseragaman.

## Struktur Repo
```
/laravel      # Aplikasi Laravel API
/nextjs       # Aplikasi Next.js (App Router)
/docker       # Dockerfiles & Nginx config
/docker-compose.yml
```

## Lisensi
Untuk keperluan assessment/tes teknis.
