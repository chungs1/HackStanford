function GameState() {
	this.level = 1;
	this.win = false;
	this.players = 0;
	this.overallHealth = 100;
	this.listOfExpirations = {}; // dictionary of task_id: {startTime: #start, timeDur: #timeMs}
	this.listOfFuncs = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "X", "Y", "Z"]

	function update() {

	}

	function checkTaskComplete(taskObject) {

	}

	function randomizeFunc() {
		var randomID = listOfFuncs[randomizeNum("func")]+randomizeNum("number");
		var startTimeInMillis = Date.now();

		this.listOfExpirations[randomID] = {};
		this.listOfExpirations[randomID].startTime = system.
	}

	function randomizeNum(option) {
		if(option == "func") {
			return Math.floor(Math.rand()*this.listOfFuncs.length);
		} else if (func == "number") {
			return Math.floor(Math.rand()*3);
		}
	}

	function determineLengthTime() {

	}
}