class ToDoList {
  constructor(object) {
    this.id = object.id;
    this.title = object.title;
    this.urgent = object.urgent;
    this.tasks = object.tasks;
  }

  addNewTask(taskliObj) {
    this.tasks.push(taskliObj)
  }

  updateToDo(index) {
    this.tasks[index].isComplete = true;
  }

  updateTask(taskliObj) {
    console.log("taskliObj===", taskliObj); 
  }

  saveToStorage(todoGlobalArray) {
    localStorage.setItem("todoList", JSON.stringify(todoGlobalArray));
  }

  deleteFromStorage() {

  }
}

class TaskList {
  constructor(object) {
    this.id = object.id;
    this.text = object.text;
    this.isComplete = object.isComplete;
  }
}