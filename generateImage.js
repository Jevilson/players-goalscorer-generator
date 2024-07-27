const { createCanvas, loadImage, registerFont } = require('canvas');
const fs = require('fs');
const path = require('path');

function generateImage() {
    return new Promise((resolve, reject) => {
        const inputJogadores = 'players.json';
        const inputImagePath = 'modelo.png';
        const fontPath = path.join(__dirname, 'fonts', 'Montserrat-Bold.ttf'); 
        const jogadoresPath = path.join(__dirname, inputJogadores);
        const data = fs.readFileSync(jogadoresPath, 'utf8');

        const jogadores = JSON.parse(data).map(jogador => ({
            nome: jogador.nome,
            jogos: jogador.jogos,
            golsPorJogo: Math.floor(jogador.golsPorJogo),
            gols: jogador.gols
        }));

        registerFont(fontPath, { family: 'Montserrat', weight: 'bold' });

        const canvasWidth = 2160;
        const canvasHeight = 3840;
        const fontSize = 49;

        const canvas = createCanvas(canvasWidth, canvasHeight);
        const ctx = canvas.getContext('2d');

        loadImage(inputImagePath).then((image) => {
            ctx.drawImage(image, 0, 0, canvasWidth, canvasHeight);

            ctx.font = `${fontSize}px Montserrat`;
            ctx.fillStyle = 'white';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';

            const startX = 794;
            const startY = 1251;
            const offsetY = 198;

            jogadores.slice(0, 10).forEach((jogador, index) => {
                const yPosition = (startY + index * offsetY) + (index >= 5 ? 12 : 0);
                ctx.fillText(jogador.nome, startX, yPosition);
                ctx.fillText(jogador.jogos, 1425, yPosition);
                ctx.fillText(jogador.golsPorJogo, 1604, yPosition);
                ctx.fillText(jogador.gols, 1779, yPosition);
            });

            const stream = canvas.createPNGStream();
            resolve(stream);
        }).catch(err => {
            reject(err);
        });
    });
}

module.exports = { generateImage };
