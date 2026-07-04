const shoppingList = document.querySelector(".shopping-list");
const shoppingForm = document.querySelector(".shopping-form");
const clearBtn = document.querySelector(".clear");
const filterButtons = document.querySelectorAll(".filter-buttons button");

document.addEventListener("DOMContentLoaded", function () {
  loadItems();

  if (shoppingForm) {
    shoppingForm.addEventListener("submit", handleFormSubmit);
  }

  for (let button of filterButtons) {
    button.addEventListener("click", function (e) {
      const filterBtn = e.target;

      for (let button of filterButtons) {
        button.classList.add("btn-secondary");
        button.classList.remove("btn-primary");
      }

      filterBtn.classList.add("btn-primary");
      filterBtn.classList.remove("btn-secondary");

      // filterBtn.getAttribute("item-filter");
      // console.log(filterBtn.getAttribute("item-filter"));

      filterItems(filterBtn.getAttribute("item-filter"));
    });
  }

  clearBtn.addEventListener("click", function (e) {
    shoppingList.innerHTML = "";
    saveToLS();
    updateState();
    // localStorage.clear();
  });

  updateState();
});

function loadItems() {
  const items = JSON.parse(localStorage.getItem("shoppingItems")) || [];
  // const items = [
  //   { id: 1, name: "Egg", completed: false },
  //   { id: 2, name: "Fish", completed: true },
  //   { id: 3, name: "Milk", completed: false },
  //   { id: 4, name: "Olive", completed: false },
  // ];
  for (let item of items) {
    const li = createListItem(item);
    shoppingList.appendChild(li);
  }
}

function addItem(input) {
  const newItem = createListItem({
    id: generateId(),
    name: input.value,
    completed: false,
  });

  shoppingList.appendChild(newItem);
  input.value = "";

  updateFilteredItems();

  saveToLS();

  updateState();
}

function handleFormSubmit(e) {
  e.preventDefault();

  const input = document.getElementById("item");
  if (input && input.value.trim().length === 0) {
    alert("enter a value");
    return;
  }

  addItem(input);
}

function createListItem(item) {
  const input = document.createElement("input");
  input.type = "checkbox";
  input.classList.add("form-check-input");
  input.checked = item.completed;
  input.addEventListener("change", toggleCompleted);

  const div = document.createElement("div");
  div.textContent = item.name;
  div.classList.add("item-name");
  div.addEventListener("click", function (e) {
    const li = e.target.parentElement;
    if (!li.hasAttribute("item-completed")) {
      e.target.contentEditable = "true";
      e.target.focus();
    }
  });
  div.addEventListener("blur", function (e) {
    e.target.contentEditable = "false";
  });
  div.addEventListener("keydown", function (e) {
    if (e.key == "Enter") {
      e.preventDefault();
      closeEditMode(e);
      saveToLS();
    }
  });

  const deleteIcon = document.createElement("i");
  deleteIcon.classList.add("fs-3", "bi", "bi-x", "text-danger", "delete-icon");
  deleteIcon.addEventListener("click", removeItem);

  const li = document.createElement("li");
  li.setAttribute("item-id", item.id);
  li.className = "border rounded p-3 mb-1";
  li.toggleAttribute("item-completed", item.completed);

  li.appendChild(input);
  li.appendChild(div);
  li.appendChild(deleteIcon);

  return li;
}

function generateId() {
  return Date.now().toString();
}

function toggleCompleted(e) {
  const li = e.target.parentElement;
  li.toggleAttribute("item-completed", e.target.checked);
  updateFilteredItems();
  saveToLS();
}

function removeItem(e) {
  const li = e.target.parentElement;
  if (li) {
    shoppingList.removeChild(li);
    saveToLS();
    updateState();
  }
}

function closeEditMode(e) {
  const target = e.target;
  target.contentEditable = "false";
  // Trim accidental whitespace/newlines from editable content
  target.textContent = target.textContent.trim();
  target.blur();
}

function filterItems(filterType) {
  const items = shoppingList.querySelectorAll("li");

  for (let item of items) {
    item.classList.remove("d-flex");
    item.classList.remove("d-none");

    const completed = item.hasAttribute("item-completed");

    if (filterType == "complete") {
      item.classList.toggle(completed ? "d-flex" : "d-none");
    } else if (filterType == "incomplete") {
      item.classList.toggle(!completed ? "d-flex" : "d-none");
    } else {
      item.classList.toggle("d-flex");
    }
  }
}

function updateFilteredItems() {
  const activeFilter = document.querySelector(".btn-primary[item-filter]");
  filterItems(activeFilter.getAttribute("item-filter"));
}

function saveToLS() {
  const listItems = shoppingList.querySelectorAll("li");
  const liste = [];

  for (let li of listItems) {
    const id = li.getAttribute("item-id");
    const name = li.querySelector(".item-name").textContent;
    const completed = li.hasAttribute("item-completed");

    liste.push({ id, name, completed });
  }

  localStorage.setItem("shoppingItems", JSON.stringify(liste));
}

function updateState() {
  const isEmpty = shoppingList.querySelectorAll("li").length === 0;
  const alert = document.querySelector(".alert");

  alert.classList.toggle("d-none", !isEmpty);
}
