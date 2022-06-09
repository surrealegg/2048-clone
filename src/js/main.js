window.game = new Game("game");

window.addEventListener("keydown", e => {
    game.grid.nextMove(e.keyCode);
    game.update();
});

window.addEventListener("load", () => {
    game.startGame();
});

document.getElementById("newGame").addEventListener("click", e => {
    localStorage.setItem("cells", "");
    game.resetGame();
});