class Cell {
  constructor(split, pos, value) {
    this.split = split;

    this.active = true;
    this.x = pos[0];
    this.y = pos[1];
    this.value = value;

    this.merge_from = null;

    this.element = document.createElement("div");
    this.update();
  }

  savePosition() {
    this.previous_x = this.x;
    this.previous_y = this.y;
  }

  move(x, y) {
    this.x = x;
    this.y = y;

    this.element.style.left = this.percentage(this.x);
    this.element.style.top = this.percentage(this.y);
  }

  percentage(pos) {
    return this.split * pos + "%";
  }

  update(element) {
    this.element.className = "cell cell-" + this.value;
    this.element.style.left = this.percentage(this.x);
    this.element.style.top = this.percentage(this.y);
    this.element.innerText = this.value;

    if (this.merge_from != null) {
      this.active = false;
      this.element.classList.add("hiding");

      setTimeout(() => {
        this.element.remove();
      }, 300);
    }
  }
}
