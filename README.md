# Janji Suci — Wedding Planner (Exact Split)

Versi ini dibuat dari `janji-suci.html` dengan tujuan utama: **memisahkan source ke beberapa path/component tanpa mengubah isi JSX, teks, warna, layout, state, dan logic aplikasi**.

## Struktur

- `index.html` — entry point dan CDN yang sama seperti file asli
- `public/styles.css` — CSS yang dipisahkan dari `<style>` asli
- `public/js/core` — ornaments, helpers, icons
- `public/js/components` — komponen reusable
- `public/js/screens` — screen onboarding/auth/setup/loading
- `public/js/pages` — halaman fitur
- `public/js/navigation` — Sidebar & BottomNav
- `public/js/app` — App & Root

## Jalankan

```bash
npm install
npm run dev
```

Kemudian buka alamat yang diberikan Vite.

> Karena versi ini sengaja mempertahankan React UMD + Babel Standalone + CDN seperti file asli, file JSX di-load berurutan sebagai script Babel, bukan diubah menjadi sistem import/export.
