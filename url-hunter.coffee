class Game
  constructor: ->
    @levelSize = 60
    @playerLocation = @levelSize / 2

  start: ->
    @points = 0
    @startTime = new Date
    @timeLimit = 30
    @animals = []
    @addAnimal() for num in [4..1]
    @interval = setInterval((=> @update()), 1000 / 30)

  gameOver: ->
    clearInterval(@interval)
    location.replace "#  You killed #{@points} animal#{if @points == 1 then '' else '\'s'} in #{@elapsedTime()} seconds! (Press ESC to play again)"

  elapsedTime: ->
    return Math.floor(((new Date).getTime() - @startTime.getTime()) / 1000)

  # Animal Methods
  # --------------
  addAnimal: ->
    animal = new Animal(Math.floor(Math.random() * @levelSize))
    @animals.push(animal)

  removeAnimal: (deadAnimal) ->
    @animals = @animals.filter (animal) -> animal != deadAnimal

  isAnimalAt: (position) ->
    matches = (animal for animal in @animals when Math.floor(animal.position) == position)
    matches[0]

  # Gamestate Methods
  # -----------------
  update: ->
    animal.update(@levelSize) for animal in @animals
    @draw()

  draw: ->
    url = ""
    while url.length < @levelSize
      position = url.length
      if position == @playerLocation
        if @isAnimalAt(@playerLocation) then url += "@" else url += "O"
      else if @isAnimalAt(position)
        url += "a"
      else
        url += "-"

    timeLeft = @timeLimit - @elapsedTime()
    if timeLeft <= 0
      @gameOver()
    else
      timeLeft = "0" + timeLeft if timeLeft < 10 # Keep the same width
      location.replace "#  #{timeLeft}|" + url + "|#{timeLeft}"
      document.title = "Points #{@points}"

  onKeyDown: (event) =>
    switch event.which
      when 37 # left
        @playerLocation -= 1
        @playerLocation = @levelSize - 1 if @playerLocation < 0
      when 39 # right
        @playerLocation += 1
        @playerLocation %= @levelSize
      when 38, 32 # attack
        animal = @isAnimalAt(@playerLocation)
        if animal
          @points += 1
          @removeAnimal(animal)
          @gameOver() if @animals.length == 0
      when 27 # enter
        @start()

class Animal
  constructor: (position) ->
    @position = position
    @velocityChange = Math.random() * 0.5
    @velocityIndex = Math.random() * Math.PI

  update: (levelSize) ->
    dampener = 0.4

    @velocityIndex += (Math.random() * @velocityChange)
    @position += Math.sin(@velocityIndex) * dampener
    @position %= levelSize
    @position += levelSize if @position < 0

document.addEventListener 'DOMContentLoaded', ->
  game = new Game()
  document.addEventListener 'keydown', game.onKeyDown
  game.start()
