 function pusher_timer() {
  var pusher = new Pusher('70931')
  var uID = p-1;

  var channel = pusher.subscribe('signup_process_'+uID) 
  
channel.bind('update', function(data) { // Bind to an event on our channel, in our case, update
    var progressBar = document.getElementById('realtime_prog');
    prog.value=(data.time+"%")

    // Process is complete,Do whatever you want now, maybe redirect them to their freshly created account?
    if (data.progress == 0) {
      $('#time_msg').text("Ran out of time!");
    }
  });
 }



function generateTask() {
    task_id = document.getElementById("task");
    task_id.innerHTML= " " // get task and change name
}

function update_Title(title_num) {
    
}


