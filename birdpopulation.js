class BirdPopulation {
  constructor(width, height, context, populationSize, survivors) {
    this.width = width;
    this.height = height;
    this.context = context;
    this.populationSize = populationSize;
    this.survivors = survivors;
    this.population = this.getInitialPopulation(this.populationSize);
    this.history = [];
    this.evolution = new Evolution(
      (brainWeights) => this.childGenerator(40, this.height / 2, this.width, this.height, this.context, brainWeights), 
      this.getFitnessValue, 
      this.getBrainWeights);
  }

  childGenerator(birdX, birdY, width, height, context, brainWeights) {
    var birdBrain = new BirdBrain();
    birdBrain.setWeights(brainWeights);
    return new Bird(birdX, birdY, width, height, context, birdBrain);
  }

  getFitnessValue(bird) {
    return bird.points;
  }

  getBrainWeights(bird) {
    return bird.birdBrain.getWeights();
  }

  getInitialPopulation(populationSize) {
    var population = [];
    for(var index = 0; index < populationSize; index++) {
      population.push(new Bird(40, this.height / 2, this.width, this.height, this.context, new BirdBrain()));
    }
    return population;
  }

  getBestBird() {
    var bestBird = undefined;
    var bestPoints = -1;
    for (var index = 0; index < this.population.length; index++) { 
      var bird = this.population[index];
      if (bird.points > bestPoints) {
        bestBird = bird;
        bestPoints = bird.points;
      }
    }
    return bestBird;
  }

  getBestBirds(number) {
    var sortedBirds = this.population.slice();
    sortedBirds.sort((bird1, bird2) => bird1.points < bird2.points);
    return sortedBirds.splice(0, number);
  }

  getStatistics() {
    var countAlive = this.population.map(bird => bird.isAlive).filter(isAlive => isAlive === true).reduce(sum, 0);
    var bestBird = this.getBestBird();
    return [countAlive, bestBird, this.population.length];
  }

  getNextGeneration() {
    var parents = this.getBestBirds(this.survivors);

    var nextGeneration = this.evolution.getNextGeneration(parents, this.populationSize);

    this.history.push(this.population.slice());
    this.population = nextGeneration;
    
    return nextGeneration;
  }
}