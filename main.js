var todoGlobalArray = [];
var navBody = document.querySelector("nav");
var mainBody = document.querySelector("main");
var titleInput = document.querySelector(".nav__input--title");
var listInput = document.querySelector(".nav__input--task-item");
var titleInputError = document.querySelector("#nav__div--title-error");
var listInputError = document.querySelector("#nav__div--list-error");
var tasklistArea = document.querySelector(".nav__container-task-list");
var inspire = document.querySelector("#main__container--inspire");

mainBody.addEventListener('click', mainEventHandler);
navBody.addEventListener('click', navEventHandler);
titleInput.addEventListener('mouseout', mouseOutCreateInitialObject);
window.addEventListener("load", reInstantiate);

function mainEventHandler(e) {
  if (e.target.classList.contains('main__img--li')) {
    checkOffTask(e); 
  }
  if (e.target.classList.contains('main__img--delete')) {
    deleteButtonClicked(e);
  }
  if (e.target.classList.contains('main__img--urgent')) {
    urgentButtonClicked(e);
  }
}

function urgentButtonClicked(e) {
  var foundCard = findCardObj(findId(e));
  if (foundCard.urgent === false) {
    activateUrgency(foundCard, e);
  } else {
    deactivateUrgency(foundCard, e);
  }
  foundCard.saveToStorage(todoGlobalArray); 
}

function activateUrgency(foundCard, e) {
  e.target.src = "icons/urgent-active.svg";
  e.target.parentElement.parentElement.parentElement.classList.add('main__card--urgent');
  e.target.nextElementSibling.classList.add('main__p--red');
  foundCard.updateToDo(-1, true);
}

function deactivateUrgency(foundCard, e) {
  e.target.src = "icons/urgent.svg";
  e.target.parentElement.parentElement.parentElement.classList.remove('main__card--urgent');
  e.target.nextElementSibling.classList.remove('main__p--red');
  foundCard.updateToDo(-1, false);
}

function deleteButtonClicked(e) {
  if (e.target.parentElement.classList.contains('main__p--red')) {
    var foundCard = findCardObj(findId(e));
    foundCard.deleteFromStorage(findId(e));
    e.target.parentElement.parentElement.parentElement.remove();
    localStorage.setItem("todoList", JSON.stringify(todoGlobalArray));
  }
}

function checkOffTask(e) {
  e.target.src = "icons/delete-active.svg";
  var pNode = e.target.parentNode.children[1];
  pNode.classList.add("main__p--task-finished");
  var foundCard = findCardObj(findId(e));
  var taskId = parseInt(e.target.parentElement.dataset.id);
  for (var i = 0; i < foundCard.tasks.length; i++) {
    if (foundCard.tasks[i].id === taskId){
      foundCard.updateToDo(i)
      checkDeleteActivate(foundCard, e);
      foundCard.saveToStorage(todoGlobalArray);
    }
  }
}

function checkDeleteActivate(foundCard, e) {
  for (var i = 0; i < foundCard.tasks.length; i++) {
    if (foundCard.tasks[i].isComplete === false) {
      return;
    }
  }
  var deleteContainer = e.target.parentElement.parentElement.parentElement.childNodes[5].children[1];
  deleteContainer.classList.remove("main__p--shadow");
  deleteContainer.classList.add("main__p--red");
  foundCard.readyToDelete();
}

function findCardObj(cardId){
  console.log("cardId===", cardId);
  return todoGlobalArray.find(function(index){
    return index.id === cardId })
}

function findId(e){
  return parseInt(e.target.closest(".main__card").getAttribute('data-id'));
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
      taskArray.splice(taskIndex, 1);
      e.target.parentNode.remove();
    } 
  }   
}

function findIndex(e, array, htmlClass) {
  var id = e.target.closest(`.${htmlClass}`).dataset.id;
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
        todoGlobalArray[i].addNewTask(taskListObj);
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
    var urgencyArray = determineUrgencyOnReload(todoObject);
    mainBody.insertAdjacentHTML('afterbegin', `<card class="main__card ${urgencyArray[0]}" data-id=${todoObject.id}>
      <p class="main__p--title">
        ${todoObject.title}
      </p>
      <ul class="main__ul--tasks">
        ${populateTasksToCard(todoObject.tasks)}
      </ul>
      <footer>
        <container class="main__container--urgent">
          <img class="main__img--urgent" src=${urgencyArray[1]} alt="urgent symbol">
          <p ${urgencyArray[2]}>
            URGENT
          </p>
        </container>
        <container class="main__container--delete ${cardCanBeDeleted(todoObject)}">
          <img class="main__img--delete" src="icons/delete.svg" alt="delete symbol">
          <p>
            DELETE
          </p>
        </container>
      </footer>
    </card>`)
  }
}

function determineUrgencyOnReload(todoObject) {
  if (todoObject.urgent === true){
    return ['main__card--urgent', 'icons/urgent-active.svg', 'main__p--red']
  }
  return ['', 'icons/urgent.svg', ''];
}

function cardCanBeDeleted(todoObject) {
  if (todoObject.deletable === false) {
    return 'main__p--shadow'
  }
  return 'main__p--red'
}

function populateTasksToCard(tasks) {
  var taskList = "";
  for (var i = 0; i < tasks.length; i++){
    var checkImage = checkListImage(tasks, i);
    var pClass = setTaskStyle(checkImage);
    taskList += `<li data-id=${tasks[i].id} class="main__card--li">
          <img class="main__img--li" src=${checkImage} alt="icon check-box">
          <p class=${pClass}>${tasks[i].text}</p>
          </li>`
  }
  return taskList;
}

function checkListImage(tasks, index) {
  if (tasks[index].isComplete === true) {
    return "icons/delete-active.svg";
  } else {
    return "icons/checkbox.svg";
  } 
}

function setTaskStyle(checkImage) {
  if (checkImage === "icons/delete-active.svg") {
      return "main__p--task-finished"
    } else {
      return "";
    }
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