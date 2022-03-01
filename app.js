const input = document.querySelector("input");
const todoListDOM = document.querySelector(".todos__list");
const itemsLeftDOM = document.querySelector(".items-left");
const filters = document.querySelectorAll(".filter");
const toggleMode = document.querySelector(".toggle-mode");

let lightMode = localStorage.getItem("lightMode");
lightMode === "enable"
  ? (toggleMode.src = "/images/icon-moon.svg")
  : (toggleMode.src = "/images/icon-sun.svg");

const enableLightMode = () => {
  document.body.classList.add("lightmode");
  localStorage.setItem("lightMode", "enabled");
  toggleMode.src = "/images/icon-moon.svg";
};
const disableLightMode = () => {
  document.body.classList.remove("lightmode");
  localStorage.setItem("lightMode", null);
  toggleMode.src = "/images/icon-sun.svg";
};

window.on;

if (lightMode === "enabled") {
  enableLightMode();
}

toggleMode.addEventListener("click", () => {
  lightMode = localStorage.getItem("lightMode");
  // if it not current enabled, enable it
  if (lightMode !== "enabled") {
    enableLightMode();
    // if it has been enabled, turn it off
  } else {
    disableLightMode();
  }
});

input.addEventListener("keyup", (e) => {
  if (event.keyCode === 13) {
    // Cancel the default action, if needed
    event.preventDefault();
    // Trigger the button element with a click
    addTodo(input.value);
  }
});

let todos = [];

function addTodo(item) {
  if (item === "") return;

  const todo = {
    id: uuidv4(),
    name: item,
    completed: false,
  };

  todos.push(todo);
  addToStorage(todos);
  itemsLeftDOM.textContent = `${todos.length} items left`;
  input.value = "";
}

function addToStorage(todos) {
  localStorage.setItem("todos", JSON.stringify(todos));
  renderTodos(todos);
}

function dragstart_handler(ev) {
  // Add the target element's id to the data transfer object
  ev.dataTransfer.setData("text/plain", ev.target.id);
}

function renderTodos(todos) {
  // console.log(todos);
  // clear everything inside <ul> with class=todo-items
  todoListDOM.innerHTML = "";
  // run through each item inside todos
  todos.forEach(function (item) {
    // check if the item is completed
    const checked = item.completed ? "checked" : null;
    // make a <li> element and fill it
    // <li> </li>
    const div = document.createElement("div");
    // <li class="item"> </li>
    div.setAttribute("class", "todo");
    // <li class="item" data-key="20200708"> </li>
    div.setAttribute("data-key", item.id);
    /* <li class="item" data-key="20200708">
            <input type="checkbox" class="checkbox">
            Go to Gym
            <button class="delete-button">X</button>
          </li> */
    div.draggable = true;
    // if item is completed, then add a class to <li> called 'checked', which will add line-through style
    if (item.completed === true) {
      div.classList.add("checked");
    }

    div.addEventListener("dragstart", () => {
      div.classList.add("dragging");
    });
    div.addEventListener("dragend", () => {
      div.classList.remove("dragging");
    });

    div.innerHTML = `
      <img class="check ${checked}" src="./images/icon-check.svg" alt="" />
      <span>${item.name}</span>
      <img class="cross" src="./images/icon-cross.svg" alt="" />
       `;
    // finally add the <li> to the <ul>
    todoListDOM.append(div);
    itemsLeftDOM.textContent = `${todos.length} items left`;
  });
}

todoListDOM.addEventListener("dragover", (e) => {
  // console.log(e.clientX);
  e.preventDefault();
  const afterElement = getDragAfterElement(todoListDOM, e.clientY);
  const todo = document.querySelector(".todo");

  if (afterElement === null) {
    todoListDOM.appendChild(todo);
  } else {
    todoListDOM.insertBefore(todo, afterElement);
  }
  const isDragging = document.querySelector(".dragging");
});

function getDragAfterElement(container, y) {
  // Add the target element's id to the data transfer object
  const draggableElements = [
    ...container.querySelectorAll(".todo:not(.dragging)"),
  ];

  return draggableElements.reduce(
    (closest, child) => {
      const box = child.getBoundingClientRect();
      const offset = y - box.top - box.height / 2;

      if (offset < 0 && offset > closest.offset) {
        return { offset: offset, element: child };
      } else {
        return closest;
      }
    },

    { offset: Number.NEGATIVE_INFINITY }
  ).element;
}

{
  /* <input type="checkbox" class="checkbox" ${checked}>
${item.name}
<button class="delete-button">X</button> */
}

function getFromLocalStorage() {
  const fromLocal = localStorage.getItem("todos");
  // if reference exists
  if (fromLocal) {
    // converts back to array and store it in todos array
    todos = JSON.parse(fromLocal);

    renderTodos(todos);
  }
}

getFromLocalStorage();

function toggle(id) {
  todos.forEach(function (item) {
    // use == not ===, because here types are different. One is number and other is string
    if (item.id == id) {
      // toggle the value
      item.completed = !item.completed;
    }
  });
  addToStorage(todos);
}
// deletes a todo from todos array, then updates localstorage and renders updated list to screen
function deleteTodo(id) {
  // filters out the <li> with the id and updates the todos array
  todos = todos.filter(function (item) {
    //   // use != not !==, because here types are different. One is number and other is string
    return item.id != id;
  });
  // // update the localStorage
  addToStorage(todos);
  itemsLeftDOM.textContent = `${todos.length} items left`;
}

// after that addEventListener <ul> with class=todoItems. Because we need to listen for click event in all delete-button and checkbox
todoListDOM.addEventListener("click", function (event) {
  // check if the event is on checkbox

  if (event.target.classList.contains("check")) {
    // toggle the state
    toggle(event.target.parentElement.getAttribute("data-key"));
  }
  // check if that is a delete-button
  if (event.target.classList.contains("cross")) {
    // get id from data-key attribute's value of parent <li> where the delete-button is present
    deleteTodo(event.target.parentElement.getAttribute("data-key"));
  }
});

function filterTodos(filter) {
  document
    .querySelectorAll(".active")
    .forEach((item) => item.classList.remove("active"));
  const option = filter.getAttribute("data-option");
  let newArr = [];
  if (option === "active") {
    filter.classList.add("active");
    newArr = todos.filter((todo) => todo.completed === false);
  } else if (option === "completed") {
    filter.classList.add("active");
    newArr = todos.filter((todo) => todo.completed !== false);
  } else {
    filter.classList.add("active");
    newArr = todos;
  }
  renderTodos(newArr);
  itemsLeftDOM.textContent = `${newArr.length} items left`;
}

filters.forEach((filter) => {
  filter.addEventListener("click", () => {
    filterTodos(filter);
  });
});

const clear = document.querySelector(".clear");
clear.addEventListener("click", clearCompletedTodos);

function clearCompletedTodos() {
  todos = todos.filter((todo) => todo.completed !== true);
  addToStorage(todos);
  itemsLeftDOM.textContent = `${newArr.length} items left`;
}
