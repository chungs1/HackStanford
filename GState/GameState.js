function GameState() {
	//this.level = 1;
	console.log("CALLING GAMESTATE");
	this.taskUrl = 'https://dl.dropboxusercontent.com/u/11657199/projects/HackStanford/GState/tasks.json'
	this.win = false;
	this.players = [];
	this.overallHealth = 100;
	this.listOfExpirations = {}; // dictionary of task_id: {startTime: #start, timeDur: #timeMs}
	this.listOfPeopleWithTasks = {};
	this.listOfFuncs = [{
	"name": "break firewall",
	"type": "takeaction",
	"action": "break",
	"subject": "firewall"

},
{
	"name": "shit on Debra's desk",
	"type": "takeaction",
	"action": "shit on",
	"subject": "Debra's desk"
},
{
	"name": "shit on Patt's desk",
	"type": "takeaction",
	"action": "shit on",
	"subject": "Patt's desk"
},
{
	"name": "shit on James's desk",
	"type": "takeaction",
	"action": "shit on",
	"subject": "James's desk"
},
{
	"name": "shit on Kyle's desk",
	"type": "takeaction",
	"action": "shit on",
	"subject": "Kyle's desk"
},
{
	"name": "shit on Pappy's desk",
	"type": "takeaction",
	"action": "shit on",
	"subject": "Pappy's desk"
},
{
	"name": "shit on Menora's desk",
	"type": "takeaction",
	"action": "shit on",
	"subject": "Menora's desk"
},
{
	"name": "shit on Carl's desk",
	"type": "takeaction",
	"action": "shit on",
	"subject": "Carl's desk"
}];
	var	that = [];
	/*console.log("before " + that);
	$.getJSON(this.taskUrl, function(data) {
		that = data[0];
	 });
	//console.log("before " + that);
	this.listOfFuncs = that;
	console.log("after " + this.listOfFuncs);
	//this.listOfFuncs = this.listOfFuncs[1];*/
	this.timeDur = 5000;
	this.state = null;
	this.metadata = null;
	this.addedKeys = null;

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
			checkTaskComplete();
		};

		for (var i = 0; i < peopleID.length; i++) {
			//if the person doesn't have a task, 
			if(!this.listOfPeopleWithTasks[peopleID[i]]) {
				var task = randomizeNum(peopleID[i]);
				gapi.hangouts.data.setValue(task[0].name, task[0]);
			}
		} 

		//remove from sharedstate old completed tasks
		gapi.hangouts.data.submitDelta({}, addedKeys);


		//if your health goes below;
		if (this.overallHealth <= 0) {
			end("YOU LOST!!!!!");
		}



	}


	//the main function
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
		var itemToSend = {randomID.name: task};

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
	}


}



function updateLocalDataState(state, metadata, addedKeys, game) {
	game.state = state;
	game.metadata = metadata;
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
