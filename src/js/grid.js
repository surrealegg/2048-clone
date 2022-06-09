class Grid {
  constructor(size, cells = null) {
    this.size = size;
    this.cells = [];
    this.score = 0;
    this.loaded = false;
    this.dead = false;
    this.won = false;

    // If the game is loading a saved game
    if (cells) {
      this.loaded = true;
      cells = JSON.parse(cells);
      cells.forEach(v => {
        this.newCell(v.x, v.y, v.value);
      });
    }

    // Load score from local storage if there's any
    const score = localStorage.getItem("score");
    if (score) this.score = parseInt(score);
  }

  // 37 = left, 38 = up, 39 = right, 40 = down
  nextMove(point) {
    // Only continue if least one of those keys are pressed
    // and if the game is not ended
    if ([37, 38, 39, 40].indexOf(point) < 0 || (this.dead || this.won)) return;

    const horizontal = point === 37 || point === 39;
    const positive = point === 40 || point === 39;
    const step = positive ? 1 : -1;

    let freeSpaces;
    let usedSpaces;

    let allMoved;
    let createNewCell = false;

    // Loop until all Cells can no longer move
    do {
      allMoved = true;

      this.cells.forEach((v, i) => {
        if (v.merge_from === null) {
          let canMove;

          // Loop until specific cell can no longer move
          do {
            canMove = true;

            // Update used and free spaces on every loop
            // Purpose of passing usedSpaces variable to the getFreeSpaces function
            // is to prevent calling the same function again
            usedSpaces = this.getUsedSpaces();
            freeSpaces = this.getFreeSpaces(usedSpaces); 

            // Getting the X and Y cell is going to move to
            const nextX = horizontal ? v.x + step : v.x;
            const nextY = !horizontal ? v.y + step : v.y;

            // If there's free space to move
            if (freeSpaces.find(el => el[0] === nextX && el[1] === nextY)) {
              allMoved = false;
              createNewCell = true;
              this.cells[i].move(nextX, nextY);
            } else {
              canMove = false;

              // If there's a cell next to it, that can be merged with.
              const nextCell = this.cells.find(
                el =>
                  el.x === nextX &&
                  el.y === nextY &&
                  el.value === v.value &&
                  el.merge_from === null
              );

              if (nextCell) {
                createNewCell = true;

                nextCell.value *= 2;

                // If the cell reached 2048
                if(nextCell.value >= 2048)
                  this.won = true;

                this.updateScore(nextCell.value);

                this.cells[i].merge_from = nextCell;
                this.cells[i].move(nextCell.x, nextCell.y);
              }
            }
          } while (canMove);
        }
      });
    } while (!allMoved);

    if (createNewCell) this.newCell();
  }

  getUsedSpaces() {
    let usedSpaces = [];

    // Get all used spaces
    this.cells.forEach((v, i) => {
      if (this.cells[i].merge_from === null) usedSpaces.push([v.x, v.y]);
    });

    return usedSpaces;
  }

  getFreeSpaces(used = null) {
    let allTiles = [];
    let freeSpaces = [];
    let usedSpaces = used ? used : this.getUsedSpaces();

    for (let i = 0; i < this.size; i++)
      for (let j = 0; j < this.size; j++) allTiles.push([i, j]);

    allTiles.forEach((v, i) => {
      if (!usedSpaces.find(el => el[0] === v[0] && el[1] === v[1]))
        freeSpaces.push(v);
    });

    return freeSpaces;
  }

  getFreeSpace() {
    const freeSpaces = this.getFreeSpaces();

    return freeSpaces.random();
  }

  newCell(x = null, y = null, value = 2) {
    const pos = x != null && y != null ? [x, y] : this.getFreeSpace();

    if (!pos) return false;

    this.cells.push(new Cell(this.getSplit(), pos, value));
  }

  getSplit() {
    return 100 / this.size;
  }

  updateScore(value) {
    const best = localStorage.getItem("best");

    this.score += value;
    localStorage.setItem("score", this.score);

    if (!best) localStorage.setItem("best", 0);

    if (this.score > best) localStorage.setItem("best", this.score);
  }

  // Create a json array to save progress
  toJSON() {
    let result = [];

    this.cells.forEach((v, i) => {
      if (v.active)
        result.push({
          x: v.x,
          y: v.y,
          value: v.value
        });
    });

    return JSON.stringify(result);
  }
}
