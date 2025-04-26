'use client';

import { useState, useEffect } from 'react';
import { fetchTasks, createTask, updateTask, deleteTask } from '@/services/api';

interface Task {
  id: number;
  title: string;
  description: string;
  due_date: string;
  status: string;
}

export default function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // New task form state
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    due_date: ''
  });
  
  // Edit task state
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  
  useEffect(() => {
    loadTasks();
  }, []);
  
  const loadTasks = async () => {
    try {
      setLoading(true);
      const data = await fetchTasks();
      setTasks(data);
    } catch (err) {
      setError('Failed to load tasks');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createTask(newTask);
      setNewTask({ title: '', description: '', due_date: '' });
      await loadTasks();
    } catch (err) {
      setError('Failed to create task');
      console.error(err);
    }
  };
  
  const handleUpdateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTask) return;
    
    try {
      await updateTask(editingTask.id, editingTask);
      setEditingTask(null);
      await loadTasks();
    } catch (err) {
      setError('Failed to update task');
      console.error(err);
    }
  };
  
  const handleDeleteTask = async (id: number) => {
    try {
      await deleteTask(id);
      await loadTasks();
    } catch (err) {
      setError('Failed to delete task');
      console.error(err);
    }
  };
  
  const handleStatusChange = async (id: number, status: string) => {
    try {
      await updateTask(id, { status });
      await loadTasks();
    } catch (err) {
      setError('Failed to update task status');
      console.error(err);
    }
  };
  
  const filterTasks = (status: string) => {
    return tasks.filter(task => task.status === status);
  };
  
  // Format due date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  if (loading) return <div className="text-center p-8">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-light-purple shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Task Manager</h1>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
            <button className="float-right" onClick={() => setError(null)}>×</button>
          </div>
        )}
        
        {/* Create New Task Form */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-black mb-4">Create New Task</h2>
          <form onSubmit={handleCreateTask}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  value={newTask.title}
                  onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                  className="w-full p-2 border text-black rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-black mb-2">Due Date</label>
                <input
                  type="datetime-local"
                  value={newTask.due_date}
                  onChange={(e) => setNewTask({...newTask, due_date: e.target.value})}
                  className="w-full p-2 border text-black rounded"
                  required
                />
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-black mb-2">Description</label>
              <textarea
                value={newTask.description}
                onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                className="w-full p-2 border text-black rounded"
                rows={3}
              />
            </div>
            <div className="mt-4">
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Add Task
              </button>
            </div>
          </form>
        </div>
        
        {/* Edit Task Form (conditionally rendered) */}
        {editingTask && (
          <div className="bg-white shadow rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-black mb-4">Edit Task</h2>
            <form onSubmit={handleUpdateTask}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-black mb-2">Title</label>
                  <input
                    type="text"
                    value={editingTask.title}
                    onChange={(e) => setEditingTask({...editingTask, title: e.target.value})}
                    className="w-full p-2 border text-black rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-black mb-2">Due Date</label>
                  <input
                    type="datetime-local"
                    value={editingTask.due_date.slice(0, 16)} // Format for datetime-local input
                    onChange={(e) => setEditingTask({...editingTask, due_date: e.target.value})}
                    className="w-full p-2 border text-black rounded"
                    required
                  />
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-black mb-2">Description</label>
                <textarea
                  value={editingTask.description}
                  onChange={(e) => setEditingTask({...editingTask, description: e.target.value})}
                  className="w-full p-2 border text-black rounded"
                  rows={3}
                />
              </div>
              <div className="mt-4 flex space-x-4">
                <button
                  type="submit"
                  className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setEditingTask(null)}
                  className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
        
        {/* Task Lists */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* To Do Tasks */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-blue-600">To Do</h2>
            {filterTasks('todo').length === 0 ? (
              <p className="text-gray-500">No tasks to do</p>
            ) : (
              <ul className="space-y-4">
                {filterTasks('todo').map(task => (
                  <li key={task.id} className="border-b pb-2">
                    <h3 className="font-semibold text-black">{task.title}</h3>
                    <p className="text-sm text-gray-600">{task.description}</p>
                    <p className="text-xs text-gray-500">Due: {formatDate(task.due_date)}</p>
                    <div className="flex space-x-2 mt-2">
                      <button
                        onClick={() => handleStatusChange(task.id, 'done')}
                        className="text-xs bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded"
                      >
                        Mark Done
                      </button>
                      <button
                        onClick={() => setEditingTask(task)}
                        className="text-xs bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteTask(task.id)}
                        className="text-xs bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded"
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          
          {/* Done Tasks */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-green-600">Done</h2>
            {filterTasks('done').length === 0 ? (
              <p className="text-gray-500">No completed tasks</p>
            ) : (
              <ul className="space-y-4">
                {filterTasks('done').map(task => (
                  <li key={task.id} className="border-b pb-2">
                    <h3 className="font-semibold line-through text-black">{task.title}</h3>
                    <p className="text-sm text-gray-600">{task.description}</p>
                    <p className="text-xs text-gray-500">Completed</p>
                    <div className="flex space-x-2 mt-2">
                      <button
                        onClick={() => handleStatusChange(task.id, 'todo')}
                        className="text-xs bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-1 rounded"
                      >
                        Mark To Do
                      </button>
                      <button
                        onClick={() => handleDeleteTask(task.id)}
                        className="text-xs bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded"
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          
          {/* Overdue Tasks */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-red-600">Overdue</h2>
            {filterTasks('overdue').length === 0 ? (
              <p className="text-gray-500">No overdue tasks</p>
            ) : (
              <ul className="space-y-4">
                {filterTasks('overdue').map(task => (
                  <li key={task.id} className="border-b pb-2">
                    <h3 className="font-semibold text-red-600">{task.title}</h3>
                    <p className="text-sm text-gray-600">{task.description}</p>
                    <p className="text-xs text-red-500">Due: {formatDate(task.due_date)}</p>
                    <div className="flex space-x-2 mt-2">
                      <button
                        onClick={() => handleStatusChange(task.id, 'done')}
                        className="text-xs bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded"
                      >
                        Mark Done
                      </button>
                      <button
                        onClick={() => setEditingTask(task)}
                        className="text-xs bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteTask(task.id)}
                        className="text-xs bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded"
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}