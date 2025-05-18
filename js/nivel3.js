let nv3 = {
    estado: 0, // 0 - Pausa / 1 - Jogando / 2 - Perdeu / 3 - Ganhou
    vidas: 0,
    vel: 4,
    background: {
        x: 0,
        width: 0,
        nBack: 5
    },
    nObs: 8,
    obstaculos: [],
    explosao: [],
    obstaculosInfo: {
        width: 0,
        height: 0
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
    nAliados: 0,
    aliadosApanhados: 0,
    aliados: []
};

async function resizeNivel3() {
    // Background
    img.nivel3.background.resize(0, height);
    img.nivel3.bomba.resize(0, height / 6);
    img.nivel3.explosao.resize(0, height / 6);
    // Personagem
    img.nivel3.personagem.idle.resize(0, height / 5);
    img.nivel3.personagem.walkFull.resize(0, height / 5);
    let nWalk = 4;
    for (let i = 0; i < nWalk; i++) {
        img.nivel3.personagem.walk.push(img.nivel3.personagem.walkFull.get(
            img.nivel3.personagem.walkFull.width / nWalk * i, 0,
            img.nivel3.personagem.walkFull.width / nWalk, img.nivel3.personagem.walkFull.height
        ));
    }
    // Aliados
    img.nivel3.aliados[0].resize(height / 5, 0);
    img.nivel3.aliados[1].resize(0, height / 5);
}

async function setupNivel3() {
    nv3.vidas = 3;
    nv3.estado = 0;
    nv3.background.x = 0;
    nv3.obstaculosInfo.width = img.nivel3.bomba.width;
    nv3.obstaculosInfo.height = img.nivel3.bomba.height;
    nv3.background.width = img.nivel3.background.width * nv3.background.nBack;
    nv3.obstaculos = [];
    for (let i = 0; i < nv3.nObs; i++) {
        newBomba();
    }
    // Personagem
    nv3.personagem.x = nv3.personagem.maxX;
    nv3.personagem.y = height - img.nivel3.personagem.idle.height - 25;
    nv3.personagem.posX = 0;
    nv3.personagem.width = img.nivel3.personagem.idle.width;
    nv3.personagem.height = img.nivel3.personagem.idle.height;
    // Aliados
    nv3.aliados = [];
    nv3.nAliados = 4;
    nv3.aliadosApanhados = 0;
    for (let i = 0; i < nv3.nAliados - 1; i++) {
        nv3.aliados.push({
            tipo: 0, // 0 - Normal / 1 - Bubba
            x: random(nv3.personagem.x + nv3.personagem.width + 50, nv3.background.width - img.nivel3.bomba.width),
            y: height - img.nivel3.aliados[0].height - 25,
            width: img.nivel3.aliados[0].width,
            height: img.nivel3.aliados[0].height,
            estado: true
        });
    }
    nv3.aliados.push({
        tipo: 1, // 0 - Normal / 1 - Bubba
        x: random(nv3.personagem.x + nv3.personagem.width + 50, nv3.background.width - img.nivel3.bomba.width),
        y: height - img.nivel3.aliados[1].height - 25,
        width: img.nivel3.aliados[1].width,
        height: img.nivel3.aliados[1].height,
        estado: true
    });
}

function drawNivel3() {
    background(255);
    // Desenhar Background
    for (let i = 0; i < nv3.background.nBack; i++) {
        image(img.nivel3.background,
            nv3.background.x + i * img.nivel3.background.width, 0);
    }
    // Vidas
    for (let i = 0; i < nv3.vidas; i++) {
        image(img.vidas, img.vidas.width * i, 0);
    }
    // Movimento
    movimentoNivel3();
    // Personagem
    personagemNivel3();
    // Aliados
    desenharAliados();
    // Bombas
    desenhaBomba();
    // Menu
    menuNivel3();
}

function personagemNivel3() {
    if (nv3.estado != 1) { // Se não estiver a jogar
        image(img.nivel3.personagem.idle, nv3.personagem.x + nv3.personagem.posX, nv3.personagem.y);
    } else if (nv3.estado == 1) {
        image(img.nivel3.personagem.walk[nv3.personagem.fotograma], nv3.personagem.x + nv3.personagem.posX, nv3.personagem.y);
        nv3.personagem.frame++;
        if (nv3.personagem.frame >= nv3.personagem.frameRate) { // Fotogramas andar
            nv3.personagem.frame = 0;
            nv3.personagem.fotograma++;
            if (nv3.personagem.fotograma >= img.nivel1.personagem.walk.length) {
                nv3.personagem.fotograma = 0;
            }
        }
    }
}

function movimentoNivel3() {
    if (nv3.estado == 1) {
        if (keyIsPressed === true) {
            if (keyCode == LEFT_ARROW) {
                if (nv3.personagem.posX > nv3.personagem.maxX) {
                    nv3.personagem.posX = max(nv3.personagem.posX - nv3.vel, nv3.personagem.maxX);
                } else {
                    nv3.background.x = min(nv3.background.x + nv3.vel, 0);
                }
            } else if (keyCode == RIGHT_ARROW) {
                if (nv3.background.x > -nv3.background.width + width) {
                    nv3.background.x = max(nv3.background.x - nv3.vel, -nv3.background.width + width);
                } else {
                    nv3.personagem.posX = min(nv3.personagem.posX + nv3.vel, width - nv3.personagem.width);
                }
            }
        }
        if (nv3.personagem.posX >= width - nv3.personagem.width) {
            nv3.estado = 3;
        }
    }
}

function desenharAliados() {
    for (let i = 0; i < nv3.aliados.length; i++) {
        if (nv3.aliados[i].estado) {
            if (nv3.aliados[i].tipo == 0) {
                image(img.nivel3.aliados[0], nv3.background.x + nv3.aliados[i].x, nv3.aliados[i].y);
            } else {
                image(img.nivel3.aliados[1], nv3.background.x + nv3.aliados[i].x, nv3.aliados[i].y);
            }
            // Colisão
            let personagem = {
                x: nv3.personagem.x + nv3.personagem.posX + -nv3.background.x,
                y: nv3.personagem.y,
                width: nv3.personagem.width,
                height: nv3.personagem.height
            };
            if (checkCollide(nv3.aliados[i], personagem)) {
                nv3.aliados[i].estado = false;
                nv3.aliadosApanhados++;
            }
        }
    }

    if (nv3.aliadosApanhados >= nv3.nAliados) {
        nv3.estado = 3;
    }
}

function desenhaBomba() {
    for (let i = nv3.obstaculos.length - 1; i >= 0; i--) {
        // Desenhar
        image(img.nivel3.bomba, nv3.background.x + nv3.obstaculos[i].x, nv3.obstaculos[i].y);
        // Movimento
        nv3.obstaculos[i].y += nv3.obstaculos[i].vel;
        if (nv3.obstaculos[i].y > height - 100) {
            newExplosao(nv3.obstaculos[i]);
            nv3.obstaculos.splice(i, 1);
        } else {
            // Colisão
            let personagem = {
                x: nv3.personagem.x + nv3.personagem.posX + -nv3.background.x,
                y: nv3.personagem.y,
                width: nv3.personagem.width,
                height: nv3.personagem.height
            };
            if (nv3.estado == 1 && checkCollide(nv3.obstaculos[i], personagem)) {
                newExplosao(nv3.obstaculos[i]);
                nv3.obstaculos.splice(i, 1);
                nv3.obstaculos[i].estado = false;
                nv3.vidas--;
                if (nv3.vidas <= 0) {
                    nv3.estado = 2;
                }
            }
        }
    }
    if (nv3.obstaculos.length < nv3.nObs) {
        newBomba();
    }

    // Desenha Explosoes
    for (let i = nv3.explosao.length - 1; i >= 0; i--) {
        // Desenhar
        image(img.nivel3.explosao, nv3.background.x + nv3.explosao[i].x, nv3.explosao[i].y);
        nv3.explosao[i].frame++;
        if (nv3.explosao[i].frame >= nv3.explosao[i].frameMax) {
            nv3.explosao.splice(i, 1);
        }
    }
}

function newBomba() {
    nv3.obstaculos.push({
        x: random(nv3.personagem.x + nv3.personagem.width + 50, nv3.background.width - img.nivel3.bomba.width),
        y: -nv3.obstaculosInfo.height,
        width: nv3.obstaculosInfo.width,
        height: nv3.obstaculosInfo.height,
        vel: random(1, 4)
    });
}

function newExplosao(bomba) {
    nv3.explosao.push({
        x: bomba.x,
        y: bomba.y,
        frame: 0,
        frameMax: 20
    });
    if (somButton.active) {
        som.bomba.play();
    }
}

function keyNivel3() {
    if (nv3.estado == 0 && key == " ") { // Começar Jogo
        nv3.estado = 1;
    }
}

function menuNivel3() {
    if (nv3.estado == 2) { // Perdeste
        nivelMenu(false);
    } else if (nv3.estado == 3) { // Ganhaste   
        nivelMenu(true);
    }
}

async function clickNivel3() {
    if (nv3.estado == 2 && perderButton.clicked()) {
        await setupNivel3();
        jogoEstado = 0; // Menu
    } else if (nv3.estado == 3 && ganharButton.clicked()) {
        await setupNivel3();
        jogoEstado = 0; // Menu
        showAndPlayVideo();
    }
}