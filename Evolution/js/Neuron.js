// JavaScript Document

	
/**
 * Initialize a new neuron with suggested weights
 * 
 * @param Weights An array of this neuron's weights
 */
function Neuron() {
	this.inputSources = [];
	this.weights = [];
	this.lastOutput = 0;
}


Neuron.prototype.addInput = function(inputSource, weight){
	this.inputSources.push(inputSource);
	this.weights.push(weight);	
}


Neuron.prototype.Activation = function( sum) {
	return ( (2 / (1 + Math.pow(Math.E, -sum))) - 1 );
}


Neuron.prototype.getOutput = function(){
	return this.lastOutput;
}

Neuron.prototype.setOutput = function(val){
	this.lastOutput = val;
}


Neuron.prototype.calcOutput = function(allNeurons){
	var sum=0;
		
	for (var xxx=0; xxx<this.inputSources.length; xxx++){
		sum += (allNeurons[this.inputSources[xxx]].getOutput() * this.weights[xxx]);
	}

	
	var output = this.Activation(sum);
	
	this.lastOutput = output;
	
	return output;
}
