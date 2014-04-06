function GameState() {
	//this.level = 1;
	console.log("start");
	this.taskUrl = 'https://dl.dropboxusercontent.com/u/11657199/projects/HackStanford/GState/tasks.json'
	this.win = false;
	this.players = [];
	this.overallHealth = 100;
	this.listOfExpirations = {}; // dictionary of task_id: {startTime: #start, timeDur: #timeMs}
	this.listOfPeopleWithTasks = {};
	this.listOfFuncs = [];
	var list = [];
	//console.log("hello");
	$.ajax({
  		dataType: "json",
  		url: this.taskUrl,
  		success: function(data){
  			list = data;
  		},
  		async: false
	});
	this.listOfFuncs = list;

	//this.listOfFuncs = this.listOfFuncs[1];
	this.timeDur = 5000;
	this.state = null;
	this.metadata = null;
	this.addedKeys = null;

	for(i=0;i<this.listOfFuncs.length;i++){
		console.log("hi" + this.listOfFuncs[i].name);
	}
	var i = 0;

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
		this.players = gapi.hangout.getParticipants();
		var taskLists = {};
		var check = {};
		for(var i = 0; i < this.players.length; i++) { //2 players for 
			this.listOfPeopleWithTasks[this.players[i].id] = false;
			taskLists[this.players[i]] = {};
			taskLists[this.players[i]].tasklist = [];
			for(var j = 0; j < 4; j++) {
				var randomFunc = Math.floor(Math.random()*3);
				var possibleFunc = this.listOfFuncs[randomFunc];

				while(true) {
					if(check[possibleFunc] == undefined) {
						taskLists[this.players[i]].tasklist.push(possibleFunc);
						check[possibleFunc] = true;
						break;
					} else {
						randomFunc = Math.floor(Math.random()*3);
						possibleFunc = this.listOfFuncs[randomFunc];
					}
				}
			}
		}

		update();

	}

	//this updates the render and sends instructions.
	this.update = function() {
		var peopleID =  Object.keys(this.listOfPeopleWithTasks);

		for (var i = 0; i < addedKeys.length; i++) {
			var key = addedKeys[i];
			var name = this.listOfPeopleWithTasks[key].name;
			checkTaskComplete(this.listOfExpirations[name]);
			delete this.listOfExpirations[name];
		};

		for (var i = 0; i < peopleID.length; i++) {
			//if the person doesn't have a task, 
			if(!this.listOfPeopleWithTasks[peopleID[i]]) {
				var task = randomizeNum(peopleID[i]);
				gapi.hangouts.data.setValue(task[0].name, JSON.stringify(task[0]));
			}
		} 

		//remove from sharedstate old completed tasks
		gapi.hangouts.data.submitDelta({}, addedKeys);


		//if your health goes below;
		if (this.overallHealth <= 0) {
			end("YOU LOST!!!!!");
		}

	}


	//the check function
	function checkTaskComplete(taskObject) {
		//if the thing in the array isn't undefined
		if (this.listOfExpirations[taskObject.task_id] != undefined) {
			//if it's greater than the duration time
			if (Date.now() > this.listOfExpirations[taskObject.task_id].expiration.getMilliseconds()) {
				this.overallHealth = this.overallHealth - 10;
				this.listOfPeopleWithTasks[taskObject.userId] = false;
			}
		}
	}

	function randomizeFunc(person_id) {
		var randomID = listOfFuncs[randomizeNum("func")];
		var task = initializeTask(randomID, person_id);
		var name_temp = randomID.name;
		var itemToSend = {name_temp: task};

		this.listOfExpirations[randomID.name] = task;
		this.listOfPeopleWithTasks[person_id] = true;
		
		return itemToSend;

	}

	function randomizeNum(option) {
		if(option == "func") {
			return Math.floor(Math.rand()*this.listOfFuncs.length);
		} else if (func == "number") {
			return Math.floor(Math.rand()*1);
		}
	}

	function end(message) {
		//render("Lose"); //see the lose screen
		console.log("YOU LOSE");
		alert("YOU LOSE");
	}


}



function updateLocalDataState(state, metadata, addedKeys, game) {
	game.state = JSON.parse(state);
	game.metadata = JSON.parse(metadata);
	game.addedKeys = addedKeys;

	game.update(); //render based on this
}

(function() {
	console.log("initializing..");
	if(gapi && gapi.hangout) {

		//initialize the hangout
		var initHangout = function(apiInitEvent) {
			if(apiInitEvent.isApiReady) {
				var game = new GameState();
				//when the state of the game changes, change the local state also
				gapi.hangout.data.onStateChanged.add(function(stateChangeEvent) {
          updateLocalDataState(stateChangeEvent.state,
                               stateChangeEvent.metadata, game);
        });

        //if there is no initial game state, then get the shared state
        if (!game.state) {
          var state = gapi.hangout.data.getState();
          var metadata = gapi.hangout.data.getStateMetadata();
          if (state && metadata) {
            updateLocalDataState(state, metadata, game);
          }
        }
        gapi.hangout.onApiReady.remove(initHangout);
        game.start();
			}
		}
		gapi.hangout.onApiReady.add(initHangout);
	}
})();
