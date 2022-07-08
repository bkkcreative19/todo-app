const todoListDOM = document.querySelector(".todos__list");
const itemsLeftDOM = document.querySelector(".items-left");
const filters = document.querySelectorAll(".filter");
const toggleMode = document.querySelector(".toggle-mode");

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
        todoList.dragStart(div);
      });

      div.addEventListener("dragover", (e) => {
        e.preventDefault();
      });

      div.addEventListener("dragenter", (e) => {
        todoList.dragEnter(div);
      });

      div.addEventListener("drop", () => {
        todoList.drop(div);
      });
      div.addEventListener("dragleave", () => {
        todoList.dragLeave(div);
      });

      div.innerHTML = `
        <div class='circle ${checked}'>
          ${
            checked
              ? ' <img class="check" src="./images/icon-check.svg" alt="" />'
              : ""
          }
         
        </div>
        
        <span>${todo.name}</span>
        <img class="cross" src="./images/icon-cross.svg" alt="" />
         `;

      this.todoListDOM.append(div);
    });
  }
}

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
      return item.id != id;
    });
    this.todos = todos;
  }

  toggle(id) {
    let todos = [...this.todos];
    todos.forEach(function (item) {
      if (item.id == id) {
        // toggle the value
        item.isCompleted = !item.isCompleted;
      }
    });

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
  }

  dragStart(element) {
    this.startIndex = element.closest("div").getAttribute("data-key");
    console.log(this.startIndex);
  }

  drop(element) {
    let endIndex = element.getAttribute("data-key");

    element.classList.remove("dragging");
    this.swapItems(this.startIndex, endIndex);
  }

  dragEnter(element) {
    element.classList.add("dragging");
  }

  dragLeave(element) {
    element.classList.remove("dragging");
  }

  swapItems(fromIndex, toIndex) {
    let todos = [...this.todos];

    const temp = todos[fromIndex].id;

    todos[fromIndex].id = todos[toIndex].id;
    todos[toIndex].id = temp;

    this.todos = todos;
    ui.updateStorage(todos);
  }
}

const todoList = new TodoList();

class Todo {
  constructor(id, name) {
    this.id = id;
    this.name = name;
    this.isCompleted = false;
  }
}

class Theme {
  constructor() {
    this.lightMode = localStorage.getItem("lightMode");
  }

  handleThemeSwitich(e) {
    this.checkIfLightMode();
    if (this.lightMode === "enabled") {
      this.lightMode = null;
    } else {
      this.lightMode = "enabled";
    }
  }

  checkIfLightMode() {
    if (this.lightMode === "enabled") {
      toggleMode.src = "/images/icon-moon.svg";
    } else {
      toggleMode.src = "/images/icon-sun.svg";
    }

    if (this.lightMode === "enabled") {
      document.body.classList.add("lightmode");
      localStorage.setItem("lightMode", "enabled");
      toggleMode.src = "/images/icon-moon.svg";
    } else {
      toggleMode.src = "/images/icon-sun.svg";
      localStorage.setItem("lightMode", null);
      document.body.classList.remove("lightmode");
    }
  }
}

const ui = new UI();
const theme = new Theme();

theme.checkIfLightMode();
ui.renderTodos(todoList.todos);

document.querySelector("form").addEventListener("submit", function (e) {
  const input = document.querySelector("input");
  e.preventDefault();
  // console.log(e.key);

  const index = todoList.todos.length === 0 ? 0 : todoList.todos.length;
  const todo = new Todo(index, input.value);
  input.value = "";

  todoList.addTodo(todo);
  ui.updateStorage(todoList.todos);
});

document.querySelector(".todos__list").addEventListener("click", (e) => {
  if (e.target.classList.contains("circle")) {
    todoList.toggle(e.target.parentElement.getAttribute("data-key"));
    ui.updateStorage(todoList.todos);
  }
  if (e.target.classList.contains("cross")) {
    todoList.deleteTodo(e.target.parentElement.getAttribute("data-key"));
    ui.updateStorage(todoList.todos);
  }
});

document.querySelector(".toggle-mode").addEventListener("click", (e) => {
  theme.handleThemeSwitich(e);
});

document.querySelector(".clear").addEventListener("click", () => {
  todoList.clearCompletedTodos();
  ui.updateStorage(todoList.todos);
});

document.querySelectorAll(".filter").forEach((filter) => {
  filter.addEventListener("click", (e) => {
    const elems = document.querySelector(".active");
    if (elems !== null) {
      elems.classList.remove("active");
    }
    e.target.classList.add("active");

    todoList.filterTodos(filter.getAttribute("data-option"));
    ui.renderTodos(todoList.filteredTodos);
  });
});
