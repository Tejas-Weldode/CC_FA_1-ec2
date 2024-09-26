const express = require("express");
const fs = require("fs");
const app = express();
const port = process.env.PORT || 3000;
const cors = require("cors");

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cors());

const tasksFile = "./tasks.json";

// Get all tasks
app.get("/tasks", (req, res) => {
    fs.readFile(tasksFile, (err, data) => {
        if (err) {
            return res.status(500).send("Error reading tasks");
        }
        res.json(JSON.parse(data));
    });
});

// Add a new task
app.post("/tasks", (req, res) => {
    const task = req.body.task;
    fs.readFile(tasksFile, (err, data) => {
        if (err) {
            return res.status(500).send("Error reading tasks");
        }
        const tasks = JSON.parse(data);
        tasks.push(task);
        fs.writeFile(tasksFile, JSON.stringify(tasks), (err) => {
            if (err) {
                return res.status(500).send("Error saving task");
            }
            res.status(201).send("Task added");
        });
    });
});

// Delete a task
app.delete("/tasks/:index", (req, res) => {
    const index = parseInt(req.params.index);
    fs.readFile(tasksFile, (err, data) => {
        if (err) {
            return res.status(500).send("Error reading tasks");
        }
        const tasks = JSON.parse(data);
        tasks.splice(index, 1);
        fs.writeFile(tasksFile, JSON.stringify(tasks), (err) => {
            if (err) {
                return res.status(500).send("Error deleting task");
            }
            res.status(200).send("Task deleted");
        });
    });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
