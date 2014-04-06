function GameState() {
	//this.level = 1;
	this.win = false;
	this.players = [];
	this.overallHealth = 100;
	this.listOfExpirations = {}; // dictionary of task_id: {startTime: #start, timeDur: #timeMs}
	this.listOfFuncs = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "X", "Y", "Z"];
	this.timeDur = 5000;
	this.state = null;
	this.metadata = null;
	this.addedKeys = null;

	//now we start
	this.start = function() {
		this.players = gapi.hangout.getParticipants();
		var taskLists = {};
		var check = {};

		for(var i = 0; i < this.players.length; i++) {
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
		for (var i = 0; i < addedKeys.length; i++) {
			var key = addedKeys[i];
			checkTaskComplete();
		};

		if(this.listOfExpirations.length == 0) {

		}

		// here I make a new task and then send it and take away the old things
		var newTask;


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
			if (taskObject.endTime - this.listOfExpirations[taskObject.task_id].startTime > this.timeDur) {
				this.overallHealth = this.overallHealth - 10;
			}
		}
	}

	function randomizeFunc(person_id) {
		var randomID = listOfFuncs[randomizeNum("func")]+randomizeNum("number");
		var itemToSend = {randomID: {}};
		itemToSend.randomID.startTime = Date.now();
		itemToSend.randomID.timeDur = this.timeDur;
		itemToSend.randomID.person_id = person_id;

		this.listOfExpirations[randomID] = {};
		this.listOfExpirations[randomID].startTime = itemToSend.randomID.startTime;

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
