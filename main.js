var todoGlobalArray = [];
var navBody = document.querySelector("nav");
var titleInput = document.querySelector(".nav__input--title");
var listInput = document.querySelector(".nav__input--task-item");
var titleInputError = document.querySelector("#nav__div--title-error");
var listInputError = document.querySelector("#nav__div--list-error");
var tasklistArea = document.querySelector(".nav__container-task-list");

navBody.addEventListener('click', navEventHandler);
titleInput.addEventListener('mouseout', newObjectTitle);

function navEventHandler(e) {
  console.log(e);
  if (e.target.id === 'nav__button--add-new-task') {
    console.log("createNewCard firing!!!");
    createNewCard(titleInput.value);
  }
  if (e.target.className === 'nav__button--plus') {
    createNewTask(listInput.value, e);
  }
}

function newObjectTitle(e){
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
    var taskObject = {
      text: taskString,
      isComplete: false,
    }
    var taskli = new TaskList(taskObject);
    for (var i = 0; i < todoGlobalArray.length; i ++){
      if (todoGlobalArray[i].title === titleInput.value){
        todoGlobalArray[i].updateTask(taskli);
        // function to populate the DOM and clear the input
        populateTaskInDOM(taskli);
        listInput.value = "";
      }
    }
    console.log("todoListArray====",todoGlobalArray);
    };
};

function populateTaskInDOM(taskli) {
  console.log("populateTaskInDOM is firing!!");
  console.log("taskli object is====", taskli);
  tasklistArea.insertAdjacentHTML('afterend', `<div class="nav__div--list-item">
          <img class="nav__div--list-img" src="icons/delete.svg" alt="Task bullet point">
          <p>
            ${taskli.text}
          </p>
        </div>`);
}

function createNewCard(titleString) {
  // if (checkInputs() === false){
  //   console.log("checkInputs() is returning false!!!");
  //   return;
  // }
  var todoObject = {
    id: Date.now(),
    title: titleString,
    urgent: false,
    tasks: [],
  }
  var todoItem = new ToDoList(todoObject);
  // call a method?
  // todolist.addTaskList(listInput.value);
  // console.log(todolist);
  todoGlobalArray.push(todoItem);
  console.log("Global Array===", todoGlobalArray);
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