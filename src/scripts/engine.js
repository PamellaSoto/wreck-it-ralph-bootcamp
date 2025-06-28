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
            easy: 700,
            medium: 390,
            hard: 250
        },
        lifes: 3
    }
};

let gameSession = null;
let timerInterval = null;

function gameStart(difficulty) {
    document.querySelector('#new-game').classList.add('hidden');
    setupCardHitBox();
    state.view.timer.textContent = "00:" + String(state.values.sessionTime).padStart(2, '0');
    loadTimer();
    gameSession = setInterval(createEnemy, state.values.gameVelocity[difficulty]);
}

function loadTimer() {
    timerInterval = setInterval(() => {
        state.values.sessionTime--;

        if (state.values.sessionTime >= 0) {
            state.view.timer.textContent = "00:" + String(state.values.sessionTime).padStart(2, '0');
        }

        if (state.values.sessionTime <= 0) {
            clearInterval(timerInterval);
            clearInterval(gameSession);
            lostGame("Time's over!<br>Your score: " + state.values.score);
        }
    }, 1000);
}

function setupCardHitBox() {
    state.view.cards.forEach((card) => {
        card.addEventListener('click', () => {
            card.classList.contains('enemy') ? clickedOnEnemy(card) : clickedOnFoe();
        });
    });
}

function createEnemy() {
    const availableCards = Array.from(state.view.cards).filter(
        card => !card.classList.contains('enemy')
    );

    if (availableCards.length === 0) {
        clearInterval(gameSession);
        clearInterval(timerInterval);
        lostGame("Too many enemies!<br>Your score: " + state.values.score);
    }
    const randIndex = Math.floor(Math.random() * availableCards.length);
    const card = availableCards[randIndex];
    card.classList.add('enemy');
    
}

function updateScore() {
    state.view.score.textContent = state.values.score
}

function clickedOnEnemy(card) {
    card.classList.remove('enemy');
    state.values.score += 1;
    updateScore();
}

function clickedOnFoe() {
    let lifesTotal= state.values.lifes -= 1;
    state.view.lifesIcons[lifesTotal].remove()
    
    console.log(state.values.lifes)
    if (state.values.lifes === 0) {
        clearInterval(gameSession);
        clearInterval(timerInterval);
        lostGame("No more lives!<br>Your score: " + state.values.score);
    }
}

function lostGame(message) {
    setTimeout(() => clearInterval(gameSession), 2000);
    document.querySelector('#game-over').classList.remove('hidden');
    document.querySelector('#game-over p').innerHTML = message;
}