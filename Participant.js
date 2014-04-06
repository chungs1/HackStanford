

function init(metadata) {
	userID_ = gapi.auth.getLocalParticipant();
	possibleTasks_ = JSON.parse(metadata);
	tasks_ = {};
	//get list of possible tasks to send to Jessica
	for (var x in possibleTasks.keys){
		if (possibleTasks[x].person_id == userID){
			tasks[x] = (possibleTasks[x]);
		}
	}
	toSend = JSON.stringify(possibleTasks);
	SEND.TO.JESSICA(toSend);
	//send possibleTasks to Jessica

	//eventListeners here?
	//var a = document.getElementById("a").value(task.keys[1]);
	//a.addEventListener("click",sendUpdate(a.objectName,a.value()));
	//repeat for the other 3 events
}

//looks at the data that has changed, then decides whether it needs to update or not
function updateLocalDataState(state, metadata) {
	state_ = state;
	metadata_ = metadata;
	changes_ = {};
	for (var x in metadata.keys){
		if (metadata[x].person_id == userID_){
			changes[x] = metadata[x];
		}
	}
	SEND.TO.JESSICA(toSend);
}

//check for state changes that GameState might throw at you
gapi.hangout.data.onStateChanged.add(function(stateChangeEvent) {
	updateLocalDataState(stateChangeEvent.state,stateChangeEvent.metadata,stateChangeEvent.addedKeys);
});
}

//sendUpdate() sends an update to GameServer using submitDelta.
function sendUpdate(taskID,value){
	state_[taskID].value = value;
	gapi.hangout.data.submitDelta(state_[taskID]);
	}
}

