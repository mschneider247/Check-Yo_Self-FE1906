var todoListArray = [];
var navBody = document.querySelector("nav");
var titleInput = document.querySelector(".nav__input--title");
var listInput = document.querySelector(".nav__input--task-item");

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
  var taskItem = {
    text: taskString,
    isComplete: false,
  }
  var taskli = new TaskList(taskItem);
  todoListArray[0].updateTask(taskli);
  console.log("todoListArray====",todoListArray);
}

function createNewCard(titleString) {
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