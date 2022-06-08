const weekday_name = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const month_name = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

var tasks = {};
var task_id=0;
var Calender = $('#calender');
var today = new Date();
var current_date = today.getDate();
if (current_date<10) current_date="0"+current_date;
var current_hour = today.getHours();
var current_month=(today.getMonth()+1);
if (current_month<10) current_month="0"+current_month;
var current_year=today.getFullYear();
var now=current_month+"/"+current_date+"/"+current_year
var weekday=today.getDay();
var DataObj = {
  text: "",
  date: "",
  time: "",
  taskid: "",
};
var Task_List = [];

document.addEventListener('DOMContentLoaded', function() {createtable();}, false);
document.body.style.overflow = 'hidden';
$('#diaplayDate').val(now);
document.getElementById("Current_Date").innerHTML=weekday_name[weekday]+", "+current_date+ " " +month_name[current_month-1]+", "+current_year;


var createtable = function() {
var Max_day = new Date(parseInt(today.getFullYear()), parseInt(today.getMonth()+1), 0).getDate();

  for(i=0;i<24;i++){
      var tr_item=$('<tr id="row'+i+'" class="list-group-item">');
      var td_item=$('<td id="time'+i+'">');
      if(i<10) td_item.text("0"+i+":00");
      else td_item.text(i+":00");
      tr_item.append(td_item);
      var td_item=$('<td id="content '+i+'">');
      var td_list=$('<ul id="time_frame'+i+'">');
      var listitem = $('<li><input type="text" class="form-input col-5 " id="list_textE'+i+'"  class="list_text"  name="task" placeholder=" " readonly/><button id="create-task'+i+'" class="btn  btn-primary btn-sm col-2"  data-toggle="modal" data-target="#task-form-modal" data-whatever='+i+'>Add task</button></li>');
      td_list.append(listitem);
      td_item.append(td_list);
      tr_item.append(td_item);
      Calender.append(tr_item);      
    $('#list_textE'+i).prop('disabled', true);  
    }
    loadtable();
  }
  var loadtable = function() {  
    if (localStorage.getItem("Task_id")) {
      task_id=parseInt(localStorage.getItem("Task_id"));
      Task_List = JSON.parse(localStorage.getItem("Data_Storage"));
      for(i=0; i<Task_List.length ;i++){
         createTask (Task_List[i].text, Task_List[i].date, Task_List[i].time,parseInt(Task_List[i].taskid));
       }
    }
    else localStorage.setItem("Task_id", "0");
    myTimer();
} // close modal

$("#modalDueDate").datepicker({
  // force user to select a future date
  minDate: new Date()
});

$("#diaplayDate").datepicker({
});

$("#diaplayDate").change(function() {
  var date_array;
  var temp;
  date_array= $("#diaplayDate").val().split("/");
  current_date=date_array[1];
  current_month=date_array[0];
  current_year=date_array[2];

  document.getElementById("Current_Date").innerHTML=weekday_name[weekday]+", "+current_date+ " " +month_name[current_month-1]+", "+current_year;
Refresh_Table();
myTimer();

});

var Refresh_Table = function(item) {
$( "li" ).each(function( index ) {
  temp=$( this ).text();
  if (temp.includes("Edit"))
  (this).remove();
});
loadtable();
for(var i=0; i<24;i++){
enableRow(i);
}
}



var Remove_item = function(item) {
  var del_id=item.getAttribute("taskid");
  var match=0;

  Task_List = JSON.parse(localStorage.getItem("Data_Storage"));
  for (var i = 0; i < Task_List.length; i++) {
    if(Task_List[i].taskid==del_id ) match=i;   
  }
  Task_List[match].text=Task_List[Task_List.length-1].text;
  Task_List[match].date=Task_List[Task_List.length-1].date;
  Task_List[match].time=Task_List[Task_List.length-1].time;
  Task_List[match].taskid=Task_List[Task_List.length-1].taskid;
  Task_List.pop();
  localStorage.removeItem("Data_Storage");
  localStorage.setItem("Data_Storage", JSON.stringify(Task_List));
  item.parentNode.remove();
}


var createTask = function(taskText, taskDate, taskTime,taskid) {
  var temp= $('#time_frame'+taskTime);
  var date_array;
  date_array= taskDate.split("/");  

  

  if(taskDate==$("#diaplayDate").val()){
  var listitem = $('<li><input type="text" class="form-input col-5" id="list_text'+taskid+'"  class="list_text" name="task" value='+taskText+' readonly/><button id="edit-task" class="btn  btn-secondary btn-sm col-1"  data-toggle="modal" data-target="#task-form-modal" data-whatever="'+(25+taskid)+'">Edit</button><button id="remove-tasks" class="btn  btn-danger btn-sm col-1"  type="button" onclick="Remove_item(this)" taskid="'+taskid+'">Delete</button></li>');
  temp.append(listitem);
  $('#list_text'+taskid).val(taskText);
  }

};


// modal was triggered
$("#task-form-modal").on("show.bs.modal", function(event) {
  Task_List = JSON.parse(localStorage.getItem("Data_Storage"));  
  var recipient=$(event.relatedTarget).data('whatever');
  var task_id;
  var match=0;
  // clear values
  document.getElementById("edit_task").setAttribute("edit","-1");
  $("#modalTaskDescription, #modalDueDate").val("");
  $('#modalDueDate').val($("#diaplayDate").val());
if (recipient<25) {
  dis_time=recipient
  $('#modalDueDate').datepicker().datepicker('disable');
  $('#modalDueTime').prop('disabled', true);  
}
else {
  
  $('#modalDueDate').datepicker().datepicker('enable');
  $('#modalDueTime').prop('disabled', false);  
  task_id=recipient-25;
  for (var i = 0; i < Task_List.length; i++) {
    if(Task_List[i].taskid==task_id ) match=i;
  }
  document.getElementById("edit_task").setAttribute("edit",match);

 
  $('#modalTaskDescription').val(Task_List[match].text);
  dis_time=Task_List[match].time;
  }

$('#modalDueTime').val(dis_time);

});


$('#abc').on("click", function() {
  localStorage.clear();
  Task_List=[];
  DataObj = {text: "Wake Up", date: "06/07/2022", time: "1", taskid:1};    
  Task_List.push(DataObj);
  localStorage.setItem("Data_Storage", JSON.stringify({text: "Wake Up", date: "06/07/2022", time: 1, taskid:1}));
  var t= JSON.parse(localStorage.getItem("Data_Storage")); 
  localStorage.setItem("Task_id", 1);

});


var myTimer = function(){
  var dis_hour;
  today = new Date();
  var current_date1 = today.getDate();
  if (current_date1<10) current_date1="0"+current_date1;
  var current_month1=(today.getMonth()+1);
  if (current_month1<10) current_month1="0"+current_month1;
  var current_year1=today.getFullYear();
  now=current_month1+"/"+current_date1+"/"+current_year1
  
  
  var date = new Date($("#diaplayDate").val());
  weekday = date.getDay();
  console.log(weekday);
  if (current_date<=today.getDate()){
  current_hour = today.getHours();
  if(current_date<today.getDate()) 
    dis_hour=24;
  else {
   dis_hour=current_hour;
   $('#row'+dis_hour).css('background', '#ff6961');
   for(var i=dis_hour+1;i<24;i++){
    $('#row'+i).css('background', '#77dd77');
  }

  }
  for(var i=0;i<dis_hour;i++){
    disableRow(i);
  }
  } 
  else{
    for(var i=0;i<24;i++){
      $('#row'+i).css('background', '#77dd77');
    }
  }
 
 
  if (weekday>0 && weekday<6) temp="yellow";
  else temp="";
  
    for(i=9;i<18;i++){
    $('#list_textE'+i).css('background', temp);
    }
  
}


var enableRow = function(row){
  $('#row'+row).removeAttr("class");
    $('#row'+row).attr("class", "list-group-item");
    $('#row'+row).css('background', 'white');
    $('#row'+row).css('color', 'black');
    $('#create-task'+row).removeAttr("class");
    $('#create-task'+row).attr("class", "btn  btn-primary btn-sm col-2");
  };

  var disableRow = function(row){
  $('#row'+row).removeAttr("class");
    $('#row'+row).attr("class", "list-group-item list-group-item-dark disabled");
    $('#row'+row).css('background', 'grey');
    $('#row'+row).css('color', 'white');
    $('#create-task'+row).removeAttr("class");
    $('#create-task'+row).attr("class", "btn  btn-primary btn-sm col-2 disabled");
  };
  
 
// modal is fully visible
$("#task-form-modal").on("shown.bs.modal", function() {
  // highlight textarea
  $("#modalTaskDescription").trigger("focus");
});

// save button in modal was clicked
$("#task-form-modal .btn-primary").click(function(event) {
  // get form values
  var taskText = $("#modalTaskDescription").val();
  var taskDate = $("#modalDueDate").val();
  var taskTime = $("#modalDueTime").val();
  var match;
  var temp;

  if (taskText && taskDate) {
    
    console.log((taskDate==now),(taskTime>=current_hour),(taskDate>now));
    console.log(taskDate,now, taskTime, current_hour);
    if(((taskDate==now)&&(taskTime>=current_hour))||(taskDate>now)){

      match=parseInt(document.getElementById("edit_task").getAttribute("edit"));
              if (match>=0){
                Task_List[match].text=taskText;
                Task_List[match].date=taskDate;
                Task_List[match].time=taskTime;
                localStorage.removeItem("Data_Storage");
                localStorage.setItem("Data_Storage", JSON.stringify(Task_List));
                  Refresh_Table();
                  myTimer();
              }
              else {            
                createTask(taskText, taskDate, taskTime,task_id);
                DataObj = {text: taskText, date: taskDate, time: taskTime, taskid:task_id};    
                Task_List.push(DataObj);
                localStorage.setItem("Data_Storage", JSON.stringify(Task_List));
                task_id++;              
                localStorage.setItem("Task_id", task_id.toString());
             }

            $("#task-form-modal").modal("hide");


          }
          }

});












$('#exampleModal').on('show.bs.modal', function (event) {
  var button = $(event.relatedTarget) // Button that triggered the modal
  var recipient = button.data('whatever') // Extract info from data-* attributes
  // If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
  // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.

   var modal = $(this)
  modal.find('.modal-title').text('New message to ' + recipient)
  modal.find('.modal-body input').val(recipient)
})


var timer = setInterval(myTimer ,300000);