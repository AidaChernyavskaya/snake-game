const canvas = document.getElementById('game');
const context = canvas.getContext('2d');
let speed = 7;
let tileCount = 30;
let tileSize = canvas.clientWidth/tileCount - 2;

let headX = 15;
let headY = 15;

const drawGame = () => {
    clearScreen();
    drawSnake();

    setTimeout(drawGame, 1000/speed);
}

const drawSnake = () => {
    context.fillStyle = 'midnightblue';
    context.fillRect(headX * tileSize, headY * tileSize, tileCount, tileCount);
}

const clearScreen = () => {
    context.fillStyle = 'palegreen';
    context.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight)
}

drawGame();