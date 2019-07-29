var todoGlobalArray = [];
var navBody = document.querySelector("nav");
var mainBody = document.querySelector("main");
var titleInput = document.querySelector(".nav__input--title");
var listInput = document.querySelector(".nav__input--task-item");
var titleInputError = document.querySelector("#nav__div--title-error");
var listInputError = document.querySelector("#nav__div--list-error");
var tasklistArea = document.querySelector(".nav__container-task-list");
var inspire = document.querySelector("#main__container--inspire")

navBody.addEventListener('click', navEventHandler);
titleInput.addEventListener('mouseout', newToDoTitle);
window.addEventListener("load", reInstantiate);

function reInstantiate(){
  var parsedTodoList = JSON.parse(localStorage.getItem("todoList"));
  if (parsedTodoList == null){
    inspire.classList.remove("hide");
    return;
  }
  for (var i = 0; i < parsedTodoList.length; i++){
    buildCard(parsedTodoList[i]);
    populateCardToDOM(parsedTodoList[i]);
  }
}

//need another event listener for the x button on the
//individual tasks as they pop up in the dom
//this event will delete that element from the dom
//but also needs to remove the coorisponding task from
//the data model
function navEventHandler(e) {
  if (e.target.id === 'nav__button--add-new-task') {
      for (var i = 0; i < todoGlobalArray.length; i++){
        populateCardAndSave(i);
    }
  }
  if (e.target.className === 'nav__button--plus') {
    createNewTask(listInput.value);
  }
  if (e.target.id === 'nav__button--clear-all') {
    clearAll()
  }
  if (e.target.className === 'nav__div--list-img'){
    console.log("Clicking on the list image");
    removeTaskFromNavAndTodo(e);
  } 
}

// instead of pointing to GlobalArray 0 we can change how we load in the objects...
function removeTaskFromNavAndTodo(e) {
  var taskArray = todoGlobalArray[0].tasks
  for (var i = 0; i < taskArray.length; i++){
    var taskIndex = findIndex(e, taskArray, 'nav__div--list-item')
    if (taskIndex >= 0){
      console.log("taskIndex====", taskIndex);
      taskArray.splice(taskIndex, 1);
      e.target.parentNode.remove();
    }
    
  }   
}

function findIndex(e, array, item) {
  var id = e.target.closest('.' + item).dataset.id;
  var getIndex = array.findIndex(function(index) {
        console.log("index.id===", index.id);
        console.log("id===", id);
        if (index.id == id){
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

function newToDoTitle(e){
  console.log("mouseout is firing!");
  if (checkTitleInput() === false){
    return;
  } else if (checkDuplicateTitles() === false){
    return;    
  }
  createNewCard(titleInput.value); 
}

function checkDuplicateTitles() {
  for (var i = 0; i < todoGlobalArray.length; i++){
      if (todoGlobalArray[i].title === titleInput.value){
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
    taskList += `<li data-id=${tasks.id}>
          <img class="main__img--li" src="icons/checkbox.svg" alt="">
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

function checkInputs (){
  if ((checkTitleInput() === true) && (checkListInput() === true)){
    return true;
  } else if ((checkTitleInput() === true) && (checkListInput() === false)){ 
    return false;
  } else {
    return false;
  }
}
 
function checkTitleInput(){
  if (titleInput.value !== ""){
    titleInputError.classList.add("hide");
    return true;
  }
  titleInputError.classList.remove("hide");
  return false;
}

function checkListInput(){
  if (listInput.value !== ""){
    listInputError.classList.add("hide");
    return true;
  }
  listInputError.classList.remove("hide");
  return false;
};