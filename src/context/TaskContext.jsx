import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const TaskContext = createContext();

export const useTasks = () => useContext(TaskContext);

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch Tasks
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTasks(data || []);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const addTask = async (newTask) => {
    try {
      // items are already array objects { text, checked } from CreateTaskModal or parsed here
      // But CreateTaskModal sends strings. Let's ensure uniform parsing.
      
      const formattedItems = newTask.items.map(itemStr => ({ text: itemStr, checked: false }));

      const taskPayload = {
        title: newTask.title,
        status: newTask.status || '시작전',
        assignee: newTask.assignee || '미지정',
        date: newTask.date,
        progress: 0,
        description: newTask.description || '',
        items: formattedItems
      };

      const { data, error } = await supabase
        .from('tasks')
        .insert([taskPayload])
        .select();

      if (error) throw error;
      
      if (data && data.length > 0) {
        setTasks(prev => [data[0], ...prev]);
      } else {
        fetchTasks();
      }
    } catch (error) {
      console.error('Error adding task:', error);
      alert('업무 추가 실패');
    }
  };

  const updateTask = async (id, updates) => {
    try {
      const { priority, ...validUpdates } = updates;
      
      const { error } = await supabase
        .from('tasks')
        .update(validUpdates)
        .eq('id', id);

      if (error) throw error;
      setTasks(prev => prev.map(task => task.id === id ? { ...task, ...validUpdates } : task));
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const toggleTaskItem = async (taskId, itemIndex, currentItems) => {
    try {
      // Create new items array
      const newItems = [...currentItems];
      newItems[itemIndex] = { 
        ...newItems[itemIndex], 
        checked: !newItems[itemIndex].checked 
      };

      // Calculate progress
      const total = newItems.length;
      const checked = newItems.filter(i => i.checked).length;
      const progress = total === 0 ? 0 : Math.round((checked / total) * 100);

      // Optimistic Update
      setTasks(prev => prev.map(t => t.id === taskId ? { ...t, items: newItems, progress } : t));

      // DB Update
      const { error } = await supabase
        .from('tasks')
        .update({ items: newItems, progress })
        .eq('id', taskId);

      if (error) throw error;
    } catch (error) {
      console.error('Error toggling item:', error);
      // Revert if needed (omitted for simplicity in this demo)
    }
  };

  const deleteTask = async (id) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setTasks(prev => prev.filter(task => task.id !== id));
    } catch (error) {
      console.error('Error deleting task:', error);
      alert('업무 삭제 실패');
    }
  };

  // Comments Logic
  const fetchComments = async (taskId) => {
    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .eq('task_id', taskId)
      .order('created_at', { ascending: true });
    
    if (error) {
      console.error('Error fetching comments', error);
      return [];
    }
    return data;
  };

  const addComment = async (taskId, content) => {
    const { data, error } = await supabase
      .from('comments')
      .insert([{ task_id: taskId, content, author: '나' }]) 
      .select();

    if (error) {
      console.error('Error adding comment', error);
      throw error;
    }
    return data[0];
  };

  return (
    <TaskContext.Provider value={{ tasks, addTask, updateTask, toggleTaskItem, deleteTask, fetchComments, addComment, loading }}>
      {children}
    </TaskContext.Provider>
  );
};
