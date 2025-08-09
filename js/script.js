document.addEventListener("DOMContentLoaded", () => {
  const taskInput = document.getElementById("taskInput");
  const dateInput = document.getElementById("dateInput");
  const addButton = document.getElementById("addButton");
  const taskList = document.getElementById("taskList");
  const searchBar = document.getElementById("searchBar");
  const deleteAllButton = document.getElementById("deleteAllButton");

  // Calendernya Flatpickr
  flatpickr("#dateInput", {
    dateFormat: "d-m-Y",
  });

  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  function renderTasks() {
    taskList.innerHTML = "";
    tasks.forEach((task, index) => {
      const li = document.createElement("li");
      li.setAttribute("data-index", index);

      li.innerHTML = `
                <div class="task-content">
                    <span class="task-date">${task.date}</span>
                    <span class="task-text">${task.text}</span>
                </div>
                <div class="task-actions">
                    <button class="editButton">EDIT</button>
                    <button class="deleteButton">DELETE</button>
                </div>
            `;

      taskList.appendChild(li);
    });
    filterTasks();
  }

  function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  function addTask() {
    const taskText = taskInput.value.trim();
    const taskDate = dateInput.value;

    if (taskText === "" && taskDate === "") {
      console.log("Task text and date cannot be empty!.");

      alert("Task text and date cannot be empty!.");
      return;
    }

    if (taskText === "") {
      alert("Task cannot be empty!.");
      return;
    }

    if (taskDate === "") {
      alert("Date cannot be empty!.");
      return;
    }

    tasks.push({ text: taskText, date: taskDate });
    saveTasks();
    taskInput.value = "";
    dateInput.value = "";
    renderTasks();

    console.log(`Task added: "${taskText}" with date: "${taskDate}"`);
  }

  function deleteTask(index) {
    const deletedTaskText = tasks[index].text;

    tasks.splice(index, 1);
    saveTasks();
    renderTasks();

    console.log(`Task deleted: "${deletedTaskText}"`);
  }

  function deleteAllTasks() {
    if (confirm("Are you sure you wanna delete all this?")) {
      tasks = [];
      saveTasks();
      renderTasks();

      console.log("All tasks have been deleted.");
    }
  }

  function editTask(index) {
    const oldTaskText = tasks[index].text;
    const newTaskText = prompt("Edit tugas:", tasks[index].text);
    if (newTaskText !== null && newTaskText.trim() !== "") {
      tasks[index].text = newTaskText.trim();
      saveTasks();
      renderTasks();

      console.log(
        `Task edited: "${oldTaskText}" changed to "${newTaskText.trim()}"`
      );
    }
  }

  function filterTasks() {
    const searchText = searchBar.value.toLowerCase();
    const allListItems = taskList.querySelectorAll("li");
    allListItems.forEach((item) => {
      const taskText = item
        .querySelector(".task-text")
        .textContent.toLowerCase();
      if (taskText.includes(searchText)) {
        item.style.display = "flex";
      } else {
        item.style.display = "none";
      }
    });
  }

  addButton.addEventListener("click", addTask);
  deleteAllButton.addEventListener("click", deleteAllTasks);
  searchBar.addEventListener("input", filterTasks);

  taskList.addEventListener("click", (event) => {
    const target = event.target;
    const li = target.closest("li");
    if (!li) return;

    const index = parseInt(li.getAttribute("data-index"));

    if (target.classList.contains("deleteButton")) {
      deleteTask(index);
    } else if (target.classList.contains("editButton")) {
      editTask(index);
    }
  });

  renderTasks();
});
