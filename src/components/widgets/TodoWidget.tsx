import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, CheckCircle2, Circle, X, Calendar } from 'lucide-react';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  dueDate?: Date;
  priority: 'low' | 'medium' | 'high';
}

export const TodoWidget: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedPriority, setSelectedPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  const priorityColors = {
    low: 'bg-blue-100 text-blue-700',
    medium: 'bg-yellow-100 text-yellow-700',
    high: 'bg-red-100 text-red-700'
  };

  const addTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTodo.trim()) {
      const todo: Todo = {
        id: Date.now().toString(),
        text: newTodo.trim(),
        completed: false,
        dueDate: selectedDate,
        priority: selectedPriority
      };
      setTodos(prev => [todo, ...prev]);
      setNewTodo('');
      setSelectedDate(undefined);
      setSelectedPriority('medium');
      setShowAddForm(false);
    }
  };

  const toggleTodo = (id: string) => {
    setTodos(prev =>
      prev.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: string) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  };

  const formatDate = (date: Date) => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="h-full flex flex-col bg-white rounded-xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-4 flex items-center justify-between border-b">
        <h2 className="text-lg font-semibold">Tasks</h2>
        <button
          onClick={() => setShowAddForm(true)}
          className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors"
        >
          <Plus size={20} />
        </button>
      </div>

      {/* Add Todo Form */}
      <AnimatePresence>
        {showAddForm && (
          <motion.form
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            onSubmit={addTodo}
            className="border-b overflow-hidden"
          >
            <div className="p-4 space-y-3">
              <input
                type="text"
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                placeholder="What needs to be done?"
                className="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
              />
              
              <div className="flex gap-2">
                <div className="flex-1">
                  <input
                    type="date"
                    onChange={(e) => setSelectedDate(e.target.value ? new Date(e.target.value) : undefined)}
                    className="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <select
                  value={selectedPriority}
                  onChange={(e) => setSelectedPriority(e.target.value as 'low' | 'medium' | 'high')}
                  className="px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                >
                  Add Task
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 rounded-lg border hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Todo List */}
      <div className="flex-1 overflow-auto">
        <AnimatePresence>
          {todos.map(todo => (
            <motion.div
              key={todo.id}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-b last:border-b-0"
            >
              <div className="p-4 flex items-start gap-3">
                <button
                  onClick={() => toggleTodo(todo.id)}
                  className="mt-0.5 text-gray-400 hover:text-blue-500 transition-colors"
                >
                  {todo.completed ? (
                    <CheckCircle2 size={20} className="text-blue-500" />
                  ) : (
                    <Circle size={20} />
                  )}
                </button>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`text-sm ${todo.completed ? 'line-through text-gray-400' : ''}`}>
                      {todo.text}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-xs ${priorityColors[todo.priority]}`}>
                      {todo.priority}
                    </span>
                  </div>
                  
                  {todo.dueDate && (
                    <div className="mt-1 flex items-center gap-1 text-xs text-gray-500">
                      <Calendar size={12} />
                      <span>{formatDate(todo.dueDate)}</span>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => deleteTodo(todo.id)}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {todos.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-gray-400 p-4">
            <CheckCircle2 size={40} className="mb-2" />
            <p className="text-center">No tasks yet. Add one to get started!</p>
          </div>
        )}
      </div>
    </div>
  );
};
