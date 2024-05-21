const playBoard = document.querySelector(".play-board");
const scoreElement = document.querySelector(".score");
const highScoreElement = document.querySelector(".high-score");
const controls = document.querySelectorAll(".controls i");
const modal = document.getElementById('modal');
const modalButton = document.getElementById('modalButton');
let gameOver = false;
let foodX, foodY;
let snakeX = 5, snakeY = 5;
let velocityX = 0, velocityY = 0;
let snakeBody = [];
let setIntervalId;
let score = 0;
let highScore = localStorage.getItem("high-score") || 0;
let timeoutId;
highScoreElement.innerText = `Лучший счет: ${highScore}`;
const updateFoodPosition = () => {
    foodX = Math.floor(Math.random() * 30) + 1;
    foodY = Math.floor(Math.random() * 30) + 1;
}
const handleGameOver = () => {
    clearInterval(setIntervalId);
    const modalContent = document.querySelector('.modal-content');
    modalContent.querySelector('p').innerText = 'Игра окончена! Повторить?..';
    const modalButton = document.createElement('button');
    modalButton.innerText = 'Да';
    modalButton.addEventListener('click', () => {
        location.reload();
    });
    const modalNoButton = document.createElement('button');
    modalNoButton.innerText = 'Нет';
    modalNoButton.addEventListener('click', () => {
        const modalNo = document.getElementById('modalNo');
        modalNo.style.display = 'flex';
        const audio = document.getElementById('audio');
        audio.currentTime = 0;
        audio.play();
        timeoutId = setTimeout(() => {
            window.open('', '_self', '');
            window.close();
        }, 40000);
    });
    modalContent.appendChild(modalButton);
    modalContent.appendChild(modalNoButton);
    modal.style.display = 'flex';
}
const modalNo = document.getElementById('modalNo');
modalNo.addEventListener('click', (event) => {
    if (event.target.id === 'modalNo') {
        modalNo.style.display = 'none';
        const audio = document.getElementById('audio');
        audio.pause();
        clearTimeout(timeoutId);
    }
});
const changeDirection = e => {
    if (
        (e.key === "ArrowUp" && velocityY !== 1) ||
        (e.key === "ArrowDown" && velocityY !== -1) ||
        (e.key === "ArrowLeft" && velocityX !== 1) ||
        (e.key === "ArrowRight" && velocityX !== -1)
    ) {
        if (e.key === "ArrowUp" && velocityY !== 1) {
            velocityX = 0;
            velocityY = -1;
        } else if (e.key === "ArrowDown" && velocityY !== -1) {
            velocityX = 0;
            velocityY = 1;
        } else if (e.key === "ArrowLeft" && velocityX !== 1) {
            velocityX = -1;
            velocityY = 0;
        } else if (e.key === "ArrowRight" && velocityX !== -1) {
            velocityX = 1;
            velocityY = 0;
        }
    }
}
controls.forEach(button => button.addEventListener("click", () => changeDirection({ key: button.dataset.key })));
const initGame = () => {
    if (gameOver) return handleGameOver();
    let html = `<div class="food" style="grid-area: ${foodY} / ${foodX}"></div>`;
    if (snakeX === foodX && snakeY === foodY) {
        updateFoodPosition();
        snakeBody.push([foodY, foodX]);
        score++;
        highScore = score >= highScore ? score : highScore;
        localStorage.setItem("high-score", highScore);
        scoreElement.innerText = `Счёт: ${score}`;
        highScoreElement.innerText = `Лучший счет: ${highScore}`;
    }
    snakeX += velocityX;
    snakeY += velocityY;
    for (let i = snakeBody.length - 1; i > 0; i--) {
        snakeBody[i] = snakeBody[i - 1];
    }
    snakeBody[0] = [snakeX, snakeY];
    if (snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY > 30) {
        return gameOver = true;
    }
    for (let i = 0; i < snakeBody.length; i++) {
        if (i === 0) {
            let headClass = 'head';
            if (velocityX === 1) {
                headClass += ' right';
            } else if (velocityX === -1) {
                headClass += ' left';
            } else if (velocityY === 1) {
                headClass += ' down';
            } else if (velocityY === -1) {
                headClass += ' up';
            }
            html += `<div class="${headClass}" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`;
        } else {
            html += `<div class="head-2" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`;
        }
        if (i !== 0 && snakeBody[0][1] === snakeBody[i][1] && snakeBody[0][0] === snakeBody[i][0]) gameOver = true;
    }
    playBoard.innerHTML = html;
}
updateFoodPosition();
setIntervalId = setInterval(initGame, 100);
document.addEventListener("keyup", changeDirection);