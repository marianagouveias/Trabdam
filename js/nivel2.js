let nv2 = {
    estado: 0, // 0 - Pausa / 1 - Jogando / 2 - Perdeu / 3 - Ganhou
    vidas: 0,
    vel: 4,
    background: {
        x: 0,
        width: 0,
        nBack2: 2
    },
    personagem: {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        posX: 0,
        maxX: 50,
        estado: 0,
        fotograma: 0,
        frame: 0,
        frameRate: 10,
    },
    nObs: 8,
    obstaculos: [],
    obstaculosInfo: {
        width: 0,
        height: 0,
        fotograma: 0,
        frame: 0,
        frameRate: 10,
    }
};

async function resizeNivel2() {
    background(255);
    // Background
    for (let i = 0; i < img.nivel2.background.length; i++) {
        img.nivel2.background[i].resize(0, height);
    }
    // Personagem
    img.nivel2.personagem.idle.resize(0, height / 5);
    img.nivel2.personagem.walkFull.resize(0, height / 5);
    let nWalk = 3;
    for (let i = 0; i < nWalk; i++) {
        img.nivel2.personagem.walk.push(img.nivel2.personagem.walkFull.get(
            img.nivel2.personagem.walkFull.width / nWalk * i, 0,
            img.nivel2.personagem.walkFull.width / nWalk, img.nivel2.personagem.walkFull.height
        ));
    }
    // Inimigo
    nWalk = 3;
    img.nivel2.inimigo.walkFull.resize(0, height / 5);
    for (let i = 0; i < nWalk; i++) {
        img.nivel2.inimigo.walk.push(img.nivel2.inimigo.walkFull.get(
            img.nivel2.inimigo.walkFull.width / nWalk * i, 0,
            img.nivel2.inimigo.walkFull.width / nWalk, img.nivel2.inimigo.walkFull.height
        ));
    }
}

async function setupNivel2() {
    nv2.vidas = 3;
    nv2.estado = 0;
    nv2.background.x = 0;
    nv2.background.width = img.nivel2.background[0].width + img.nivel2.background[1].width * nv2.background.nBack2 + img.nivel2.background[2].width;
    // --- Personagem
    nv2.personagem.width = img.nivel2.personagem.idle.width;
    nv2.personagem.height = img.nivel2.personagem.idle.height;
    nv2.personagem.posX = nv2.personagem.maxX;
    nv2.personagem.y = height / 2 - nv2.personagem.height / 2;
    // --- Definir Obstaculos
    nv2.obstaculosInfo.width = img.nivel2.inimigo.walk[0].width;
    nv2.obstaculosInfo.height = img.nivel2.inimigo.walk[0].height;
    nv2.obstaculos = [];
    for (let i = 0; i < nv2.nObs; i++) {
        let newObs = {
            x: 0,
            y: height / 2 - nv2.obstaculosInfo.height / 2,
            width: nv2.obstaculosInfo.width,
            height: nv2.obstaculosInfo.height,
            estado: true,
            dir: null,
            vel: random(1, 6)
        }
        let check = true;
        while (check) {
            newObs.x = random(nv2.personagem.x + nv2.personagem.posX + nv2.personagem.width, nv2.background.width - 100);
            check = false;
            for (let j = 0; j < nv2.obstaculos.length; j++) {
                if (checkCollide(newObs, nv2.obstaculos[j])) {
                    check = true;
                }
            }
        }
        if (random(1) > 0.5) {
            newObs.dir = true;
        } else {
            newObs.dir = false;
        }
        nv2.obstaculos.push(newObs);
    }
}

function drawNivel2() {
    // Background
    image(img.nivel2.background[0], nv2.background.x, 0);
    for (let i = 0; i < nv2.background.nBack2; i++) {
        image(img.nivel2.background[1], nv2.background.x + img.nivel2.background[0].width + img.nivel2.background[1].width * i, 0);
    }
    image(img.nivel2.background[2], nv2.background.x + img.nivel2.background[0].width + img.nivel2.background[1].width * nv2.background.nBack2, 0);
    //Som
    if ((nv2.estado === 2 || nv2.estado === 3) && som.nivel2.isPlaying()) {
        som.nivel2.stop();
    }

    if (somButton.active && !som.nivel2.isPlaying() && nv2.estado === 1) {
        som.nivel2.loop();

    }

    // Vidas
    for (let i = 0; i < nv2.vidas; i++) {
        image(img.vidas, img.vidas.width * i, 0);
    }
    // Movimento
    movimentoNivel2();
    // Personagem
    personagemNivel2();
    // Inimigos
    inimigoNivel2();
    // Menu
    menuNivel2();
}

function movimentoNivel2() {
    if (nv2.estado == 1) {
        if (keyIsPressed === true) {
            if (keyCode == UP_ARROW) {
                nv2.personagem.y = max(nv2.personagem.y - nv2.vel, 0);
            } else if (keyCode == DOWN_ARROW) {
                nv2.personagem.y = min(nv2.personagem.y + nv2.vel, height - nv2.personagem.height);
            } else if (keyCode == LEFT_ARROW) {
                if (nv2.personagem.posX > nv2.personagem.maxX) {
                    nv2.personagem.posX = max(nv2.personagem.posX - nv2.vel, nv2.personagem.maxX);
                } else {
                    nv2.background.x = min(nv2.background.x + nv2.vel, 0);
                }
            } else if (keyCode == RIGHT_ARROW) {
                if (nv2.background.x > -nv2.background.width + width) {
                    nv2.background.x = max(nv2.background.x - nv2.vel, -nv2.background.width + width);
                } else {
                    nv2.personagem.posX = min(nv2.personagem.posX + nv2.vel, width - nv2.personagem.width);
                }
            }
        }
        if (nv2.personagem.posX >= width - nv2.personagem.width) {
            nv2.estado = 3;
        }
    }
}

function personagemNivel2() {
    if (nv2.estado != 1) {
        image(img.nivel2.personagem.idle, nv2.personagem.x + nv2.personagem.posX, nv2.personagem.y);
    } else if (nv2.estado == 1) {
        image(img.nivel2.personagem.walk[nv2.personagem.fotograma], nv2.personagem.x + nv2.personagem.posX, nv2.personagem.y);
        nv2.personagem.frame++;
        if (nv2.personagem.frame >= nv2.personagem.frameRate) { // Fotogramas andar
            nv2.personagem.frame = 0;
            nv2.personagem.fotograma++;
            if (nv2.personagem.fotograma >= img.nivel2.personagem.walk.length) {
                nv2.personagem.fotograma = 0;
            }
        }
    }
}

function inimigoNivel2() {
    for (let i = 0; i < nv2.obstaculos.length; i++) {
        if (nv2.obstaculos[i].estado) {
            // Desenhar Inimigo
            image(img.nivel2.inimigo.walk[nv2.obstaculosInfo.fotograma], nv2.background.x + nv2.obstaculos[i].x, nv2.obstaculos[i].y);
            // Movimento Inimigo
            if (nv2.obstaculos[i].dir) {
                nv2.obstaculos[i].y += nv2.obstaculos[i].vel;
                if (nv2.obstaculos[i].y > height - nv2.obstaculosInfo.height) {
                    nv2.obstaculos[i].dir = false;
                }
            } else {
                nv2.obstaculos[i].y -= nv2.obstaculos[i].vel;
                if (nv2.obstaculos[i].y < 0) {
                    nv2.obstaculos[i].dir = true;
                }
            }
            // Colisao Inimigo
            let personagem = {
                x: nv2.personagem.x + nv2.personagem.posX + -nv2.background.x,
                y: nv2.personagem.y,
                width: nv2.personagem.width,
                height: nv2.personagem.height
            };
            if (nv2.estado == 1 && checkCollide(nv2.obstaculos[i], personagem)) {
                nv2.obstaculos[i].estado = false;
                nv2.vidas--;
                if (nv2.vidas <= 0) {
                    nv2.estado = 2;
                }
            }
        }
    }
    // Fotogramas andar
    nv2.obstaculosInfo.frame++;
    if (nv2.obstaculosInfo.frame >= nv2.obstaculosInfo.frameRate) {
        nv2.obstaculosInfo.frame = 0;
        nv2.obstaculosInfo.fotograma++;
        if (nv2.obstaculosInfo.fotograma >= img.nivel2.inimigo.walk.length) {
            nv2.obstaculosInfo.fotograma = 0;
        }
    }
}

function menuNivel2() {
    if (nv2.estado == 2) { // Perdeste
        nivelMenu(false);
    } else if (nv2.estado == 3) { // Ganhaste   
        nivelMenu(true);
    }
}

function keyNivel2() {
    if (nv2.estado == 0 && key == " ") { // Começar Jogo
        nv2.estado = 1;
    }
}

async function clickNivel2() {
    if (nv2.estado == 2 && perderButton.clicked()) {
        await setupNivel2();
        jogoEstado = 0; // Menu
    } else if (nv2.estado == 3 && ganharButton.clicked()) {
        await setupNivel2();
        jogoEstado = 3; // Nível 2
    }
}