class Game {
  constructor() {
    this.levelSize = 60
    this.playerLocation = this.levelSize / 2
  }

  start() {
    this.points = 0
    this.startTime = new Date()
    this.timeLimit = 30 // seconds
    this.animals = []
    for (let i = 0; i < 4; i++) {
      let animal = new Animal(Math.floor(Math.random() * this.levelSize))
      this.animals.push(animal)
    }

    this.interval = setInterval(this.update.bind(this), 1000 / 30)
  }

  gameOver() {
    clearInterval(this.interval)
    location.replace `#  You killed ${this.points} animal${this.points === 1 ? '' : '\'s'} in ${this.elapsedTime()} seconds! (Press ESC to play again)`
  }

  elapsedTime() {
    let milliseconds = new Date().getTime() - this.startTime.getTime()
    return Math.floor(milliseconds / 1000)
  }

  // Animal Methods
  // --------------
  removeAnimal(deadAnimal) {
    this.animals = this.animals.filter((animal) => animal !== deadAnimal)
  }

  animalAt(position) {
    return this.animals.find(animal => Math.floor(animal.position) === position)
  }

  // Gamestate Methods
 // -----------------
  update() {
    for (let animal of this.animals) {
      animal.update(this.levelSize)
    }
    this.draw()
  }

  draw() {
    let url = ""
    while(url.length < this.levelSize) {
      let position = url.length
      if (position === this.playerLocation) {
        url += this.animalAt(this.playerLocation) ? "@" : "O"
      }
      else if (this.animalAt(position)) {
        url += "a"
      }
      else {
        url += "-"
      }
    }

    let timeLeft = this.timeLimit - this.elapsedTime()
    if (timeLeft <= 0) {
      this.gameOver()
    }
    else {
      if (timeLeft < 10) {
        timeLeft = "0" + timeLeft // Keep the same width
      }
      location.replace(`#  ${timeLeft}|` + url + `|${timeLeft}`)
      document.title = `Points ${this.points}`
    }
  }

  onKeyDown(event) {
    if (event.which === 37) { // left
      this.playerLocation -= 1
      if (this.playerLocation < 0) {
        this.playerLocation = this.levelSize - 1
      }
    }
    else if (event.which === 39) { // right
      this.playerLocation += 1
      this.playerLocation %= this.levelSize
    }
    else if (event.which === 38 || event.which === 32) { // attack
      let animal = this.animalAt(this.playerLocation)
      if (animal) {
        this.points += 1
        this.removeAnimal(animal)
        if (this.animals.length === 0) {
          this.gameOver()
        }
      }
    }
    else if (event.which === 27) { // enter
      this.start()
    }
  }
}

class Animal {
  constructor(position) {
    this.position = position
    this.velocityChange = Math.random() * 0.5
    this.velocityIndex = Math.random() * Math.PI
  }

  update(levelSize) {
    let dampener = 0.4

    this.velocityIndex += (Math.random() * this.velocityChange)
    this.position += Math.sin(this.velocityIndex) * dampener
    this.position %= levelSize
    if (this.position < 0) {
      this.position += levelSize
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  let game = new Game()
  document.addEventListener("keydown", game.onKeyDown)
  game.start()
})
