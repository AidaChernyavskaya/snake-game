const canvas = document.getElementById('game');
const context = canvas.getContext('2d');
let speed = 7;
let tileCount = 30;
let tileSize = canvas.clientWidth/tileCount - 1;
let xDirection = 0;
let yDirection = 0;

let headX = 15;
let headY = 15;
let foodX = 5;
let foodY = 5;

const drawGame = () => {
    clearScreen();
    drawSnake();
    drawFood();
    changeSnakePosition();

    setTimeout(drawGame, 1000/speed);
}

const drawSnake = () => {
    context.fillStyle = 'midnightblue';
    context.fillRect(headX * tileSize, headY * tileSize, tileCount, tileCount);
}

const drawFood = () => {
    context.fillStyle = 'red';
    context.fillRect(foodX * tileSize, foodY * tileSize, tileCount, tileCount);
}

const clearScreen = () => {
    context.fillStyle = 'palegreen';
    context.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight)
}

const changeSnakePosition = () => {
    headX += xDirection;
    headY += yDirection;
}

const keyDown = (event) => {
    if (event.key === 'ArrowUp' && yDirection !== 1) {
        xDirection = 0;
        yDirection = -1;
    }
    if (event.key === 'ArrowRight' && xDirection !== -1) {
        xDirection = 1;
        yDirection = 0;
    }
    if (event.key === 'ArrowDown' && yDirection !== -1) {
        xDirection = 0;
        yDirection = 1;
    }
    if (event.key === 'ArrowLeft' && xDirection !== 1) {
        xDirection = -1;
        yDirection = 0;
    }
}

drawGame();
document.body.addEventListener('keydown', keyDown);