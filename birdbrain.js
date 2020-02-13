var ACTION_THRESHOLD = 0.5
var MIN_WEIGHT = -5.0
var MAX_WEIGHT = 5.0

class BirdBrain {
	constructor() {
		this.inputs = 5;
		this.hidden = 2;
		this.outputs = 1;

		this.inputWeights = this.getRandomMatrix([this.hidden, this.inputs]);
		this.hiddenBiases = math.flatten(this.getRandomMatrix([this.hidden, 1]));
		this.outputWeights = this.getRandomMatrix([this.outputs, this.hidden]);
		this.outputBiases = math.flatten(this.getRandomMatrix([this.outputs, 1]));
	}

	getRandomMatrix(dimensions) {
		var [rows, columns] = dimensions;
		var data = [];
		for (var rowIndex = 0; rowIndex < rows; rowIndex++) {
			var rowData = [];
			for (var columnIndex = 0; columnIndex < columns; columnIndex++) {
				rowData.push(getRandom(MIN_WEIGHT, MAX_WEIGHT));
			}
			data.push(rowData);
		}
		return math.matrix(data);
	}

	getMatrixWithValues(values, dimensions) {
		var [rows, columns] = dimensions;
		var data = [];
		for (var rowIndex = 0; rowIndex < rows; rowIndex++) {
			var rowData = [];
			for (var columnIndex = 0; columnIndex < columns; columnIndex++) {
				rowData.push(values[rowIndex * columns + columnIndex]);
			}
			data.push(rowData);
		}
		return math.matrix(data);
	}

	sigmoid(x) {
    return 1 / (1 + Math.exp(-x));
  }

	process(inputValues) {
		var hiddenValues = math.add(math.multiply(this.inputWeights, inputValues), this.hiddenBiases);
    var hiddenActivations = hiddenValues.map(this.sigmoid);
    var outputValues = math.add(math.multiply(this.outputWeights, hiddenActivations), this.outputBiases);
    var outputActivations = outputValues.map(this.sigmoid);
		return math.subset(outputActivations, math.index(0)) > ACTION_THRESHOLD;
	}

	getWeights() {
		var inputWeightsVector = math.flatten(this.inputWeights)._data;
		var hiddenBiasesVector = this.hiddenBiases._data;
		var outputWeightsVector = math.flatten(this.outputWeights)._data;
		var outputBiasesVector = this.outputBiases._data;
		
		var weightsVector = inputWeightsVector.concat(hiddenBiasesVector, outputWeightsVector, outputBiasesVector);
		return weightsVector;
	}

	setWeights(weightVector) {
		var inputWeightsVector = weightVector.splice(0, this.inputs * this.hidden);
		var hiddenBiasesVector = weightVector.splice(0, this.hidden);
		var outputWeightsVector = weightVector.splice(0, this.hidden * this.outputs);
		var outputBiasesVector = weightVector.splice(0, this.outputs);

		this.inputWeights = this.getMatrixWithValues(inputWeightsVector, [this.hidden, this.inputs]);
		this.hiddenBiases = math.flatten(this.getMatrixWithValues(hiddenBiasesVector, [this.hidden, 1]));
		this.outputWeights = this.getMatrixWithValues(outputWeightsVector, [this.outputs, this.hidden]);
		this.outputBiases = math.flatten(this.getMatrixWithValues(outputBiasesVector, [this.outputs, 1]));
	}
}