const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { processFiles, calculateGoalsPerGame, sortPlayers, saveToJSON } = require('./processFiles');
const { generateImage } = require('./generateImage');

const app = express();
const port = 3000;

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'listas/');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname.endsWith('.txt') ? file.originalname : `${file.originalname}.txt`);
    }
});

const upload = multer({ storage });

app.post('/upload', upload.single('lista'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('Nenhum arquivo foi enviado.');
    }

    const directoryPath = path.join(__dirname, 'listas');
    const outputFilePath = path.join(__dirname, 'players.json');

    const playersData = processFiles(directoryPath);
    const playersWithGoalsPerGame = calculateGoalsPerGame(playersData);
    const sortedPlayers = sortPlayers(playersWithGoalsPerGame);
    saveToJSON(sortedPlayers, outputFilePath);

    res.status(200).send('Arquivo salvo e JSON gerado com sucesso!');
});

app.get('/image', (req, res) => {
    generateImage()
        .then((stream) => {
            res.setHeader('Content-Type', 'image/png');
            stream.pipe(res);
        })
        .catch(err => {
            console.error('Erro ao gerar a imagem:', err);
            res.status(500).send('Erro ao gerar a imagem.');
        });
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
