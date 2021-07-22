'use strict';

var eltr = document.querySelector('.create-arr');
var elTimerP = document.querySelector('#timer');
var elLivesP = document.querySelector('#lives');
var timeStart;
var ginterval;
const NORMAL = '😃';
const LOSE = '🤯';
const WIN = '😎';
var gBoard = [];
var numsArr1;
var numsArr2;
var lives = 3;
var elSmile = document.querySelector('.smile');
var gGame = {
  isOn: false,
  shownCount: 0,
  markedCount: 0,
  secsPassed: 0,
  isFirstClick: 0,
};
var gLevel = { SIZE: 4, MINES: 2 };
function initGame(size, mines) {
  elSmile.innerHTML = NORMAL;

  gGame.isFirstClick = 0;
  gGame.isOn = false;
  gBoard = [];
  if (ginterval) {
    clearInterval(ginterval);
  }
  lives = 3;
  elLivesP.innerHTML = `${lives} lives left `;
  gGame.shownCount = 0;
  elTimerP.innerHTML = '00.000';
  gLevel = { SIZE: size, MINES: mines };
  buildBoard(gLevel.SIZE);
  renderBoard(gBoard);
}

function buildBoard(num) {
  for (let i = 0; i < num; i++) {
    gBoard.push([]);
    for (let j = 0; j < num; j++) {
      gBoard[i][j] = {
        minesAroundCount: 4,
        isShown: false,
        isMine: false,
        isMarked: false,
      };
    }
  }
}

function renderBoard(gBoard) {
  var strHtml = '';
  for (var i = 0; i < gBoard.length; i++) {
    strHtml += '<tr>';
    for (var j = 0; j < gBoard[0].length; j++) {
      //${gBoard[i][j].isMine} ${gBoard[i][j].minesAroundCount}
      strHtml += `<td class='cell-${i}-${j}' oncontextmenu="cellRightClick(this, ${i},${j})" onclick="cellClicked(this, ${i},${j})"></td>`;
    }
    strHtml += '</tr>';
  }
  eltr.innerHTML = strHtml;
}

function cellRightClick(elCell, i, j) {
  if (elCell.innerHTML === '🚩') {
    elCell.innerHTML = '';
    gBoard[i][j].isMarked = false;
    gGame.markedCount--;
  } else {
    elCell.innerHTML = '🚩';
    gBoard[i][j].isMarked = true;
    gGame.markedCount++;
  }
  if (gGame.shownCount + gGame.markedCount === gLevel.SIZE ** 2) {
    console.log('you win');
    elSmile.innerHTML = WIN;
    gameOver();
  }
}

function cellClicked(elCell, i, j) {
  if (gGame.isOn === false && gGame.isFirstClick === 0) {
    var arr1 = createArr(gLevel.MINES);
    var arr2 = createArr(gLevel.MINES);

    for (var x = 0; x < gLevel.MINES; x++) {
      var random1 = drawNum(arr1);
      var random2 = drawNum(arr2);
      gBoard[random1][random2].isMine = true;
    }

    minesAroundCount(gBoard);
    renderBoard(gBoard);
    gGame.isFirstClick = 1;
    gGame.isOn = true;
    getTime();
    var elCell = document.querySelector(`.cell-${i}-${j}`);
    elCell.classList.add('isShown');
  }

  if (!gGame.isOn) return;
  if (gBoard[i][j].isMarked) return;

  var cellMAC = gBoard[i][j].minesAroundCount;
  if (cellMAC === -1) {
    lives--;
    elLivesP.innerHTML = `${lives} lives left `;
    gGame.isOn = true;
    if (lives <= 0) {
      elSmile.innerHTML = LOSE;
      discoverAllMine();
      gameOver();
    }
  }

  if (cellMAC != -1 && cellMAC > 0) {
    elCell.innerHTML = cellMAC;
  }
  if (!gBoard[i][j].isShown && !gBoard[i][j].isMine) {
    gBoard[i][j].isShown = true;
    gGame.shownCount++;
    elCell.classList.add('isShown');
  }

  if (cellMAC === 0) {
    negs(i, j, gBoard);
  }

  if (gGame.shownCount + gGame.markedCount === gLevel.SIZE ** 2) {
    console.log('you win');
    elSmile.innerHTML=WIN;
    gameOver();
  }
}

function negs(cellI, cellJ, mat) {
  if (mat[cellI][cellJ].isMine) return -1;
  for (var i = cellI - 1; i <= cellI + 1; i++) {
    if (i < 0 || i >= mat.length) continue;
    for (var j = cellJ - 1; j <= cellJ + 1; j++) {
      if (j < 0 || j >= mat[i].length) continue;
      if (i === cellI && j === cellJ) continue;
      var elCell = document.querySelector(`.cell-${i}-${j}`);
      if (gBoard[i][j].minesAroundCount !== 0 && !gBoard[i][j].isMarked) {
        elCell.innerHTML = gBoard[i][j].minesAroundCount;
      }
      if (
        !gBoard[i][j].isShown &&
        !gBoard[i][j].isMine &&
        !gBoard[i][j].isMarked
      ) {
        gBoard[i][j].isShown = true;
        gGame.shownCount++;
        elCell.classList.add('isShown');
      }
    }
  }
}

function discoverAllMine() {
  for (var i = 0; i < gBoard.length; i++) {
    for (var j = 0; j < gBoard[0].length; j++) {
      if (gBoard[i][j].isMine) {
        var elCell = document.querySelector(`.cell-${i}-${j}`);
        elCell.innerHTML = '💣';
      }
    }
  }
}

function minesAroundCount(gBoard) {
  for (var i = 0; i < gBoard.length; i++) {
    for (var j = 0; j < gBoard[0].length; j++) {
      var negs = blowUpNegs(i, j, gBoard);
      gBoard[i][j].minesAroundCount = negs;
    }
  }
}

function blowUpNegs(cellI, cellJ, mat) {
  var count = 0;
  if (mat[cellI][cellJ].isMine) return -1;
  for (var i = cellI - 1; i <= cellI + 1; i++) {
    if (i < 0 || i >= mat.length) continue;
    for (var j = cellJ - 1; j <= cellJ + 1; j++) {
      if (j < 0 || j >= mat[i].length) continue;
      if (i === cellI && j === cellJ) continue;
      if (mat[i][j].isMine) {
        count++;
      }
    }
  }
  return count;
}

function gameOver() {
  console.log('Game Over');
  gGame.isOn = false;
  clearInterval(ginterval);
}
