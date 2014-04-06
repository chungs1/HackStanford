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

	function start() {
		this.players = gapi.hangout.getParticipants();
		var taskLists = {};
		var check = {};

		render() //renders the 
		for(int i = 0; i < this.players.length; i++) {
			taskLists[this.players[i]] = {};
			taskLists[this.players[i]].tasklist = [];
			for(int j = 0; j < 4; j++) {
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

	}

	function update() {

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

	function randomizeFunc() {
		var randomID = listOfFuncs[randomizeNum("func")]+randomizeNum("number");
		var itemToSend = {randomID: {}};
		itemToSend.randomID.startTime = Date.now();
		itemToSend.randomID.timeDur = this.timeDur;

		this.listOfExpirations[randomID] = {};
		this.listOfExpirations[randomID].startTime = itemToSend.randomID.startTime;


	}

	function randomizeNum(option) {
		if(option == "func") {
			return Math.floor(Math.rand()*this.listOfFuncs.length);
		} else if (func == "number") {
			return Math.floor(Math.rand()*1);
		}
	}

	function end(message) {
		render("Lose"); //see the lose screen
	}


}



function updateLocalDataState(state, metadata, game) {
	game.state = state;
	game.metadata = metadata;

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

        //if another person enters or leaves, abort the mission by ending
				gapi.hangout.onParticipantsChanged.add(function(partChangeEvent) {
          game.end("WE'VE BEEN DETECTED, ABORT MISSION");
          console.log("game ended");
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
