import React from 'react';
import TaskList from './components/TaskList';

const App = () => {
  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-4xl font-extrabold mb-6 text-gray-800">To-Do List</h1>
      <TaskList />
    </div>
  );
};

export default App;
