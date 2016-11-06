var gameOfLife = {
    width: 50,
    height: 50,
    stepInterval: null,
    multicolor: false,
    mouseDown: false,

    createAndShowBoard: function() {
      //   let dimensions = window.prompt('Welcome to Conway\'s Game of Life \n\n\"Game of life is a cellular automaton devised by the British mathematician John Horton Conway in 1970. Every cell interacts with its eight neighbours, which are the cells that are horizontally, vertically, or diagonally adjacent. At each step in time, the following transitions occur:\n\nAny live cell with fewer than two live neighbours dies, as if caused by under-population.\nAny live cell with two or three live neighbours lives on to the next generation.\nAny live cell with more than three live neighbours dies, as if by over-population.\nAny dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.\"\n(https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life)\n\nThese 4 simple rules create a universe of recognizable patterns that interact with each other over generations in seemingly random ways.\n\nGo ahead and choose a grid size! \n(e.g. \'50\' for a 50 x 50 grid). Reload page to choose a new grid size.'
      // );
      //
      //   gameOfLife.width = dimensions;
      //   gameOfLife.height = dimensions;

        var goltable = document.createElement("tbody");

        // build Table HTML
        var tablehtml = '';
        for (var h = 0; h < this.height; h++) {
            tablehtml += "<tr id='row+" + h + "'>";
            for (var w = 0; w < this.width; w++) {
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


    forEachCell: function(iteratorFunc) {

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
        // document.getElementById("genDiv").addEventListener("mousedown", function(){ gameOfLife.mouseDown = true; });
        //
        // document.getElementById("genDiv").addEventListener("mouseup", function(){ gameOfLife.mouseDown = false; });

        var onMouseOver = function(e) {
          // if (gameOfLife.mousDown === true){
            if (this.getAttribute('data-status') == 'dead') {
                this.className = "alive";
                this.setAttribute('data-status', 'alive');
            } else {
                this.className = "dead";
                this.setAttribute('data-status', 'dead');
            }
          // };
        };
        this.forEachCell(function(cell) {
          cell.addEventListener("mouseover", onMouseOver);
        });
    },

    step: function() {

        var getNeighbors = function(x, y) {
            var neighbors = [];
            for (var diffx = -1; diffx <= 1; diffx++) {
                for (var diffy = -1; diffy <= 1; diffy++) {
                    if (diffx === 0 && diffy === 0) continue;

                    var newX = +x + diffx;
                    var newY = +y + diffy;
                    neighbors.push(document.getElementById(+x + diffx + "-" + newY));
                }
            }
            return neighbors;
        };

        gameOfLife.forEachCell(function(cell, x, y) {
            var neighbors = getNeighbors(x, y);
            var aliveNeighbors = 0;

            neighbors.forEach(function(neighbor) {
                if (neighbor && neighbor.getAttribute('class') === "alive") aliveNeighbors++;
            });

            if (cell.className === "alive") {
                if (aliveNeighbors < 2 || aliveNeighbors > 3) {
                    cell.setAttribute("data-status", "dead");
                }
            } else if (aliveNeighbors === 3) {
                cell.setAttribute("data-status", "alive");
            }

        });

        gameOfLife.forEachCell(function(cell) {
            if (cell.getAttribute("data-status") === "alive") {
                cell.setAttribute("class", "alive");

                if (gameOfLife.multicolor) {
                  cell.setAttribute("style", gameOfLife.colorChooser());
                }
            } else {
                cell.setAttribute("class", "dead");
                cell.removeAttribute("style");
            }
        });

        var currentGen =
        document.getElementById("gen2").innerHTML;
        gameOfLife.updateGen(currentGen);
    },

    colorChooser: function(){
      var red = Math.floor(Math.random() * 255 + 1);
      var green = Math.floor(Math.random() * 255 + 1);
      var blue = Math.floor(Math.random() * 255 + 1);

      return `background-color:rgb(${red}, ${green}, ${blue});`
    },

    updateGen: function(currentGen){
      currentGen = Number(currentGen) + 1;

      var genCircles = [].slice.call(document.getElementsByClassName("generations"));

      genCircles.forEach(function(circle){ circle.innerHTML = currentGen; });
    }

};

/* ************************************** */

gameOfLife.createAndShowBoard();

document.getElementById("step_btn").onclick = gameOfLife.step;


// Settings for continuous play
var interval;
document.getElementById("play_btn").onclick =
    function() {
        interval = setInterval(gameOfLife.step, 100);
    };

// Clear board
document.getElementById("clear_btn").onclick = function() {
    clearInterval(interval);

    gameOfLife.forEachCell(function(cell) {
        cell.setAttribute("data-status", "dead");
        cell.setAttribute("class", "dead");
        cell.removeAttribute("style");
    });

    gameOfLife.updateGen(0);
};

// Reset with random display of alive vs dead elements
document.getElementById("reset_btn").onclick = function() {
    clearInterval(interval);

    gameOfLife.forEachCell(function(cell) {
        var randNum = Math.random() * 2;
        if (Math.floor(randNum) === 1) {
            cell.setAttribute("data-status", "dead");
            cell.setAttribute("class", "dead");
            cell.removeAttribute("style");
        } else {
            cell.setAttribute("data-status", "alive");
            cell.setAttribute("class", "alive");
            if (gameOfLife.multicolor) {
              cell.setAttribute("style", gameOfLife.colorChooser());
            }
        }
    });

    gameOfLife.updateGen(0);
};

document.getElementById("multicolor").onclick = function(){
  gameOfLife.multicolor = true;
};
document.getElementById("unicolor").onclick = function(){
  gameOfLife.multicolor = false;
};

var gosper = [ '24-11',
  '25-11',
  '35-11',
  '36-11',
  '23-12',
  '25-12',
  '35-12',
  '36-12',
  '1-13',
  '2-13',
  '10-13',
  '11-13',
  '23-13',
  '24-13',
  '1-14',
  '2-14',
  '9-14',
  '11-14',
  '9-15',
  '10-15',
  '17-15',
  '18-15',
  '17-16',
  '19-16',
  '17-17',
  '36-18',
  '37-18',
  '36-19',
  '38-19',
  '36-20',
  '25-23',
  '26-23',
  '27-23',
  '25-24',
  '26-25' ];

var pentadecathlon = [ '15-11',
  '16-11',
  '17-11',
  '14-12',
  '18-12',
  '13-13',
  '19-13',
  '12-15',
  '20-15',
  '12-16',
  '20-16',
  '13-18',
  '19-18',
  '14-19',
  '18-19',
  '15-20',
  '16-20',
  '17-20' ];

var pulsar = [
  "3-1",
  "4-1",
  "5-1",
  "9-1",
  "10-1",
  "11-1",
  "1-3",
  "6-3",
  "8-3",
  "13-3",
  "1-4",
  "6-4",
  "8-4",
  "13-4",
  "1-5",
  "6-5",
  "8-5",
  "13-5",
  "3-6",
  "4-6",
  "5-6",
  "9-6",
  "10-6",
  "11-6",
  "3-8",
  "4-8",
  "5-8",
  "9-8",
  "10-8",
  "11-8",
  "1-12",
  "6-12",
  "8-12",
  "13-12",
  "1-13",
  "6-13",
  "8-13",
  "13-13",
  "1-14",
  "6-14",
  "8-14",
  "13-14",
  "3-16",
  "4-16",
  "5-16",
  "9-16",
  "10-16",
  "11-16"
];

var selectPattern = function(){
  var array = window[this.id];
  array.forEach(function(xy){
    document.getElementById(xy).setAttribute("data-status", "alive");
    document.getElementById(xy).className = "alive";
  });
};

document.getElementById("gosper").addEventListener('click', selectPattern);

document.getElementById("pentadecathlon").addEventListener('click', selectPattern);
