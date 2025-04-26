import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// No more auth interceptors needed

export const fetchTasks = async () => {
  const response = await api.get('/tasks/');
  return response.data;
};

export const createTask = async (taskData: { title: string; description: string; due_date: string }) => {
  const response = await api.post('/tasks/', taskData);
  return response.data;
};

export const updateTask = async (id: number, taskData: { title?: string; description?: string; due_date?: string; status?: string }) => {
  const response = await api.put(`/tasks/${id}/`, taskData);
  return response.data;
};

export const deleteTask = async (id: number) => {
  const response = await api.delete(`/tasks/${id}/`);
  return response.data;
};

export default api;