let nv1 = {
    estado: 0, // 0 - Pausa / 1 - Jogando / 2 - Perdeu / 3 - Ganhou
    vidas: 0,
    velX: 4,
    background: {
        x: 0,
        width: 0,
        nBack1: 4 // Número de vezes que o background 1 é repetido
    },
    personagem: {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        posX: 0,
        maxY: 0,
        estado: 0,
        fotograma: 0,
        frame: 0,
        frameRate: 10,
        velY: 0,
        gravidadeY: -0.5
    },
    carro: {
        x: 0,
        y: 0
    },
    nObs: 8,
    obstaculos: []
};

async function resizeNivel1() {
    // Background
    for (let i = 0; i < img.nivel1.background.length; i++) {
        img.nivel1.background[i].resize(0, height);
    }
    // Personagem
    img.nivel1.personagem.idle.resize(0, height / 5);
    img.nivel1.personagem.jump.resize(0, height / 5);
    img.nivel1.personagem.walkFull.resize(0, height / 5);
    let nWalk = 4;
    for (let i = 0; i < nWalk; i++) {
        img.nivel1.personagem.walk.push(img.nivel1.personagem.walkFull.get(
            img.nivel1.personagem.walkFull.width / nWalk * i, 0,
            img.nivel1.personagem.walkFull.width / nWalk, img.nivel1.personagem.walkFull.height
        ));
    }
}

async function setupNivel1() {
    nv1.estado = 0;
    nv1.vidas = 3;
    // --- Definir Posicoes
    nv1.personagem.x = 100;
    nv1.personagem.y = height - img.nivel1.personagem.idle.height - 50;
    nv1.personagem.posX = 0;
    nv1.personagem.width = img.nivel1.personagem.idle.width;
    nv1.personagem.height = img.nivel1.personagem.idle.height;
    nv1.personagem.maxY = nv1.personagem.y;
    nv1.background.width = nv1.background.nBack1 * img.nivel1.background[0].width + img.nivel1.background[1].width;
    nv1.background.x = 0;
    nv1.carro.x = -img.nivel1.carro.width / 2;
    nv1.carro.y = height - img.nivel1.carro.height - 50;
    // --- Definir Obstaculos
    nv1.obstaculos = [];
    for (let i = 0; i < nv1.nObs; i++) {
        let newObs = {
            x: 0,
            y: height - 50 - 20,
            width: 20,
            height: 20,
            estado: true
        }
        let check = true;
        while (check) {
            newObs.x = random(nv1.personagem.x + nv1.personagem.width, nv1.background.width - 100);
            check = false;
            for (let j = 0; j < nv1.obstaculos.length; j++) {
                if (checkCollide(newObs, nv1.obstaculos[j])) {
                    check = true;
                }
            }
        }

        nv1.obstaculos.push(newObs);
    }
}

function drawNivel1() {
    background(255);
    // Som
    if ((nv1.estado === 2 || nv1.estado === 3) && som.nivel1.isPlaying()) {
        som.nivel1.stop();
    }

    if (somButton.active && !som.nivel1.isPlaying() && nv1.estado === 1) {
        som.nivel1.loop();
    }
    // Desenhar Background
    for (let i = 0; i < nv1.background.nBack1; i++) {
        image(img.nivel1.background[0],
            nv1.background.x + i * img.nivel1.background[0].width, 0);
    }
    image(img.nivel1.background[1],
        nv1.background.x + nv1.background.nBack1 * img.nivel1.background[0].width, 0);

    // Vidas
    for (let i = 0; i < nv1.vidas; i++) {
        image(img.vidas, img.vidas.width * i, 0);
    }
    // Movimento
    movimentoNivel1();
    // Desenhar Personagem
    personagemNivel1();
    // Desenhar Carro
    image(img.nivel1.carro, nv1.carro.x + nv1.personagem.posX, nv1.carro.y);
    // Desenhar Obstáculos
    obstaculosNivel1();
    // Menu
    menuNivel1();
}

function movimentoNivel1() {
    if (nv1.estado == 1) {
        if (nv1.background.x >= -nv1.background.width + width) {
            nv1.background.x -= nv1.velX;
        } else {
            nv1.personagem.posX += nv1.velX;
        }
    }

    if (nv1.personagem.estado == 1) { // Se estiver a saltar
        nv1.personagem.y -= nv1.personagem.velY;
        nv1.personagem.velY += nv1.personagem.gravidadeY;

        if (nv1.personagem.y >= nv1.personagem.maxY) { // Se bater no chao
            nv1.personagem.estado = 0;
            nv1.personagem.velY = 0;
            nv1.personagem.y = nv1.personagem.maxY;
        }
    }
}

function personagemNivel1() {
    if (nv1.estado != 1) { // Se não estiver a jogar
        image(img.nivel1.personagem.idle, nv1.personagem.x + nv1.personagem.posX, nv1.personagem.y);
    } else if (nv1.estado == 1) {
        if (nv1.personagem.estado == 0) { // Se estiver a andar
            image(img.nivel1.personagem.walk[nv1.personagem.fotograma], nv1.personagem.x + nv1.personagem.posX, nv1.personagem.y);
            nv1.personagem.frame++;
            if (nv1.personagem.frame >= nv1.personagem.frameRate) { // Fotogramas andar
                nv1.personagem.frame = 0;
                nv1.personagem.fotograma++;
                if (nv1.personagem.fotograma >= img.nivel1.personagem.walk.length) {
                    nv1.personagem.fotograma = 0;
                }
            }
        } else if (nv1.personagem.estado == 1) { // Se estiver a saltar
            image(img.nivel1.personagem.jump, nv1.personagem.x + nv1.personagem.posX, nv1.personagem.y);
        }
    }
    // Verificar Ganhar
    if (nv1.personagem.x + nv1.personagem.posX > width) {
        nv1.estado = 3;
    }
}

function obstaculosNivel1() {
    for (let i = 0; i < nv1.obstaculos.length; i++) {
        if (nv1.obstaculos[i].estado) {
            // Desenhar
            rectMode(CORNER);
            noStroke();
            fill(20, 200, 100);
            rect(nv1.background.x + nv1.obstaculos[i].x, nv1.obstaculos[i].y,
                nv1.obstaculos[i].width, nv1.obstaculos[i].height);
            // Colisão
            let personagem = {
                x: nv1.personagem.x + nv1.personagem.posX + -nv1.background.x,
                y: nv1.personagem.y,
                width: nv1.personagem.width,
                height: nv1.personagem.height
            };
            if (checkCollide(nv1.obstaculos[i], personagem)) {
                nv1.obstaculos[i].estado = false;
                nv1.vidas--;
                if (nv1.vidas <= 0) {
                    nv1.estado = 2;
                }
            }
        }
    }
}

function menuNivel1() {
    if (nv1.estado == 2) { // Perdeste
        nivelMenu(false);
    } else if (nv1.estado == 3) { // Ganhaste   
        nivelMenu(true);
    }
}

function keyNivel1() {
    if (nv1.estado == 0 && key == " ") { // Começar Jogo
        nv1.estado = 1;
    } else if (nv1.estado == 1 && nv1.personagem.estado == 0 && key == " ") { // Saltar
        nv1.personagem.estado = 1;
        nv1.personagem.velY = 10;
    }
}

async function clickNivel1() {
    if (nv1.estado == 2 && perderButton.clicked()) {
        await setupNivel1();
        jogoEstado = 0; // Menu
    } else if (nv1.estado == 3 && ganharButton.clicked()) {
        await setupNivel1();
        jogoEstado = 2; // Nível 2
    }
}