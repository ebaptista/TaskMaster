import React from 'react';
import { FolderKanban, ArrowRight, Calendar } from 'lucide-react';
import type { Project } from '../types';

interface ProjectListProps {
  projects: Project[];
  onSelectProject: (projectId: string) => void;
}

export function ProjectList({ projects, onSelectProject }: ProjectListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project) => {
        const completedTasks = project.tasks.filter(t => t.status === 'completed').length;
        const progress = project.tasks.length > 0
          ? Math.round((completedTasks / project.tasks.length) * 100)
          : 0;

        return (
          <div
            key={project.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <FolderKanban className="w-8 h-8 text-blue-500" />
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      {project.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {project.tasks.length} tarefas
                    </p>
                  </div>
                </div>
              </div>

              <p className="mt-4 text-gray-600 dark:text-gray-300 text-sm">
                {project.description}
              </p>

              <div className="mt-6">
                <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mb-2">
                  <span>Progresso</span>
                  <span>{progress}%</span>
                </div>
                <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                  <div
                    className="h-2 bg-blue-500 rounded-full transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              <button
                onClick={() => onSelectProject(project.id)}
                className="mt-6 w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:ring-offset-gray-800"
              >
                Abrir projeto
                <ArrowRight className="ml-2 w-4 h-4" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}