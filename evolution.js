var MIN = -0.1;
var MAX = 0.1;

class Evolution {
  constructor(childGenerator, getParentFitness, getParentBrainWeights) {
    this.childGenerator = childGenerator;
    this.getParentFitness = getParentFitness;
    this.getParentBrainWeights = getParentBrainWeights;
  }

  getNextGeneration(parents, populationSize) {
    var childrenCount = populationSize - parents.length;
    var clonedParents = this.cloneParents(parents);

    var children = this.getChildren(parents, childrenCount);
    return clonedParents.concat(children);
  }

  cloneParents(parents) {
    return parents.map(parent => {
      var brainWeights = this.getParentBrainWeights(parent);
      return this.childGenerator(brainWeights);
    });
  }

  getChildren(parents, childrenCount) {
    var children = [];
    for(var childIndex = 0; childIndex < childrenCount; childIndex++) {
      var [parent1, parent2] = this.selectParents(parents);
      var child = this.getChild(parent1, parent2);
      children.push(child);
    }
    return children
  }

  selectParents(parents) {
    var parent1 = this.selectParent(parents, null);
    var parent2 = this.selectParent(parents, parent1);

    return [parent1, parent2];
  }

  selectParent(parents, otherParent) {
    var fitnessSum = parents.map(parent => this.getParentFitness(parent)).reduce(sum, 0);
    
    for (var index = 0; index < parents.length - 1; index++) {
      var candidate = parents[index];
      if (Math.random() < (this.getParentFitness(candidate) / fitnessSum) && otherParent !== candidate) {
        return candidate;
      }
    }
    if (otherParent !== parents[parents.length - 1]) {
      return parents[parents.length - 1];
    } else {
      return parents[0];
    }
  }

  randomlySelect(weight1, weight2) {
    if (Math.random() < 0.5) {
      return weight1;
    } else {
      return weight2;
    }
  }

  getChild(parent1, parent2) {
    var parent1Weights = this.getParentBrainWeights(parent1);
    var parent2Weights = this.getParentBrainWeights(parent2);

    // crossover
    //var cutoff = Math.floor(Math.random() * parent1Weights.length);
    //var childWeights = parent1Weights.slice(0, cutoff + 1).concat(parent2Weights.slice(cutoff + 1));
    
    // random replacement
    var childWeights = parent1Weights.map((weight, index) => this.randomlySelect(weight, parent2Weights[index]));

    // change weights a little
    var mutatedChildWeights = childWeights.map(weight => weight + getRandom(MIN, MAX));

    return this.childGenerator(mutatedChildWeights);
  }
}