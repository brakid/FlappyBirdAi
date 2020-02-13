var DELAY = 10;

$(document).ready(function(){
  var width = 300;
  var height = 400;
  var canvas = document.getElementById("canvas");
  var context = canvas.getContext("2d");
  var plotContext = document.getElementById("plot").getContext("2d");
  var logsElement = $("p#logs");
  var statsElement = $("p#stats");
  var pipeCount = 3;

  var birdPopulation = new BirdPopulation(width, height, context, 100, 10);
  
  var results = [];
  var bestBirds = [];
  var pipesPassedResult = [];

  function plotResults(results, pipesPassedResult) {
    new Chart(plotContext, {
      type: 'line',
      data: {
        labels: results.map((value, index) => index + 1),
        datasets: [{ 
            data: results,
            label: "Best Bird Points",
            borderColor: "#3e95cd",
            fill: false
          },
          { 
            data: pipesPassedResult,
            label: "# of pipes passed",
            borderColor: "#FF0000",
            fill: false
          }]
        }
    });
  }
  
  function simulateGeneration(birdPopulation, shouldDisplay) {
    var environment = new Environment(width, height, context, pipeCount, birdPopulation, shouldDisplay);
    environment.initialize();

    var steps = 10000;
    while(environment.nextStep() && --steps > 0) {}
    return environment.pipesPassed;
  }

  function simulationAndDisplayStep(environment, remainingSteps) {
    var stepResult = environment.nextStep();
    var [survivors, bestBird, populationSize] = environment.birds.getStatistics();
    var pipesPassed = environment.pipesPassed;
    statsElement.prepend('<p>Step ' + (10000 - remainingSteps) + ' - Best bird : ' + bestBird.points + ', survivors: ' + survivors + ' / ' + populationSize + ', pipes passed: ' + pipesPassed + '</p>');
  
    if (stepResult && remainingSteps > 0) {
      //statsElement.prepend('<p>Step ' + (10000 - remainingSteps) + ' - Best bird : ' + bestBird.points + ', survivors: ' + survivors + ' / ' + populationSize + ', pipes passed: ' + pipesPassed + '</p>');
      setTimeout(() => simulationAndDisplayStep(environment, remainingSteps - 1));
    }
  } 

  function simulateAndDisplayGeneration(birdPopulation) {
    var environment = new Environment(width, height, context, pipeCount, birdPopulation, true);
    environment.initialize();

    var steps = 10000;
    setTimeout(() => simulationAndDisplayStep(environment, steps));
  }

  function simulateGenerations(number) {
    for (var index = 1; index <= number; index++) {
      var pipesPassed = simulateGeneration(birdPopulation, false);
      var [survivors, bestBird, populationSize] = birdPopulation.getStatistics();
      logsElement.append('<p>Best bird in generation ' + index + ' : ' + bestBird.points + ', survivors: ' + survivors + ' / ' + populationSize + ', pipes passed: ' + pipesPassed + '</p>');
      results.push(birdPopulation.getBestBird().points);
      bestBirds.push(birdPopulation.getBestBird());
      pipesPassedResult.push(pipesPassed);
      birdPopulation.getNextGeneration();
    }
    //logsElement.append('<p>Best Birds: ' + JSON.stringify(bestBirds) + '</p>');
  }

  function evaluateBestBirds() {
    birdPopulation.population = bestBirds;
    birdPopulation.population.forEach(bird => bird.reset());  
    simulateAndDisplayGeneration(birdPopulation);
  }

  simulateGenerations(50);
  plotResults(results, pipesPassedResult);

  evaluateBestBirds();
});