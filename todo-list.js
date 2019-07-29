class ToDoList {
  constructor(object) {
    this.id = object.id;
    this.title = object.title;
    this.urgent = object.urgent;
    this.tasks = object.tasks;
  }

  updateTask(taskli) {
    this.tasks.push(taskli)
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