Judul Proyek: Game Memory Match Berbasis Web dengan Flask

📌 Deskripsi Umum Proyek
Proyek ini merupakan pengembangan dari sebuah permainan edukatif berbasis web yang mengusung konsep "Memory Match Game" atau permainan mencocokkan pasangan gambar. Permainan ini bertujuan untuk melatih daya ingat dan konsentrasi pemain melalui interaksi yang menyenangkan dan menantang. Pengembangan game ini menggunakan framework Flask (Python) sebagai fondasi backend, dengan dukungan HTML, CSS, dan JavaScript di sisi frontend untuk menciptakan antarmuka yang interaktif.

Pemain akan dihadapkan pada papan permainan berisi kartu-kartu yang tertutup dan harus mencocokkan setiap pasangan gambar yang identik. Game ini menyediakan beberapa tingkatan kesulitan dan sistem papan skor dinamis yang menyimpan skor tertinggi pemain untuk setiap level. Terdapat pula mekanisme penalti berupa pengacakan ulang posisi kartu jika waktu habis dan masih terdapat pasangan kartu yang belum ditemukan.

🎯 Tujuan Proyek
Membuat game web interaktif yang dapat dimainkan langsung melalui browser.

Mengimplementasikan logika pemilihan gambar secara acak untuk menciptakan replayability tinggi.

Menyediakan sistem level kesulitan yang bervariasi untuk meningkatkan tantangan bagi pemain.

Mengembangkan sistem penyimpanan skor berdasarkan level permainan.

Menambah pengalaman bermain dengan aturan penalti dan batasan waktu.

🎮 Fitur-Fitur Utama
1. Level Permainan
Game terdiri dari tiga tingkatan kesulitan, yaitu:

Easy: 4 pasangan gambar (8 kartu dalam grid 4x4).

Medium: 6 pasangan gambar (12 kartu dalam grid 6x6).

Hard: 8 pasangan gambar (16 kartu dalam grid 8x8).

Tiap level menyesuaikan jumlah pasangan gambar dan tingkat kesulitan pencocokannya.

2. Sistem Papan Skor
Skor pemain akan dikirim ke server setelah menyelesaikan permainan.

Data skor disimpan dalam struktur dictionary bernama top_scores, dikategorikan berdasarkan level permainan.

Hanya 10 skor tertinggi yang disimpan untuk tiap level.

Papan skor dapat diakses melalui halaman /scoreboard.

3. Randomisasi Gambar
Gambar diambil dari folder static/images/ secara acak menggunakan modul random.

Untuk setiap permainan, dipilih sejumlah gambar yang akan digandakan dan diacak ulang posisinya untuk membentuk pasangan.

Sistem memastikan bahwa gambar cukup tersedia untuk jumlah pasangan yang dibutuhkan di setiap level.

4. Routing Halaman Aplikasi
Beberapa endpoint dalam aplikasi ini antara lain:

/ – Halaman utama (homepage).

/level – Memilih level permainan.

/instructions – Menampilkan petunjuk atau cara bermain.

/game/<level> – Memulai permainan berdasarkan level yang dipilih.

/submit_score – Menerima skor dari klien dan memperbarui papan skor.

/scoreboard – Menampilkan 10 skor tertinggi.

/goodbye – Halaman akhir setelah permainan selesai.

/static/images/<filename> – Menyediakan akses gambar statis.

5. Mekanisme Penalti (Shuffle Ulang)
Jika waktu yang ditentukan habis dan masih terdapat kartu yang belum berhasil dicocokkan, maka posisi seluruh kartu akan diacak ulang secara otomatis.

Fitur ini bertujuan untuk menambah tantangan serta mendorong pemain menyelesaikan permainan dengan cepat dan tepat.

⚙️ Teknologi yang Digunakan
Backend: Python (Flask Framework)

Frontend: HTML5, CSS3, JavaScript

Library Tambahan: os, random dari Python standard library

Templating: Jinja2 Template Engine (via Flask)

🗃️ Struktur Data & Manajemen Gambar
Semua gambar permainan disimpan dalam folder static/images/. Gambar-gambar ini akan dipilih secara acak berdasarkan level dan dikombinasikan menjadi pasangan. Pemilihan dan pengacakan gambar dilakukan melalui fungsi get_random_image_pairs(level) yang terdapat di dalam kode backend.

Struktur dictionary top_scores digunakan untuk menyimpan skor pemain dan tidak bersifat persistensi (belum terhubung ke database). Struktur ini akan diperbarui setiap kali pemain mengirimkan skor melalui endpoint /submit_score.
