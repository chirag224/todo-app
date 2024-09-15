const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const Task = require('./Model/taskModel');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        app.listen(port, () => {
            console.log(`MongoDB connected and listening on port ${port}`);
        });
    })
    .catch(err => {
        console.error('Database connection error:', err);
    });

app.get('/api/tasks', async (req, res) => {
    try {
        const tasks = await Task.find();
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.get('/api/categories', async (req, res) => {
    try {
        const tasks = await Task.find();
        const categories = [...new Set(tasks.map(task => task.category).filter(Boolean))];
        res.json(categories);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.get('/api/tasks/category/:category', async (req, res) => {
    try {
        const category = req.params.category;
        const tasks = await Task.find({ category });
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.post('/api/tasks', async (req, res) => {
    const task = new Task({
        title: req.body.title,
        description: req.body.description,
        dueDate: req.body.dueDate,
        category: req.body.category,
    });
    try {
        const newTask = await task.save();
        res.status(201).json(newTask);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

app.put('/api/tasks/:id', async (req, res) => {
    try {
        const taskId = req.params.id;
        const taskUpdates = req.body;

        // Find the task by ID
        const task = await Task.findById(taskId);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        // Check if the task is already completed and if the update tries to mark it as completed again
        if (task.completed && taskUpdates.completed) {
            return res.status(400).json({ message: 'Task is already marked as completed' });
        }

        // Update the task
        const updatedTask = await Task.findByIdAndUpdate(taskId, taskUpdates, { new: true });
        res.json(updatedTask);
    } catch (err) {
        console.error(err); // Log error for debugging
        res.status(400).json({ message: err.message });
    }
});



app.delete('/api/tasks/:id', async (req, res) => {
    try {
        const result = await Task.findByIdAndDelete(req.params.id);
        if (!result) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.json({ message: 'Task deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.patch('/api/tasks/:id/complete', async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        if (task.completed) {
            return res.status(400).json({ message: 'Task is already completed' });
        }

        task.completed = true;
        const updatedTask = await task.save();
        res.json(updatedTask);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
