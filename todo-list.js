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
}

class TaskList {
  constructor(object) {
    this.text = object.text;
    this.isComplete = object.isComplete;
  }
}