/*https://github.com/pusher/real-time-progress-bar-tutorial/blob/master/public/js/home.js*/

var json = '{"name":"seduce male secretary","type":"button","action":"seduce","subject":"male secretary"}';
var action_obj = JSON.parse(json);

json = '{"name": "Calbots invisishield","type": "select","subject":"calbots invisishield","options": [0,1,2,3]}';
var select_obj = JSON.parse(json);

var obj_arr = [action_obj,select_obj];
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
    for (var i = 0; i<=1; i++) {
        //change title of each subpanel


        var title = "h2_"+(i+1) + "";
        var curtask = tasks_in[i];
        console.log(curtask);
        document.getElementById(title).innerHTML=curtask.subject;
        if (curtask.type == "button") {
            // create button
             var new_button = $('<button />')
                .addClass('bluebutton')
                .text(curtask.action)
                //.mousedown(onbuttonClick()) //do something
                .insertAfter( "."+title +"");

        
    }                

        
        else if (curtask.type=="select") {
            //create four selection buttons
            for (var s = 1; s <=4; s++) {
                console.log('here');
                 var new_button = $('<button />')
                .addClass('smallbutton')
                .text(curtask.options[i])
                //.mousedown(onselectClick()); //do something
                 .insertAfter(".smallbutton");
            }
               
        }
        
        
        else if (curtask.type=="slider") {            
            var new_button = $('<input />')
                .attr({
                    'id': 'sliderinput',
                    'type': 'range',
                    'min':curtask.min_value,
                    'max':curtask.max_value
                });

        }
    }
}


 
