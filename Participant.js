

function init(metadata) {
	userID_ = gapi.auth.getLocalParticipant();
	possibleTasks_ = JSON.parse(metadata);
	tasks = {};
	var state_ = null;
	var metadata_ = null;
	var currObjective = null;
	//get list of possible tasks to send to Jessica
	for (var x in possibleTasks.keys){
		if (x == userID){
			tasks.push(possibleTasks[x]);
		}
	}
	//send list to Jessica

	//eventListeners here?
	//var a = document.getElementById("a").value(task.keys[1]);
	//a.addEventListener("click",sendUpdate(a.objectName,a.value()));
	//repeat for the other 3 events
}

//looks at the data that has changed, then decides whether it needs to update or not
function updateLocalDataState(state, metadata) {
	state_ = state;
	metadata_ = metadata;
	for (var x in metadata.keys){
		if (x == userID_){

		}
	}
}


//check for state changes that GameState might throw at you
gapi.hangout.data.onStateChanged.add(function(stateChangeEvent) {
	updateLocalDataState(stateChangeEvent.state,stateChangeEvent.metadata,stateChangeEvent.addedKeys);
});
}

//sendUpdate() sends an update to GameServer in the form [taskID:taskValue]
function sendUpdate(taskID,value){
	state_[taskID].value = value;
	gapi.hangout.data.submitDelta(state_[taskID]);
	}
}
	//Code for when current task times out
