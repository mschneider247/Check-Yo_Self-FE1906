var todoGlobalArray = [];
var navBody = document.querySelector("nav");
var mainBody = document.querySelector("main");
var titleInput = document.querySelector(".nav__input--title");
var listInput = document.querySelector(".nav__input--task-item");
var titleInputError = document.querySelector("#nav__div--title-error");
var listInputError = document.querySelector("#nav__div--list-error");
var tasklistArea = document.querySelector(".nav__container-task-list");

navBody.addEventListener('click', navEventHandler);
titleInput.addEventListener('mouseout', newToDoTitle);

function navEventHandler(e) {
  if (e.target.id === 'nav__button--add-new-task') {
    for (var i = 0; i < todoGlobalArray.length; i++){
      populateCardAndSave(i);
    }
  }
  if (e.target.className === 'nav__button--plus') {
    createNewTask(listInput.value, e);
  }
  if (e.target.id === 'nav__button--clear-all') {
    clearAll()
  }
}

function populateCardAndSave(index) {
  if (todoGlobalArray[index].title === titleInput.value) {
        populateCardToDOM(todoGlobalArray[index]);
        todoGlobalArray[index].saveToStorage(todoGlobalArray);
        clearNavArea();
  }
}

function clearAll() {
  console.log("Clear All function is firing!!");
  for (var i = 0; i < todoGlobalArray.length; i++){
    if (todoGlobalArray[i].title === titleInput.value){
      todoGlobalArray.splice(i, 1);
    }
  }
  clearNavArea();
}

function clearNavArea() {
  titleInput.value = "";
  listInput.value = "";
  tasklistArea.innerHTML = '';
}

function newToDoTitle(e){
  console.log("mouseout is firing!");
  if (checkTitleInput() === false){
    return;
  } else {
    for (var i = 0; i < todoGlobalArray.length; i++){
      if (todoGlobalArray[i].title === titleInput.value){
        return;
      };
    };
  }
  createNewCard(titleInput.value); 
}

function createNewTask(taskString, e) {
  if (checkInputs() === false){
    return;
  } else {
    var taskObject = newTaskObject(taskString);
    var taskli = new TaskList(taskObject);
    for (var i = 0; i < todoGlobalArray.length; i ++){
      if (todoGlobalArray[i].title === titleInput.value){
        todoGlobalArray[i].updateTask(taskli);
        populateTaskToNav(taskli);
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
    mainBody.insertAdjacentHTML('afterbegin', `<card class="main__card">
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
    taskList += `<li>
          <img class="main__img--li" src="icons/checkbox.svg" alt="">
          <p>${tasks[i].text}</p>
          </li>`
  }
  return taskList;
}

function populateTaskToNav(taskli) {
  tasklistArea.insertAdjacentHTML('beforeend', `<div class="nav__div--list-item">
          <img class="nav__div--list-img" src="icons/delete.svg" alt="Task bullet point">
          <p>
            ${taskli.text}
          </p>
        </div>`);
}

function createNewCard(titleString) {
  var todoObject = newTodoObject(titleString);
  var todoItem = new ToDoList(todoObject);
  todoGlobalArray.push(todoItem);
  console.log("Global Array===", todoGlobalArray);
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