PANDUAN SETUP — GAME POIN GRATIS

PENTING
- Ini adalah kerangka aman untuk poin virtual gratis, bukan saldo uang.
- Tidak ada deposit uang, withdraw, taruhan, atau konversi poin menjadi uang.
- Admin harus diberi custom claim melalui Firebase Admin SDK di lingkungan tepercaya.
- Jangan pernah menaruh service-account JSON atau private key di folder website.

1. Buat/ pilih proyek Firebase.
2. Aktifkan Authentication > Email/Password dan Realtime Database.
3. js/firebase-config.js sudah diisi dengan konfigurasi proyek game-gratis-d8961 yang diberikan. Periksa kembali bila proyek Firebase yang dipakai berbeda.
4. Pasang database.rules.json ke Realtime Database Rules.
5. Deploy fungsi:
   - Masuk ke folder functions
   - npm install
   - firebase deploy --only functions
6. Jadikan akun admin melalui lingkungan tepercaya (contoh Node.js lokal dengan Firebase Admin SDK):
   admin.auth().setCustomUserClaims("UID_ADMIN", {admin:true});
   UID_ADMIN adalah UID akun admin dari Firebase Authentication.
   Jangan jalankan kode pemberian hak admin dari browser publik.
7. Hosting: unggah isi folder proyek ke Firebase Hosting atau hosting static yang mendukung HTTPS.

Catatan keamanan:
- Rules membatasi pengguna hanya membuat permintaan poin untuk UID sendiri.
- Pengguna tidak bisa mengubah saldo poin.
- Persetujuan dilakukan Cloud Function yang memeriksa custom claim admin.
- Sebelum dipublikasikan, uji menggunakan akun pengguna biasa dan akun admin terpisah.
