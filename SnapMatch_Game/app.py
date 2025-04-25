from flask import Flask, render_template, request, jsonify, abort, send_from_directory
import os
import random

app = Flask(__name__)

# Inisialisasi papan skor untuk setiap level
top_scores = {
    'easy': [],
    'medium': [],
    'hard': []
}

@app.route('/scoreboard')
def scoreboard():
    return render_template('papan_score.html', top_scores=top_scores)


# Fungsi untuk mendapatkan pasangan gambar secara acak berdasarkan level
def get_random_image_pairs(level):
    # Tentukan folder gambar
    image_folder = os.path.join(app.static_folder, 'images')

    # Periksa apakah folder gambar ada
    if not os.path.exists(image_folder):
        print("[ERROR] Folder gambar tidak ditemukan:", image_folder)
        return []

    # Ambil daftar semua file gambar di folder
    all_images = [img for img in os.listdir(image_folder) if img.endswith(('png', 'jpg', 'jpeg'))]

    # Debugging: Tampilkan daftar gambar yang ditemukan
    print("Gambar yang ditemukan:", all_images)

    # Periksa apakah terdapat cukup gambar untuk membuat pasangan
    if len(all_images) < 2:
        print("[ERROR] Jumlah gambar tidak mencukupi.")
        return []

    # Tentukan jumlah pasangan berdasarkan level
    if level == 'easy':
        pair_count = 4  # 4x4 grid membutuhkan 8 pasangan
    elif level == 'medium':
        pair_count = 6  # 6x6 grid membutuhkan 18 pasangan
    elif level == 'hard':
        pair_count = 8  # 8x8 grid membutuhkan 32 pasangan
    else:
        pair_count = 8  # Default ke level 'easy'

    # Pastikan jumlah gambar mencukupi untuk pasangan yang dibutuhkan
    if len(all_images) < pair_count:
        print("[WARNING] Jumlah gambar yang tersedia kurang dari pasangan yang dibutuhkan.")
        pair_count = len(all_images)  # Gunakan semua gambar yang tersedia

    # Ambil gambar acak untuk dijadikan pasangan
    selected_images = random.sample(all_images, pair_count)
    image_pairs = selected_images * 2  # Gandakan untuk membuat pasangan
    random.shuffle(image_pairs)  # Acak urutan gambar

    print(f"Pasangan gambar untuk level {level}:", image_pairs)
    return image_pairs

# Route untuk halaman utama
@app.route('/')
def index():
    return render_template('index.html')

# Route untuk halaman level
@app.route('/level')
def level():
    return render_template('level.html')

# Route untuk petunjuk
@app.route('/instructions')
def instructions():
    return render_template('instruction.html')

@app.route('/goodbye')
def goodbye():
    return render_template('goodbye.html')

# Route untuk halaman game berdasarkan level
@app.route('/game/<level>')
def game(level):
    valid_levels = ['easy', 'medium', 'hard']
    if level not in valid_levels:
        abort(404, description="Level tidak valid")

    # Dapatkan pasangan gambar sesuai dengan level
    image_pairs = get_random_image_pairs(level)
    if not image_pairs:
        return "Tidak ada gambar yang tersedia untuk permainan.", 500

    return render_template('game.html', level=level, images=image_pairs)

# Route untuk melayani gambar statis (mengambil gambar dari folder 'static/images/')
@app.route('/static/images/<filename>')
def serve_image(filename):
    image_folder = os.path.join(app.static_folder, 'images')
    return send_from_directory(image_folder, filename)

@app.route('/submit_score', methods=['POST'])
def submit_score():
    data = request.get_json()
    score = data.get('score')
    level = data.get('level', 'easy')

    if level not in top_scores:
        return jsonify({"error": "Level tidak valid"}), 400

    # Simpan skor
    top_scores[level].append(score)
    top_scores[level] = sorted(top_scores[level], reverse=True)[:10]

    print(f"Skor terbaru di level {level}: {top_scores[level]}")  # Debugging

    return jsonify({"message": "Skor berhasil disimpan!", "score": score}), 200


if __name__ == '__main__':
    app.run(debug=True)
