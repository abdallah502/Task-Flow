const taskInput = document.getElementById("taskInput");
const categoryInput = document.getElementById("category");
const addButton = document.getElementById("addButton");
const taskList = document.getElementById("taskList");
const searchInput = document.getElementById("searchInput");
const emptyMessage = document.getElementById("emptyMessage");

const totalCount = document.getElementById("totalCount");
const activeCount = document.getElementById("activeCount");
const completedCount = document.getElementById("completedCount");

const filterButtons = document.querySelectorAll(".filter");

let tasks = JSON.parse(localStorage.getItem("taskflowTasks")) || [];
let currentFilter = "all";

function saveTasks() {
    localStorage.setItem("taskflowTasks", JSON.stringify(tasks));
}

function updateStats() {
    const completed = tasks.filter(task => task.completed).length;
    const active = tasks.length - completed;

    totalCount.textContent = "Total: " + tasks.length;
    activeCount.textContent = "Active: " + active;
    completedCount.textContent = "Completed: " + completed;
}

function renderTasks() {
    taskList.innerHTML = "";

    const searchText = searchInput.value.toLowerCase();

    const visibleTasks = tasks.filter(task => {
        const matchesSearch = task.text.toLowerCase().includes(searchText);

        if (currentFilter === "active") {
            return !task.completed && matchesSearch;
        }

        if (currentFilter === "completed") {
            return task.completed && matchesSearch;
        }

        return matchesSearch;
    });

    emptyMessage.style.display =
        visibleTasks.length === 0 ? "block" : "none";

    visibleTasks.forEach(task => {
        const li = document.createElement("li");

        if (task.completed) {
            li.classList.add("completed");
        }

        const info = document.createElement("div");
        info.className = "task-info";

        const text = document.createElement("span");
        text.className = "task-text";
        text.textContent = task.text;

        text.addEventListener("click", function () {
            toggleTask(task.id);
        });

        const category = document.createElement("div");
        category.className = "category";
        category.textContent = task.category;

        info.appendChild(text);
        info.appendChild(category);

        const actions = document.createElement("div");
        actions.className = "actions";

        const editButton = document.createElement("button");
        editButton.textContent = "Edit";
        editButton.className = "edit";

        editButton.addEventListener("click", function () {
            editTask(task.id);
        });

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.className = "delete";

        deleteButton.addEventListener("click", function () {
            deleteTask(task.id);
        });

        actions.appendChild(editButton);
        actions.appendChild(deleteButton);

        li.appendChild(info);
        li.appendChild(actions);

        taskList.appendChild(li);
    });

    updateStats();
}

function addTask() {
    const text = taskInput.value.trim();

    if (text === "") {
        return;
    }

    const newTask = {
        id: Date.now(),
        text: text,
        category: categoryInput.value,
        completed: false
    };

    tasks.push(newTask);

    taskInput.value = "";

    saveTasks();
    renderTasks();
}

function toggleTask(id) {
    tasks = tasks.map(task => {
        if (task.id === id) {
            return {
                ...task,
                completed: !task.completed
            };
        }

        return task;
    });

    saveTasks();
    renderTasks();
}

function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);

    saveTasks();
    renderTasks();
}

function editTask(id) {
    const task = tasks.find(task => task.id === id);

    if (!task) {
        return;
    }

    const newText = prompt("Edit your task:", task.text);

    if (newText === null) {
        return;
    }

    const cleanedText = newText.trim();

    if (cleanedText === "") {
        return;
    }

    task.text = cleanedText;

    saveTasks();
    renderTasks();
}

addButton.addEventListener("click", addTask);

taskInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        addTask();
    }
});

searchInput.addEventListener("input", renderTasks);

filterButtons.forEach(button => {
    button.addEventListener("click", function () {
        currentFilter = button.dataset.filter;

        filterButtons.forEach(btn => {
            btn.classList.remove("active-filter");
        });

        button.classList.add("active-filter");

        renderTasks();
    });
});

renderTasks();
