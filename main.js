var todoListArray = [];
var navBody = document.querySelector("nav");
var titleInput = document.querySelector(".nav__input--title");
var listInput = document.querySelector(".nav__input--task-item");
var titleInputError = document.querySelector("#nav__div--title-error");
var listInputError = document.querySelector("#nav__div--list-error");

navBody.addEventListener('click', navEventHandler);

function navEventHandler(e) {
  console.log(e);
  if (e.target.id === 'nav__button--add-new-task') {
    createNewCard(titleInput.value);
  }
  if (e.target.className === 'nav__button--plus') {
    console.log("listInput.value===", listInput.value);
    createNewTask(listInput.value)
  }
}

function createNewTask(taskString, e) {
  if (checkInputs() === false){
    return;
  } else {
    var taskItem = {
      text: taskString,
      isComplete: false,
    }
    var taskli = new TaskList(taskItem);
    //for loop?? that adds stuff to our tasklist??
    //a method in our class TaskList?!  FUCK YA!!
    //for (var i = 0; i < )
    todoListArray[0].updateTask(taskli);
    console.log("todoListArray====",todoListArray);
    };
};

function createNewCard(titleString) {
  if (checkInputs() === false){
    return;
  }
  var todoObject = {
    id: Date.now(),
    title: titleString,
    urgent: false,
    tasks: [],
  }
  var todolist = new ToDoList(todoObject);
  console.log(todolist);
  todoListArray.push(todolist);
  console.log("Global Array===", todoListArray);
}

function checkInputs (){
  if ((checkTitleInput() === true) && (checkListInput() === true)){
    console.log("checkTitleInput and checkLoist Input are returning true");
    titleInputError.classList.add("hide");
    listInputError.classList.add("hide");
    return true;
  } else if ((checkTitleInput() === true) && (checkListInput() === false)){
    titleInputError.classList.add("hide");
    listInputError.classList.remove("hide"); 
    return false;
  } else {
    titleInputError();
    return false;
  }
}

function checkTitleInput(){
  if (titleInput.value !== ""){
    return true;
  }
  titleInputError.classList.remove("hide");
  return false;
}

function checkListInput(){
  if (listInput.value !== ""){
    return true;
  }
  listInputError.classList.remove("hide");
  return false;
};