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

let score = 0;
let highScore = 2;
let currentScoreElem = document.getElementById('current_score');
let highScoreElem = document.getElementById('high_score');

class snakePart {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

const drawGame = () => {
    changeSnakePosition();

    let result = isGameOver();
    if (result) {return;}

    clearScreen();

    drawSnake();
    drawFood();
    drawCurrentScore();
    drawHighScore();

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

const drawCurrentScore = () => {
    currentScoreElem.innerHTML = String(score);
}

const drawHighScore = () => {
    let highScore = localStorage.getItem('highScore');
    if (highScore === null) {
        localStorage.setItem('highScore', '0');
    }
    if (score > Number(highScore)) {
        highScoreElem.innerHTML = String(score);
        localStorage.setItem('highScore', JSON.stringify(score));
    } else {
        highScoreElem.innerHTML = highScore;
    }
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
        score++;
    }
}

const isGameOver = () => {
    let gameOver = false;
    if (yDirection === 0 && xDirection === 0) {return false}
    if (headX < 0 || headY < 0 || headX === tileCount - 10 || headY === tileCount - 10) {gameOver = true}

    for (let i = 0; i < snakeParts.length; i++){
        let part = snakeParts[i];
        if (part.x === headX && part.y === headY){
            gameOver = true;
            break;
        }
    }

    if (gameOver) {
        context.fillStyle = 'black';
        context.font = '48px sans-serif';
        context.fillText('Конец игры!', canvas.clientWidth / 4, canvas.clientHeight / 2)
    }
    return gameOver;
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