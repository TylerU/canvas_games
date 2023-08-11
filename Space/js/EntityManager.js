var EntityManager = 
{
	lastID: 0,
	entityMap: {}, // [ENTITY NAME][component name] = actual component
	componentMap: {}, //[Component Names][entities with this]
	
	getNextID: function(){
		this.lastID ++;
		return this.lastID;	
	},

	createEntity: function(){
		var id = "e_" + this.getNextID();
		this.entityMap[id] = {};
		return id;
	},
	
	addComponent: function(ent, component){
		this.entityMap[ent][component.name] = component;
		
		if (!this.componentMap[component.name]){
			this.componentMap[component.name] = [];	
		}
		this.componentMap[component.name].push(ent);
	},
	
	hasComponent: function(ent, comp){	
		var entity = ent;
		if (entity.constructor == String){
		}
		else{
			entity = entity.name;	
		}
		
		
		if (this.entityMap[entity][comp]){
			return true;	
		}
		else {
			return false;	
		}
	},
	
	
	getAllEntitiesWith: function(comp){
		return this.componentMap[comp];
	},
	
	
	getComponent: function(ent, comp){
		if (ent.constructor == String){
			return this.entityMap[ent][comp];
		}
		else{
			return this.entityMap[ent.name][comp];
		}
	},
	
	getComponentStartsWith: function(ent,comp){
		var entity = ent;
		if (entity.constructor == String){
		}
		else{
			entity = entity.name;	
		}
		
		var keys = 	Object.keys(this.entityMap[entity]);
		var arr = this.entityMap[entity];
		for (var i = 0; i < keys.length; i++){
			if (keys[i].indexOf(comp) != -1 ){
				return arr[keys[i]];
			}
		}
	},
	
	getAllComponentsOf: function(ent){
		var entity = ent;
		if (entity.constructor == String){
		}
		else{
			entity = entity.name;	
		}
		
		if (this.entityMap[entity])
			return Object.keys(this.entityMap[entity]);	
		else
			return null;
	},
	
	removeComponent: function(ent, comp){
		this.entityMap[ent][comp] = null;
		delete this.entityMap[ent][comp];
		
		var arr = this.componentMap[comp]
		for (var i = 0; i < arr.length; i++){
			entity = arr[i]
			if (entity == ent){
				entity = null;
				arr.splice(i,1);
			}
		}
	},
	
	removeEntity: function(ent){
		var entity = ent;
		if (entity.constructor == String){
		}
		else{
			entity = entity.name;	
		}
				
		var comps = this.getAllComponentsOf(entity);
		for (var i = 0; i < comps.length; i++){
			this.removeComponent(entity,comps[i]);
		}
		
		this.entityMap[entity] = null; //URGENT: DO I NEED TO GET RID OF ALL ITS ENTRIES AND SUB OBJECTS? PROLLY NOT!
		delete this.entityMap[entity];		
	}
}

//Entity Manager
Entity.prototype.constructor = Entity;
function Entity(entityMan, compArr){
	this.EM = entityMan;
	this.name = this.EM.createEntity();	

	for (var i = 0; i < compArr.length; i++){
		this.EM.addComponent(this.name, compArr[i]);
	}
	
	return this.name;
}

Entity.prototype.getComponent = function(comp){
	return this.EM.getComponent(this.name, comp);	
}

Entity.prototype.addComponent = function(comp){
	return this.EM.addComponent(this.name, comp);	
}

Entity.prototype.removeComponent = function(comp){
	return this.EM.removeComponent(this.name, comp);	
}

Entity.prototype.hasComponent = function(comp){
	return this.EM.hasComponent(this.name, comp);	
}

Entity.prototype.remove = function(){
	return this.EM.removeEntity(this.name);	
}