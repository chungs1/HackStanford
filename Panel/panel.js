/*https://github.com/pusher/real-time-progress-bar-tutorial/blob/master/public/js/home.js*/

var json = '{"name":"seduce male secretary","type":"button","action":"seduce","subject":"male secretary"}';
var action_obj = JSON.parse(json);

json = '{"name": "calbots invisishield","type": "select","subject":"calbots invisishield","options": [1,2,3,4]}';
var select_obj = JSON.parse(json);


json='{"name": "bribe ","type": "slider","min_value":0,"max_value":10}';
var slider_obj = JSON.parse(json);

var obj_arr = [action_obj,select_obj,slider_obj];
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
    for (var i = 0; i<=2; i++) {
        //change title of each subpanel


        var title = "h2_"+(i+1) + "";
        var curtask = tasks_in[i];
        console.log(curtask);
        document.getElementById(title).innerHTML=curtask.name;
        if (curtask.type == "button") {
            // create button
             var new_button = $('<button />')
                .addClass('bluebutton')
                .text(curtask.action)
                //.mousedown(alert("hello")) //do something
                .insertAfter( "."+title +"");

        
    }                

        
        else if (curtask.type=="select") {
            //create four selection buttons
            for (var s = 0; s <=3; s++) {
                 var new_button = $('<button />')
                .addClass('smallbutton')
                .text(curtask.options[s])
                //.mousedown(onselectClick()); //do something
                .insertAfter( "."+title +"");
            }
               
        }
        
        
        else if (curtask.type=="slider") {
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
                //.mouseup(console.log("change"))
                .insertAfter( "."+title +"");


        }
    }
}

function updateTicker(button){
    $("#sliderTicker").text(button.value);
}



function textin(task) {
    document.getElementById(task).innerHTML=curtask.command;
}

 
