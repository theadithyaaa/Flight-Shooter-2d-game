const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const playerImg = new Image();
playerImg.src = "./imgs/plane.png"; 

const enemyImg = new Image();
enemyImg.src = "./imgs/enemy_plane.png"; 

const player = {
    x: canvas.width / 2 - 40,
    y: canvas.height - 100,
    width: 70,
    height: 50,
    speed: 10,
    bullets: []
};

const enemies = [];
const enemySpeed = 2;
let score = 0;

function shootBullet() {
    player.bullets.push({
        x: player.x + player.width / 2 - 5,
        y: player.y,
        width: 10,
        height: 20,
        color: "yellow"
    });
}

function spawnEnemy() {
    const size = 80; 
    enemies.push({
        x: Math.random() * (canvas.width - size),
        y: -size,
        width: size,
        height: size
    });
}

function isColliding(rect1, rect2) {
    return (
        rect1.x < rect2.x + rect2.width &&
        rect1.x + rect1.width > rect2.x &&
        rect1.y < rect2.y + rect2.height &&
        rect1.y + rect1.height > rect2.y
    );
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.drawImage(playerImg, player.x, player.y, player.width, player.height);

    player.bullets.forEach((bullet, index) => {
        bullet.y -= 5;
        if (bullet.y + bullet.height < 0) {
            player.bullets.splice(index, 1);
        }
        ctx.fillStyle = bullet.color;
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    });

    enemies.forEach((enemy, index) => {
        enemy.y += enemySpeed;
        if (enemy.y > canvas.height) {
            enemies.splice(index, 1);
        }
        ctx.drawImage(enemyImg, enemy.x, enemy.y, enemy.width, enemy.height);

        player.bullets.forEach((bullet, bulletIndex) => {
            if (isColliding(bullet, enemy)) {
                enemies.splice(index, 1);
                player.bullets.splice(bulletIndex, 1);
                score++;
            }
        });

        if (isColliding(enemy, player)) {
            alert(`Game Over! Your score: ${score}`);
            document.location.reload();
        }
    });

    ctx.fillStyle = "black";
    ctx.font = "20px Arial";
    ctx.fillText(`Score: ${score}`, 10, 30);

    requestAnimationFrame(gameLoop);
}

document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft" && player.x > 0) {
        player.x -= player.speed;
    } else if (e.key === "ArrowRight" && player.x + player.width < canvas.width) {
        player.x += player.speed;
    } else if (e.key === " " || e.key === "Spacebar") {
        shootBullet();
    }
});

setInterval(spawnEnemy, 1000);

playerImg.onload = () => {
    enemyImg.onload = () => {
        gameLoop();
    };
};
