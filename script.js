const canvas = document.getElementById('game');
const context = canvas.getContext('2d');
let speed = 6;
let tileCount = 30;
let tileSize = canvas.clientWidth/tileCount + 8;
let xDirection = 0;
let yDirection = 0;

let headX = 10;
let headY = 10;
let foodX = 5;
let foodY = 5;

const snakeParts = [];
let tailLength = 2;

class snakePart {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

const drawGame = () => {
    clearScreen();

    drawSnake();
    drawFood();

    changeSnakePosition();
    checkCollision(tileCount - 10);

    setTimeout(drawGame, 1000/speed);
}

const drawSnake = () => {
    context.fillStyle = 'navy';
    for (let i = 0; i < snakeParts.length; i++){
        let part = snakeParts[i];
        context.fillRect(part.x * tileCount, part.y * tileCount, tileSize, tileSize);
    }
    snakeParts.push(new snakePart(headX, headY));
    if (snakeParts.length > tailLength){
        snakeParts.shift();
    }

    context.fillStyle = 'midnightblue';
    context.fillRect(headX * tileCount, headY * tileCount, tileSize, tileSize);
}

const drawFood = () => {
    context.fillStyle = 'red';
    context.fillRect(foodX * tileCount, foodY * tileCount, tileSize, tileSize);
}

const clearScreen = () => {
    context.fillStyle = 'palegreen';
    context.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight)
}

const changeSnakePosition = () => {
    headX += xDirection;
    headY += yDirection;
}

const checkCollision = (max) => {
    if (foodX === headX && foodY === headY){
        foodX = Math.floor(Math.random() * max);
        foodY = Math.floor(Math.random() * max);
        tailLength++;
    }
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