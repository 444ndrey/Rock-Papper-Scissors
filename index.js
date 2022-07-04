const playerPanel = document.querySelector('.player-panel');
const playerScore = document.querySelector('#playerScore');
const computerScore = document.querySelector('#computerScore');
const playerReusltImg = document.querySelector('#playerResultImg');
const computerReusltImg = document.querySelector('#computerResultImg');
const playerResult = document.querySelector('#playerResult');
const computerResult = document.querySelector('#computerResult');
const resultMessage = document.querySelector('#game-result-message');
const turnsHistory = [];
const score = {
    player: 0,
    computer: 0
}
async function doTurn(playerTurn) {
    playerPanel.style.display = 'none';
    let computerTurn = parseFloat(Math.random() * 2).toFixed();
    computerTurn = await fetch('./elements.json')
        .then((result) => result.json())
        .then(res => {
            return Object.values(res)[computerTurn];
        });
    ComputeAndShowResult(playerTurn, computerTurn);
}

function takeRock() {
    getElementInfo('rock').then(res => {
        doTurn(res);
    });
}
function takePapper() {
    getElementInfo('papper').then(res => {
        doTurn(res);
    });
}
function takeScissors() {
    getElementInfo('scissors').then(res => {
        doTurn(res);
    });
}

async function getElementInfo(name) {
    return await fetch('./elements.json')
        .then((result) => result.json())
        .then((res => res[name]));
}

async function ComputeAndShowResult(playerTurn, computerTurn) {
    let result = 'draw';
    resultMessage.innerText = 'DRAW';
    if (playerTurn.beat == computerTurn.name) {
        result = 'win'
        resultMessage.innerText = 'YOU WIN';
    }
    if (playerTurn.name == computerTurn.beat) {
        result = 'lose'
        resultMessage.innerText = 'YOU LOSE';
    }

    await setTimeout(() => {
        playerReusltImg.classList.remove('wating-animation');
        computerReusltImg.classList.remove('wating-animation');
        if (result == 'win') {
            score.player += 1;
            playerResult.classList.add('winner');
        }
        if (result == 'lose') {
            score.computer += 1;
            computerResult.classList.add('winner');
        }
        playerScore.innerText = score.player;
        computerScore.innerText = score.computer;
        playerReusltImg.src = `img/${playerTurn.img}`
        computerReusltImg.src = `img/${computerTurn.img}`
        resultMessage.style.opacity = 100;
        turnsHistory.unshift({
            playerTurn: playerTurn,
            computerTurn: computerTurn,
            result: result
        });
        fillHistory();
    }, 500);
    setTimeout(() => {

        setupNewTurn();
    }, 1700)
}
function setupNewTurn() {
    playerPanel.style.display = 'block';
    playerReusltImg.src = `img/rock.svg`;
    computerReusltImg.src = `img/rock.svg`;
    computerResult.classList.remove('winner');
    playerResult.classList.remove('winner');
    playerReusltImg.classList.add('wating-animation');
    computerReusltImg.classList.add('wating-animation');
    resultMessage.style.opacity = 0;
}
function fillHistory() {
    if (turnsHistory.length >= 7) {
        turnsHistory.pop();
    }
    const gameHistory = document.querySelector('.game-history')
    gameHistory.innerHTML = '';
    turnsHistory.forEach(result => {
        const turnResult = document.createElement('div');
        turnResult.classList.add('game-history-item');
        const playerTurn = document.createElement('img');
        const computerTurn = document.createElement('img');

        computerTurn.src = `img/${result.computerTurn.img}`;
        playerTurn.src = `img/${result.playerTurn.img}`;

        switch (result.result) {
            case 'win':
                computerTurn.classList.add('img-loser')
                break;
            case 'lose':
                playerTurn.classList.add('img-loser')
                break;
            case 'draw':
                playerTurn.classList.add('img-loser')
                computerTurn.classList.add('img-loser')
                break;
        }

        turnResult.append(playerTurn);
        turnResult.append(computerTurn);
        gameHistory.append(turnResult);
    });
}