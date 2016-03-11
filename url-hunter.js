'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Game = function () {
  function Game() {
    _classCallCheck(this, Game);

    this.levelSize = 60;
    this.playerLocation = this.levelSize / 2;
  }

  _createClass(Game, [{
    key: 'start',
    value: function start() {
      this.points = 0;
      this.startTime = new Date();
      this.timeLimit = 30; // seconds
      this.animals = [];
      for (var i = 0; i < 4; i++) {
        var animal = new Animal(Math.floor(Math.random() * this.levelSize));
        this.animals.push(animal);
      }

      this.interval = setInterval(this.update.bind(this), 1000 / 30);
    }
  }, {
    key: 'gameOver',
    value: function gameOver() {
      clearInterval(this.interval);
      location.replace('#  You killed ' + this.points + ' animal' + (this.points === 1 ? '' : '\'s') + ' in ' + this.elapsedTime() + ' seconds! (Press ESC to play again)');
    }
  }, {
    key: 'elapsedTime',
    value: function elapsedTime() {
      var milliseconds = new Date().getTime() - this.startTime.getTime();
      return Math.floor(milliseconds / 1000);
    }

    // Animal Methods
    // --------------

  }, {
    key: 'removeAnimal',
    value: function removeAnimal(deadAnimal) {
      this.animals = this.animals.filter(function (animal) {
        return animal !== deadAnimal;
      });
    }
  }, {
    key: 'animalAt',
    value: function animalAt(position) {
      return this.animals.find(function (animal) {
        return Math.floor(animal.position) === position;
      });
    }

    // Gamestate Methods
    // -----------------

  }, {
    key: 'update',
    value: function update() {
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this.animals[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var animal = _step.value;

          animal.update(this.levelSize);
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      this.draw();
    }
  }, {
    key: 'draw',
    value: function draw() {
      var url = "";
      while (url.length < this.levelSize) {
        var position = url.length;
        if (position === this.playerLocation) {
          url += this.animalAt(this.playerLocation) ? "@" : "O";
        } else if (this.animalAt(position)) {
          url += "a";
        } else {
          url += "-";
        }
      }

      var timeLeft = this.timeLimit - this.elapsedTime();
      if (timeLeft <= 0) {
        this.gameOver();
      } else {
        if (timeLeft < 10) {
          timeLeft = "0" + timeLeft; // Keep the same width
        }
        location.replace('#  ' + timeLeft + '|' + url + ('|' + timeLeft));
        document.title = 'Points ' + this.points;
      }
    }
  }, {
    key: 'onKeyDown',
    value: function onKeyDown(event) {
      if (event.which === 37) {
        // left
        this.playerLocation -= 1;
        if (this.playerLocation < 0) {
          this.playerLocation = this.levelSize - 1;
        }
      } else if (event.which === 39) {
        // right
        this.playerLocation += 1;
        this.playerLocation %= this.levelSize;
      } else if (event.which === 38 || event.which === 32) {
        // attack
        var animal = this.animalAt(this.playerLocation);
        if (animal) {
          this.points += 1;
          this.removeAnimal(animal);
          if (this.animals.length === 0) {
            this.gameOver();
          }
        }
      } else if (event.which === 27) {
        // enter
        this.start();
      }
    }
  }]);

  return Game;
}();

var Animal = function () {
  function Animal(position) {
    _classCallCheck(this, Animal);

    this.position = position;
    this.velocityChange = Math.random() * 0.5;
    this.velocityIndex = Math.random() * Math.PI;
  }

  _createClass(Animal, [{
    key: 'update',
    value: function update(levelSize) {
      var dampener = 0.4;

      this.velocityIndex += Math.random() * this.velocityChange;
      this.position += Math.sin(this.velocityIndex) * dampener;
      this.position %= levelSize;
      if (this.position < 0) {
        this.position += levelSize;
      }
    }
  }]);

  return Animal;
}();

document.addEventListener("DOMContentLoaded", function () {
  var isSafari = navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1;

  if (isSafari) {
    document.body.classList.toggle("safari");
  } else {
    (function () {
      var game = new Game();
      document.addEventListener("keydown", function () {
        return game.onKeyDown.apply(game, arguments);
      });
      game.start();
    })();
  }
});
