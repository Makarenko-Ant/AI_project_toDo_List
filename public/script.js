const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");

async function loadTasks() {

    const response = await fetch("/api/tasks");
    const tasks = await response.json();

    taskList.innerHTML = "";

    if (tasks.length === 0) {
        taskList.innerHTML =
            "<p style='text-align:center;color:#888;'>Список завдань порожній</p>";
        return;
    }

    tasks.forEach(task => {

        const li = document.createElement("li");

        const span = document.createElement("span");
        span.textContent = task.text;

        if (task.completed) {
            span.classList.add("completed");
        }

        span.addEventListener("click", async () => {

            await fetch(`/api/tasks/${task.id}`, {
                method: "PUT"
            });

            loadTasks();
        });

        const deleteBtn = document.createElement("button");

        deleteBtn.textContent = "Видалити";

        deleteBtn.addEventListener("click", async () => {

            await fetch(`/api/tasks/${task.id}`, {
                method: "DELETE"
            });

            loadTasks();
        });

        li.appendChild(span);
        li.appendChild(deleteBtn);

        taskList.appendChild(li);
    });
}

addBtn.addEventListener("click", async () => {

    const text = taskInput.value.trim();

    if (!text) return;

    await fetch("/api/tasks", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            text
        })
    });

    taskInput.value = "";

    loadTasks();
});

loadTasks();