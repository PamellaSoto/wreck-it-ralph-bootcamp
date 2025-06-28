const state = {
    view: {
        cards: document.querySelectorAll('.card'),
        timer: document.querySelector('#game-timer'),
        score: document.querySelector('#game-score'),
        lifesIcons: Array.from(document.querySelectorAll('.lifes-image'))
    },
    values: {
        score: 0,
        sessionTime: 60,
        gameVelocity: {
            easy: 1500,
            medium: 1000,
            hard: 150
        },
        enemyCount: 0,
        lifes: 3
    }
};

let gameSession = null;

function gameStart(difficulty) {
    document.querySelector('#new-game').classList.add('hidden');
    setupCardHitBox();
    state.view.timer.textContent = "00:" + state.values.sessionTime;
    loadTimer();
    gameSession = setInterval(createEnemy, state.values.gameVelocity[difficulty]);
}

function setupCardHitBox() {
    state.view.cards.forEach((card) => {
        card.addEventListener('click', () => {
            card.classList.contains('enemy') ? clickedOnEnemy(card) : clickedOnFoe();
        });
    });
}

function createEnemy() {
    const randIndex = Math.floor(Math.random() * state.view.cards.length);
    const card = state.view.cards[randIndex];
    if (!card.classList.contains('enemy')) {
        card.classList.add('enemy');
        state.values.enemyCount += 1;
    }
    
    checkEnemyCount();
}

function checkEnemyCount() {
    if (state.values.enemyCount >= 9) {
        lostGame("Too many enemies!<br>Your score: " + state.values.score);
    }
}

function updateScore() {
    state.view.score.textContent = state.values.score
}

function clickedOnEnemy(card) {
    card.classList.remove('enemy');
    state.values.score += 1;
    state.values.enemyCount -= 1;
    updateScore();
}

function clickedOnFoe() {
    let lifesTotal= state.values.lifes -= 1;
    state.view.lifesIcons[lifesTotal].remove()
    
    console.log(state.values.lifes)
    if (state.values.lifes === 0) {
        lostGame("No more lives!<br>Your score: " + state.values.score);
    }
}

function loadTimer() {
    const timerInterval = setInterval(() => {
        state.values.sessionTime--;

        if (state.values.sessionTime >= 0) {
            state.view.timer.textContent = "00:" + String(state.values.sessionTime).padStart(2, '0');
        }

        if (state.values.sessionTime <= 0) {
            clearInterval(timerInterval);
            lostGame("Time's over!\nYour score: " + state.values.score);
        }
    }, 1000);
}

function lostGame(message) {
    setTimeout(() => clearInterval(gameSession), 2000);
    document.querySelector('#game-over').classList.remove('hidden');
    document.querySelector('#game-over p').innerHTML = message;
}