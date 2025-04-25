document.addEventListener('DOMContentLoaded', () => {
    const gameBoard = document.getElementById('game-board');
    const timeSpan = document.getElementById('time');
    const scoreSpan = document.getElementById('score');
    // const winMessage = document.getElementById('win-message');
    const continueButton = document.getElementById('continue-button');
    const scoreboardButton = document.getElementById('scoreboard-button');
    const stopGameButton = document.getElementById('stop-game');
    const stopPopup = document.getElementById('stop-popup');
    const resumeGameButton = document.getElementById('resume-game');
    const restartGameButton = document.getElementById('restart-game');
    const exitGameButton = document.getElementById('exit-game');
    const finalScoreSpan = document.getElementById('final-score');

    let revealedCards = [];
    let score = 0;
    let timer = 120;
    let timerInterval;
    const bonusPerSecond = 5; // Bonus skor per detik tersisa
    const baseScorePerMatch = 10;

    // Cek skor sebelumnya dari Local Storage
    if (localStorage.getItem('savedScore')) {
        score = parseInt(localStorage.getItem('savedScore'));
        scoreSpan.textContent = score;
    }

    // Ambil level dari URL
    const level = window.location.pathname.split('/')[2];

    // Level konfigurasi
    const levelConfig = {
        easy: { gridSize: 4, pairCount: 8 },
        medium: { gridSize: 6, pairCount: 18 },
        hard: { gridSize: 8, pairCount: 32 }
    };

    const { gridSize, pairCount } = levelConfig[level] || levelConfig.easy;

    initGame();

    function initGame() {
        setupGameBoard(gridSize);
        startTimer();
        // winMessage.style.display = 'none';
    }

    function setupGameBoard(size) {
        gameBoard.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
        gameBoard.style.gridTemplateRows = `repeat(${size}, 1fr)`;

        const images = generateImages(pairCount);
        const shuffledImages = shuffle([...images, ...images]);

        shuffledImages.forEach((image) => {
            const card = createCard(image);
            gameBoard.appendChild(card);
        });
    }

    function createCard(image) {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.image = image;

        const img = document.createElement('img');
        img.src = `/static/images/${image}`;
        img.classList.add('card-image', 'hidden');

        card.appendChild(img);

        card.addEventListener('click', () => handleCardClick(card));
        return card;
    }

    function handleCardClick(card) {
        if (card.classList.contains('revealed') || revealedCards.length === 2) return;

        const img = card.querySelector('.card-image');
        img.classList.remove('hidden');
        card.classList.add('revealed');
        revealedCards.push(card);

        if (revealedCards.length === 2) {
            const [first, second] = revealedCards;
            if (first.dataset.image === second.dataset.image) {
                handleMatch();
            } else {
                handleMismatch();
            }
        }
    }

    function handleMatch() {
        score += baseScorePerMatch;
        scoreSpan.textContent = score;
        revealedCards = [];
        checkWinCondition();
    }

    function handleMismatch() {
        setTimeout(() => {
            revealedCards.forEach(card => {
                card.classList.remove('revealed');
                card.querySelector('.card-image').classList.add('hidden');
            });
            revealedCards = [];
        }, 1000);
    }

    function generateImages(pairCount) {
        return Array.from({ length: pairCount }, (_, i) => `image${i + 1}.jpg`);
    }

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function startTimer() {
        timerInterval = setInterval(() => {
            timer--;
            timeSpan.textContent = timer;

            if (timer === 0) {
                clearInterval(timerInterval);
                alert('Waktu habis!');
                shuffleUnmatchedCards();
                resetTimer();
            }
        }, 1000);
    }

    function submitScore(finalScore) {
        fetch("/submit_score", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                score: finalScore,
                level: level,  // Kirim level yang diambil dari URL
            })
        })
        .then(response => response.json())
        .then(data => {
            console.log(data.message);
            finalScoreSpan.textContent = finalScore;
            winMessage.style.display = 'block';
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    }

    function resetTimer() {
        timer = 120;
        startTimer();
    }

    function checkWinCondition() {
        const totalPairs = document.querySelectorAll('.card').length / 2;
        const matchedPairs = document.querySelectorAll('.card.revealed').length / 2;

        if (matchedPairs === totalPairs) {
            endGame();
        }
    }

    function endGame() {
        clearInterval(timerInterval); // Hentikan timer
        const bonusScore = timer * bonusPerSecond; // Hitung skor bonus
        score += bonusScore; // Tambahkan bonus skor
        scoreSpan.textContent = score;
    
        // Simpan skor ke server
        submitScore(score);
    
        // Simpan skor ke Local Storage
        localStorage.setItem('savedScore', score);
    
        // Tampilkan pesan kemenangan
        finalScoreSpan.textContent = score;
        document.getElementById('win-message').style.display = 'block'; // Tampilkan pop-up
    }
    

    if (!stopGameButton || !stopPopup || !resumeGameButton || !restartGameButton || !exitGameButton || !continueButton || !scoreboardButton) {
        console.error('Some buttons or elements are missing in the DOM!');
        return;
    }

    // Event listeners
    stopGameButton.addEventListener('click', () => {
        clearInterval(timerInterval); // Hentikan timer
        stopPopup.style.display = 'block'; // Tampilkan pop-up
    });
    

    resumeGameButton.addEventListener('click', () => {
        stopPopup.style.display = 'none';
        startTimer();
    });

    restartGameButton.addEventListener('click', () => {
        window.location.reload();
    });

    exitGameButton.addEventListener('click', () => {
        window.location.href = '/';
    });

    continueButton.addEventListener('click', () => {
        window.location.reload();
    });

    scoreboardButton.addEventListener('click', () => {
        window.location.href = '/scoreboard';
    });
});
