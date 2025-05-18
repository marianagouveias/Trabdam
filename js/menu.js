let titleMenu = "Forrest Gump";
let nivelButton = [];
let ganharButton, perderButton;
let somButton;

function setupMenu() {
    let nNiveis = 3;
    for (let i = 1; i <= nNiveis; i++) { // Criar 3 botões Nivel
        nivelButton.push(new Button(
            width / (nNiveis + 1) * i, height / 2,
            150, 50,
            "Nível " + i,
            color(100, 150, 255),
            color(255),
            i
        ));
    }
    ganharButton = new Button(width / 2, height / 2 + 50,
        150, 50,
        "Continuar",
        color(100, 150, 255),
        color(255),
        0);
    perderButton = new Button(width / 2, height / 2 + 50,
        150, 50,
        "Sair",
        color(100, 150, 255),
        color(255),
        0);
    somButton = new ImageButton(width - img.som.width/2 - 10, img.som.height/2 + 10,
        img.som.width, img.som.height,
        img.som,
        0);
}

function drawMenu() {
    background(255, 0, 0);
    textAlign(CENTER, CENTER);
    textSize(40);
    text(titleMenu, width / 2, 100);

    for (let i = 0; i < nivelButton.length; i++) {
        nivelButton[i].display();
    }
}

function nivelMenu(resultado) {
    fill(255);
    rectMode(CENTER);
    rect(width / 2, height / 2, width / 2, height / 2, 24);
    fill(0);
    textSize(24);
    if (resultado) {
        text("Ganhaste!", width / 2, height / 2 - ganharButton.height);
        ganharButton.display();
    } else {
        text("Perdeste :(", width / 2, height / 2 - perderButton.height);
        perderButton.display();
    }
}

function clickMenu() {
    for (let i = 0; i < nivelButton.length; i++) {
        if (nivelButton[i].clicked()) {
            jogoEstado = nivelButton[i].id;
            break;
        }
    }
}

