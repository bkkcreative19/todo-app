const input = document.querySelector("input");
const todoListDOM = document.querySelector(".todos__list");
const itemsLeftDOM = document.querySelector(".items-left");
const filters = document.querySelectorAll(".filter");
const toggleMode = document.querySelector(".toggle-mode");

class TodoList {
  constructor() {
    this.todos = JSON.parse(localStorage.getItem("todos"))
      ? JSON.parse(localStorage.getItem("todos"))
      : [];
    this.filteredTodos = [];
  }

  addTodo(todo) {
    let todos = [...this.todos];
    todos.push(todo);
    this.todos = todos;
  }

  deleteTodo(id) {
    let todos = [...this.todos];
    todos = todos.filter(function (item) {
      //   // use != not !==, because here types are different. One is number and other is string
      return item.id != id;
    });
    this.todos = todos;

    // itemsLeftDOM.textContent = `${todos.length} items left`;
  }

  toggle(id) {
    let todos = [...this.todos];
    todos.forEach(function (item) {
      // use == not ===, because here types are different. One is number and other is string
      if (item.id == id) {
        // toggle the value
        item.isCompleted = !item.isCompleted;
      }
    });
    // console.log(todos);
    this.todos = todos;
  }

  filterTodos(filter) {
    let todos = [...this.todos];

    if (filter === "all") {
      this.todos = todos;
    } else if (filter === "active") {
      todos = todos.filter((todo) => todo.isCompleted !== true);
    } else {
      todos = todos.filter((todo) => todo.isCompleted !== false);
    }

    this.filteredTodos = todos;
  }

  clearCompletedTodos() {
    let todos = [...this.todos].filter((todo) => todo.isCompleted !== true);
    this.todos = todos;
    // itemsLeftDOM.textContent = `${newArr.length} items left`;
  }
}

const todoList = new TodoList();

class UI {
  constructor() {
    this.startIndex = null;
    this.endIndex = null;
  }
  todoListDOM = document.querySelector(".todos__list");

  updateStorage(todos) {
    localStorage.setItem("todos", JSON.stringify(todos));
    this.renderTodos(todos);
  }

  renderTodos(todos) {
    itemsLeftDOM.textContent = `${todos.length} items left`;
    todos.sort((a, b) => a.id - b.id);
    this.todoListDOM.innerHTML = "";
    todos.forEach((todo) => {
      const checked = todo.isCompleted ? "checked" : null;

      const div = document.createElement("div");
      div.classList.add("draggable");

      div.setAttribute("class", "todo");

      div.setAttribute("data-key", todo.id);

      div.draggable = true;

      if (todo.isCompleted === true) {
        div.classList.add("checked");
      }

      div.addEventListener("dragstart", () => {
        this.dragStart(div);
      });

      div.addEventListener("dragover", (e) => {
        e.preventDefault();
      });

      div.addEventListener("dragenter", (e) => {
        this.dragEnter(div);
      });

      div.addEventListener("drop", () => {
        this.drop(div);
      });
      div.addEventListener("dragleave", () => {
        this.dragLeave(div);
      });

      div.addEventListener("dragend", () => {
        this.dragEnd(div);
      });

      div.innerHTML = `
        <img class="check ${checked}" src="./images/icon-check.svg" alt="" />
        <span>${todo.name}</span>
        <img class="cross" src="./images/icon-cross.svg" alt="" />
         `;
      // finally add the <li> to the <ul>
      this.todoListDOM.append(div);
    });
  }

  dragStart(element) {
    // console.log("start");
    element.classList.add("dragging");

    // console.log(element.closest("div").getAttribute("data-key"));
    this.startIndex = element.closest("div").getAttribute("data-key");
  }

  dragEnd(element) {
    // console.log("end");
    element.classList.remove("dragging");
  }

  drop(element) {
    this.endIndex = element.getAttribute("data-key");
    // console.log(element.getAttribute("data-key"));
    element.classList.remove("dragging");
    this.swapItems(this.startIndex, this.endIndex);
  }

  dragEnter(element) {
    element.classList.add("dragging");
  }

  dragLeave(element) {
    element.classList.remove("dragging");
  }

  swapItems(fromIndex, toIndex) {
    let todos = [...todoList.todos];
    // console.log(todos);
    const itemOne = todos[fromIndex];
    const itemTwo = todos[toIndex];
    console.log("from", fromIndex, "to", toIndex);

    // const tmp = a[4];
    // a[4] = a[3];
    // a[3] = tmp;

    const temp = todos[fromIndex].id;

    todos[fromIndex].id = todos[toIndex].id;
    todos[toIndex].id = temp;
    // console.log(todos);
    ui.renderTodos(todos);
    // listItems[fromIndex].appendChild(itemTwo);
    // listItems[toIndex].appendChild(itemOne);
  }
}

class Todo {
  constructor(id, name) {
    this.id = id;
    this.name = name;
    this.isCompleted = false;
  }
}

class Theme {
  constructor() {
    this.lightMode = localStorage.getItem("light");
    this.themeMode = "light";
  }

  handleThemeSwitich(e) {
    if (this.themeMode === "light") {
      this.themeMode = "dark";
    } else {
      this.themeMode = "light";
    }

    if (this.themeMode === "light") {
      document.body.classList.add("lightmode");
      localStorage.setItem("lightMode", "enabled");
      e.target.src = "/images/icon-moon.svg";
    } else {
      e.target.src = "images/icon-sun.svg";
      localStorage.setItem("lightMode", null);
      document.body.classList.remove("lightmode");
    }

    return this.themeMode;
  }

  checkIfLightMode() {
    this.lightMode === "enable"
      ? (toggleMode.src = "/images/icon-moon.svg")
      : (toggleMode.src = "/images/icon-sun.svg");
  }
}

const ui = new UI();
const theme = new Theme();

theme.checkIfLightMode();
ui.renderTodos(todoList.todos);
// const local = new LocalStorage();

document.getElementById("addTodo").addEventListener("keyup", function (e) {
  if (e.key === "Enter") {
    const index = todoList.todos.length === 0 ? 0 : todoList.todos.length;
    const todo = new Todo(index, e.target.value);

    // ui.addTodo(todo);
    todoList.addTodo(todo);
    ui.updateStorage(todoList.todos);
  }
});

document.querySelector(".todos__list").addEventListener("click", (e) => {
  if (e.target.classList.contains("check")) {
    // toggle the state
    todoList.toggle(e.target.parentElement.getAttribute("data-key"));
    ui.updateStorage(todoList.todos);
  }
  // check if that is a delete-button
  if (e.target.classList.contains("cross")) {
    // get id from data-key attribute's value of parent <li> where the delete-button is present
    todoList.deleteTodo(e.target.parentElement.getAttribute("data-key"));
    ui.updateStorage(todoList.todos);
  }
});

document.querySelector(".toggle-mode").addEventListener("click", (e) => {
  theme.handleThemeSwitich(e);
});

document.querySelector(".clear").addEventListener("click", () => {
  console.log("yay");
  todoList.clearCompletedTodos();
  ui.updateStorage(todoList.todos);
});

document.querySelectorAll(".filter").forEach((filter) => {
  filter.addEventListener("click", (e) => {
    todoList.filterTodos(filter.getAttribute("data-option"));
    ui.renderTodos(todoList.filteredTodos);
  });
});
