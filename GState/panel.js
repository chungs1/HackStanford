/*https://github.com/pusher/real-time-progress-bar-tutorial/blob/master/public/js/home.js*/
/*
var json = '{"name":"seduce male secretary","type":"takeaction","action":"seduce","subject":"male secretary"}';
var action_obj = JSON.parse(json);

json='{"name": "bribe ","type": "slider","min_value":0,"max_value":10,"answer":5}';
var slider_obj = JSON.parse(json);

json = '{"name": "calbots invisishield","type": "select","subject":"calbots invisishield","options": [1,2,3,4], "answer":3}';
var select_obj = JSON.parse(json);

var obj_arr = [action_obj,select_obj,slider_obj];
var obj_arr = [action_obj,select_obj,slider_obj];
*/
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

function sendResponse(element){
    var task_id = $("#task").attr("task_id");
    console.log("hi"+task_id + "space " + element.value);
    gapi.hangout.data.setValue(task_id,element.value);
}
//task_in is Task json object (list of four)
function generateTask(tasks_in) {
    console.log("hi " + tasks_in);
    for (var i = 0; i<4; i++) {
        //change title of each subpanel


        var title = "h2_"+(i+1) + "";
        var curtask = tasks_in[i];
        console.log(curtask);
        if (curtask.type == "takeaction") {
            // create button
            document.getElementById(title).innerHTML=curtask.subject;
             var new_button = $('<button />')
                .addClass('bluebutton')
                .attr("value",true)
                .attr("onclick","sendResponse(this)")
                .text(curtask.action)
                //.mousedown(alert("hello")) //do something
                .insertAfter( "."+title +"");

        
        }                

        
        else if (curtask.type=="select") {
            document.getElementById(title).innerHTML=curtask.name;
            //create four selection buttons
            for (var s = 0; s <curtask.options.length; s++) {
                 var new_button = $('<button />')
                .addClass('smallbutton')
                .attr("value",curtask.options[s])
                .text(curtask.options[s])
                .attr("onclick","sendResponse(this)")
                .insertAfter( "."+title +"");
            }
               
        }
        
        
        else if (curtask.type=="slider") {
            document.getElementById(title).innerHTML=curtask.name;
            $("."+title +"").append("<p>amount:</p>"+"<p id='sliderTicker'>0</p>" );
            var new_button = $('<input />')
                .attr({
                    'id': 'sliderinput',
                    'type': 'range',
                    'min':curtask.min_value,
                    'max':curtask.max_value,
                    'class':'slider',
                    'onmouseup':"updateTicker(this)"
                })
                .insertAfter( "."+title +"");


        }
    }
}

function updateTicker(button){
    $("#sliderTicker").text(button.value);
    sendResponse(button);
}



function textIn(task) {
    console.log("TASK :" + task);
    var finaltask = task.name;
    console.log("TASK NAME " + finaltask);
    if (task.type=="select" || task.type=="slider") {
        finaltask = "set " + task.name + " to " + task.answer+"";
    }
    document.getElementById("task").innerHTML=finaltask;
    $('#task').attr( 'task_id',task.task_id );  //not actually 100% sure that this works. 
    updateProgressBar(task);
}