const date = document. querySelector('.date'),
  daysContainer = document.querySelector('.days'),
  prev = document.querySelector('.prev'),
  next = document.querySelector('.next'),
  gotoBtn = document.querySelector('.goto-btn'),
  todayBtn  = document.querySelector('.today-btn'),
  dateInput = document.querySelector('.date-input'),
  calendarDay = document.querySelector(".calendar-day"),
  calendarDate = document.querySelector(".calendar-date"),

  habitsContainer = document.querySelector('.habits'),
  goalsContainer = document.querySelector('.goals'),
  highlightContainer = document.querySelector('.highlights'),

  addHabitBtn = document.getElementById('add-habit'),
  addGoalBtn = document.getElementById('add-goal'),
  addHighlightBtn = document.getElementById('add-highlight'),

  addHabitWrapper = document.querySelector('.add-habit-wrapper'),
  addGoalWrapper = document.querySelector('.add-goal-wrapper'),
  addHighlightWrapper = document.querySelector('.add-highlight-wrapper'),

  closeButtons = document.querySelectorAll('.close'),

  addHabitName = document.getElementById('habit-name'),
  addGoalName = document.getElementById('goal-name'),
  addHighlightName = document.getElementById('highlight-name'),

  addHabitSubmitBtn = document.getElementById('add-habit-btn'),
  addGoalSubmitBtn = document.getElementById('add-goal-btn'),
  addHighlightSubmitBtn = document.getElementById('add-highlight-btn')
;
// Calendar variables
let today = new Date();
let activeDay;
let month = today.getMonth();
let year = today.getFullYear();

// Months array
const months = [
  'January', 'February', 'March', 'April',
  'May', 'June', 'July',
  'August', 'September', 'October',
  'November', 'December',
];

// Initializing arrays
let habitsArray = [];
let goalsArray = [];
let highlightsArray = [];

// Getting habits, goals, highlights from Local Storage
getHabits();
getGoals();
getHighlights();

//Function to add days
function initCalendar() {
  //Getting previous month days and current month days and remaining next month days
  const firstDay = new Date(year, month, 0);
  const lastDay = new Date(year, month + 1, 0);
  const prevLastDay = new Date(year, month, 0);
  const prevDays = prevLastDay.getDate();
  const lastDate = lastDay.getDate();
  const day = firstDay.getDay();
  const nextDays = 7 - lastDay.getDay() - 1;

  //Updating date on top of calendar
  date.innerHTML = months[month] + " " + year;

  //Adding days on DOM

  //Adding previous month days
  let days = "";
  for (let x = day; x > 0; x--){
    days += `<div class="day prev-date">${prevDays - x + 1}</div>`
  }

  //Current month days
  for (let i = 1; i <= lastDate; i++){

    let highlightFound = false;
    highlightsArray.forEach((highlightObject) => {
      if(
        highlightObject.day === i &&
        highlightObject.month === month + 1 &&
        highlightObject.year === year
      ) {
        //If this day highlight found
        highlightFound = true;
      }
    });

    //If day is today adding class today
    if(
      i === new Date().getDate() &&
      year === new Date().getFullYear() &&
      month === new Date().getMonth()
    ){
      activeDay = i;
      getActiveDay(i);
      updateHabits(i);
      updateGoals();
      updateHighlight(i);

      //If completed habit found also add habit class
      if(highlightFound) {
        days += `<div class="day today active done">${i}</div>`
      } else {
        days += `<div class="day today active">${i}</div>`
      }

    }
    //Adding remaining days
    else {
      if(highlightFound) {
        days += `<div class="day done">${i}</div>`
      } else {
        days += `<div class="day">${i}</div>`
      }
    }
  }

  //Adding next month days
  for (let j = 1; j <= nextDays + 1; j++) {
    days += `<div class="day next-date">${j}</div>`
  }
  daysContainer.innerHTML = days
  //Add listener after calender initialized
  addListener();
}

initCalendar();

//Previous month
function previousMonth(){
  month--;
  if(month < 0){
    month = 11;
    year--;
  }
  initCalendar();
}

//Next month
function nextMonth(){
  month++;
  if(month > 11){
    month = 0;
    year++;
  }
  initCalendar();
}

//Adding event listeners on prev and next buttons
prev.addEventListener("click", previousMonth);
next.addEventListener("click", nextMonth);

//'Go to date' and 'Today' buttons functionality
todayBtn.addEventListener('click', function(){
  today = new Date();
  month = today.getMonth();
  year = today.getFullYear();
  initCalendar();
});

//Date input validation
dateInput.addEventListener('input', function(event){
  //Allow only numbers, removing anything else
  dateInput.value = dateInput.value.replace(/[^0-9]/g, "");

  if(dateInput.value.length >= 2 && dateInput.value.indexOf("/") === -1) {
    //Adding a slash if two or more numbers entered and there is no slash yet
    dateInput.value = dateInput.value.slice(0,2) + "/" + dateInput.value.slice(2);
  }

  if(dateInput.value.length > 7){
    //Don't allow more than 7 characters
    dateInput.value = dateInput.value.slice(0,7)
  }

  //If backspace pressed
  if(event.inputType === 'deleteContentBackward'){
    if(dateInput.value.length === 3){
      dateInput.value = dateInput.value.slice(0,2)
    }
  }
});

gotoBtn.addEventListener('click', gotoDate);

//Function to go to entered date
function gotoDate(){
  const dateArr = dateInput.value.split("/");
  //Little date validation
  if(dateArr.length === 2){
    if(dateArr[0] > 0 && dateArr[0] < 13 && dateArr[1].length === 4){
      month = dateArr[0] - 1
      year = dateArr[1];
      initCalendar();
      return;
    }
    //If invalid date
    alert("Invalid date!")
  }
}

// Add habit, goal, highlight functions, logic
addHabitBtn.addEventListener('click', function(){
  addHighlightWrapper.classList.remove('active');
  addGoalWrapper.classList.remove('active');
  addHabitWrapper.classList.toggle('active');
});

addGoalBtn.addEventListener('click', function(){
  addHighlightWrapper.classList.remove('active');
  addHabitWrapper.classList.remove('active');
  addGoalWrapper.classList.toggle('active');
});

addHighlightBtn.addEventListener('click', function(){
  addHabitWrapper.classList.remove('active');
  addGoalWrapper.classList.remove('active');
  addHighlightWrapper.classList.toggle('active');
});

// If click is outside add window
document.addEventListener('click', (event)=>{
  if(event.target !== addHabitBtn && !addHabitWrapper.contains(event.target)){
    addHabitWrapper.classList.remove('active');
  }
  if(event.target !== addGoalBtn && !addGoalWrapper.contains(event.target)){
    addGoalWrapper.classList.remove('active');
  }
  if(event.target !== addHighlightBtn && !addHighlightWrapper.contains(event.target)){
    addHighlightWrapper.classList.remove('active');
  }
});

//Popup menu close button listener
closeButtons.forEach((button) => {
  button.addEventListener('click', () => {
    addHabitWrapper.classList.remove('active');
    addGoalWrapper.classList.remove('active');
    addHighlightWrapper.classList.remove('active');
  })
}
);

// Allow only 50 chars in habit title
addHabitName.addEventListener('input', function(){
  addHabitName.value = addHabitName.value.slice(0, 50);
});

// Allow only 50 chars in goal title
addGoalName.addEventListener('input', function(){
  addGoalName.value = addGoalName.value.slice(0, 100);
});

// Allow only 150 chars in goal title
addHighlightName.addEventListener('input', function(){
  addHighlightName.value = addHighlightName.value.slice(0, 150);
});

//Function to add listener on days after rendered
function addListener(){
  const days = document.querySelectorAll('.day');
  days.forEach((day) => {
    day.addEventListener('click', (e) => {
      //Set current day as active day
      activeDay = Number(e.target.innerHTML);

      //Call active day function click
      getActiveDay(e.target.innerHTML);
      updateHabits(Number(e.target.innerHTML));
      updateGoals();
      updateHighlight(Number(e.target.innerHTML))

      //Remove active from already active day
      days.forEach((day) => {
        day.classList.remove('active');
      });

      //If previous month day clicked goto previous month and add active
      if(e.target.classList.contains('prev-date')){
        previousMonth();
        setTimeout(() => {
          //Selecting all days of this month
          const days = document.querySelectorAll('.day');

          //After going to previous month add active to clicked
          days.forEach((day)=>{
            if(!day.classList.contains('prev-date') &&
              day.innerHTML === e.target.innerHTML
            ) {
              day.classList.add("active");
            }
          });
        }, 100);

        //Same with next month days
      } else if(e.target.classList.contains('next-date')){
        nextMonth();

        setTimeout(() => {
          //Selecting all days of this month
          const days = document.querySelectorAll('.day');

          //After going to next month add active to clicked
          days.forEach((day)=>{
            if(!day.classList.contains('next-date') &&
              day.innerHTML === e.target.innerHTML
            ) {
              day.classList.add("active");
            }
          });
        }, 100);
      } else {
        //Remaining days of the month
        e.target.classList.add("active");
      }
    });
  });
}

//Function for showing active day and date on top of the right part
function getActiveDay(date){
  const day = new Date(year, month, date);
  calendarDay.innerHTML = day.toString().split(" ")[0];
  calendarDate.innerHTML = date + " " + months[month] + " " + year;
}

//Function to show daily habits
function updateHabits(date){
  let habits = "";
  habitsArray.forEach((habit) => {
    //Get habits of active day only
    if(
      date === habit.day &&
      month + 1 === habit.month &&
      year === habit.year
    ){
     //Then show habits on DOM
     habit.habits.forEach(habit => {
       if(habit.completed){
         habits +=
           `
          <div class="habit completed">
            <div class="title">
              <i class="fas fa-circle"></i>
              <h3 class="habit-title">${habit.title}</h3>
            </div>
              <i class="fa-solid fa-trash-can delete-icon"></i>
          </div>
         `
       } else {
         habits +=
           `
            <div class="habit">
              <div class="title">
                <i class="fas fa-circle"></i>
                <h3 class="habit-title">${habit.title}</h3>
              </div>
                <i class="fa-solid fa-trash-can delete-icon"></i>
            </div>
           `
       }
     });
    }
  });

  //If nothing found
  if(habits === ""){
    habits =
      `
      <div class="no-habit">
        <p>No habits yet</p>
      </div>
      `;
  }

  habitsContainer.innerHTML = habits;
  // Save habits when update habit called
  saveHabits();
}

//Function to show monthly goals
function updateGoals(){
  let goals = "";
  goalsArray.forEach((goal) => {
    //Get goals of active day only
    if(
      month + 1 === goal.month &&
      year === goal.year
    ){
      //Then show goals on DOM
      goal.goals.forEach(goal => {
        if(goal.completed){
          goals +=
            `
          <div class="goal completed">
            <div class="title">
              <i class="fas fa-circle"></i>
              <h3 class="goal-title">${goal.title}</h3>
            </div>
              <i class="fa-solid fa-trash-can delete-icon"></i>
          </div>
         `
        } else {
          goals +=
            `
            <div class="goal">
              <div class="title">
                <i class="fas fa-circle"></i>
                <h3 class="goal-title">${goal.title}</h3>
              </div>
                <i class="fa-solid fa-trash-can delete-icon"></i>
            </div>
           `
        }
      });
    }
  });

  //If nothing found
  if(goals === ""){
    goals =
      `
      <div class="no-goal">
        <p>No goals yet</p>
      </div>
      `;
  }

  goalsContainer.innerHTML = goals;
  // Save habits when update habit called
  saveGoals();
}

//Function to show day's highlight
function updateHighlight(date){
  let highlights = "";
  highlightsArray.forEach((highlight) => {
    //Get highlights of active day only
    if(
      date === highlight.day &&
      month + 1 === highlight.month &&
      year === highlight.year
    ){
      //Then show highlights on DOM
      highlight.highlights.forEach(highlight => {
        highlights +=
          `
          <div class="highlight">
            <div class="title">
              <i class="fas fa-circle"></i>
              <h3 class="highlight-title">${highlight.title}</h3>
            </div>
            <i class="fa-solid fa-trash-can delete-icon"></i>
          </div>
           `
      });
    }
  });

  //If nothing found
  if(highlights === ""){
    highlights =
      `
      <div class="no-highlight">
        <p>No highlights yet</p>
      </div>
      `;
  }

  highlightContainer.innerHTML = highlights;
  // Save highlights when update habit called
  saveHighlights();
}

// Function to add new habits
addHabitSubmitBtn.addEventListener('click', function(){
  const habitName = addHabitName.value;
  // Some validation
  if(habitName === ""){
    alert("Please enter a valid habit name");
    return;
  }
  const newHabit = {
    title: habitName,
    completed: false,
  };

  let habitAdded = false;

  // Checking if habit list is not empty
  if(habitsArray.length > 0){
    // Checking if current day has already any goals then add to that
    habitsArray.forEach(item => {
      if(item.day === activeDay &&
        item.month === month + 1 &&
        item.year === year
      ) {
        item.habits.push(newHabit);
        habitAdded = true;
      }
    });
  }

  // If habit array is empty or day has no habits, create new
  if(!habitAdded){
    habitsArray.push(
      {
        day: activeDay,
        month: month + 1,
        year: year,
        habits: [newHabit],
      }
    );
  }

  // Remove active class from add new habit form
  addHabitWrapper.classList.remove("active");
  // Clear the fields
  addHabitName.value = "";

  // Show current added habit
  updateHabits(activeDay);
  updateGoals(activeDay);
  updateHighlight(activeDay);

  // Add habit class to newly added day if not already
  const activeDayElement = document.querySelector('.day.active');
  //TODO Change done class logic
  if(!activeDayElement.classList.contains('done')){
    activeDayElement.classList.add('done');
  }

});

// Cross habit function
habitsContainer.addEventListener('click', (event)=>{
  if(event.target.classList.contains('habit')){
    const habitTitle = event.target.children[0].children[1].innerHTML;
    // Get the title of habit than search in array by title and add completed
    habitsArray.forEach((habit) => {
      if(
        habit.day === activeDay &&
        habit.month === month + 1 &&
        habit.year === year
      ){
        habit.habits.forEach((item, index) => {
          if(item.title === habitTitle){
            item.completed = !item.completed;
          }
        });
      }
    });
    // After adding completed as true update habit
    updateHabits(activeDay);
  }
});

// Remove habit function
habitsContainer.addEventListener('click', (event) => {
  if (event.target.classList.contains('delete-icon')) {
    if (confirm("Are you sure you want to delete this habit?")) {
      const habitItem = event.target.closest('.habit');
      if (habitItem) {
        const habitTitle = habitItem.querySelector('.habit-title').innerHTML;
        habitsArray.forEach((habit, index) => {
          if (
            habit.day === activeDay &&
            habit.month === month + 1 &&
            habit.year === year
          ) {
            habit.habits.forEach((item, itemIndex) => {
              if (item.title === habitTitle) {
                // Remove the habit from the array
                habit.habits.splice(itemIndex, 1);
                // If no habits remaining on that day, remove the entire day from the array
                if (habit.habits.length === 0) {
                  habitsArray.splice(index, 1);
                  // Also remove the 'done' class from the day element if it exists
                  const activeDayElement = document.querySelector('.day.active');
                  if (activeDayElement.classList.contains('done')) {
                    activeDayElement.classList.remove('done');
                  }
                }
                // Update the habits
                updateHabits(activeDay);
                // Optionally, you can also save the updated habits array to localStorage
                saveHabits();
              }
            });
          }
        });
      }
    }
  }
});

// Function to add new goals
addGoalSubmitBtn.addEventListener('click', function(){
  const goalName = addGoalName.value;
  // Some validation
  if(goalName === ""){
    alert("Please enter a valid goal name");
    return;
  }
  const newGoal = {
    title: goalName,
    completed: false,
  };

  let goalAdded = false;

  // Checking if goals list is not empty
  if(goalsArray.length > 0){
    // Checking if current day has already any goals then add to that
    goalsArray.forEach(item => {
      if
      (
        item.month === month + 1 &&
        item.year === year
      ) {
        item.goals.push(newGoal);
        goalAdded = true;
      }
    });
  }

  // If goals array is empty or day has no goals, create new
  if(!goalAdded){
    goalsArray.push(
      {
        month: month + 1,
        year: year,
        goals: [newGoal],
      }
    );
  }

  // Remove active class from add new goals form
  addGoalWrapper.classList.remove("active");
  // Clear the field
  addGoalName.value = "";

  // Show current added goal
  updateGoals(activeDay);

  // Add done class to newly added day if not already
  const activeDayElement = document.querySelector('.day.active');
  //TODO Change done class logic
  if(!activeDayElement.classList.contains('done')){
    activeDayElement.classList.add('done');
  }

});

// Cross habit function
goalsContainer.addEventListener('click', (event)=>{
  if(event.target.classList.contains('goal')){
    const goalTitle = event.target.children[0].children[1].innerHTML;
    // Get the title of goal than search in array by title and add completed
    goalsArray.forEach((goal) => {
      if(
        goal.month === month + 1 &&
        goal.year === year
      ){
        goal.goals.forEach((item, index) => {
          if(item.title === goalTitle){
            item.completed = !item.completed;
          }
        });
      }
    });
    // After adding completed as true update goal
    updateGoals();
  }
});

// Remove goal function
goalsContainer.addEventListener('click', (event) => {
  if (event.target.classList.contains('delete-icon')) {
    if (confirm("Are you sure you want to delete this goal?")) {
      const goalItem = event.target.closest('.goal');
      if (goalItem) {
        const goalTitle = goalItem.querySelector('.goal-title').innerHTML;
        goalsArray.forEach((goal, index) => {
          if (
            goal.month === month + 1 &&
            goal.year === year
          ) {
            goal.goals.forEach((item, itemIndex) => {
              if (item.title === goalTitle) {
                // Remove the goal from the array
                goal.goals.splice(itemIndex, 1);
                // If no goals remaining in that month, remove the entire month from the array
                if (goal.goals.length === 0) {
                  goalsArray.splice(index, 1);
                  // Also remove the 'done' class from the day element if it exists
                  const activeDayElement = document.querySelector('.day.active');
                  if (activeDayElement.classList.contains('done')) {
                    activeDayElement.classList.remove('done');
                  }
                }
                // Update the goals
                updateGoals();
                // Optionally, you can also save the updated goals array to localStorage
                saveGoals();
              }
            });
          }
        });
      }
    }
  }
});

// Function to add new highlights
addHighlightSubmitBtn.addEventListener('click', function(){
  const highlightName = addHighlightName.value;
  // Some validation
  if(highlightName === ""){
    alert("Please enter a valid highlight");
    return;
  }
  const newHighlight = {
    title: highlightName,
  };

  let highlightAdded = false;

  // Checking if highlight list is not empty
  if(highlightsArray.length > 0){
    // Checking if current day has already any highlight then add to that
    highlightsArray.forEach(item => {
      if(item.day === activeDay &&
        item.month === month + 1 &&
        item.year === year
      ) {
        item.highlights.push(newHighlight);
        highlightAdded = true;
      }
    });
  }

  // If highlight array is empty or day has no habits, create new
  if(!highlightAdded){
    highlightsArray.push(
      {
        day: activeDay,
        month: month + 1,
        year: year,
        highlights: [newHighlight],
      }
    );
  }

  // Remove active class from add new highlight form
  addHighlightWrapper.classList.remove("active");
  // Clear the fields
  addHighlightName.value = "";

  // Show current added highlight
  updateHighlight(activeDay);

  // Add done class to newly added day if not already
  const activeDayElement = document.querySelector('.day.active');
  //TODO Change done class logic
  if(!activeDayElement.classList.contains('done')){
    activeDayElement.classList.add('done');
  }
});

// Remove highlight function
highlightContainer.addEventListener('click', (event) => {
  if (event.target.classList.contains('delete-icon')) {
    if (confirm("Are you sure you want to delete this highlight?")) {
      const highlightItem = event.target.closest('.highlight');
      if (highlightItem) {
        const highlightTitle = highlightItem.querySelector('.highlight-title').innerHTML;
        highlightsArray.forEach((highlight, index) => {
          if (
            highlight.day === activeDay &&
            highlight.month === month + 1 &&
            highlight.year === year
          ) {
            highlight.highlights.forEach((item, itemIndex) => {
              if (item.title === highlightTitle) {
                // Remove the highlight from the array
                highlight.highlights.splice(itemIndex, 1);
                // If no highlights remaining on that day, remove the entire day from the array
                if (highlight.highlights.length === 0) {
                  highlightsArray.splice(index, 1);
                  // Also remove the 'done' class from the day element if it exists
                  const activeDayElement = document.querySelector('.day.active');
                  if (activeDayElement.classList.contains('done')) {
                    activeDayElement.classList.remove('done');
                  }
                }
                // Update the highlights
                updateHighlight(activeDay);
                // Optionally, you can also save the updated highlights array to localStorage
                saveHighlights();
              }
            });
          }
        });
      }
    }
  }
});

// Functions for storing and getting habits from local storage
function saveHabits(){
  localStorage.setItem("habits", JSON.stringify(habitsArray));
}

function getHabits(){
  if(localStorage.getItem("habits") === null){
    return;
  }
  habitsArray.push(...JSON.parse(localStorage.getItem("habits")));
}

// Functions for storing and getting goals from local storage
function saveGoals(){
  localStorage.setItem("goals", JSON.stringify(goalsArray));
}

function getGoals(){
  if(localStorage.getItem("goals") === null){
    return;
  }
  goalsArray.push(...JSON.parse(localStorage.getItem("goals")));
}

// Functions for storing and getting highlights from local storage
function saveHighlights(){
  localStorage.setItem("highlights", JSON.stringify(highlightsArray));
}

function getHighlights(){
  if(localStorage.getItem("highlights") === null){
    return;
  }
  highlightsArray.push(...JSON.parse(localStorage.getItem("highlights")));
}
