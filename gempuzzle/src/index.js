/* eslint-disable no-use-before-define */
/* eslint-disable no-plusplus */
/* eslint-disable no-param-reassign */
import './index.html';
import './styles/style.scss';
import render from './scripts/render';

render();
const burger = document.querySelector('.burger__container');
const wrapper = document.querySelector('.game-field__wrapper');
const settings = document.querySelector('.settings');
const startBtn = document.querySelector('.start-btn');
const stopBtn = document.querySelector('.stop-btn');
const pauseBtn = document.querySelector('.pause-btn');
const gameField = document.querySelector('.game-field');
const gameLvls = document.querySelectorAll('.game-lvl');
const steps = document.querySelector('.steps-counter__num');
const hours = document.querySelector('.hours');
const minutes = document.querySelector('.minutes');
const seconds = document.querySelector('.seconds');
const popup = document.querySelector('.popup');
const popUpCloseBtn = document.querySelector('.popup__burger__block');
const finalScore = document.querySelector('.popup__score');
const finalTime = document.querySelector('.popup__time');
const bestScoreBlock = document.querySelector('.best-score__block');
const wish = document.querySelector('.bonus__block');
const moveSoundItem = document.querySelector('.move');
const startSoundItem = document.querySelector('.start');
const soundBtn = document.querySelector('.sound');
const soundBtnIcon = document.querySelector('.sound-icon');
const bestResultsBtn = document.querySelector('.best-results-btn');
const bestResultsPopUp = document.querySelector('.best-results__popup');
const bestResultsCloseBtn = document.querySelector('.best-popup__burger__block');
const saveBtn = document.querySelector('.save-btn');
const playSaveBtn = document.querySelector('.play-save-btn');
let nonEmptyCoords = null;
let emptyCoords = null;
let timerActive;
let ableToPlay = false;
let isPaused = true;
let isRunning = false;
let firstGame = false;
let stepsNum = 0;
let soundIsOn = true;
// let cellsNumber = 0;
// let gameCells = [];
let matrix = [];
let gameHours = '';
let gameMinutes = '';
let gameSeconds = '';
const bestScore = {
  2: 1000,
  3: 1000,
  4: 1000,
  5: 1000,
  6: 1000,
  7: 1000,
  8: 1000,
  wish: "You're awesome =)",
};

const openMenu = () => {
  if (!settings.classList.contains('opened')) {
    settings.classList.add('opened');
    burger.classList.add('active');
    ableToPlay = false;
  } else {
    settings.classList.remove('opened');
    burger.classList.remove('active');
    ableToPlay = true;
  }
};

const closeMenu = () => {
  if (settings.classList.contains('opened')) {
    settings.classList.remove('opened');
    burger.classList.remove('active');
    ableToPlay = true;
  }
};
const openPopUp = () => {
  popup.classList.add('opened');
  finalScore.innerHTML = `Your score is: ${stepsNum}`;
  finalTime.innerHTML = `Your time is:
  ${gameHours < 10 ? `0${gameHours}` : gameHours}:
  ${gameMinutes < 10 ? `0${gameMinutes}` : gameMinutes}:
  ${gameSeconds < 10 ? `0${gameSeconds}` : gameSeconds}`;
};

const closePopUp = () => {
  popup.classList.remove('opened');
};

const fillBestTable = () => {
  const bests = {};
  for (let i = 2; i <= 8; i++) {
    const local = localStorage.getItem(`${i}`);
    if (local) {
      bests[i] = local;
    }
  }
  const bestSizes = Object.keys(bests);
  for (let i = 0; i < bestSizes.length; i++) {
    const field = document.querySelector([`div[data-size='${bestSizes[i]}'`]);
    field.innerHTML = `${bests[bestSizes[i]]}`;
  }
};

const openBestScoreTable = () => {
  bestResultsPopUp.classList.add('opened');
  closeMenu();
};

const closeBestScoreTable = () => {
  bestResultsPopUp.classList.remove('opened');
};

const shuffle = (arr) => {
  let j; let temp;
  for (let i = arr.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    temp = arr[j];
    arr[j] = arr[i];
    arr[i] = temp;
  }
  return arr;
};

const createArray = (numOfElements) => {
  const valuesArray = [];

  for (let i = 1; i <= numOfElements; i++) {
    valuesArray.push(i);
  }
  return valuesArray;
};

const createMatrix = (array, number) => {
  const matr = [];
  let x = 0;
  let y = 0;

  for (let i = 0; i < number; i++) {
    matr.push([]);
  }
  for (let i = 0; i < array.length; i++) {
    if (x >= number) {
      y++;
      x = 0;
    }
    matr[y][x] = array[i];
    x++;
  }
  return matr;
};

function findCoords(number, matr) {
  for (let y = 0; y < matr.length; y++) {
    for (let x = 0; x < matr[y].length; x++) {
      if (matr[y][x] === number) {
        return { x, y };
      }
    }
  }
  return null;
}

function checkMatrixIsSolvable(matr) {
  let inversions = 0;
  const arr = matr.flat();
  const cellsNumber = arr.length;
  const emptyRow = findCoords(cellsNumber, matr);
  for (let i = 0; i < arr.length; i++) {
    for (let j = arr.length; j > i; j--) {
      if (arr[j] < arr[i] && arr[i] !== arr.length) {
        inversions += 1;
      }
    }
  }
  return cellsNumber % 2 === 0
    ? checkEvenMatrixIsSolvable(inversions, emptyRow.y)
    : checkOddMatrixIsSolvable(inversions);
}
function checkEvenMatrixIsSolvable(inversions, emptyRow) {
  console.log(inversions, emptyRow);
  return (inversions + emptyRow) % 2 !== 0;
}

function checkOddMatrixIsSolvable(inversions) {
  console.log(inversions);
  return inversions % 2 === 0;
}

const createNewCells = (number, array) => {
  const fieldSize = Math.round(Math.sqrt(number));
  if (localStorage.getItem(`${fieldSize}`)) {
    const result = localStorage.getItem(`${fieldSize}`);
    bestScoreBlock.innerHTML = `Best score for ${fieldSize} x ${fieldSize} is ${result}`;
  }

  gameField.innerHTML = '';
  for (let i = 0; i < array.length; i += 1) {
    const cell = document.createElement('div');
    cell.classList.add('game-field__item');
    cell.classList.add(`game-field__item_${fieldSize}`);
    cell.setAttribute('draggable', 'false');
    cell.setAttribute('data-item', `${array[i]}`);
    cell.innerHTML = `${array[i]}`;
    gameField.append(cell);
    if (cell.dataset.item === `${number}`) {
      cell.innerHTML = '';
      cell.classList.add('blank');
    }
  }
};

const setPositionItems = (matr) => {
  const cells = document.querySelectorAll('.game-field__item');
  for (let y = 0; y < matr.length; y++) {
    for (let x = 0; x < matr[y].length; x++) {
      const value = matr[y][x];
      const node = cells[value - 1];
      const percents = 100;
      node.style.transform = `translate3D(${x * percents}%, ${y * percents}%, 0)`;
    }
  }
};
const setStepsNumber = (stepsQuantity) => `${stepsQuantity}`;

const startTimeCounter = (hour, min, sec) => {
  timerActive = setInterval(() => {
    sec += 1;
    if (sec < 10) {
      seconds.innerHTML = `0${sec}`;
    }
    if (sec >= 10) {
      seconds.innerHTML = `${sec}`;
    }
    if (sec > 59) {
      sec = 0;
      min += 1;
      seconds.innerHTML = `0${sec}`;
    }
    if (min < 10) {
      minutes.innerHTML = `0${min}`;
    }
    if (min > 10) {
      minutes.innerHTML = `${min}`;
    }
    if (min > 59) {
      hour += 1;
      min = 0;
      hours.innerHTML = `0${hour}`;
    }
    if (hour > 9) {
      hours.innerHTML = `${hour}`;
    }
    if (hour > 23) {
      hour = 0;
    }
  }, 1000);
};

const saveTimeCounter = () => {
  gameHours = +hours.innerHTML;
  gameMinutes = +minutes.innerHTML;
  gameSeconds = +seconds.innerHTML;
};

const stopTimeCounter = () => {
  hours.innerHTML = '00';
  minutes.innerHTML = '00';
  seconds.innerHTML = '00';
  steps.innerHTML = '0';
  gameHours = 0;
  gameMinutes = 0;
  gameSeconds = 0;
  stepsNum = 0;
};

const removeColor = () => {
  gameLvls.forEach((btn) => {
    if (btn.classList.contains('chosen')) btn.classList.remove('chosen');
  });
};

const handleSounds = () => {
  if (soundBtnIcon.classList.contains('muted')) {
    soundIsOn = true;
    soundBtnIcon.classList.remove('muted');
  } else {
    soundBtnIcon.classList.add('muted');
    soundIsOn = false;
  }
};

const playAudio = (audio) => {
  if (soundIsOn) {
    audio.play();
  }
};
const isValidForSwap = (coords1, coords2) => {
  const diffX = Math.abs(coords1.x - coords2.x);
  const diffY = Math.abs(coords1.y - coords2.y);
  return ((diffX === 1 || diffY === 1) && (coords1.x === coords2.x || coords1.y === coords2.y));
};

const showResult = (matr, array) => {
  const flattened = matr.flat();
  for (let i = 0; i < array.length; i++) {
    if (array[i] !== flattened[i]) {
      return false;
    }
  }
  return true;
};

const setBestScore = () => {
  wish.innerHTML = bestScore.wish;
  const localBest = localStorage.getItem(`${matrix.length}`);
  if (localBest) {
    if (stepsNum < localBest && stepsNum > 0) {
      localStorage.setItem(`${matrix.length}`, stepsNum);
    }
  } else {
    localStorage.setItem(`${matrix.length}`, stepsNum);
  }
};

function swap(coords1, coords2, matr) {
  const cellsNumber = getCellsNumber();
  const rightArray = createArray(cellsNumber);
  if (!isPaused) {
    const coords1Num = matr[coords1.y][coords1.x];
    matr[coords1.y][coords1.x] = matr[coords2.y][coords2.x];
    matr[coords2.y][coords2.x] = coords1Num;
    playAudio(moveSoundItem);
    if (showResult(matr, rightArray)) {
      ableToPlay = false;
      isRunning = false;
      clearInterval(timerActive);
      saveTimeCounter();
      openPopUp();
      setBestScore();
    }
  }
}

const startGameByMove = () => {
  if (stepsNum === 1) {
    clearInterval(timerActive);
    startTimeCounter(0, 0, 0);
    startBtn.innerHTML = 'New game';
  }
};
const handleBtnsText = () => {
  if (isRunning) {
    if (isPaused) {
      pauseBtn.innerHTML = 'Continue';
      pauseBtn.classList.add('clicked');
    } else {
      pauseBtn.innerHTML = 'Pause';
      pauseBtn.classList.remove('clicked');
    }
  }
};
function getCellsNumber() {
  const gameCells = document.querySelectorAll('.game-field__item');
  const cellsNumber = gameCells.length;
  return cellsNumber;
}

function startGame(cellsNumber) {
  const sortedArray = createArray(cellsNumber);
  createNewCells(cellsNumber, sortedArray);
  let shuffledArr = shuffle(sortedArray);
  let gameMatrix = createMatrix(shuffledArr, Math.sqrt(cellsNumber));
  let solvable = checkMatrixIsSolvable(gameMatrix);
  while (!solvable) {
    solvable = checkMatrixIsSolvable(gameMatrix);
    shuffledArr = shuffle(shuffledArr);
    gameMatrix = createMatrix(shuffledArr, Math.sqrt(cellsNumber));
  }
  return gameMatrix;
}

const playSavedGame = () => {
  isPaused = false;
  ableToPlay = true;
  isRunning = true;
  const cellsNumber = getCellsNumber();
  const savedGame = localStorage.getItem(`${cellsNumber}`);
  const savedObj = JSON.parse(savedGame);
  matrix = savedObj.matrix;
  stepsNum = savedObj.stepsNum;
  gameHours = savedObj.gameHours;
  gameMinutes = savedObj.gameMinutes;
  gameSeconds = savedObj.gameSeconds;
  steps.innerHTML = setStepsNumber(stepsNum);
  setPositionItems(matrix);
  clearInterval(timerActive);
  startTimeCounter(gameHours, gameMinutes, gameSeconds);
  handleBtnsText();
};

gameLvls.forEach((btn) => {
  btn.addEventListener('click', () => {
    firstGame = false;
    isPaused = false;
    ableToPlay = true;
    handleBtnsText();
    startBtn.innerHTML = 'Shuffle and start';
    removeColor();
    btn.classList.add('chosen');
    closeMenu();
    stepsNum = 0;
    const rows = btn.innerHTML[0] * 1;
    const cellsNumber = rows ** 2;
    matrix = startGame(cellsNumber);
    setPositionItems(matrix);
    startGameByMove();
    if (localStorage.getItem(`${rows}`)) {
      const result = localStorage.getItem(`${rows}`);
      bestScoreBlock.innerHTML = `Best score for ${rows} x ${rows} is ${result}`;
    } else {
      bestScoreBlock.innerHTML = '';
    }
    clearInterval(timerActive);
    stopTimeCounter();
  });
});

startBtn.addEventListener('click', () => {
  ableToPlay = true;
  isRunning = true;
  isPaused = false; // check
  firstGame = false;
  stepsNum = 0;
  steps.innerHTML = setStepsNumber(stepsNum);
  startBtn.innerHTML = 'New game';
  const cellsNumber = getCellsNumber();
  matrix = startGame(cellsNumber);
  setPositionItems(matrix);
  clearInterval(timerActive);
  stopTimeCounter();
  startTimeCounter(0, 0, 0);
  closePopUp();
  playAudio(startSoundItem);
  handleBtnsText();
});

pauseBtn.addEventListener('click', () => {
  if (isRunning) {
    if (isPaused) {
      isPaused = false;
      handleBtnsText();
      clearInterval(timerActive);
      startTimeCounter(gameHours, gameMinutes, gameSeconds);
    } else {
      isPaused = true;
      handleBtnsText();
      saveTimeCounter();
      clearInterval(timerActive);
    }
  }
});

stopBtn.addEventListener('click', () => {
  isRunning = true;
  isPaused = false;
  stepsNum = 0;
  handleBtnsText();
  clearInterval(timerActive);
  saveTimeCounter();
  stopTimeCounter();
  handleBtnsText();
});

gameField.addEventListener('mousedown', (event) => {
  const cellsNumber = getCellsNumber();
  const nonEmptyCell = event.target.closest('.game-field__item');
  const empty = gameField.lastChild;
  if (!nonEmptyCell || nonEmptyCell === empty) {
    return;
  }
  const nonEmptyCellNum = Number(nonEmptyCell.dataset.item);
  const emptyCellNum = cellsNumber;
  nonEmptyCoords = findCoords(nonEmptyCellNum, matrix);
  emptyCoords = findCoords(emptyCellNum, matrix);
  const isValid = isValidForSwap(nonEmptyCoords, emptyCoords);
  if (isValid && ableToPlay && !isPaused) {
    nonEmptyCell.setAttribute('draggable', 'true');
    empty.setAttribute('draggable', 'false');
    nonEmptyCell.classList.add('moving');
  } else {
    nonEmptyCell.setAttribute('draggable', 'false');
  }
});

gameField.addEventListener('mousemove', (event) => {
  const cellsNumber = getCellsNumber();
  const nonEmptyCell = event.target.closest('.game-field__item');
  const empty = gameField.lastChild;
  if (!nonEmptyCell || nonEmptyCell === empty) {
    return;
  }
  const nonEmptyCellNum = Number(nonEmptyCell.dataset.item);
  const emptyCellNum = cellsNumber;
  nonEmptyCoords = findCoords(nonEmptyCellNum, matrix);
  emptyCoords = findCoords(emptyCellNum, matrix);
  const isValid = isValidForSwap(nonEmptyCoords, emptyCoords);
  if (isValid && ableToPlay && !isPaused) {
    nonEmptyCell.classList.add('valid');
  } else {
    nonEmptyCell.classList.add('invalid');
  }
});
gameField.addEventListener('dragend', (event) => {
  event.preventDefault();
  if (ableToPlay) {
    isRunning = true;
    swap(nonEmptyCoords, emptyCoords, matrix);
    stepsNum += 1;
    steps.innerHTML = stepsNum;
    startGameByMove();
    setPositionItems(matrix);
    event.target.classList.remove('moving');
  }
});
gameField.addEventListener('mouseout', (event) => {
  const nonEmptyCell = event.target.closest('.game-field__item');
  nonEmptyCell.classList.remove('valid');
  nonEmptyCell.classList.remove('invalid');
});

gameField.addEventListener('click', (event) => {
  const cellsNumber = getCellsNumber();
  const nonEmptyCell = event.target.closest('.game-field__item');
  if (!nonEmptyCell) {
    return;
  }
  const nonEmptyCellNum = Number(nonEmptyCell.dataset.item);
  const emptyCellNum = cellsNumber;
  nonEmptyCoords = findCoords(nonEmptyCellNum, matrix);
  emptyCoords = findCoords(emptyCellNum, matrix);
  const isValid = isValidForSwap(nonEmptyCoords, emptyCoords);
  if (isValid && ableToPlay && !isPaused) {
    isRunning = true;
    stepsNum += 1;
    steps.innerHTML = setStepsNumber(stepsNum);
    startGameByMove();
    swap(nonEmptyCoords, emptyCoords, matrix);
    event.target.classList.remove('moving');
    setPositionItems(matrix);
  }
});

saveBtn.addEventListener('click', () => {
  const cellsNumber = getCellsNumber();
  saveTimeCounter();
  localStorage.setItem(`${cellsNumber}`, JSON.stringify({
    matrix, stepsNum, gameHours, gameMinutes, gameSeconds,
  }));
});

playSaveBtn.addEventListener('click', () => {
  playSavedGame();
});

window.onload = function () {
  ableToPlay = true;
  isPaused = false;
  firstGame = true;
  clearInterval(timerActive);
  const cellsNumber = 16;
  matrix = startGame(cellsNumber);
  setPositionItems(matrix);
  startGameByMove();
  fillBestTable();
  if (localStorage.getItem(`${cellsNumber}`)) {
    playSaveBtn.style.display = 'block';
  }
};

bestResultsBtn.addEventListener('click', openBestScoreTable);
popUpCloseBtn.addEventListener('click', closePopUp);
bestResultsCloseBtn.addEventListener('click', closeBestScoreTable);
wrapper.addEventListener('click', closeMenu);
burger.addEventListener('click', openMenu);
soundBtn.addEventListener('click', handleSounds);

// function handleDrop() {
//   const cells = document.querySelectorAll('.game-field__item');
//   cells.forEach((cell) => {
//     cell.addEventListener('dragstart', (event) => {
//       if (event.target !== cell) {
//         console.log('no');
//       } else {
//         console.log('dragstart', event.target);
//       }
//     });
//     cell.addEventListener('dragend', (event) => {
//       console.log('dragend', event.target);
//       if (ableToPlay && event.target === cell) {
//         swap(nonEmptyCoords, emptyCoords, matrix);
//         stepsNum += 1;
//         steps.innerHTML = stepsNum;
//         if (stepsNum === 1) {
//           startTimeCounter(0, 0, 0);
//         }
//         setPositionItems(matrix);
//       }
//       cell.setAttribute('draggable', 'false');
//     });
//   });
// }

// const draggedItem = null;
// let droppedItem = null;

// gameCells.forEach((item) => {
//   item.addEventListener('dragstart', handleDragstart);
//   item.addEventListener('dragend', handleDragend);
//   item.addEventListener('drag', handleDrag);
//   item.addEventListener('dragenter', () => {
//     if (draggedItem !== droppedItem) { droppedItem = item; }
//   });
//   item.addEventListener('dragleave', () => {
//     droppedItem = null;
//   });
// });

/// //////////////////////////////////////////////////////

/// ////////////////////////////////////////////////

// class Game {
//   constructor(number) {
//     this.rows = number;
//     this.cols = number;
//     this.cells = this.cols * this.rows;
//     this.array = [];
//     this.shuffledArr = [];
//     this.timerActive = 0;
//     this.seconds = 0;
//     this.minutes = 0;
//     this.hours = 0;
//   }

//   createArray() {
//     for (let i = 1; i <= this.cells; i++) {
//       this.array.push(i);
//     }
//     return this.array;
//   }

//   shuffle() {
//     for (let i = 1; i <= this.cells; i++) {
//       this.shuffledArr.push(i);
//     }
//     let j; let temp;
//     for (let i = this.shuffledArr.length - 1; i > 0; i--) {
//       j = Math.floor(Math.random() * (i + 1));
//       temp = this.shuffledArr[j];
//       this.shuffledArr[j] = this.shuffledArr[i];
//       this.shuffledArr[i] = temp;
//     }
//     return this.shuffledArr;
//   }

//   getSeconds() {
//     this.seconds += 1;
//     return this.seconds;
//   }

//   saveTimeCounter() {
//     if (this.minutes === 0 && this.hours === 0) {
//       return (this.seconds > 9 ? `${this.seconds} sec` : `0${this.seconds} sec`);
//     }
//     if (this.hours === 0) {
//       return (`0${this.minutes} min, 0${this.seconds} sec`);
//     }

//     return (`0${this.hours} hours, 0${this.minutes} min, 0${this.seconds} sec`);
//   }

//   stopTimeCounter() {
//     this.hours = 0;
//     this.minutes = 0;
//     this.seconds = 0;
//   }
// }

// gameLvls.forEach((btn) => {
//   btn.addEventListener('click', () => {
//     newGameLvl = btn.innerHTML[0] * 1;

//     console.log(newGameLvl);

//   });
// });

// console.log(newGameLvl);

// const newGame = new Game(newGameLvl);
// console.log(newGame);

// function startTimeCounter() {
//   timerActive = setInterval(() => {
//     newGame.getSeconds();
//     if (newGame.seconds < 10) {
//       seconds.innerHTML = `0${newGame.seconds}`;
//     }
//     if (newGame.seconds > 10) {
//       seconds.innerHTML = `${newGame.seconds}`;
//     }
//     if (newGame.seconds > 59) {
//       newGame.seconds = 0;
//       newGame.minutes += 1;
//       seconds.innerHTML = `0${newGame.seconds}`;
//       minutes.innerHTML = `0${newGame.minutes}`;
//     }
//     if (newGame.minutes >= 10) {
//       minutes.innerHTML = `${newGame.minutes}`;
//     }
//     if (newGame.minutes >= 59) {
//       newGame.hours += 1;
//       newGame.minutes = 0;
//       hours.innerHTML = `0${newGame.hours}`;
//     }
//     if (newGame.hours > 9) {
//       hours.innerHTML = `${newGame.hours}`;
//     }
//     if (newGame.hours > 23) {
//       newGame.hours = 0;
//     }
//   }, 1000);
// }

// const openMenu = () => {
//   settings.classList.toggle('opened');
//   burger.classList.toggle('active');
// };

// wrapper.addEventListener('click', openMenu);
// burger.addEventListener('click', openMenu);

// startBtn.addEventListener('click', () => {
//   console.log(newGame);
//   startTimeCounter();
// });

// stopBtn.addEventListener('click', () => {
//   clearInterval(timerActive);
//   newGame.stopTimeCounter();
//   hours.innerHTML = '00';
//   minutes.innerHTML = '00';
//   seconds.innerHTML = '00';
// });
