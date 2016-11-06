var gameOfLife = {
    width: 50,
    height: 50,
    stepInterval: null,

    createAndShowBoard: function() {
        // let dimensions = window.prompt('Set grid size \n(e.g. \'20\' for a 20 x 20 grid)');
        // gameOfLife.width = dimensions;
        // gameOfLife.height = dimensions;

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

        var onCellClick = function(e) {
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
        }

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
            } else {
                cell.setAttribute("class", "dead");
            }
        });

        var currentGen =
        document.getElementById("gen2").innerHTML;
        gameOfLife.updateGen(currentGen);
    },

    updateGen: function(currentGen){
      currentGen = Number(currentGen) + 1;

      var genCircles = [].slice.call(document.getElementsByClassName("generations"));

      genCircles.forEach(function(circle){ circle.innerHTML = currentGen; })
    },

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
        } else {
            cell.setAttribute("data-status", "alive");
            cell.setAttribute("class", "alive");
        }
    });

    gameOfLife.updateGen(0);
};
