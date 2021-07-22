'use strict';

var eltr = document.querySelector('.create-arr');
var timerP = document.querySelector('#timer');
var timeStart;
var ginterval;
const NORMAL = '😃';
const LOSE = '🤯';
const WIN = '😎';
var gBoard = [];
var numsArr1;
var numsArr2;

var gGame = {
  isOn: false,
  shownCount: 0,
  markedCount: 0,
  secsPassed: 0,
  isFirstClick: 0,
};
var gLevel = { SIZE: 4, MINES: 2 };
function initGame(size, mines) {
  gGame.isFirstClick = 0;
  gBoard = [];
  if(ginterval){
    clearInterval(ginterval);
  }
  gGame.shownCount = 0;
  timerP.innerHTML = '00.000';
  gLevel = { SIZE: size, MINES: mines };
  buildBoard(gLevel.SIZE);
  minesAroundCount(gBoard);
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
        isMarked: true,
      };
    }
  }
  var arr1 = createArr(gLevel.SIZE);
  var arr2 = createArr(gLevel.SIZE);

  for (var i = 0; i < gLevel.MINES; i++) {
    var random1 = drawNum(arr1);
    var random2 = drawNum(arr2);
    gBoard[random1][random2].isMine = true;
  }
}

function renderBoard(gBoard) {
  var strHtml = '';
  for (var i = 0; i < gBoard.length; i++) {
    strHtml += '<tr>';
    for (var j = 0; j < gBoard[0].length; j++) {
      //${gBoard[i][j].isMine} ${gBoard[i][j].minesAroundCount}
      strHtml += `<td class='cell-${i}-${j}' onclick="cellClicked(this, ${i},${j})"></td>`;
    }
    strHtml += '</tr>';
  }
  eltr.innerHTML = strHtml;
}

function cellClicked(elCell, i, j) {
  if (gGame.isOn === false && gGame.isFirstClick === 0) {
    gGame.isFirstClick = 1;
    gGame.isOn = true;
    getTime();

    // if (gBoard[i][j].minesAroundCount === -1) {
    //   initGame(gLevel.SIZE, gLevel.MINES);
    //   // cellClicked(elCell, i, j);
    //   return;
    // }
  }

  if (!gGame.isOn) return;
  gBoard[i][j].isShown = true;

  var cellMAC = gBoard[i][j].minesAroundCount;
  if (cellMAC === -1) {
    // elCell.innerHTML = '💣';
    discoverAllMine();
    gameOver();
  }
  if (cellMAC != -1 && cellMAC > 0) {
    elCell.innerHTML = cellMAC;
    gGame.shownCount++;
  }

  if (cellMAC === 0) {
    negs(i, j, gBoard);
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
      if (gBoard[i][j].minesAroundCount !== 0) {
        elCell.innerHTML = gBoard[i][j].minesAroundCount;
        gGame.shownCount++;
      }
    }
  }
}

function discoverAllMine() {
  for (var i = 0; i < gBoard.length; i++) {
    for (var j = 0; j < gBoard[0].length; j++) {
      console.log(gBoard[i][j].isMine);
      if (gBoard[i][j].isMine) {
        var elCell = document.querySelector(`.cell-${i}-${j}`);
        elCell.innerHTML = '💣';
        console.log(elCell);
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
