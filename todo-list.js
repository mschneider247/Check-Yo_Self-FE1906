class ToDoList {
  constructor(object) {
    this.id = object.id;
    this.title = object.title;
    this.urgent = object.urgent;
    this.tasks = object.tasks;
    this.deletable = false;
  }

  addNewTask(taskliObj) {
    this.tasks.push(taskliObj)
  }

  updateToDo(index, urgent) {
    if (index >= 0) {
      this.tasks[index].isComplete = true;
      return;
    }
    this.urgent = urgent;
  }

  updateTask(taskliObj) {
    console.log("taskliObj===", taskliObj); 
  }

  saveToStorage(todoGlobalArray) {
    localStorage.setItem("todoList", JSON.stringify(todoGlobalArray));
  }

  readyToDelete() {
    this.deletable = true;
  }

  deleteFromStorage(cardId) {
    for (var i = 0; i < todoGlobalArray.length; i++) {
      if (todoGlobalArray[i].id === cardId) {
        todoGlobalArray.splice(i, 1);
      }
    }
  }
}

class TaskList {
  constructor(object) {
    this.id = object.id;
    this.text = object.text;
    this.isComplete = object.isComplete;
  }
}