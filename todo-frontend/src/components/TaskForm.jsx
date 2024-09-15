import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TaskForm = ({ onAdd, categories, taskToEdit, onEdit }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [category, setCategory] = useState('');

  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title);
      setDescription(taskToEdit.description);
      setDueDate(new Date(taskToEdit.dueDate).toISOString().substr(0, 10));
      setCategory(taskToEdit.category);
    }
  }, [taskToEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const taskData = { title, description, dueDate, category };
    
    if (taskToEdit) {
      // Editing an existing task
      try {
        const response = await axios.put(`http://localhost:3000/api/tasks/${taskToEdit._id}`, taskData);
        onEdit(response.data);
        clearForm();
      } catch (error) {
        console.error('Error updating task:', error);
      }
    } else {
      // Adding a new task
      try {
        const response = await axios.post('http://localhost:3000/api/tasks', taskData);
        onAdd(response.data);
        clearForm();
      } catch (error) {
        console.error('Error adding task:', error);
      }
    }
  };

  const clearForm = () => {
    setTitle('');
    setDescription('');
    setDueDate('');
    setCategory('');
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="p-2 border border-gray-300 rounded-md mb-2 w-full"
        required
      />
      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="p-2 border border-gray-300 rounded-md mb-2 w-full"
      />
      <input
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        className="p-2 border border-gray-300 rounded-md mb-2 w-full"
      />
      <input
        type="text"
        placeholder="Category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="p-2 border border-gray-300 rounded-md mb-2 w-full"
      />
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
      >
        {taskToEdit ? 'Update Task' : 'Add Task'}
      </button>
    </form>
  );
};

export default TaskForm;
