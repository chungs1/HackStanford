var localParticipant = null;

function GameState() {
	//this.level = 1;
	this.taskUrl = 'https://dl.dropboxusercontent.com/u/11657199/projects/HackStanford/GState/tasks.json'
	this.win = false;
	this.numComplete = 0;
	this.players = []; 
	this.overallHealth = 100;
	this.listOfExpirations = {}; // dictionary of task_id: {startTime: #start, timeDur: #timeMs}
	this.listOfPeopleWithTasks = {};
	this.numParticipants = 0;
	this.numStarted = 0;
	
	/*Fetches the Task*/
	function fetchTasks(taskUrl){
		var list = [];
		$.ajax({
  			dataType: "json",
  			url: taskUrl,
  			success: function(data){
  				list = data;
  			},
  			async: false
		});
		return list;
	}
	
	this.listOfFuncs = fetchTasks(this.taskUrl);
	this.timeDur = 5000;
	this.state = null;
	this.metadata = null;
	this.addedKeys = [];

	this.i = 0;


	function shuffle(o){ //v1.0
    		for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    		return o;
	};

	/* Initializes a Task Object Right before it sends it */
	this.initializeTask = function(task, userId){
		task.task_id = this.i;
		this.i++;
		task.expiration = new Date();
		//console.log(task.expiration.getMilliseconds());
		task.expiration.setMilliseconds(task.expiration.getMilliseconds() + this.timeDur);
		if(task.type == "select"){
			task.answer = shuffle(task.options)[0];
		} else if(task.type == "slider"){
			task.answer = Math.floor(Math.random() * (task.max_value - task.min_value)) + task.min_value;
		}
		task.userId = userId;
		task.done = false;
		return task;
	}

	console.log("Arr " + this.listOfFuncs);
	this.i = 0;

	function initializeTask(task, userId){
		task.task_id = i;
		i++;
		task.expiration = Date();
		task.expiration.setMilliseconds(task.expiration.getMilliseconds() + this.timeDur);
		task.userId = userId;
		task.done = false;
		return task;
	}

	//now we start
	this.start = function() {
		this.numStarted+=1;
		if(this.numStarted > 1) {
			generateTask(taskLists[localParticipant.id].tasklist);
			return;
		}
		this.players = gapi.hangout.getParticipants();
		localParticipant = gapi.hangout.getLocalParticipant()
		var taskLists = {};
		var check = {};
		var numPlayers = this.players.length;

		function shuffle(o){ //v1.0
    	for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    	return o;
		};


		var i = 0;
		var taskLists = {};
		for(var j =0; j < numPlayers; j++) {
			taskLists[this.players[j]] = {};
			taskLists[this.players[j]].tasklist = [];
		}
		this.listOfFuncs = shuffle(this.listOfFuncs);
		var newFuncs = [];
		while(i<numPlayers*4){
			var id = this.players[Math.floor(i/4)];
			taskLists[id].tasklist.push(this.listOfFuncs[i]);
			this.listOfPeopleWithTasks[id] = false;
			newFuncs.push(this.listOfFuncs[i]);
			this.listOfExpirations[this.listOfFuncs[i].name] = this.listOfFuncs[i];
			i++;
		}
		this.listOfFuncs = newFuncs;

		for (var j = 0; j < numPlayers; j++) {
			//generate the task list for each people
			generateTask(taskLists[this.players[j]].tasklist);
		}

		this.update();

	}

	//this updates the render and sends instructions.
	this.update = function() {
		var peopleID =  Object.keys(this.listOfPeopleWithTasks);

		for (var i = 0; i < this.addedKeys.length; i++) {
			var keyObj = this.addedKeys[i];
			//var name = this.listOfExpirations[key].name
;			console.log('meh');
			console.log(this.addedKeys[i]);
			//console.log(this.listOfExpirations[name]);
			console.log(this.listOfExpirations[keyObj.key]);
			this.checkTaskComplete(this.listOfExpirations[keyObj.key]);
			delete this.listOfExpirations[keyObj.key];
		};

		if(this.numComplete >= 10) {
			end("win");
		}

		for (var i = 0; i < peopleID.length; i++) {
			//if the person doesn't have a task, 
			if(!this.listOfPeopleWithTasks[peopleID[i]]) {
				var task = this.randomizeFunc(peopleID[i]);
				//console.log(task);
				textIn(task);
				gapi.hangout.data.setValue(task["name"].name, JSON.stringify(task["name"]));
			}
		} 

		//remove from sharedstate old completed tasksole.
		var arrayOfAddedKeys = new Array();
		for (var i = 0;i<this.addedKeys.length;i++){
			arrayOfAddedKeys[i] = JSON.stringify(this.addedKeys[i]);
		}
		
		gapi.hangout.data.submitDelta({}, arrayOfAddedKeys);


		//if your health goes below;
		if (this.overallHealth <= 0) {
			end("YOU LOST!!!!!");
		}
	}


	//the check function
	this.checkTaskComplete = function(taskObject) {
		//if the thing in the array isn't undefined
		if (this.listOfExpirations[taskObject.task_id] != undefined) {
			//if it's greater than the duration time
			if (Date.now() > this.listOfExpirations[taskObject.task_id].expiration.getMilliseconds()) {
				this.overallHealth = this.overallHealth - 10;
				this.listOfPeopleWithTasks[taskObject.userId] = false;
			} else {
				this.numComplete += 1;
			}
		}
	}

	this.randomizeFunc = function(person_id) {
		//console.log(this.i);
		var randomID = this.listOfFuncs[this.randomizeNum("func")];
		var task = this.initializeTask(randomID, person_id);
		var name = randomID[name];
		var itemToSend = task;

		this.listOfExpirations[task.task_id] = task;
		this.listOfPeopleWithTasks[person_id] = true;
		
		return itemToSend;

	}

	this.randomizeNum = function(option) {
		if(option == "func") {
			return Math.floor(Math.random()*this.listOfFuncs.length);
		} else if (option == "number") {
			return Math.floor(Math.random()*1);
		}
	}

	function end(message) {
		//render("Lose"); //see the lose screen
		if(message = "win") {
			alert("YOU WINNNNNNNNNN YAYA");
		} else {
			console.log("YOU LOSE");
			alert("YOU LOSE");
		}
	}

}

function updateLocalDataState(state, metadata, addedKeys) {
	game.state = state;
	game.metadata = metadata;
	game.addedKeys = addedKeys;
	game.update(); //render based on this
}

 var game = new GameState();


(function() {
	//console.log("initializing..");
	if(gapi && gapi.hangout) {

		//initialize the hangout
		var initHangout = function(apiInitEvent) {
			if(apiInitEvent.isApiReady) {
				//when the state of the game changes, change the local state also
				gapi.hangout.data.onStateChanged.add(function(stateChangeEvent) {
          updateLocalDataState(stateChangeEvent.state,
                               stateChangeEvent.metadata, stateChangeEvent.addedKeys);
        });

        gapi.hangout.data.onParticipantsEnabled.add(function(stateChangeEvent) {
        	game.numParticipants++;
        });

        //if there is no initial game state, then get the shared state

        if (!game.state) {
          var state = gapi.hangout.data.getState();
          var metadata = gapi.hangout.data.getStateMetadata();
          var addedKeys = [];
          if (state && metadata) {
            updateLocalDataState(state, metadata, addedKeys);
          }
        }
        gapi.hangout.onApiReady.remove(initHangout);
        game.start();
			}
		}
		gapi.hangout.onApiReady.add(initHangout);
	}
})();
