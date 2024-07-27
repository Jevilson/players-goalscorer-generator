const fs = require('fs');
const path = require('path');

function readFilesFromDirectory(directory) {
    return fs.readdirSync(directory).filter(file => path.extname(file) === '.txt');
}

function readFileContent(filePath) {
    return fs.readFileSync(filePath, 'utf-8');
}

function processFiles(directory) {
    const files = readFilesFromDirectory(directory);
    const playersCount = {};

    files.forEach(file => {
        const content = readFileContent(path.join(directory, file));
        const players = content.split('\n').map(line => line.trim()).filter(line => line !== '');

        players.forEach(playerLine => {
            const [player, goals] = playerLine.split(':');
            const goalsCount = parseInt(goals, 10);

            if (!playersCount[player]) {
                playersCount[player] = { jogos: 0, golsPorJogo: 0, gols: 0 };
            }

            playersCount[player].jogos += 1;
            playersCount[player].gols += goalsCount;
        });
    });

    return playersCount;
}

function calculateGoalsPerGame(players) {
    for (const player in players) {
        const goalsPerGame = (players[player].gols / players[player].jogos).toFixed(2);
        players[player].golsPorJogo = parseFloat(goalsPerGame);
    }
    return players;
}

function sortPlayers(players) {
    const playersArray = Object.keys(players).map(player => ({
        nome: player,
        ...players[player]
    }));

    playersArray.sort((a, b) => {
        if (b.gols === a.gols) {
            return b.jogos - a.jogos;
        }
        return b.gols - a.gols;
    });

    return playersArray;
}

function saveToJSON(data, outputFilePath) {
    fs.writeFileSync(outputFilePath, JSON.stringify(data, null, 2), 'utf-8');
}

module.exports = {
    processFiles,
    calculateGoalsPerGame,
    sortPlayers,
    saveToJSON
};
