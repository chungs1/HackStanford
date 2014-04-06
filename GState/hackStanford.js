/*https://github.com/pusher/real-time-progress-bar-tutorial/blob/master/public/js/home.js*/

var json = '{"name":"seduce male secretary","type":"takeaction","action":"seduce","subject":"male secretary"}';
var action_obj = JSON.parse(json);

json='{"name": "bribe ","type": "slider","min_value":0,"max_value":10,"answer":5}';
var slider_obj = JSON.parse(json);

json = '{"name": "calbots invisishield","type": "select","subject":"calbots invisishield","options": [1,2,3,4], "answer":3}';
var select_obj = JSON.parse(json);





//sets timer to task.expiration
function time(task) {
     $("b[id=timer]").text(task.expiration);
var settimmer = 0;
        $(function(){
                window.setInterval(function() {
                    var timeCounter = $("b[id=timer]").html();
                    var updateTime = eval(timeCounter)- eval(1);
                    $("b[id=timer]").html(updateTime);

                    if(updateTime == 0){
                        var task_id = $("#task").attr(task_id);
                        gapi.hangout.data.setValue(task_id,false);
                    }
                }, 1000);

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
        if (curtask.type == "takeaction") {
            // create button
             var new_button = $('<button />')
                .addClass('bluebutton')
                .attr("value",true)
                 .click(sendResponse(this))
                .text(curtask.action)
                //.mousedown(alert("hello")) //do something
                .insertAfter( "."+title +"");

        
    }                

        
        else if (curtask.type=="select") {
            //create four selection buttons
            for (var s = 0; s <=3; s++) {
                 var new_button = $('<button />')
                .addClass('smallbutton')
                .attr("value",options[s])
                .text(curtask.options[s])
                 .click(sendResponse(this))
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
                .insertAfter( "."+title +"");


        }
    }
}




function sendResponse(element){
    var task_id = $("#task").attr(task_id);
    gapi.hangout.data.submitDelta({task_id:element.value},[]);
}

function textIn(task) {
    var finaltask = task.name;
    if (task.type=="select" || task.type=="slider") {
        finaltask = "set " + task.name + " to " + task.answer+"";
    }
    document.getElementById("task").innerHTML=finaltask;
    $('#task').attr( 'task_id',task.task_id );  //not actually 100% sure that this works. 

    timer(task);
}
