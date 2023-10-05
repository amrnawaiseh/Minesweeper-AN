document.addEventListener('DOMContentLoaded', () => {
	const flagsCountElement = document.querySelector("#flags-count");
	const minesCountElement = document.querySelector("#mines-count");
	const boardElement = document.querySelector("#board");
	const gameOverElement = document.querySelector('#game-over');
	const resGame = document.querySelector('#res-btn');


	let board;
	const rows = 10;
	const columns = 15;
	let flagsCount;
	let minesCount;
	const minesLocation = new Set();
	let tilesClicked;
	let gameOver;

	window.onload = startGame;

	flagsCountElement.innerText = flagsCount;

	function setMines() {
		let minesLeft = minesCount, id, r, c;

		while (minesLeft > 0) {
			r = Math.floor(Math.random() * rows);
			c = Math.floor(Math.random() * columns);

			id = r.toString() + "-" + c.toString();

			if (!minesLocation.has(id)) {
				minesLocation.add(id);
				minesLeft -= 1;
			}
		}
	}

	function startGame() {
		minesLocation.clear();
		flagsCount = 15;
		minesCount = 15;
		tilesClicked = 0;
		board = [];
		gameOver = false;
		gameOverElement.innerHTML = "";
		boardElement.innerHTML = "";
		minesCountElement.innerText = minesCount;
		flagsCountElement.innerText = flagsCount;
		setMines();

		for (let r = 0; r < rows; r++) {
			let row = [];

			for (let c = 0; c < columns; c++) {
				let tile = document.createElement("div");
				tile.id = r.toString() + "-" + c.toString();
				tile.addEventListener("click", clickTile);
				tile.addEventListener('contextmenu', (e) => {
					e.preventDefault();
					if (!tile.classList.contains("tile-clicked") & (flagsCount > 0)) {
						if (gameOver) {
							return;
						}
						if (tile.innerText == "") {
							tile.innerText = "🚩";
							flagsCount--;
							flagsCountElement.innerText = flagsCount;
						}
						else if (tile.innerText == "🚩") {
							tile.innerText = "";
							flagsCount++;
							flagsCountElement.innerText = flagsCount;
						}

					}
				})

				boardElement.append(tile);
				row.push(tile);
			}
			board.push(row);
		}

		return board;
	}

	resGame.addEventListener('click', startGame);

	function clickTile() {

		const tile = this;

		if (gameOver || tile.classList.contains("tile-clicked") || tile.innerText === "🚩") {
			return;
		}

		if (minesLocation.has(tile.id)) {
			gameOverElement.innerText = 'GAME OVER!';
			gameOver = true;
			revealMines();
			return;
		}

		const coords = tile.id.split("-");
		const r = parseInt(coords[0]);
		const c = parseInt(coords[1]);
		checkMine(r, c);
	}

	function revealMines() {
		for (let r = 0; r < rows; r++) {
			for (let c = 0; c < columns; c++) {
				let tile = board[r][c];

				if (minesLocation.has(board[r][c].id)) {
					tile.innerText = "💣";
					tile.style.backgroundColor = "red";
				}
			}
		}
	}

	function checkMine(r, c) {
		if (r < 0 || r >= rows || c < 0 || c >= columns) {
			return;
		}
		if (board[r][c].classList.contains("tile-clicked")) {
			return;
		}

		board[r][c].classList.add("tile-clicked");
		tilesClicked += 1;

		let minesFound = 0;
		minesFound += checkTile(r - 1, c - 1);
		minesFound += checkTile(r - 1, c);
		minesFound += checkTile(r - 1, c + 1);
		minesFound += checkTile(r, c - 1);
		minesFound += checkTile(r, c + 1);
		minesFound += checkTile(r + 1, c - 1);
		minesFound += checkTile(r + 1, c);
		minesFound += checkTile(r + 1, c + 1);

		if (tilesClicked == rows * columns - minesCount) {
			minesCountElement.innerText = "Cleared";
			gameOver = true;
		}

		if (minesFound > 0) {
			board[r][c].innerText = minesFound;
			board[r][c].classList.add("x" + minesFound.toString());
		}
		else {
			board[r][c].innerText = "";
			checkMine(r - 1, c - 1);
			checkMine(r - 1, c);
			checkMine(r - 1, c + 1);
			checkMine(r, c - 1);
			checkMine(r, c + 1);
			checkMine(r + 1, c - 1);
			checkMine(r + 1, c);
			checkMine(r + 1, c + 1);
		}

	}

	function checkTile(r, c) {
		if (r < 0 || r >= rows || c < 0 || c >= columns) {
			return 0;
		}

		if (minesLocation.has(r.toString() + "-" + c.toString())) {
			return 1;
		}

		return 0;
	};

});
