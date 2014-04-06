function GameState() {
	//this.level = 1;
	this.win = false;
	this.players = 0;
	this.overallHealth = 100;
	this.listOfExpirations = {}; // dictionary of task_id: {startTime: #start, timeDur: #timeMs}
	this.listOfFuncs = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "X", "Y", "Z"];
	this.timeDur = 5000;

	function start() {
		
	}

	function updateUser() {

	}

	//the main function
	function checkTaskComplete(taskObject) {
		//if the thing in the array isn't undefined
		if (this.listOfExpirations[taskObject.task_id] != undefined) {
			//if it's greater than the duration time
			if (taskObject.endTime - this.listOfExpirations[taskObject.task_id].startTime > this.timeDur) {
				this.overallHealth
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
			return Math.floor(Math.rand()*3);
		}
	}


}

gapi.hangout.onApiReady.add(function(eventObj) {
	var game = new GameState();
	game.start();
	
});