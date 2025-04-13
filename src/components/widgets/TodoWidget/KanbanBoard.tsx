import React from 'react';
import { motion } from 'framer-motion';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useTodoStore } from '../../../store/todoStore';
import type { Task } from '../../../store/todoStore';

interface KanbanBoardProps {
  onTaskClick: (taskId: string) => void;
}

interface Column {
  id: string;
  title: string;
  tasks: Task[];
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({ onTaskClick }) => {
  const { tasks, updateTask } = useTodoStore();

  const columns: Column[] = [
    {
      id: 'todo',
      title: 'To Do',
      tasks: tasks.filter((t) => !t.completed),
    },
    {
      id: 'done',
      title: 'Done',
      tasks: tasks.filter((t) => t.completed),
    },
  ];

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const sourceCol = columns.find((col) => col.id === result.source.droppableId);
    const destCol = columns.find((col) => col.id === result.destination.droppableId);

    if (!sourceCol || !destCol) return;

    const task = sourceCol.tasks[result.source.index];
    if (!task) return;

    // Update task completion status based on destination column
    updateTask(task.id, {
      completed: destCol.id === 'done',
    });
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="h-full flex gap-4 p-4 overflow-auto">
        {columns.map((column) => (
          <div
            key={column.id}
            className="flex-1 flex flex-col min-w-[280px] bg-gray-50 dark:bg-gray-900 rounded-xl"
          >
            <div className="p-4 border-b dark:border-gray-700">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {column.title}
                <span className="ml-2 text-gray-400">({column.tasks.length})</span>
              </h3>
            </div>

            <Droppable droppableId={column.id}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="flex-1 p-2 overflow-y-auto"
                >
                  <AnimatePresence>
                    {column.tasks.map((task, index) => (
                      <Draggable
                        key={task.id}
                        draggableId={task.id}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <motion.div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className={`mb-2 p-3 bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700 shadow-sm hover:shadow-md transition-all cursor-pointer ${
                              snapshot.isDragging ? 'shadow-lg' : ''
                            }`}
                            onClick={() => onTaskClick(task.id)}
                          >
                            <div className="text-sm dark:text-white">
                              {task.text}
                            </div>
                            {(task.subtasks?.length > 0 || task.dueDate) && (
                              <div className="mt-2 flex items-center gap-3 text-xs text-gray-500">
                                {task.subtasks?.length > 0 && (
                                  <span>
                                    {task.subtasks.filter((s) => s.completed).length}/
                                    {task.subtasks.length} subtasks
                                  </span>
                                )}
                                {task.dueDate && (
                                  <span>
                                    Due {new Date(task.dueDate).toLocaleDateString()}
                                  </span>
                                )}
                              </div>
                            )}
                            {task.progress > 0 && (
                              <div className="mt-2 h-1 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                                <motion.div
                                  className="h-full bg-blue-500"
                                  initial={{ width: 0 }}
                                  animate={{ width: `${task.progress}%` }}
                                  transition={{ duration: 0.3 }}
                                />
                              </div>
                            )}
                          </motion.div>
                        )}
                      </Draggable>
                    ))}
                  </AnimatePresence>
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </div>
    </DragDropContext>
  );
};
