function Game() {
  this.ctx = document.getElementById('one-player').getContext('2d');
  this.width = $('#one-player').width();
  this.height = $('#one-player').height();
  this.player = new Player("IronHack");
  this.grid = new Grid();
  this.board = new Board(this.width, this.height, "#000", this.grid);
  this.zombie = new Zombie(2, 2, this.board.gapX(), this.board.gapY());
  this.brains = [new Brain(3, 2, this.board.gapX(), this.board.gapY()),
    new Brain(2, 5, this.board.gapX(), this.board.gapY()),
    new Brain(5, 6, this.board.gapX(), this.board.gapY())
  ];
  this.trashes = [new Trash(1, 4, this.board.gapX(), this.board.gapY()),
    new Trash(1, 5, this.board.gapX(), this.board.gapY()),
    new Trash(1, 6, this.board.gapX(), this.board.gapY())
  ];
  this.intervalID;
  //this.brick;
}
Game.prototype=Object.create(Game.prototype);
Game.prototype.constructor=Game;

Game.prototype.startGame = function() {
  //console.log("---In startGame");
  this.paintCanvas();
  this.player.clock.start();
};

Game.prototype.paintCanvas = function() {
  this.clearCanvas();
  this.prepareBoard(); // Must be the first in paint
  this.paintElement(this.trashes); // Must be the second in paint
  this.paintElement(this.zombie); // Must be the thirth in paint
  this.paintElement(this.brains); // Must be the fourth in paint
};

Game.prototype.prepareBoard = function() {
  var img;
  this.grid.pattern.forEach(function(eY, indexY) {
    eY.forEach(function(eX, indexX) {
      if (eX) {
        img = new Image();
        //this.brick = new Brick(indexX * this.board.gapX(), indexY * this.board.gapY(), this.board.gapX(), this.board.gapY());
        img.onload = function() {
          this.ctx.drawImage(img, indexX * this.board.gapX(), indexY * this.board.gapY(), this.board.gapX(), this.board.gapY());
        }.bind(this);
        img.src = this.board.img;
      }
    }, this);
  }, this);
};

Game.prototype.paintElement = function(element) {
  var img;
  if (Array.isArray(element)) {
    element.forEach(function(e) {
      img = new Image();
      img.onload = function() {
        this.ctx.drawImage(img, e.x * this.board.gapX(), e.y * this.board.gapY(), e.width, e.height);
      }.bind(this);
      img.src = e.img;
    }, this);
  } else {
    img = new Image();
    img.onload = function() {
      this.ctx.drawImage(img, element.x * this.board.gapX(), element.y * this.board.gapY(), element.width, element.height);
    }.bind(this);
    img.src = element.img;
  }
};

Game.prototype.clearCanvas = function() {
  this.ctx.fillStyle = '#000';
  this.ctx.fillRect(0, 0, this.width, this.height);
};

// Eval if all the brains are places in the trashes and then the game finsih
Game.prototype.win=function() {
  var success = true;
  this.trashes.forEach(function(trash) {
    trash.isFull(this.brains);
    success *= trash.status;
  },this);
  if (success) {
    this.player.clock.stop();
    alert("WIIIINN");
    clearInterval(this.intervalID);
  }
};
