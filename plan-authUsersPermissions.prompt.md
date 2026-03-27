# Plan: Auth, Users, Permissions

## Goal
Menyiapkan fondasi auth yang production-ready lalu mengintegrasikannya secara konsisten ke service `users` dan `permissions`.

## Scope
- Gunakan JWT verification dengan secret Encore.
- Standarkan cara ambil dan validasi auth context.
- Terapkan proteksi endpoint yang tepat (`auth: true` bila wajib login).
- Siapkan pola authorization berbasis role/permission yang reusable.

## Implementation Plan
1. Finalisasi auth handler JWT
   - Validasi header `Authorization` dengan format `Bearer <token>`.
   - Verifikasi token (algoritma, issuer, audience, expiry).
   - Map claims ke `AuthData` (`userID`, `email`, `roles`).

2. Hardening endpoint auth utility
   - Pertahankan endpoint health-check (`/auth/ping`).
   - Gunakan endpoint status auth yang konsisten (`/auth/is-auth`).
   - Pastikan behavior error auth seragam (`unauthenticated`).

3. Integrasi ke service users
   - Tandai endpoint sensitif dengan `auth: true`.
   - Ambil identitas caller dari `getAuthData()`.
   - Pisahkan akses `self` vs `admin` jika dibutuhkan.

4. Integrasi ke service permissions
   - Definisikan helper guard otorisasi (contoh: `requireRole("admin")`).
   - Terapkan guard di endpoint mutasi permission.
   - Kembalikan error yang tepat (`permission_denied`) saat akses tidak valid.

5. Konsistensi kontrak API
   - Samakan naming path (kebab-case).
   - Samakan shape response untuk endpoint status/check.
   - Jaga tipe agar eksplisit dan mudah dipakai antar-service.

6. Validasi dan verifikasi
   - Jalankan type-check / diagnostics untuk file yang berubah.
   - Uji alur utama: no token, token invalid, token valid non-admin, token valid admin.

## Deliverables
- Auth handler JWT siap pakai di service auth.
- Endpoint users terproteksi sesuai kebutuhan auth.
- Endpoint permissions menggunakan guard authorization yang konsisten.
- Dokumentasi singkat pola auth/authorization untuk pengembangan lanjutan.

## Notes
- Secret yang dipakai: `AuthJWTSecret`.
- Untuk produksi, gunakan secret kuat dan rotasi berkala.
- Jika nanti perlu RBAC lebih kompleks, guard dapat diperluas ke permission matrix.
