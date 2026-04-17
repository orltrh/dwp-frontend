# DataKu — Aplikasi Paket Data

Aplikasi web e-commerce untuk pembelian paket data internet. Dibangun dengan React + MUI v9, menggunakan json-server sebagai mock API.

---

## Teknologi

| Layer | Teknologi |
|-------|-----------|
| UI Framework | React 18 + Vite |
| Component Library | MUI (Material UI) v9 |
| Routing | react-router-dom v7 |
| Mock API | json-server v1 |

---

## Cara Menjalankan

### 1. Install dependensi

```bash
npm install
```

### 2. Jalankan mock API (json-server)

```bash
npx json-server db.json --port 3000
```

### 3. Jalankan aplikasi React

```bash
npm run dev
```

Buka browser di `http://localhost:5173`

---

## Akun Login

| Field | Value |
|-------|-------|
| Username | `budisukadonat` |
| Password | `budi123` |

---

## Fitur

- **Login** — autentikasi dengan username & password
- **Dashboard** — ringkasan kuota aktif, sisa pulsa, dan riwayat transaksi terbaru
- **Beli Lagi** — tombol cepat untuk membeli ulang paket terakhir yang dibeli
- **Paket Data** — daftar semua paket dengan filter kategori dan pengurutan harga/kuota
- **Pembelian** — modal dua langkah (konfirmasi → sukses) dengan opsi ganti nomor HP tujuan
- **Riwayat Transaksi** — semua transaksi dengan filter kategori, tampilan nomor tujuan dan tanggal kedaluwarsa

---

## Struktur Folder

```
src/
├── components/
│   ├── BuyPackageModal.jsx   # Modal pembelian (reusable)
│   └── Layout.jsx            # AppBar + navigasi bawah
├── config/
│   └── api.js                # Base URL API
├── context/
│   └── AuthContext.jsx       # State autentikasi global
├── hooks/
│   └── useCustomer.js        # Hook fetch data pelanggan
├── pages/
│   ├── DashboardPage.jsx
│   ├── LoginPage.jsx
│   ├── PackagesPage.jsx
│   └── TransactionsPage.jsx
└── utils/
    └── format.js             # formatPrice, formatDate
```
