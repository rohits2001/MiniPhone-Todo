import React, { useState, useMemo, useEffect } from 'react';
import { Check, Trash2, Edit2, Redo2 } from 'lucide-react';
import { motion, AnimatePresence, Variants } from 'framer-motion';

type Priority = 'low' | 'medium' | 'high';
type Category = 'personal' | 'work' | 'shopping' | 'other';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  priority: Priority;
  category: Category;
  dueDate: string;
  subtasks?: Todo[];
}

const TodoList: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([
    { 
      id: 'learn-react', 
      text: 'Learn React', 
      completed: false,
      priority: 'medium',
      category: 'personal',
      dueDate: new Date().toISOString().split('T')[0]
    },
    { 
      id: 'build-project', 
      text: 'Build a project', 
      completed: true,
      priority: 'high',
      category: 'work',
      dueDate: new Date().toISOString().split('T')[0]
    },
    { 
      id: 'write-documentation', 
      text: 'Write documentation', 
      completed: false,
      priority: 'low',
      category: 'work',
      dueDate: new Date().toISOString().split('T')[0]
    }
  ]);

  const [newTodo, setNewTodo] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [history, setHistory] = useState<Todo[][]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');



  const variants: Variants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  const springTransition = { type: 'spring', stiffness: 300, damping: 25 };

  useEffect(() => {
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
      setTodos(JSON.parse(savedTodos));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const saveToHistory = () => {
    setHistory(prev => {
      // Remove any future history if we're not at the latest state
      const newHistory = prev.slice(0, historyIndex + 1);
      return [...newHistory, [...todos]];
    });
    setHistoryIndex(prev => prev + 1);
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      const nextIndex = historyIndex + 1;
      setTodos(history[nextIndex]);
      setHistoryIndex(nextIndex);
    }
  };

  const addTodo = () => {
    if (newTodo.trim()) {
      const newTodos = [...todos, { 
        id: newTodo.trim().toLowerCase().replace(/\s+/g, '-'), 
        text: newTodo.trim(), 
        completed: false,
        priority: 'medium' as Priority,
        category: 'personal' as Category,
        dueDate: new Date().toISOString().split('T')[0]
      }];
      setTodos(newTodos);
      saveToHistory();
      setNewTodo('');
    }
  };

  const clearCompleted = () => {
    const newTodos = todos.filter(todo => !todo.completed);
    setTodos(newTodos);
    saveToHistory();
  };

  const startEdit = (todo: Todo) => {
    setEditingId(todo.id);
    setEditText(todo.text);
  };

  const saveEdit = () => {
    if (editingId && editText.trim()) {
      const newTodos = todos.map(todo =>
        todo.id === editingId ? { ...todo, text: editText.trim() } : todo
      );
      setTodos(newTodos);
      saveToHistory();
      setEditingId(null);
      setEditText('');
    }
  };

  const filteredTodos = useMemo(() => {
    return todos
      .filter((todo: Todo) => {
        const matchesFilter = 
          filter === 'all' ? true :
          filter === 'active' ? !todo.completed :
          todo.completed;
        return matchesFilter;
      });
  }, [todos, filter]);

  const toggleTodo = (id: string) => {
    const newTodos = todos.map((todo) =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    setTodos(newTodos);
    saveToHistory();
  };

  const deleteTodo = (id: string) => {
    const newTodos = todos.filter((todo) => todo.id !== id);
    setTodos(newTodos);
    saveToHistory();
  };

  return (
    <motion.div 
      className="h-full flex flex-col min-h-0 overflow-hidden font-sans text-[13px] bg-gradient-to-br from-blue-50 to-white"
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={springTransition}
    >
      {/* Header */}
      <motion.div 
        className="px-3 pt-3 text-gray-800"
        variants={variants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ ...springTransition, delay: 0.1 }}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <h1 className="text-lg font-semibold tracking-tight">My Tasks</h1>
            <motion.button
              onClick={redo}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className={`p-1 rounded ${historyIndex < history.length - 1 ? 'text-blue-600 hover:bg-black/5' : 'text-gray-400'}`}
              disabled={historyIndex >= history.length - 1}
            >
              <Redo2 size={14} />
            </motion.button>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center rounded-md text-[11px] overflow-hidden border divide-x divide-black/5 bg-white/50">

              <motion.button
                onClick={() => setFilter('all')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`px-2 py-1 transition-all ${filter === 'all' ? 'bg-black/5 text-gray-700' : 'text-gray-500 hover:text-gray-600 hover:bg-black/5'}`}
              >
                All
              </motion.button>
              <motion.button
                onClick={() => setFilter('active')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`px-2 py-1 transition-all ${filter === 'active' ? 'bg-black/5 text-gray-700' : 'text-gray-500 hover:text-gray-600 hover:bg-black/5'}`}
              >
                Active
              </motion.button>
              <motion.button
                onClick={() => setFilter('completed')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`px-2 py-1 transition-all ${filter === 'completed' ? 'bg-black/5 text-gray-700' : 'text-gray-500 hover:text-gray-600 hover:bg-black/5'}`}
              >
                Done
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Add Todo Bar */}
      <motion.div 
        className="px-3 py-1.5 border-t bg-black/5 border-black/5"
        variants={variants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ ...springTransition, delay: 0.3 }}
      >
        <div className="flex items-center gap-1.5">
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addTodo()}
            placeholder="Add a new task..."
            className="flex-1 text-[11px] px-2 py-1 rounded-md bg-white text-gray-600 border-none focus:outline-none focus:ring-1 focus:ring-blue-500/20 transition-all"
          />
          <motion.button
            onClick={addTodo}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-3 py-1 rounded-md text-[11px] font-medium bg-blue-500/10 text-blue-600 hover:bg-blue-500/20 transition-all"
          >
            Add
          </motion.button>

        </div>
      </motion.div>

      {/* Todo List */}
      <motion.div 
        className="flex-1 overflow-y-auto hide-scrollbar px-3 space-y-1 min-h-0 py-2 overscroll-contain"
        variants={variants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ ...springTransition, delay: 0.4 }}
      >
        <AnimatePresence>
          {filteredTodos.map(todo => (
            <motion.div
              key={todo.id}
              layout
              initial={{ opacity: 0, scale: 0.8, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: -20 }}
              transition={{
                ...springTransition,
                layout: springTransition
              }}
              whileHover={{ scale: 1.02 }}
              className={`flex items-center gap-2 px-2 py-1.5 rounded hover:bg-black/5 group transition-all`}
            >
              <motion.button
                onClick={() => toggleTodo(todo.id)}
                whileTap={{ scale: 0.8 }}
                className={`shrink-0 w-4 h-4 rounded flex items-center justify-center transition-all ${
                  todo.completed
                    ? 'bg-green-500/90 text-white'
                    : 'border border-black/20 hover:border-green-500/50'
                }`}
              >
                {todo.completed && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                  >
                    <Check size={8} />
                  </motion.div>
                )}
              </motion.button>
              {editingId === todo.id ? (
                <input
                  type="text"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && saveEdit()}
                  onBlur={saveEdit}
                  autoFocus
                  className={`flex-1 min-w-0 px-2 text-[13px] rounded bg-transparent focus:outline-none text-gray-700 placeholder:text-gray-400`}
                />
              ) : (
                <span className={`flex-1 min-w-0 truncate text-[13px] ${todo.completed ? 'line-through opacity-40' : ''} text-gray-700}`}>
                  {todo.text}
                </span>
              )}
              <motion.div className="flex items-center gap-1 shrink-0">
                {todo.dueDate && (
                  <span className={`text-xs font-medium text-gray-400`}>
                    {new Date(todo.dueDate).toLocaleDateString()}
                  </span>
                )}
                <motion.div className={`px-1.5 py-0.5 rounded text-[11px] shrink-0 ${
                  todo.priority === 'high' ? 'bg-red-500/10 text-red-500' :
                  todo.priority === 'medium' ? 'bg-yellow-500/10 text-yellow-600' :
                  'bg-green-500/10 text-green-600'
                }`}>
                  {todo.priority === 'medium' ? 'med' : todo.priority}
                </motion.div>
                <motion.span className={`text-[11px] px-1.5 py-0.5 rounded shrink-0 bg-gray-100 text-gray-500`}>
                  {todo.category === 'shopping' ? 'shop' : todo.category}
                </motion.span>
                <motion.button
                  onClick={() => startEdit(todo)}
                  whileTap={{ scale: 0.9 }}
                  className={`opacity-0 group-hover:opacity-100 p-0.5 shrink-0 text-black/40 hover:text-blue-500 transition-all`}
                >
                  <Edit2 size={11} />
                </motion.button>
                <motion.button
                  onClick={() => deleteTodo(todo.id)}
                  whileTap={{ scale: 0.9 }}
                  className={`opacity-0 group-hover:opacity-100 p-0.5 shrink-0 text-black/40 hover:text-red-500 transition-all`}
                >
                  <Trash2 size={11} />
                </motion.button>
              </motion.div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
      {/* Footer */}
      <motion.div 
        className="px-3 py-1.5 border-t bg-black/5 border-black/5 flex justify-end items-center"
        variants={variants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ ...springTransition, delay: 0.4 }}
      >
        <motion.button
          onClick={clearCompleted}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="text-[11px] px-2 py-0.5 rounded text-red-500 hover:bg-red-50 transition-all"
        >
          Clear completed
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default TodoList;