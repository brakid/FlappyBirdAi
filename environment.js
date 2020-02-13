var PIPE_SPACE_RATIO = 0.6;
var PIPE_RANDOM_THRESHOLD = 0.02;
var PIPE_VARIATION = 100;
var PIPE_MINIMUM = 150;

class Environment {
  constructor(width, height, context, pipeCount, initialBirds, shouldDisplay) {
    this.width = width;
    this.height = height;
    this.context = context;
    this.birds = initialBirds;
    this.pipePairs = [];
    this.pipeCount = pipeCount;
    this.pipesPassed = 0;
    this.shouldDisplay = shouldDisplay;
  }

  getLastPipe(remainingPipes) {
    var lastIndex = -1;
    for (var index = 0; index < remainingPipes.length; index++) { 
      var pipePair = remainingPipes[index];
      if (pipePair.getBoundaries()[2] > lastIndex) {
        lastIndex = pipePair.getBoundaries()[2];
      }
    }
    return lastIndex;
  }

  getOpening() {
    return Math.floor(Math.random() * PIPE_VARIATION + PIPE_MINIMUM);
  }

  processPipes() {
    var pipesToRemoveCount = this.pipePairs.filter(pipePair => pipePair.getBoundaries()[2] <= 0).reduce(count, 0);
    this.pipesPassed += pipesToRemoveCount;

    var remainingPipes = this.pipePairs.filter(pipePair => pipePair.getBoundaries()[2] > 0);

    if (remainingPipes.length < this.pipeCount 
          && this.getLastPipe(remainingPipes) < PIPE_SPACE_RATIO * this.width 
          && Math.random() < PIPE_RANDOM_THRESHOLD) {
      remainingPipes.push(new PipePair(this.width + 15, this.getOpening(), this.height, this.context));
    }
    this.pipePairs = remainingPipes;
  }

  clear() {
    this.context.clearRect(0, 0, this.width, this.height); 
  }

  drawBackground() {
    this.context.fillStyle = "blue";
    this.context.fillRect(0, 0, this.width, this.height);
    this.context.fillStyle = "green";
    this.context.fillRect(0, this.height - 50, this.width, this.height);
  }

  drawAllBirds() {
    for (var index = 0; index < this.birds.population.length; index++) {
      var bird = this.birds.population[index];
      //bird.draw();
      if (!bird.isAlive) {
        //console.log('Bird ' + index + ' is dead : ' + bird.points);
      } else {
        bird.draw();
        //console.log('Bird ' + index + ' is alive : ' + bird.points);
      }
    }
  }

  drawAllPipes() {
    for (var index = 0; index < this.pipePairs.length; index++) { 
      this.pipePairs[index].draw();
    }
  }

  actionAllBirds() {
    for (var index = 0; index < this.birds.population.length; index++) {
      var bird = this.birds.population[index];
      if (bird.isAlive) {
        var action = bird.think(this.pipePairs);
        //console.log('Bird ' + index + ' : should flap : ' + action);
        bird.takeAction(action);
      }
    }
  }

  nextAllBirds() {
    for (var index = 0; index < this.birds.population.length; index++) {
      var bird = this.birds.population[index];
      if (bird.isAlive) {
        bird.next();
      }
    }
  }

  nextAllPipes() {
    for (var index = 0; index < this.pipePairs.length; index++) {
      this.pipePairs[index].next();
    }
  }

  areBirdsAlive() {
    var anyAlive = false;
    for (var index = 0; index < this.birds.population.length; index++) {
      var bird = this.birds.population[index];
      if(bird.isAlive) {
        var isDead = bird.isDead(this.pipePairs);
        if (!isDead) {
          //console.log('Bird ' + index + ' : is alive');
          anyAlive = true;
        } else {
          //console.log('Bird ' + index + ' : is dead');
        };
      }
    }
    return anyAlive;
  }

  getBestBird() {
    return this.birds.getBestBird();
  }

  draw() {
    if (this.shouldDisplay) {
      this.drawBackground();
      this.drawAllBirds();
      this.drawAllPipes();
    }
  }

  nextStep() {
    this.clear();
    this.processPipes();
    this.actionAllBirds();
    this.nextAllBirds();
    this.nextAllPipes();
    this.draw();
    if (!this.areBirdsAlive()) {
      //alert('Lost: ' + this.getBestBird().points);
      //console.log(this.birds.getBestBirds(4));
      return false;
    } else {
      //console.log('Best bird: ' + JSON.stringify(this.getBestBird()));
      return true;
    }
  }

  initialize() {
    this.clear();
    this.processPipes();
    this.draw();
  }
}