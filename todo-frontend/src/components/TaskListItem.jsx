import React from 'react';

const TaskListItem = ({ task, onEdit, onDelete, onStatusChange }) => {
  const handleStatusChange = () => {
    if (!task.completed) {
      onStatusChange(task._id, true);
    }
  };

  const handleEdit = () => {
    onEdit(task);
  };

  const handleDelete = () => {
    onDelete(task._id);
  };

  return (
    <li className={`border p-4 mb-4 rounded-md ${task.completed ? 'bg-green-100 text-green-700' : 'bg-white'}`}>
      <div className="flex justify-between">
        <h2 className={`text-lg font-semibold ${task.completed ? 'text-gray-500' : ''}`}>
          {task.title}
        </h2>
        <div>
          <button
            onClick={handleEdit}
            className="bg-yellow-500 text-white px-2 py-1 rounded-md hover:bg-yellow-600 mr-2"
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            className="bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      </div>
      <p>{task.description}</p>
      <p>Due: {new Date(task.dueDate).toLocaleDateString()}</p>
      <p>Category: {task.category}</p>
      <button
        onClick={handleStatusChange}
        className={`mt-2 px-4 py-2 rounded-md text-white ${task.completed ? 'bg-gray-500' : 'bg-blue-500'} hover:${task.completed ? 'bg-gray-600' : 'bg-blue-600'}`}
      >
        {task.completed ? 'Undo' : 'Complete'}
      </button>
    </li>
  );
};

export default TaskListItem;
