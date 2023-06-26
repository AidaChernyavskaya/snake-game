const canvas = document.getElementById('game');
const context = canvas.getContext('2d');
let speed = 6;
let tileCount = 30;
let tileSize = canvas.clientWidth/tileCount + 10;
let xDirection = 0;
let yDirection = 0;
let direction = '';

let headX = 10;
let headY = 10;

const foodImg = new Image();
foodImg.src = 'images/apple.svg';
let food = {
    x: 5,
    y: 5
};

const spriteImg = new Image();
spriteImg.src = 'images/blue-snake.png';

const gameOverSound = new Audio('sounds/game-over.mp3');
const biteSound = new Audio('sounds/bite.mp3');

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
    snakeParts.push(new snakePart(headX, headY));
    for (let i = 0; i < snakeParts.length; i++){
        let part = snakeParts[i];
        if (i === 0) {
            //tale
            let pPart = snakeParts[i + 1]; // Previous snake part
            if (!pPart) {pPart = snakeParts[0]}
            if (pPart.y < part.y) {
                context.drawImage(spriteImg, 192, 128, 64, 64, part.x * tileCount, part.y * tileCount, tileSize, tileSize);
            } else if (pPart.x > part.x) {
                context.drawImage(spriteImg, 256, 128, 64, 64, part.x * tileCount, part.y * tileCount, tileSize, tileSize);
            } else if (pPart.y > part.y) {
                context.drawImage(spriteImg, 256, 192, 64, 64, part.x * tileCount, part.y * tileCount, tileSize, tileSize);
            } else if (pPart.x < part.x) {
                context.drawImage(spriteImg, 192, 192, 64, 64, part.x * tileCount, part.y * tileCount, tileSize, tileSize);
            }
        } else if (i === snakeParts.length - 1) {
            //head
            switch (direction) {
                case 'up':
                    context.drawImage(spriteImg, 192, 0, 64, 64, headX * tileCount, headY * tileCount, tileSize, tileSize);
                    break;
                case 'down':
                    context.drawImage(spriteImg, 256, 64, 64, 64, headX * tileCount, headY * tileCount, tileSize, tileSize);
                    break;
                case 'right':
                    context.drawImage(spriteImg, 256, 0, 64, 64, headX * tileCount, headY * tileCount, tileSize, tileSize);
                    break;
                case 'left':
                    context.drawImage(spriteImg, 192, 64, 64, 64, headX * tileCount, headY * tileCount, tileSize, tileSize);
                    break;
                default:
                    context.drawImage(spriteImg, 192, 0, 64, 64, headX * tileCount, headY * tileCount, tileSize, tileSize);
            }
        } else{
            //body
            let pPart = snakeParts[i-1]; // Previous snake part
            let nPart = snakeParts[i+1]; // Next snake part
            if (!nPart) nPart = snakeParts[0];
            if (part.y === nPart.y && part.y === pPart.y) {
                context.drawImage(spriteImg, 64, 0, 64, 64, part.x * tileCount, part.y * tileCount, tileSize, tileSize);
            } else if (pPart.x < part.x && nPart.y > part.y || nPart.x < part.x && pPart.y > part.y) {
                context.drawImage(spriteImg, 128, 0, 64, 64, part.x * tileCount, part.y * tileCount, tileSize, tileSize);
            } else if (part.x === nPart.x && part.x === pPart.x) {
                context.drawImage(spriteImg, 128, 64, 64, 64, part.x * tileCount, part.y * tileCount, tileSize, tileSize);
            } else if (pPart.y < part.y && nPart.x < part.x || nPart.y < part.y && pPart.x < part.x) {
                context.drawImage(spriteImg, 128, 128, 64, 64, part.x * tileCount, part.y * tileCount, tileSize, tileSize);
            } else if (pPart.x > part.x && nPart.y < part.y || nPart.x > part.x && pPart.y < part.y) {
                context.drawImage(spriteImg, 0, 64, 64, 64, part.x * tileCount, part.y * tileCount, tileSize, tileSize);
            } else if (pPart.y > part.y && nPart.x > part.x || nPart.y > part.y && pPart.x > part.x) {
                context.drawImage(spriteImg, 0, 0, 64, 64, part.x * tileCount, part.y * tileCount, tileSize, tileSize);
            }
        }
    }
    if (snakeParts.length > tailLength){
        snakeParts.shift();
    }
}

const drawFood = () => {
    context.drawImage(foodImg, food.x * tileCount, food.y * tileCount, tileSize, tileSize);
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
    let flag = true;
    for (let i = 0; i < 30; i++) {
        flag = !flag
        for (let j = 0; j < 30; j++) {
            flag ? context.fillStyle = 'rgb(170,215,81)' : context.fillStyle = 'rgb(162,209,73)';
            context.fillRect(j * 30, i * 30, 30, 30);
            flag = !flag
        }
    }
}

const changeSnakePosition = () => {
    headX += xDirection;
    headY += yDirection;
}

const checkCollision = (max) => {
    if (food.x === headX && food.y === headY){
        biteSound.play();
        food.x = Math.floor(Math.random() * max);
        food.y = Math.floor(Math.random() * max);
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
        gameOverSound.play();
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
        direction = 'up';
    }
    if (event.key === 'ArrowRight' && xDirection !== -1) {
        xDirection = 1;
        yDirection = 0;
        direction = 'right';
    }
    if (event.key === 'ArrowDown' && yDirection !== -1) {
        xDirection = 0;
        yDirection = 1;
        direction = 'down';
    }
    if (event.key === 'ArrowLeft' && xDirection !== 1) {
        xDirection = -1;
        yDirection = 0;
        direction = 'left';
    }
}

drawGame();
document.body.addEventListener('keydown', keyDown);