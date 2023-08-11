// JavaScript Document
/*
	To add a new property of the genome:
	1) Add a getter function: get____()
	2) Add a CreateRandom______() function
	3) Add a Mutate_____() function
	4) Add initialization code that calls the random function or clones the property if it is an object
	5) Add relevant mutation factors and mins and maxes
*/

Genome.prototype.maxSize = 20;
Genome.prototype.minSize = 4;

Genome.prototype.weightLocation = 0;
Genome.prototype.inputLocation = 2;
Genome.prototype.outputLocation = 1;

Genome.prototype.mutationFactor = 0.06;
Genome.prototype.maxMutation = 0.07;
Genome.prototype.minMutation = 0.009;

Genome.prototype.sizeMutationMax = 1.5;
Genome.prototype.colorMutationMax = 40;

//CONSIDER making more FLEXIBLE. 
//Also, how do we coordinate inputs and outputs with our commanding organism?

//FLEXIBLE! MOOORE!
function Genome(g /*pre-made genome OR numInputs*/, numHidden, numOutputs){
	this.brain = [];
	this.color = [];
	this.size = 0;
	
	if (g instanceof Genome){
		this.brain = Clone(g.brain);
		this.color = Clone(g.color);
		this.size =  g.size;
	}
	else{
		this.brain  = this.createRandomLayeredBrain(g, numOutputs, numHidden);
		this.color =  this.createRandomColor();
		this.size = this.createRandomSize();	
	}
}

Genome.prototype.createRandomLayeredBrain = function(numIn, numOut, numHid){
	var allNeurons = [];
	var inputNeurons = [];
	var hiddenNeurons = [];
	var outputNeurons = [];
		
	var finalBrain = [];
	//Create Lists of neurons. These will just be arrays of numbers
	for (var i = 1; i < numIn + 1; i++){//Neuron 0 will be connected to all hidden and output neurons and will be the BIAS neuron
		allNeurons.push(i);	
		inputNeurons.push(i);
	}
	
	for (var j = numIn + 1; j < 1 + numHid+ numIn; j++){//Bias
		allNeurons.push(j);	
		hiddenNeurons.push(j);
	}


	for (var k = numIn + numHid + 1; k < numOut + numHid + numIn + 1; k++){//Bias
		allNeurons.push(k);	
		outputNeurons.push(k);
	}

	//Actually create the neuron connections
	var hiddenLayer = this.createLayer(inputNeurons, hiddenNeurons); 
	var outputLayer = this.createLayer(hiddenNeurons, outputNeurons); 
	var bias1 = this.createLayer([0], hiddenNeurons);
	var bias2 = this.createLayer([0], outputNeurons);
	finalBrain = finalBrain.concat(hiddenLayer, outputLayer, bias1, bias2);
	return finalBrain;
}


Genome.prototype.createLayer = function(inputNeurons, outputNeurons){
	var finalBrain = [];
	for (var out = 0; out < outputNeurons.length; out++){
		for (var inp = 0; inp < inputNeurons.length; inp++){
			var neuron = [];
			neuron[this.weightLocation] = RandomClamped(-1,1);
			neuron[this.outputLocation] = outputNeurons[out];
			neuron[this.inputLocation] = inputNeurons[inp];
			finalBrain.push(neuron)
		}
	}
	
	return finalBrain;
}

Genome.prototype.createRandomColor = function(){
	return [Math.floor(RandomClamped(0, 255)),  
				  Math.floor(RandomClamped(0, 255)),  
				  Math.floor(RandomClamped(0, 255))   ];
}

Genome.prototype.createRandomSize = function(){
	return Math.floor(RandomClamped(this.minSize, this.maxSize));
}



Genome.prototype.getNumSensors = function(){
	var sum = 0;
	var sensors = this.getSensors();
	
	for (var i = 0; i < sensors.length; i++){
		sum += sensors[i].numOutputs;	
	}
	
	return sum;
}


Genome.prototype.getSensors = function(){
	// return [new VecToFood(), new ProximityEye(-20), new ProximityEye(20)];	
	return [new VecToFood(), new MyHealth()];	
}

Genome.prototype.getColor = function(){
	return this.color;	
}

Genome.prototype.getBrain = function(){
	return this.brain;	
}


Genome.prototype.getSize = function(){
	return this.size;	
}

Genome.prototype.mutateBrain = function(){
	var brn = this.getBrain();
	for (var i = 0; i < brn.length; i++){
		if (Math.random() < this.mutationFactor){//Very rare
			var toAdd = RandomClamped(-this.maxMutation, this.maxMutation);
			this.brain[i][this.weightLocation] += toAdd;
		}
	}
}


Genome.prototype.mutateColor = function(){
	for (var i = 0; i< this.color.length; i++){
		if (Math.random() < this.mutationFactor){//Very rare
			var toAdd = RandomClamped(-this.colorMutationMax, this.colorMutationMax);
			this.color[i] += Math.floor(toAdd);
			if (this.color[i] < 0){
				this.color[i] = 0;	
			}
			else if (this.color[i] > 255){
				this.color[i] = 255;	
			}

		}
	}
}


Genome.prototype.mutateSize = function(){
	if (Math.random() < this.mutationFactor){//Very rare
		var toAdd = (RandomClamped(-this.sizeMutationMax, this.sizeMutationMax));
		this.size += toAdd;
	}
}


Genome.prototype.MutateGenome = function(who){
	var newGenome = new Genome(who);
	
	newGenome.mutateBrain();
	newGenome.mutateColor();
	newGenome.mutateSize();
	
	return newGenome;
}