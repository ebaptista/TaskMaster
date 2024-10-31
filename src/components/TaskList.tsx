import React from 'react';
import { Clock, CheckCircle2, Circle, Timer, MoreVertical } from 'lucide-react';
import type { Task } from '../types';
import { ProgressControl } from './ProgressControl';

interface TaskListProps {
  tasks: Task[];
  onTaskUpdate: (taskId: string, updates: Partial<Task>) => void;
}

export function TaskList({ tasks, onTaskUpdate }: TaskListProps) {
  const getStatusIcon = (status: Task['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'in-progress':
        return <Clock className="w-5 h-5 text-blue-500" />;
      default:
        return <Circle className="w-5 h-5 text-gray-400" />;
    }
  };

  const handleProgressChange = (taskId: string, newProgress: number) => {
    onTaskUpdate(taskId, {
      progress: newProgress,
      status: newProgress === 100 ? 'completed' : newProgress === 0 ? 'pending' : 'in-progress',
    });
  };

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <div
          key={task.id}
          className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3">
              <button
                onClick={() =>
                  onTaskUpdate(task.id, {
                    status:
                      task.status === 'completed'
                        ? 'pending'
                        : task.status === 'pending'
                        ? 'in-progress'
                        : 'completed',
                    progress: task.status === 'pending' ? 0 : task.status === 'completed' ? 100 : task.progress,
                  })
                }
                className="hover:opacity-75 transition-opacity"
              >
                {getStatusIcon(task.status)}
              </button>
              <div>
                <h3 className="font-medium text-gray-900">{task.title}</h3>
                <p className="text-sm text-gray-500">{task.description}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Timer className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">
                  {task.timeSpent}/{task.timeEstimate}h
                </span>
              </div>
              <button className="hover:bg-gray-100 p-2 rounded-full">
                <MoreVertical className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          </div>
          <div className="pl-8">
            <ProgressControl
              progress={task.progress}
              onProgressChange={(newProgress) => handleProgressChange(task.id, newProgress)}
            />
          </div>
        </div>
      ))}
    </div>
  );
}