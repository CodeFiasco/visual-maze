// Get width and height
var width = 10; // document.getElementById('width').value;
var height = 10; // document.getElementById('height').value;
var speed = 2;

var maze = new Maze(width, height);

// Create new maze path
var timer = setInterval(function() {
	var notSolved = maze.move();

	// Check if all maze path is complete
	if (!notSolved) {
		clearInterval(timer);

		document.getElementById('solve').disabled = false;
	}
}, 50 * speed);

// Solve maze on button click
document.getElementById('solve').addEventListener('click', function() {
	maze.startPoint.html.className += ' path';

	// Search for path
	var solving = setInterval(function() {
		var finished = maze.solve();

		// Check if the end point has been reached
		if (finished) {
			clearInterval(solving);

			document.getElementById('solve').disabled = true;
		}

	}, 50 * speed);
});

function Maze(w, h) {
	this.html = document.getElementById('maze');

	// Returns a matrix with h by w cells
	this.createMaze = function(width, height) {
		var finalMatrix = [];

	    for(var i=0; i < height; i++) {
	        var auxMatrix = [];

	        for(var j=0; j < width; j++) {
	            auxMatrix.push(new Cell(j, i, this.html));	// Create new Cell and store it
							this.html.appendChild(auxMatrix[j].html);		// Append new Cell to maze container
	        }

	        finalMatrix.push(auxMatrix);
	    }

	    return finalMatrix;
	}

	// Create matrix to represent maze cells
	this.cells = this.createMaze(w, h);

	// Select a random starting point
	this.startPoint = this.cells[getRandomInt(0, h - 1)][getRandomInt(0, w - 1)];
	this.startPoint.html.className += ' start highlight';
	this.startPoint.visited = true;
	this.currentCell = this.startPoint;

	// Initialize stack used to create and solve maze
	this.stack = [this.currentCell];
	this.maxStack = 0;

	this.move = function() {
		var direction = this.getUnvisitedCellDirection();

		if(direction) {
			switch(direction){
				case 'top':
						this.currentCell.top = true;
						this.currentCell.html.className += ' top';

						this.currentCell = this.cells[this.currentCell.y - 1][this.currentCell.x];

						this.currentCell.bottom = true;
						this.currentCell.html.className += ' bottom';
					break;

				case 'right':
						this.currentCell.right = true;
						this.currentCell.html.className += ' right';

						this.currentCell = this.cells[this.currentCell.y][this.currentCell.x + 1];

						this.currentCell.left = true;
						this.currentCell.html.className += ' left';
					break;

				case 'bottom':
						this.currentCell.bottom = true;
						this.currentCell.html.className += ' bottom';

						this.currentCell = this.cells[this.currentCell.y + 1][this.currentCell.x];

						this.currentCell.top = true;
						this.currentCell.html.className += ' top';
					break;

				case 'left':
						this.currentCell.left = true;
						this.currentCell.html.className += ' left';

						this.currentCell = this.cells[this.currentCell.y][this.currentCell.x - 1];

						this.currentCell.right = true;
						this.currentCell.html.className += ' right';
					break;
			}

			this.currentCell.visited = true;
			this.currentCell.html.className += ' highlight';
			this.stack.push(this.currentCell);
		}
		else{
			// Check if new path distance is bigger than the previous biggest
			if(this.maxStack < this.stack.length){
				this.endPoint = this.currentCell;
				this.maxStack = this.stack.length;
			}

			// Remove highlight
			this.currentCell.html.className = this.currentCell.html.className.replace(' highlight', '');

			// Set new current place
			this.stack.pop();
			this.currentCell = this.stack[this.stack.length - 1]

			// Check if all cells are visited
			if (this.stack.length == 1) {
				this.currentCell.html.className = this.currentCell.html.className.replace(' highlight', '');

				this.endPoint.html.className += ' end';
				this.resetCells();

				return false;
			}
		}

		return true;
	}

	this.solve = function() {
		var direction = this.getUnvisitedCellDirection();

		if(direction) {
			switch(direction){
				case 'top':
						this.currentCell = this.cells[this.currentCell.y - 1][this.currentCell.x];
					break;

				case 'right':
						this.currentCell = this.cells[this.currentCell.y][this.currentCell.x + 1];
					break;

				case 'bottom':
						this.currentCell = this.cells[this.currentCell.y + 1][this.currentCell.x];
					break;

				case 'left':
						this.currentCell = this.cells[this.currentCell.y][this.currentCell.x - 1];
					break;
			}

			this.currentCell.visited = true;
			this.currentCell.html.className += ' path';
			this.stack.push(this.currentCell);

			if (this.currentCell == this.endPoint)
				return true;
		}
		else{
			this.currentCell.html.className = this.currentCell.html.className.replace(' path', '');
			this.stack.pop();
			this.currentCell = this.stack[this.stack.length - 1];
		}
	}

	// Returns a random direction with an unvisited cell.
	// Returns false if all cells around currentCell were already visited.
	this.getUnvisitedCellDirection = function() {
		var rand = ['top', 'right', 'bottom', 'left'];

		while(rand.length > 0) {
			var n = getRandomInt(0, rand.length - 1);	// Pick a random direction

			switch(rand[n]) {
				case 'top':
						// Check if there's an unvisited cell above currentCell
						if(this.currentCell.y - 1 >= 0 &&
						this.cells[this.currentCell.y - 1][this.currentCell.x].visited === false) {
							return 'top';
							var aux = this.cells[this.currentCell.y - 1][this.currentCell.x];

							aux.bottom = true;
							aux.html.className += ' bottom';

							this.currentCell.top = true;
							this.currentCell.html.className += ' top';

							return aux; // Return next this.currentCell
						}
					break;

				case 'right':
						// Check if there's an unvisited cell to the right of currentCell
						if(this.currentCell.x + 1 < width &&
						this.cells[this.currentCell.y][this.currentCell.x + 1].visited === false) {
							return 'right';
							var aux = this.cells[this.currentCell.y][this.currentCell.x + 1];

							this.currentCell.right = true;
							this.currentCell.html.className += ' right';

							aux.left = true;
							aux.html.className += ' left'

							return aux;
						}
					break;

				case 'bottom':
						// Check if there's an unvisited cell below currentCell
						if(this.currentCell.y + 1 < height &&
						this.cells[this.currentCell.y + 1][this.currentCell.x].visited === false) {
							return 'bottom';
							var aux = this.cells[this.currentCell.y + 1][this.currentCell.x];

							this.currentCell.bottom = true;
							this.currentCell.html.className += ' bottom';

							aux.top = true;
							aux.html.className += ' top';

							return aux;
						}
					break;

				case 'left':
						// Check if there's an unvisited cell left of currentCell
						if(this.currentCell.x - 1 >= 0 &&
						this.cells[this.currentCell.y][this.currentCell.x - 1].visited === false) {
							return 'left';
							var aux = this.cells[this.currentCell.y][this.currentCell.x - 1];

							aux.right = true;
							aux.html.className += ' right';

							this.currentCell.left = true;
							this.currentCell.html.className += ' left';

							return aux;
						}
					break;
			}

			rand.splice(n,1); // Remove direction if cell is already visited
		}

		return false; // In case all cells around are visited
	}

	// Resets all cells to unvisited
	this.resetCells = function() {
		for(var i = 0; i < this.cells.length; i++){
			for(var j = 0; j < this.cells[i].length; j++){
				this.cells[i][j].visited = false;
			}
		}
	}
}

function Cell(x, y) {
	this.visited = false;

	this.x = x;
	this.y = y;

	this.right = false;
	this.bottom = false;

	this.left = false;
	this.top = false;

	this.html = document.createElement('div');
	this.html.className = 'cell';

}

// Returns a random Integer between 2 values (inclusive)
function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}
