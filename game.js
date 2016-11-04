var gameOfLife = {
  width: 200,
  height: 200,
  stepInterval: null,

  createAndShowBoard: function () {
    // create <table> element
    let dimensions = window.prompt('Set size')
    gameOfLife.width = dimensions;
    gameOfLife.height = dimensions;
    
    var goltable = document.createElement("tbody");

    // build Table HTML
    var tablehtml = '';
    for (var h=0; h<this.height; h++) {
      tablehtml += "<tr id='row+" + h + "'>";
      for (var w=0; w<this.width; w++) {
        tablehtml += "<td data-status='dead' id='" + w + "-" + h + "'></td>";
      }
      tablehtml += "</tr>";
    }
    goltable.innerHTML = tablehtml;

    // add table to the #board element
    var board = document.getElementById('board');
    board.appendChild(goltable);

    // once html elements are added to the page, attach events to them
    this.setupBoardEvents();
  },

  forEachCell: function (iteratorFunc) {
    /*
      Write forEachCell here. You will have to visit
      each cell on the board, call the "iteratorFunc" function,
      and pass into func, the cell and the cell's x & y
      coordinates. For example: iteratorFunc(cell, x, y)
    */
    var rows = document.getElementsByTagName("TBODY")[0].children;
    rows = [].slice.call(rows);

    rows.forEach(function(row) {
      var rowCells = [].slice.call(row.children);
      rowCells.forEach(function(cell) {
        var x = cell.id.split("-")[0];
        var y = cell.id.split("-")[1];
        iteratorFunc(cell, x, y);
      })
    })


  },

  setupBoardEvents: function() {
    // each board cell has an CSS id in the format of: "x-y"
    // where x is the x-coordinate and y the y-coordinate
    // use this fact to loop through all the ids and assign
    // them "on-click" events that allow a user to click on
    // cells to setup the initial state of the game
    // before clicking "Step" or "Auto-Play"

    // clicking on a cell should toggle the cell between "alive" & "dead"
    // for ex: an "alive" cell be colored "blue", a dead cell could stay white

    // EXAMPLE FOR ONE CELL
    // Here is how we would catch a click event on just the 0-0 cell
    // You need to add the click event on EVERY cell on the board

    var onCellClick = function (e) {
      // QUESTION TO ASK YOURSELF: What is "this" equal to here?

      // how to set the style of the cell when it's clicked
      if (this.getAttribute('data-status') == 'dead') {
        this.className = "alive";
        this.setAttribute('data-status', 'alive');
      } else {
        this.className = "dead";
        this.setAttribute('data-status', 'dead');
      }
    };

    this.forEachCell(function(cell) {
      cell.onclick = onCellClick;
    });
  },

  step: function () {
    // Here is where you want to loop through all the cells
    // on the board and determine, based on it's neighbors,
    // whether the cell should be dead or alive in the next
    // evolution of the game.
    //
    // You need to:
    // 1. Count alive neighbors for all cells
    // 2. Set the next state of all cells based on their alive neighbors
    var getNeighbors = function(x, y){
      var neighbors = [];
      for (var diffx = -1; diffx <= 1; diffx++) {
        for (var diffy = -1; diffy <= 1; diffy++) {
          if (diffx === 0 && diffy === 0) continue;
          // debugger;
          var newX = +x + diffx;
          var newY = +y + diffy;
          // console.log(newX, newY);
          neighbors.push(document.getElementById(+x + diffx + "-" + newY));
        }
      }
      return neighbors;
    }

    gameOfLife.forEachCell(function(cell, x, y) {
      var neighbors = getNeighbors(x, y);
      var aliveNeighbors = 0;

      neighbors.forEach(function(neighbor){
        if (neighbor && neighbor.getAttribute('class') === "alive") aliveNeighbors++;
      });

      // gameOfLife.forEachCell(function(cell2, x2, y2) {
      //
      //
        // if((Math.abs(x-x2) <= 1) && (Math.abs(y-y2) <= 1) && cell2.getAttribute('class') === "alive" && !(x === x2 && y === y2)) {
      //     aliveNeighbors ++;
      //   }
      // });
      //   // debugger;
        if(cell.className === "alive") {
          if (aliveNeighbors < 2 || aliveNeighbors > 3) {
            cell.setAttribute("data-status", "dead");
          }
        } else if(aliveNeighbors === 3){
            cell.setAttribute("data-status", "alive");
        }


        // debugger;
    });

    gameOfLife.forEachCell(function(cell){
      if (cell.getAttribute("data-status") === "alive"){
        cell.setAttribute("class", "alive");
      } else {
        cell.setAttribute("class", "dead");
      }
    });

    // newBoard variable for next generation
    // gameOfLife.forEachCell(function(cell, x, y) {
    //   var aliveNeighbors = 0;
    //   //run for loop to find neighbor boundary
    //   debugger;
    //   for(var i = x-1; i <= x + 1; i++) {
    //     for(var j = y-1; j <= y + 1; j++) {
    //       //continue if the coordinates of the neighbor is found
    //       if(i === x && j === y) continue;
    //       var n = document.getElementById(x + '-' + y);
    //       if(n === null) continue;
    //       //get number of aliveNeighbors in the current generation
    //       if(n.getAttribute === "alive") {
    //         aliveNeighbors++;
    //       }
    //     }
    //     console.log(aliveNeighbors);
    //   }


    //   //set cell status for next generation
    //   if(cell.getAttribute("data-status") === "alive") {
    //     if(aliveNeighbors < 2 || aliveNeighbors > 3) {
    //       cell.setAttribute("data-status", "dead");
    //     } else if (cell.getAttribute("data-status") === "dead" && (aliveNeighbors === 3)) {
    //       cell.setAttribute("data-status", "alive");
    //     }
    //   }
    // });
  },

  enableAutoPlay: function () {
    // Start Auto-Play by running the 'step' function
    // automatically repeatedly every fixed time interval

  }
};

  gameOfLife.createAndShowBoard();
  document.getElementById("step_btn").onclick = gameOfLife.step;
  // debugger;


  // gameOfLife.forEachCell(gameOfLife.step);

  var interval;
  document.getElementById("play_btn").onclick =
    function(){
       interval = setInterval(gameOfLife.step, 100);
  };
  document.getElementById("clear_btn").onclick = function(){
       clearInterval(interval);
       gameOfLife.forEachCell(function(cell){
         cell.setAttribute("data-status", "dead");
         cell.setAttribute("class", "dead");
       });
  };

  document.getElementById("reset_btn").onclick = function(){
       clearInterval(interval);
       gameOfLife.forEachCell(function(cell){
         var randNum = Math.random() * 2;
         if (Math.floor(randNum) === 1){
           cell.setAttribute("data-status", "dead");
           cell.setAttribute("class", "dead");
         } else {
           cell.setAttribute("data-status", "alive");
           cell.setAttribute("class", "alive");
         }
       });
  };
