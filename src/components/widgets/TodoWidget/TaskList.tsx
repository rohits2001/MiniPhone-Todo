import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import {
  CheckCircle2,
  Circle,
  X,
  Calendar,
  Tag,
  ChevronRight,
  MoreVertical,
} from 'lucide-react';
import { useTodoStore } from '../../../store/todoStore';

interface TaskListProps {
  onTaskClick: (taskId: string) => void;
}

export const TaskList: React.FC<TaskListProps> = ({ onTaskClick }) => {
  const { tasks, toggleTaskComplete, deleteTask, updateTask } = useTodoStore();

  const priorityColors = {
    low: 'bg-blue-100 text-blue-700',
    medium: 'bg-yellow-100 text-yellow-700',
    high: 'bg-red-100 text-red-700',
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(tasks);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update task order in store
    items.forEach((task, index) => {
      updateTask(task.id, { order: index });
    });
  };

  const formatDate = (date: Date) => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const taskDate = new Date(date);
    
    if (taskDate.toDateString() === today.toDateString()) return 'Today';
    if (taskDate.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
    return taskDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="tasks">
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="h-full overflow-auto px-4"
          >
            <AnimatePresence>
              {tasks.map((task, index) => (
                <Draggable key={task.id} draggableId={task.id} index={index}>
                  {(provided, snapshot) => (
                    <motion.div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className={`group mb-2 p-3 bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700 shadow-sm hover:shadow-md transition-all ${
                        snapshot.isDragging ? 'shadow-lg' : ''
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <button
                          onClick={() => toggleTaskComplete(task.id)}
                          className="mt-0.5 text-gray-400 hover:text-blue-500 transition-colors"
                        >
                          {task.completed ? (
                            <CheckCircle2 size={20} className="text-blue-500" />
                          ) : (
                            <Circle size={20} />
                          )}
                        </button>

                        <div className="flex-1 min-w-0" onClick={() => onTaskClick(task.id)}>
                          <div className="flex items-center gap-2">
                            <span
                              className={`text-sm dark:text-white ${
                                task.completed ? 'line-through text-gray-400 dark:text-gray-500' : ''
                              }`}
                            >
                              {task.text}
                            </span>
                            <span
                              className={`px-2 py-0.5 rounded-full text-xs ${
                                priorityColors[task.priority]
                              }`}
                            >
                              {task.priority}
                            </span>
                          </div>

                          <div className="mt-2 flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                            {task.dueDate && (
                              <div className="flex items-center gap-1">
                                <Calendar size={12} />
                                <span>{formatDate(task.dueDate)}</span>
                              </div>
                            )}
                            {task.category?.length > 0 && (
                              <div className="flex items-center gap-1">
                                <Tag size={12} />
                                <span>{task.category.join(', ')}</span>
                              </div>
                            )}
                            {task.subtasks?.length > 0 && (
                              <div className="flex items-center gap-1">
                                <CheckCircle2 size={12} />
                                <span>
                                  {task.subtasks.filter((s) => s.completed).length}/
                                  {task.subtasks.length}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => onTaskClick(task.id)}
                            className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                          >
                            <ChevronRight size={16} className="text-gray-400" />
                          </button>
                          <button
                            onClick={() => deleteTask(task.id)}
                            className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                          >
                            <X size={16} className="text-gray-400" />
                          </button>
                        </div>
                      </div>

                      {/* Progress bar for tasks with subtasks */}
                      {task.subtasks?.length > 0 && (
                        <div className="mt-2 h-1 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-blue-500"
                            initial={{ width: 0 }}
                            animate={{
                              width: `${(task.subtasks.filter((s) => s.completed).length /
                                task.subtasks.length) *
                                100}%`,
                            }}
                            transition={{ duration: 0.3 }}
                          />
                        </div>
                      )}
                    </motion.div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </AnimatePresence>

            {tasks.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-gray-400 dark:text-gray-500 p-4">
                <CheckCircle2 size={40} className="mb-2" />
                <p className="text-center">No tasks yet. Add one to get started!</p>
              </div>
            )}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};
