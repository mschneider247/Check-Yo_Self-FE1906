var todoGlobalArray = [];
var navBody = document.querySelector("nav");
var mainBody = document.querySelector("main");
var titleInput = document.querySelector(".nav__input--title");
var listInput = document.querySelector(".nav__input--task-item");
var titleInputError = document.querySelector("#nav__div--title-error");
var listInputError = document.querySelector("#nav__div--list-error");
var tasklistArea = document.querySelector(".nav__container-task-list");
var inspire = document.querySelector("#main__container--inspire")

// Okay for phase 2 I need somenew query selectors and event listeners
// for the main area...   looks like I already have a query selector 
// for it so check that off. The only thing I use it for right now
// is the add inner html for the main element.  I can add an event listener
// to that.  

//When an image is clicked it will find its parent id and match it
// to the id in global array.  Then I can target that specific element and change
// images when its clicked and changing the done state boolean...    ok

mainBody.addEventListener('click', mainEventHandler);
navBody.addEventListener('click', navEventHandler);
titleInput.addEventListener('mouseout', mouseOutCreateInitialObject);
window.addEventListener("load", reInstantiate);

function mainEventHandler(e) {
  console.log("Clicking in the MAIN area!!!!");
  console.log("e.target.classList.contains('main__img--li') ===", e.target.classList.contains("main__img--li"));
  if (e.target.classList.contains('main__img--li')) {
    console.log("Holy shit!! ewe hit the task complete button!!");
    console.log("e.target===", e.target);
    console.log("e.target.src===", e.target.src);
    e.target.src = "icons/delete-active.svg";
    console.log("e===", e);
    console.log("e.target.parentNode.children[1].classList===", e.target.parentNode.children[1].classList);
    var pNode = e.target.parentNode.children[1];
    console.log(pNode);
    pNode.classList.add("main__p--task-finished");
    // In populateTasksToCard  wtf am I trying to do??
    // in polulate"          " you can see the different elements
    // you want to change the p tag to be italic
    // --- match the p tag using the event console.log
    // you'll add a new class and then style that class
    // in the css
    // more styling!!


    // and change the object property to be true
    // this needs to be passed through the class
    // save to storage
    // dom gets updated in the main.js
  }

}

function navEventHandler(e) {
  if (e.target.id === 'nav__button--add-new-task') {
      for (var i = 0; i < todoGlobalArray.length; i++) {
        populateCardAndSave(i);
    }
  }
  if (e.target.className === 'nav__button--plus') {
    createNewTask(listInput.value);
  }
  if (e.target.id === 'nav__button--clear-all') {
    clearAll()
  }
  if (e.target.className === 'nav__div--list-img') {
    console.log("Clicking on the list image");
    removeTaskFromNavAndTodo(e);
  } 
}

function reInstantiate() {
  var parsedTodoList = JSON.parse(localStorage.getItem("todoList"));
  if (parsedTodoList == null){
    inspire.classList.remove("hide");
    return;
  }
  for (var i = 0; i < parsedTodoList.length; i++) {
    buildCard(parsedTodoList[i]);
    populateCardToDOM(parsedTodoList[i]);
  }
}

function removeTaskFromNavAndTodo(e) {
  var taskArray = todoGlobalArray[0].tasks
  for (var i = 0; i < taskArray.length; i++) {
    var taskIndex = findIndex(e, taskArray, 'nav__div--list-item')
    if (taskIndex >= 0) {
      console.log("taskIndex====", taskIndex);
      taskArray.splice(taskIndex, 1);
      e.target.parentNode.remove();
    } 
  }   
}

function findIndex(e, array, htmlAttribute) {
  var id = e.target.closest('.' + htmlAttribute).dataset.id;
  var getIndex = array.findIndex(function(index) {
        console.log("index.id===", index.id);
        console.log("id===", id);
        if (index.id == id) {
          return index.id;
        }
  });
  return parseInt(getIndex);
}

function populateCardAndSave(index) {
  if ((todoGlobalArray[index].title === titleInput.value) && (checkTasksIsPopulated(index) === true)) {
        inspire.classList.add("hide");
        populateCardToDOM(todoGlobalArray[index]);
        todoGlobalArray[index].saveToStorage(todoGlobalArray);
        clearNavArea();
  }
}

function checkTasksIsPopulated(index) {
  if (todoGlobalArray[index].tasks.length > 0) {
    listInputError.classList.add("hide");
    return true;
  }
  listInputError.classList.remove("hide");
  return false;
}

function clearAll() {
  console.log("Clear All function is firing!!");
  for (var i = 0; i < todoGlobalArray.length; i++) {
    if ((todoGlobalArray[i].title === titleInput.value) || (todoGlobalArray[i].tasks.length === 0)) {
      todoGlobalArray.splice(i, 1);
    } 
  }
  clearNavArea();
}

function clearNavArea() {
  titleInput.value = "";
  listInput.value = "";
  tasklistArea.innerHTML = '';
  titleInputError.classList.add("hide");
  listInputError.classList.add("hide");
}

//newToDoTitle needs a new name...   mouseOutCreateInitialObject
function mouseOutCreateInitialObject(e){
  console.log("mouseout is firing!");
  if (checkTitleInput() === false) {
    return;
  } else if (checkDuplicateTitles() === false) {
    return;    
  }
  createNewCard(titleInput.value); 
}

function checkDuplicateTitles() {
  for (var i = 0; i < todoGlobalArray.length; i++) {
      if (todoGlobalArray[i].title === titleInput.value) {
        return false;
      };
  };
  return true;
}

function createNewTask(taskString) {
  if (checkInputs() === false){
    return;
  } else {
    var taskObject = newTaskObject(taskString);
    var taskListObj = new TaskList(taskObject);
    for (var i = 0; i < todoGlobalArray.length; i ++){
      if (todoGlobalArray[i].title === titleInput.value){
        todoGlobalArray[i].updateTask(taskListObj);
        populateTaskToNav(taskListObj);
        listInput.value = "";
      }
    }
  };
};

function newTaskObject(taskString) {
  return {
      id: Date.now(),
      text: taskString,
      isComplete: false,
      }
}

function populateCardToDOM(todoObject) {
  if (todoGlobalArray.length > 0){
    mainBody.insertAdjacentHTML('afterbegin', `<card class="main__card" data-id=${todoObject.id}>
      <p class="main__p--title">
        ${todoObject.title}
      </p>
      <ul class="main__ul--tasks">
        ${populateTasksToCard(todoObject.tasks)}
      </ul>
      <footer>
        <container class="main__container--urgent">
          <img src="icons/urgent.svg" alt="urgent symbol">
          <p>
            URGENT
          </p>
        </container>
        <container class="main__container--delete">
          <img src="icons/delete.svg" alt="">
          <p>
            DELETE
          </p>
        </container>
      </footer>
    </card>`)
  }
}

function populateTasksToCard(tasks) {
  var taskList = "";
  for (var i = 0; i < tasks.length; i++){
    taskList += `<li data-id=${tasks.id} class="main__card--li">
          <img class="main__img--li" src="icons/checkbox.svg" alt="icon check-box">
          <p>${tasks[i].text}</p>
          </li>`
  }
  return taskList;
}

function populateTaskToNav(taskListObj) {
  tasklistArea.insertAdjacentHTML('beforeend', `<div class="nav__div--list-item" data-id=${taskListObj.id}>
          <img class="nav__div--list-img" src="icons/delete.svg" alt="Task bullet point">
          <p>
            ${taskListObj.text}
          </p>
        </div>`);
}

function createNewCard(titleString) {
  var todoObject = newTodoObject(titleString);
  buildCard(todoObject);
  console.log("Global Array===", todoGlobalArray);
}

function buildCard(object) {
  var todoItem = new ToDoList(object);
  todoGlobalArray.unshift(todoItem);
}

function newTodoObject(titleString) {
  return {
    id: Date.now(),
    title: titleString,
    urgent: false,
    tasks: [],
    }
}

function checkInputs() {
  if ((checkTitleInput() === true) && (checkListInput() === true)){
    return true;
  } else if ((checkTitleInput() === true) && (checkListInput() === false)){ 
    return false;
  } else {
    return false;
  }
}
 
function checkTitleInput() {
  if (titleInput.value !== ""){
    titleInputError.classList.add("hide");
    return true;
  }
  titleInputError.classList.remove("hide");
  return false;
}

function checkListInput() {
  if (listInput.value !== ""){
    listInputError.classList.add("hide");
    return true;
  }
  listInputError.classList.remove("hide");
  return false;
};