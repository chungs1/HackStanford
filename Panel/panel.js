/*https://github.com/pusher/real-time-progress-bar-tutorial/blob/master/public/js/home.js*/

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


//task_in is Task json object (list of four)
function generateTask(tasks_in) {
    for (var i = 1; i<=4; i++) {
        //change title of each subpanel
        document.getElementById(title).innerHTML=task_in.action;

        var title = "h2_"+i + "";
        var curtask = tasks_in[i];
        
        if (curtask.type == "button") {
            // create button
             var new_button = $('<button />')
                .addClass('bluebutton')
                .text(curtask.action)
                .mousedown(onbuttonClick()); //do something
    }
        
        else if (curtask.type=="select") {
            //create four selection buttons
            for (var s = 1; s <=4; s++) {
                 var new_button = $('<button />')
                .addClass('smallbutton')
                .text(curtask.options[i])
                .mousedown(onselectClick()); //do something
            }
               
        }
        
        
        else if (curtask.type=="slider") {            
            var new_button = $('<input />')
                .attr({
                    'id': 'sliderinput',
                    'type': 'range',
                    'min'=curtask.min_value;
                    'max'=curtask.max_value;
                });

        }
    }
}



