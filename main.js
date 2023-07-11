var currentDayElem = $('#currentDay');


// textarea is replaced by old input

$(document).on('click', '.saveBtn', function () {
  var curHour = $(this).parent().attr("id");
  console.log("pre-slice parent is:", curHour);
  
  curHour = curHour.slice(5); // removing leading "hour-"
  console.log("post-slice parent is:", curHour);

  var curNumHour = +curHour;  // string is converted to a number

  var curTextArea = $(this).prev(".description").val().trim();
  console.log("textarea says:\n"+ curTextArea);


  // current activity array
  var oldArray = loadPlanner();
  var newArray = [];


 // items are only added onto new array if they're not for new saved hour

  $.each(oldArray, function(index, activity) {
    if(oldArray[index].time != curNumHour) {
        newArray.push(oldArray[index]);
      }
  });


  
 // new object is created

 var newActObj = {"time": curNumHour,"desc": curTextArea};
  console.log("new object is:", newActObj);

  //new saved hour object is pushed to new activity array

  newArray.push(newActObj);
  console.log("new array is", newArray);

  // new activity saved onto array for localStorage

  localStorage.setItem("daily-planner", JSON.stringify(newArray));
});


// color panel coded as a jquery call

$(function colorPlanner () {

  // work hours
  const workHoursArray = ["hour-9", "hour-10","hour-11","hour-12",
  "hour-13","hour-14","hour-15","hour-16","hour-17"]; 

  // colore based on current time
  $.each(workHoursArray, function(index, hour) {
    let curPlannerElem = $("#"+`${hour}`);
    var curHour =  dayjs().format('H'); //correct code

    
    // let curHour = 12; // temp for testing setting time to noon

    if ((curHour-9) < `${index}`) {
      curPlannerElem.removeClass();
      curPlannerElem.addClass('row time-block past');

    } else if ((curHour-9) == `${index}`) {
      curPlannerElem.removeClass();
      curPlannerElem.addClass('row time-block present');

    } else {
      curPlannerElem.removeClass();
      curPlannerElem.addClass('row time-block future');
    }
  });
});


//current state of planner

function displayPlanner (planner) {


  //if planner has content for this hour, load into textarea

  $.each(planner, function(index, entry) {
    let curPlan = entry;
    let actTime = curPlan.time;
    let actDesc = curPlan.desc;
    let hourDiv = $("#hour-"+`${actTime}`);
    let textAreaElem = hourDiv.children(".description");
    let prevActs = textAreaElem.val();


    //if previous activities are located for certain hour make sure theres no blank to then combine
  
    if (prevActs) {
      if (prevActs.length !== " " ) {
        actDesc = (prevActs + actDesc);
      }
    }
    textAreaElem.val(actDesc+"\n");
  });
};

//load planner entries

function loadPlanner () {
  var dailyPlanner = localStorage.getItem('daily-planner');
 

  // if there is stored content load it

  if (dailyPlanner) {
    dailyPlanner = JSON.parse(dailyPlanner);
    // console.log("loadplanner: daily-planner contains:", dailyPlanner);
  }

  else {
    dailyPlanner = [];
    // console.log("nothing in localStorage for daily-planner");
  }
  return dailyPlanner;
}

function init () {

  //set current day

  let currentTime = dayjs().format('dddd, MMMM D, YYYY');


  // console.log(currentTime);
  currentDayElem.text(currentTime);


  //load entries, then return to daily planner
  
  var plannerEntries = loadPlanner();
  displayPlanner(plannerEntries);
}

init ();