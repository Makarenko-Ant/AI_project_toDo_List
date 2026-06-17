const express = require("express");
const fs = require("fs");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static("public"));

const FILE = "tasks.json";

function getTasks() {
    if (!fs.existsSync(FILE)) {
        fs.writeFileSync(FILE, "[]");
    }

    return JSON.parse(fs.readFileSync(FILE));
}

function saveTasks(tasks) {
    fs.writeFileSync(FILE, JSON.stringify(tasks, null, 2));
}

app.get("/api/tasks", (req, res) => {
    res.json(getTasks());
});

app.post("/api/tasks", (req, res) => {
    const tasks = getTasks();

    const task = {
        id: Date.now(),
        text: req.body.text,
        completed: false
    };

    tasks.push(task);

    saveTasks(tasks);

    res.status(201).json(task);
});

app.put("/api/tasks/:id", (req, res) => {
    const tasks = getTasks();

    const task = tasks.find(
        t => t.id == req.params.id
    );

    if (!task) {
        return res.status(404).json({
            message: "Task not found"
        });
    }

    task.completed = !task.completed;

    saveTasks(tasks);

    res.json(task);
});

app.delete("/api/tasks/:id", (req, res) => {
    const tasks = getTasks();

    const updatedTasks = tasks.filter(
        t => t.id != req.params.id
    );

    saveTasks(updatedTasks);

    res.json({
        message: "Deleted"
    });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});