// JavaScript Document

NeuralNet.prototype.numLayers = 2;


function NeuralNet(myGenome){		
	var brain = myGenome.getBrain();
	
	var inputNeurons = [];
	var outputNeurons = [];
	var allNeuronNames = [];
	
	for (var index = 0; index < brain.length; index++){//REMEMBER THE BIAS NEURON at 0
		var currentNeuron = brain[index];
		if (allNeuronNames.indexOf(currentNeuron[myGenome.inputLocation]) == -1){//If the input neuron isnt in our list of neurons
			allNeuronNames.push(currentNeuron[myGenome.inputLocation]);
			inputNeurons.push(currentNeuron[myGenome.inputLocation]);
			outputNeurons.push(currentNeuron[myGenome.inputLocation]);
		}
		if (allNeuronNames.indexOf(currentNeuron[myGenome.outputLocation]) == -1){//If the input neuron isnt in our list of neurons
			allNeuronNames.push(currentNeuron[myGenome.outputLocation]);
			inputNeurons.push(currentNeuron[myGenome.outputLocation]);
			outputNeurons.push(currentNeuron[myGenome.outputLocation]);
		}
	}
	
	for (var cur = 0; cur < brain.length; cur++){
		var currentNeuron = brain[cur];
		var currentInput = currentNeuron[myGenome.inputLocation];
		var currentOutput = currentNeuron[myGenome.outputLocation];
	
		if (inputNeurons.indexOf(currentOutput) !== -1){//if our input neurons list contains a neuron that is receiving an output
			inputNeurons.splice(inputNeurons.indexOf(currentOutput) ,1);
		}
		
		if (outputNeurons.indexOf(currentInput) !== -1){
			outputNeurons.splice(outputNeurons.indexOf(currentInput),1);
		}	
	}
	
	//At this point, we have: a list of all unique neurons as well as all input neurons and all output neurons
	var neurons = [];

	for (var xxx = 0; xxx < allNeuronNames.length; xxx++){
		neurons.push(new Neuron());
	}

	for (var yyy = 0; yyy < brain.length; yyy++){
		var currentNeuron = brain[yyy];
		var currentInput = currentNeuron[myGenome.inputLocation];
		var currentOutput = currentNeuron[myGenome.outputLocation];
		var currentWeight = currentNeuron[myGenome.weightLocation];
		neurons[currentOutput].addInput(currentInput, currentWeight);
	}
	
	this.neurons = neurons;
	this.outputNeurons = outputNeurons;
}

NeuralNet.prototype.getNumInputs = function() {
	return numInputs;
}

NeuralNet.prototype.getOutput = function(inputs) {
	this.neurons[0].setOutput(-1);
	for (var i = 1; i <= inputs.length; i++){
		this.neurons[i].setOutput(inputs[i-1]);
	}
	
	for (var neu = inputs.length + 1; neu < this.neurons.length; neu++){
		this.neurons[neu].calcOutput(this.neurons);	
	}
	
	var myReturn = [];
	for (var a = 0; a < this.outputNeurons.length; a++){
		myReturn.push(this.neurons[this.outputNeurons[a]].getOutput());
	}
	
	return myReturn;
}
