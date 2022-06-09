class Game {
  constructor(selector) {
    // DOM elements
    this.element = document.getElementById(selector);
    this.tileContainer = document.createElement("div");
    this.tileContainer.className = "tileContainer";
    this.element.appendChild(this.tileContainer);
    this.scoreElement = document.getElementById("score");
    this.bestElement = document.getElementById("best");

    this.window = document.createElement("div");
    this.window.className = "window";

    this.windowText = document.createElement("p");
    this.window.appendChild(this.windowText);

    this.size = 4;
    this.grid = new Grid(this.size, localStorage.getItem("cells"));
  }

  startGame() {
    for (let i = 0; i < this.size; i++) {
      let list = document.createElement("div");
      list.className = "grid-row";

      for (let j = 0; j < this.size; j++) {
        let box = document.createElement("div");
        box.className = "grid-cell";

        list.appendChild(box);
      }

      this.element.appendChild(list);
    }

    // If it's a new game create 1 new cell
    if (!this.grid.loaded) this.grid.newCell();
    this.update();
  }

  resetGame() {
    // Remove every cell
    this.tileContainer.innerHTML = "";
    if (this.element.contains(this.window))
      this.element.removeChild(this.window);

    // Reset the grid
    this.grid = new Grid(this.size);

    localStorage.setItem("score", 0);

    this.grid.newCell();
    this.update();
  }

  update() {
    this.grid.cells.forEach((value, index) => {
      // If there's an inactive object found, then delete it
      if (!this.grid.cells[index].active) {
        delete this.grid.cells[index];
        this.grid.cells.splice(index, 1);
      }

      // Update every cell
      this.grid.cells[index].update(this.tileContainer);

      // If there's a object that is not shown in a DOM, Append it.
      if (!this.element.contains(value.element) && value.active)
        this.tileContainer.appendChild(value.element);
    });

    localStorage.setItem("cells", this.grid.toJSON());

    // Update scores
    const score = localStorage.getItem("score");
    const best = localStorage.getItem("best");

    this.scoreElement.innerText = score ? score : 0;
    this.bestElement.innerText = best ? best : 0;

    if (this.grid.won && !this.element.contains(this.window)) {
      this.windowText.innerText = "You won!";
      this.element.appendChild(this.window);
    }
  }
}
