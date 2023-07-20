const btnRefresh = document.getElementById('btn_refresh');
const btnMarkers = document.querySelectorAll('.action__btn');
const btnCells = document.querySelectorAll('.gameboard__cell');
const labelCurrentTurn = document.getElementById('label_current_turn');
const labelHumanMarker = document.getElementById('label_human_marker');
const labelBotMarker = document.getElementById('label_bot_marker');
const labelHumanScore = document.getElementById('label_human_score');
const labelBotScore = document.getElementById('label_bot_score');
const labelTieScore = document.getElementById('label_tie_score');
const btnPlayersMode = document.getElementById('btn_players_mode');
const container = document.querySelector('.container');
const menu = document.querySelector('.menu');
const btnXMark = document.getElementById('btn_xmark');
const btnCircle = document.getElementById('btn_circle');
const btnXMarkIcon = document.querySelector('.btn__xmark_icon');
const btnCircleIcon = document.querySelector('.btn__circle_icon');
const results = document.querySelector('.results');
const winner = document.querySelector('.winner');
const playerWinner = document.querySelector('.player__winner');
const btnQuit = document.querySelector('.quit');
const btnNextRound = document.querySelector('.next__round');


const gameboard = (() => {
    
    let state = [null, null, null,
                 null, null, null,
                 null, null, null];
    let turn = 1;
    let tie = 0;

    const getState = () => state;
    const setState = (index, marker) => {
        state.splice(index, 1, marker);
    };

    const getTurn = () => turn;
    const setTurn = (reset) => {
        reset === true ? turn = 0 : turn++;
    };

    const getTie = () => tie;
    const setTie = () => {
        tie++;
    };
    const resetTie = () => {
        tie = 0;
    };

    const reset = () => {
        state = [null, null, null,
                 null, null, null,
                 null, null, null];
        turn = 1;
    };

    const gameOver = () => {
        return isWinner(0, 1, 2) 
        ||  isWinner(3, 4, 5) 
        ||  isWinner(6, 7, 8) 
        ||  isWinner(0, 3, 6) 
        ||  isWinner(1, 4, 7) 
        ||  isWinner(2, 5, 8) 
        ||  isWinner(0, 4, 8) 
        ||  isWinner(6, 4, 2)
        ||  isTie();   
    };

    const isWinner = (p1, p2, p3) => {
        const c1 = state[p1];
        if (c1 === null) return false;

        const c2 = state[p2];
        if (c1 !== c2) return false;

        const c3 = state[p3];
        if (c1 != c3) return false;
        
        return true;
    };

    const isTie = () => {
        for (let i = 0; i < state.length; i++) {
            if (state[i] === null) return false;
        }
        return 'Tie';
    };

    return {getState, setState, getTurn, setTurn, reset, gameOver, getTie, setTie, resetTie};
})();

const displayController = (() => {

    const updateBoard = () => {
        btnCells.forEach(element => {
            switch(gameboard.getState()[element.dataset.index]) {
                case 'X':
                    element.innerHTML = `<i class="fa-solid fa-xmark fa-xl"></i>`;
                    break;
                case 'O':
                    element.innerHTML = `<i class="fa-regular fa-circle"></i>`;
                    break;
                default:
                    element.innerHTML = ``;
            }
        });
    };

    const updateLabels = () => {
        labelHumanScore.textContent = `${human.getScore()}`;
        labelBotScore.textContent = `${cpu.getScore()}`;
        labelHumanMarker.textContent = `${human.getMarker()} (PLAYER 1)`;
        labelBotMarker.textContent = `${cpu.getMarker()} (PLAYER 2)`;
        labelTieScore.textContent = `${gameboard.getTie()}`;
        labelCurrentTurn.innerHTML = `${human.getMarker()} TURN`;
    };

    const continueGame = () => {
        results.style.display = "flex";

        btnQuit.addEventListener('click', () => {
            results.style.display = "none";
            gameboard.reset();
            gameboard.resetTie();
            human.resetScore();
            cpu.resetScore();
            human.resetMarker();
            cpu.resetMarker();
            displayController.updateLabels();
            displayController.updateBoard();
            menu.style.display = "flex";
            container.style.display = "none";
            btnXMark.style.background = "none";
            btnCircle.style.background = "none";
            btnXMarkIcon.style.color = "var(--accent-color)";
            btnCircleIcon.style.color = "var(--accent-color)";
        });

        btnNextRound.addEventListener('click', () => {
            results.style.display = "none";
            gameboard.reset();
            displayController.updateBoard();
        });
    };

    const boardOutcome = (result) => {
        if (result === true && gameboard.gameOver() === true) {
            human.setScore();
            labelHumanScore.textContent = `${human.getScore()}`;
            labelCurrentTurn.innerHTML = `${human.getMarker()} TURN`;
            winner.innerHTML = `${human.getMarker()} WON!`;
            if (human.getMarker() === 'X') {
                playerWinner.innerHTML = `<i class="fa-solid fa-xmark fa-xl"></i> TAKES THE ROUND`;
                playerWinner.style.color = 'var(--primary-color-1)';
            }

            if (human.getMarker() === 'O') {
                playerWinner.innerHTML = `<i class="fa-regular fa-circle"></i> TAKES THE ROUND`;
                playerWinner.style.color = 'var(--primary-color-2)';
            }
            continueGame();
        }

        if (result === false && gameboard.gameOver() === true) {
            cpu.setScore();
            labelCurrentTurn.innerHTML = `${human.getMarker()} TURN`;
            labelBotScore.textContent = `${cpu.getScore()}`;
            winner.innerHTML = `${cpu.getMarker()} WON!`;
            if (cpu.getMarker() === 'X') {
                playerWinner.innerHTML = `<i class="fa-solid fa-xmark fa-xl"></i> TAKES THE ROUND`;
                playerWinner.style.color = "var(--primary-color-1)";
            }

            if (cpu.getMarker() === 'O') {
                playerWinner.innerHTML = `<i class="fa-regular fa-circle"></i> TAKES THE ROUND`;
                playerWinner.style.color = "var(--primary-color-2)";
            }
            continueGame();
        }

        if (gameboard.gameOver() === 'Tie') {
            gameboard.setTie();
            labelCurrentTurn.innerHTML = `Tie!`;
            labelTieScore.textContent = `${gameboard.getTie()}`;
            labelCurrentTurn.innerHTML = `${human.getMarker()} TURN`;
            winner.innerHTML = `Tie!`;
            playerWinner.innerHTML = `WHAT A CLOSE ROUND!`;
            playerWinner.style.color = "var(--accent-color)";
            continueGame();
        }
    };

    const boardLogic = (e) => {
        switch(gameboard.getTurn() % 2 === 1) {
            case true:
                gameboard.setState(e.target.dataset.index, human.getMarker());
                gameboard.setTurn();
                displayController.updateBoard();
                labelCurrentTurn.innerHTML = `${cpu.getMarker()} TURN`;
                boardOutcome(true);
                break;

            case false:
                gameboard.setState(e.target.dataset.index, cpu.getMarker());
                gameboard.setTurn();
                displayController.updateBoard();
                labelCurrentTurn.innerHTML = `${human.getMarker()} TURN`;
                boardOutcome(false);
                break;
        }
    };

    return {updateBoard, updateLabels, boardLogic};
})();

const Player = () => {
    let score = 0;
    let marker = '';

    const getScore = () => score;
    const setScore = () => { score++; }

    const getMarker = () => marker;
    const setMarker = (selection) => {
        marker = selection;
    };

    const resetScore = () => {
        score = 0;
    };

    const resetMarker = () => {
        marker = '';
    };

    return {getScore, setScore, getMarker, setMarker, resetScore, resetMarker};
};

const human = Player();
const cpu = Player();

btnMarkers.forEach(marker => {
    marker.addEventListener('click', (e) => {
        
        if (e.target.id === 'btn_xmark') {
            btnXMark.style.background = "var(--accent-color)";
            btnCircle.style.background = "none";
            btnXMarkIcon.style.color = "var(--main-bg)";
            btnCircleIcon.style.color = "var(--accent-color)";
        }

        if (e.target.id === 'btn_circle') {
            btnXMark.style.background = "none";
            btnCircle.style.background = "var(--accent-color)"
            btnXMarkIcon.style.color = "var(--accent-color)";
            btnCircleIcon.style.color = "var(--main-bg)";
        }

        if (human.getMarker() === '' && e.target.id === 'btn_xmark') {
            human.setMarker('X');
            cpu.setMarker('O');
            displayController.updateLabels();
            return;
        }

        if (human.getMarker() === '' && e.target.id === 'btn_circle') {
            human.setMarker('O');
            cpu.setMarker('X');
            displayController.updateLabels();
            return;
        }
    });
});

btnCells.forEach(cell => {
    cell.addEventListener('click', (e) => {
        if (human.getMarker() === '' && cpu.getMarker() === '') return alert(`You need to choose your marker first!`);
        if (e.target.childNodes.length !== 0) return;
        displayController.boardLogic(e);
    });
});

btnRefresh.addEventListener('click', () => {
    gameboard.reset();
    gameboard.resetTie();
    human.resetScore();
    cpu.resetScore();
    displayController.updateLabels();
    displayController.updateBoard();
});

btnPlayersMode.addEventListener('click', () => {
    if (human.getMarker() === '' && cpu.getMarker() === '') return alert(`You need to choose your marker first!`);
    menu.style.display = "none";
    container.style.display = "grid";
});