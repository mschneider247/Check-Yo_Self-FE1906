var todoGlobalArray = [];

var titleInput = document.querySelector(".nav__input--title");
var navBody = document.querySelector("nav");
var inspire = document.querySelector("#main__container--inspire");
var listInputError = document.querySelector("#nav__div--list-error");
var mainBody = document.querySelector("main");
var listInput = document.querySelector(".nav__input--task-item");
var tasklistArea = document.querySelector(".nav__container-task-list");
var titleInputError = document.querySelector("#nav__div--title-error");

titleInput.addEventListener('mouseout', mouseOutCreateInitialObject);
window.addEventListener("load", reInstantiate);
navBody.addEventListener('click', navEventHandler);
mainBody.addEventListener('click', mainEventHandler);

//--- Logic start for titleInput mouse out event---

function mouseOutCreateInitialObject(e) {
  if (checkTitleInput() === false) {
    return;
  } else if (checkDuplicateTitles() === false) {
    return;    
  }
  createNewCard(titleInput.value); 
}

function checkTitleInput() {
  if (titleInput.value !== ""){
    titleInputError.classList.add("hide");
    return true;
  }
  titleInputError.classList.remove("hide");
  return false;
}

function checkDuplicateTitles() {
  for (var i = 0; i < todoGlobalArray.length; i++) {
      if (todoGlobalArray[i].title === titleInput.value) {
        return false;
      };
  };
  return true;
}

function createNewCard(titleString) {
  var todoObject = newTodoObject(titleString);
  buildCard(todoObject);
}

function newTodoObject(titleString) {
  return {
    id: Date.now(),
    title: titleString,
    urgent: false,
    tasks: [],
    }
}

function buildCard(object) {
  var todoItem = new ToDoList(object);
  todoGlobalArray.push(todoItem);
}

//--- End of Logic for title mouse out event---
//--- Begin Logic for reload -- reInstantiate--

function reInstantiate(e) {
  var parsedTodoList = JSON.parse(localStorage.getItem("todoList"));
  if (parsedTodoList == null){
    inspire.classList.remove("hide");
    return;
  }
  for (var i = 0; i < parsedTodoList.length; i++) {
    buildCard(parsedTodoList[i]);
    reActivateDelete(i);
    populateCardToDOM(parsedTodoList[i]);
  }
}

function reActivateDelete(currentIndex) {
  var isCompleteCounter = 0;
  for (var i = 0; i < todoGlobalArray[currentIndex].tasks.length; i++) {
    if (todoGlobalArray[currentIndex].tasks[i].isComplete === false) {
      isCompleteCounter++;
    }
  }
  if (isCompleteCounter === 0) {
    todoGlobalArray[currentIndex].readyToDelete();
  }  
}

//--- End of Logic for reload, reInstantiate---
//--- Begin Logic for Nav content -------------

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
    removeTaskFromNavAndTodo(e);
  } 
}

function populateCardAndSave(index) {
  if ((todoGlobalArray[index].title === todoGlobalArray[0].title) && (checkTasksIsPopulated(index) === true)) {
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

function clearNavArea() {
  titleInput.value = "";
  listInput.value = "";
  tasklistArea.innerHTML = "";
  titleInputError.classList.add("hide");
  listInputError.classList.add("hide");
}

function determineUrgencyOnReload(todoObject) {
  if (todoObject.urgent === true){
    return ['main__card--urgent', 'icons/urgent-active.svg', 'main__p--red']
  }
  return ['', 'icons/urgent.svg', ''];
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

function cardCanBeDeleted(todoObject) {
  if (todoObject.deletable === false) {
    return 'main__p--shadow'
  } else if (todoObject.deletable === true) {
    return 'main__p--red'
  }
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

function populateTaskToNav(taskListObj) {
  tasklistArea.insertAdjacentHTML('beforeend', `<div class="nav__div--list-item" data-id=${taskListObj.id}>
          <img class="nav__div--list-img" src="icons/delete.svg" alt="Task bullet point">
          <p>
            ${taskListObj.text}
          </p>
        </div>`);
}

function clearAll() {
  for (var i = 0; i < todoGlobalArray.length; i++) {
    if ((todoGlobalArray[i].title === titleInput.value) || (todoGlobalArray[i].tasks.length === 0)) {
      todoGlobalArray.splice(i, 1);
    } 
  }
  clearNavArea();
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

function findIndex(e, taskArray, htmlClass) {
  var id = e.target.closest(`.${htmlClass}`).dataset.id;
  var getIndex = taskArray.findIndex(function(objIndex) {
        if (objIndex.id == id) {
          return objIndex.id;
        }
  });
  return parseInt(getIndex);
}

//--- End of Logic for Nav content ------------
//--- Begin Logic for Main content ------------

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
    }
  }
}

function findCardObj(cardId){
  return todoGlobalArray.find(function(index){
    return index.id === cardId })
}

function findId(e){
  return parseInt(e.target.closest(".main__card").getAttribute('data-id'));
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
  foundCard.saveToStorage(todoGlobalArray);
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
  console.log("deleteButtonClicked is firing!")
  var foundCard = findCardObj(findId(e));
  if (foundCard.deletable === true) {
    foundCard.deleteFromStorage(findId(e));
    e.target.parentElement.parentElement.parentElement.remove();
    localStorage.setItem("todoList", JSON.stringify(todoGlobalArray));
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

function checkListInput() {
  if (listInput.value !== ""){
    listInputError.classList.add("hide");
    return true;
  }
  listInputError.classList.remove("hide");
  return false;
};