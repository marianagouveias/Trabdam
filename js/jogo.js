let jogoEstado = 0; // 0 - Menu / 1 - Nível 1 / 2 - Nível 2 / 3 - Nível 3

const video = document.getElementById('myVideo');
const videoContainer = document.getElementById('videoContainer');

let img = {
    vidas: null,
    som: null,
    nivel1: {
        background: [],
        personagem: {
            idle: null,
            jump: null,
            walk: []
        },
        carro: null
    },
    nivel2: {
        background: [],
        personagem: {
            idle: null,
            walk: []
        },
        inimigo: {
            walk: []
        }
    },
    nivel3: {
        background: null,
        bomba: null,
        explosao: null,
        personagem: {
            idle: null,
            walk: []
        },
        aliados: []
    }
};

let som = {
    bomba: null
}

function preload() {
    // --- Imagens Gerais
    img.vidas = loadImage('../assets/life.png');
    img.som = loadImage('assets/velocidade-1.png.png');
    // --- Imagens Nível 1
    img.nivel1.background.push(loadImage('assets/background1.png'));
    img.nivel1.background.push(loadImage('assets/background2.png'));
    // Personagem
    img.nivel1.personagem.idle = loadImage('assets/idle.png');
    img.nivel1.personagem.jump = loadImage('assets/jump.png');
    img.nivel1.personagem.walkFull = loadImage('assets/walk.png');
    // Carro
    img.nivel1.carro = loadImage('assets/car_small.png');
    // --- Imagens Nível 2
    img.nivel2.background.push(loadImage('assets/campo1.png'));
    img.nivel2.background.push(loadImage('assets/campo2.png'));
    img.nivel2.background.push(loadImage('assets/campo3.png'));
    // Personagem
    img.nivel2.personagem.idle = loadImage('assets/parado.png');
    img.nivel2.personagem.walkFull = loadImage('assets/run.png');
    // Inimigo
    img.nivel2.inimigo.walkFull = loadImage('assets/advrun.png');
    // --- Imagens Nível 3
    img.nivel3.background = loadImage('assets/floresta.png');
    img.nivel3.bomba = loadImage('assets/bomba.png');
    img.nivel3.explosao = loadImage('assets/explosion.png');
    // Personagem
    img.nivel3.personagem.idle = loadImage('assets/solidle.png');
    img.nivel3.personagem.walkFull = loadImage('assets/solwalk.png');
    // Aliados
    img.nivel3.aliados.push(loadImage('assets/soldado2.png'));
    img.nivel3.aliados.push(loadImage('assets/bubba.png'));
    // --- Sons
    som.bomba = loadSound('assets/bomba.mp3');
}

async function setup() {
    createCanvas(920, 430);
    img.vidas.resize(0, height / 15);
    img.som.resize(0, height / 15);
    setupMenu();
    // Nivel 1
    await resizeNivel1();
    await setupNivel1();
    // Nivel 2
    await resizeNivel2();
    await setupNivel2();
    // Nivel 3
    await resizeNivel3();
    await setupNivel3();
}

function draw() {
    imageMode(CORNER);
    if (jogoEstado == 0) { // Menu
        drawMenu();
    } else if (jogoEstado == 1) { // Nível 1
        drawNivel1();
    } else if (jogoEstado == 2) { // Nível 2
        drawNivel2();
    } else if (jogoEstado == 3) { // Nível 3
        drawNivel3();
    }
    somButton.display();
}

function mouseClicked() {
    if (jogoEstado == 0) { // Menu
        clickMenu();
    } else if (jogoEstado == 1) { // Nível 1
        clickNivel1();
    } else if (jogoEstado == 2) { // Nível 2
        clickNivel2();
    } else if (jogoEstado == 3) { // Nível 3
        clickNivel3();
    }

    if(somButton.clicked()) {
        somButton.active = !somButton.active;
        if(somButton.active) {
            somButton.img = img.vidas;
        } else {
            somButton.img = img.som;
        }
    }
}

function keyPressed() {
    if (jogoEstado == 1) { // Nível 1
        keyNivel1();
    } else if (jogoEstado == 2) { // Nível 2
        keyNivel2();
    } else if (jogoEstado == 3) { // Nível 3
        keyNivel3();
    }
}

function checkCollide(obj1, obj2) {
    return (obj1.x < obj2.x + obj2.width &&
        obj1.x + obj1.width > obj2.x &&
        obj1.y < obj2.y + obj2.height &&
        obj1.y + obj1.height > obj2.y);
}

function showAndPlayVideo() {
    videoContainer.style.display = 'block';
    video.play();
}

function hideVideo() {
    video.pause();
    videoContainer.style.display = 'none';
}

video.addEventListener('ended', function() {
    video.currentTime = 0;
    hideVideo();
});