var ACCELERATION = -9.8;
var FLAP = 20;
var WEIGHT = 1;
var STEP = 40;

class Bird {
  constructor(x, y, width, height, context, birdBrain) {
    this.x = x;
    this.y = y;
    this.size = 10;
    this.width = width;
    this.height = height;
    this.context = context;
    this.verticalSpeed = 0;
    this.lastFlap = 0;
    this.points = 0;
    this.isAlive = true;
    this.birdBrain = birdBrain;
  }

  reset() {
    this.y = this.height / 2;
    this.verticalSpeed = 0;
    this.lastFlap = 0;
    this.points = 0;
    this.isAlive = true;
  }

  think(pipePairs) {
    var view = this.getView(pipePairs);
    // process view
    var shouldFlap = this.birdBrain.process(view);
    //console.log(view + ' : ' + shouldFlap);
    return shouldFlap;
  }

  takeAction(shouldFlap) {
    if (shouldFlap) {
      this.flap();
    }
  }

  next() {
    this.verticalSpeed += ACCELERATION * WEIGHT * (this.lastFlap / STEP);
    if (this.verticalSpeed < -FLAP) {
      this.verticalSpeed = - FLAP;
    }
    this.y += this.verticalSpeed * (this.lastFlap / STEP);
    
    if (this.y - this.size < 0) {
      this.y = this.size;
    }
    if (this.y + this.size > this.height) {
      this.y = this.height - this.size;
    }
    
    this.lastFlap += 1;
    this.points += 1;
  }

  flap() {
    this.lastFlap = 0;
    this.verticalSpeed = FLAP;
  }

  getBoundaries() { // left, bottom, right, top
    return [this.x - this.size, this.y - this.size, this.x + this.size, this.y + this.size];
  }

  hasCollision(pipeBoundaries) {
    var birdBoundaries = this.getBoundaries();

    // check if bird hits a pipe (bird right and pipe left)
    var frontalHit = birdBoundaries[2] >= pipeBoundaries[0] && birdBoundaries[2] <= pipeBoundaries[2];

    // check if bird hits a pipe (bird left and pipe right)
    var backsideHit = birdBoundaries[0] <= pipeBoundaries[2] && birdBoundaries[0] >= pipeBoundaries[0];

    // check whether bird hits upper part of pipe
    var topHit = birdBoundaries[3] >= pipeBoundaries[3];

    // check whether bird hits lower part of pipe
    var lowerHit = birdBoundaries[1] <= pipeBoundaries[1];

    //console.log(frontalHit + ' : ' + backsideHit + ' : ' + topHit + ' : ' + lowerHit);

    return (frontalHit || backsideHit) && (topHit || lowerHit);
  }

  isDead(pipePairs) {
    // detect hitting the ground or ceiling
    var birdBoundaries = this.getBoundaries();
    if ((this.height - birdBoundaries[3] <= 0) || (this.height - birdBoundaries[1] >= this.height)) {
      this.isAlive = false;
      return true;
    }

    for (var index = 0; index < pipePairs.length; index++) { 
      var pipePair = pipePairs[index];
      if (this.hasCollision(pipePair.getBoundaries())) {
        this.isAlive = false;
        return true;
      }
    }
    return false;
  }

  getClosestPipe(pipePairs) {
    var closestPipe = undefined;
    var closestDistance = 999999; // super large value
    for (var index = 0; index < pipePairs.length; index++) { 
      var pipePair = pipePairs[index];
      var pipeEndDistance = pipePair.getBoundaries()[2] - this.getBoundaries()[0];
      if (pipeEndDistance >= 0 && pipeEndDistance < closestDistance) {
        closestPipe = pipePair;
        closestDistance = pipePair;
      }
    }
    return closestPipe;
  }

  getView(pipePairs) {
    var closestPipe = this.getClosestPipe(pipePairs);
    if (!closestPipe) {
      var pipeStartDistance = (this.width - this.getBoundaries()[2]) / this.width; //0..1
      var pipeEndDistance = (this.width - this.getBoundaries()[0]) / this.width; //0..1
      var pipeBottomDistance = this.getBoundaries()[1] / this.height; //0..1
      var pipeTopDistance = (this.height - this.getBoundaries()[3]) / this.height; //0..1
    } else {
      var pipeStartDistance = (closestPipe.getBoundaries()[0] - this.getBoundaries()[2]) / this.width; //0..1
      var pipeEndDistance = (closestPipe.getBoundaries()[2] - this.getBoundaries()[0]) / this.width; //0..1
      var pipeBottomDistance = (closestPipe.getBoundaries()[1] - this.getBoundaries()[1]) / this.height; //0..1
      var pipeTopDistance = (closestPipe.getBoundaries()[3] - this.getBoundaries()[3]) / this.height; //0..1
    }
    var verticalSpeed = (this.verticalSpeed) / FLAP; //-1..1
    var view = [pipeStartDistance, pipeEndDistance, pipeTopDistance, pipeBottomDistance, verticalSpeed];

    return view;
  }

  draw() {
    this.context.beginPath();
    this.context.arc(this.x, this.height - this.y, this.size, 0, 2 * Math.PI);
    if (this.isAlive) {
      this.context.fillStyle = "yellow";
    } else {
      this.context.fillStyle = "#f5f29d";
    }
    this.context.fill();
    this.context.stroke();
    if (this.isAlive) {
      this.context.beginPath();
      this.context.strokeStyle = "black";
      var startY = 0;
      var endY = 0;
      if (this.verticalSpeed > 0) {
        startY = this.height - (this.y + this.size / 2);
        endY = this.height - (this.y - this.size / 2);
      } else if (this.verticalSpeed == 0) {
        startY = this.height - this.y;
        endY = startY;
      } else {
        startY = this.height - (this.y - this.size / 2);
        endY = this.height - (this.y + this.size / 2);
      }
      this.context.moveTo(this.x - this.size / 2, startY);
      this.context.lineTo(this.x + this.size / 2, endY);
      this.context.stroke(); 
    }
  }
}