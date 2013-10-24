function GameOfLife(width,height) {
  this.width = width;
  this.height = height;
}

GameOfLife.prototype.createAndShowBoard = function () {
  var goltable = document.createElement("table");
  var tablehtml = '';
  
  for (var h=0; h<this.height; h++) {
    tablehtml += "<tr id='row+" + h + "'>";
    for (var w=0; w<this.width; w++) {
      tablehtml += "<td id='" + w + "-" + h + "'></td>";
    }
    tablehtml += "</tr>";
  }
  
  goltable.innerHTML = tablehtml;
  var board = document.getElementById('board');
  board.appendChild(goltable);
  this.setupBoardEvents();
};

GameOfLife.prototype.coordinateHelper = function(coordArr) {
  if(coordArr) {
    return {x: coordArr[0], y: coordArr[1]};
  } else {
    return false;
  }
};

GameOfLife.prototype.setupBoardEvents = function() {
  // each board cell has an CSS id in the format of: "x-y" 
  // where x is the x-coordinate and y the y-coordinate
  // use this fact to loop through all the ids and assign
  // them "on-click" events that allow a user to click on 
  // cells to setup the initial state of the game
  // before clicking "Step" or "Auto-Play"
  
  // clicking on a cell should toggle the cell between "alive" & "dead"
  // for ex: an "alive" cell be colored "blue", a dead cell could stay white
  
  // for example, here is how we would catch a click event on just the 0-0 cell
  // you need to do something like this for EVERY cell 
  
  var onCellClick = function (e) {
    // coordinates of cell, in case you need them
    var coord_array = this.id.split('-');
    var coord_hash = {x: coord_array[0], y: coord_array[1]};
    
    // how to set the style of the cell when it's clicked
    this.style.backgroundColor = "lightblue";
  };
  
  var cell00 = document.getElementById('0-0');
  cell00.onclick = onCellClick;
};

GameOfLife.prototype.step = function () {
  // Here is where you want to loop through all the cells
  // on the board and determine, based on it's neighbors,
  // whether the cell should be dead or alive in the next
  // evolution of the game
};

startGame = function () {
  var gol = new GameOfLife(20,20);
  gol.createAndShowBoard();
};

startGame();