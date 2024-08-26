let gameOver = false;
let score = 0;
let speed = 0.1;
let speedIncrease = 0.0001; 
const platformSize = 5; 
const initialObstacleDistance = 20; 
const obstacleSpacing = 10; 


const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 5, 10); 
camera.lookAt(0, 0, 0); 

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);


const platformGeometry = new THREE.PlaneGeometry(platformSize * 2, 100); 
const platformMaterial = new THREE.MeshBasicMaterial({ color: 0x333333, side: THREE.DoubleSide });
const platform = new THREE.Mesh(platformGeometry, platformMaterial);
platform.rotation.x = Math.PI / 2;
platform.position.y = -0.5;
scene.add(platform);


const playerGeometry = new THREE.BoxGeometry();
const playerMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const player = new THREE.Mesh(playerGeometry, playerMaterial);
scene.add(player);


const obstacles = [];
for (let i = 0; i < 5; i++) {
    const obstacleGeometry = new THREE.BoxGeometry();
    const obstacleMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const obstacle = new THREE.Mesh(obstacleGeometry, obstacleMaterial);
    obstacle.position.set((Math.random() - 0.5) * 10, 0, -initialObstacleDistance - i * obstacleSpacing);
    scene.add(obstacle);
    obstacles.push(obstacle);
}


function updateScore() {
    document.getElementById('score').innerText = `Score: ${score}`;
}


function checkCollision() {
    for (let i = 0; i < obstacles.length; i++) {
        const distance = player.position.distanceTo(obstacles[i].position);
        if (distance < 1) {
            gameOver = true;
            document.getElementById('game-over').style.display = 'block';
            document.getElementById('restart').style.display = 'block';
            return;
        }
    }
}


let playerSpeed = 0.2; 


let moveLeft = false;
let moveRight = false;


function animate() {
    if (gameOver) return;

    requestAnimationFrame(animate);

    for (let i = 0; i < obstacles.length; i++) {
        obstacles[i].position.z += speed;

        if (obstacles[i].position.z > player.position.z) {
            obstacles[i].position.z = -initialObstacleDistance - (obstacles.length - 1) * obstacleSpacing;
            obstacles[i].position.x = (Math.random() - 0.5) * 10;
            score++;
            updateScore();
        }
    }

    speed += speedIncrease;

    
    if (moveLeft) {
        player.position.x -= playerSpeed;
    }
    if (moveRight) {
        player.position.x += playerSpeed;
    }

    
    if (player.position.x < -platformSize) {
        player.position.x = -platformSize;
    } else if (player.position.x > platformSize) {
        player.position.x = platformSize;
    }

    checkCollision();

    renderer.render(scene, camera);
}
animate();


document.addEventListener('keydown', (event) => {
    if (!gameOver) {
        if (event.key === 'ArrowLeft') {
            moveLeft = true; 
        } else if (event.key === 'ArrowRight') {
            moveRight = true; 
        }
    }
});


document.addEventListener('keyup', (event) => {
    if (!gameOver) {
        if (event.key === 'ArrowLeft') {
            moveLeft = false; 
        } else if (event.key === 'ArrowRight') {
            moveRight = false; 
        }
    }
});


document.getElementById('restart').addEventListener('click', () => {
    gameOver = false;
    score = 0;
    speed = 0.1;
    updateScore();

    document.getElementById('game-over').style.display = 'none';
    document.getElementById('restart').style.display = 'none';

    player.position.set(0, 0, 0);
    for (let i = 0; i < obstacles.length; i++) {
        obstacles[i].position.set((Math.random() - 0.5) * 10, 0, -initialObstacleDistance - i * obstacleSpacing);
    }

    animate();
});