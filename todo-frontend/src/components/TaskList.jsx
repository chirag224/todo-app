import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TaskListItem from './TaskListItem';
import TaskForm from './TaskForm';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [taskToEdit, setTaskToEdit] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/tasks');
      setTasks(response.data);
      const uniqueCategories = [...new Set(response.data.map(task => task.category).filter(cat => cat))];
      setCategories(['All', ...uniqueCategories]);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const handleAddTask = (newTask) => {
    setTasks([...tasks, newTask]);
    setCategories([...new Set([...categories, newTask.category])]);
  };

  const handleEditTask = (updatedTask) => {
    setTasks(tasks.map(task => task._id === updatedTask._id ? updatedTask : task));
    setTaskToEdit(null);
  };

  const handleStatusChange = async (id, completed) => {
    try {
      const response = await axios.put(`http://localhost:3000/api/tasks/${id}`, { completed });
      setTasks(tasks.map(task => task._id === id ? response.data : task));
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/tasks/${id}`);
      setTasks(tasks.filter(task => task._id !== id));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const filteredTasks = selectedCategory === 'All'
    ? tasks
    : tasks.filter(task => task.category === selectedCategory);

  return (
    <div>
      <TaskForm onAdd={handleAddTask} onEdit={handleEditTask} taskToEdit={taskToEdit} categories={categories} />
      <div className="mb-4">
        <label htmlFor="category-filter" className="block mb-2 text-sm font-medium text-gray-700">Filter by Category</label>
        <select
          id="category-filter"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="p-2 border border-gray-300 rounded-md"
        >
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>
      <ul className="task-list">
        {filteredTasks.map(task => (
          <TaskListItem
            key={task._id}
            task={task}
            onEdit={setTaskToEdit}
            onDelete={handleDeleteTask}
            onStatusChange={handleStatusChange}
          />
        ))}
      </ul>
    </div>
  );
};

export default TaskList;
