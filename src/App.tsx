import React, { useState, useEffect } from 'react';
import { ClipboardList } from 'lucide-react';
import { TaskList } from './components/TaskList';
import { TaskForm } from './components/TaskForm';
import { LoginForm } from './components/auth/LoginForm';
import { ResetPassword } from './components/auth/ResetPassword';
import { Header } from './components/layout/Header';
import { ProjectList } from './components/ProjectList';
import { ProjectForm } from './components/ProjectForm';
import type { Task, TaskFormData, AuthState, Project } from './types';
import { loadState, saveState } from './store';

function App() {
  const [currentProject, setCurrentProject] = useState<string | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isDark, setIsDark] = useState(false);
  const [auth, setAuth] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
  });
  const [isResetting, setIsResetting] = useState(false);

  useEffect(() => {
    const state = loadState();
    setProjects(state.projects);
    setIsDark(state.theme.isDark);
    document.documentElement.classList.toggle('dark', state.theme.isDark);
  }, []);

  useEffect(() => {
    saveState({ projects, theme: { isDark } });
    document.documentElement.classList.toggle('dark', isDark);
  }, [projects, isDark]);

  const handleLogin = (email: string, password: string) => {
    setAuth({
      user: {
        id: '1',
        email,
        name: 'John Doe',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      },
      isAuthenticated: true,
    });
  };

  const handleLogout = () => {
    setAuth({ user: null, isAuthenticated: false });
    setCurrentProject(null);
  };

  const handleResetPassword = (email: string) => {
    alert(`Password reset instructions sent to ${email}`);
    setIsResetting(false);
  };

  const handleAddProject = (projectData: Omit<Project, 'id' | 'tasks' | 'createdAt' | 'updatedAt'>) => {
    const newProject: Project = {
      ...projectData,
      id: crypto.randomUUID(),
      tasks: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setProjects([...projects, newProject]);
  };

  const handleAddTask = (taskData: TaskFormData) => {
    if (!currentProject) return;
    
    const newTask: Task = {
      ...taskData,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
      timeSpent: 0,
      progress: 0,
    };

    setProjects(projects.map(project => 
      project.id === currentProject
        ? { ...project, tasks: [...project.tasks, newTask] }
        : project
    ));
  };

  const handleTaskUpdate = (taskId: string, updates: Partial<Task>) => {
    if (!currentProject) return;

    setProjects(projects.map(project => 
      project.id === currentProject
        ? {
            ...project,
            tasks: project.tasks.map(task =>
              task.id === taskId
                ? { ...task, ...updates, updatedAt: new Date() }
                : task
            ),
          }
        : project
    ));
  };

  if (!auth.isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="flex justify-center">
            <ClipboardList className="w-12 h-12 text-blue-600" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            TaskMaster
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Gerencie seus projetos de forma simples e eficiente
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
            {isResetting ? (
              <ResetPassword
                onSubmit={handleResetPassword}
                onBack={() => setIsResetting(false)}
              />
            ) : (
              <LoginForm
                onLogin={handleLogin}
                onForgotPassword={() => setIsResetting(true)}
              />
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header
        user={auth.user!}
        isDark={isDark}
        onLogout={handleLogout}
        onThemeToggle={() => setIsDark(!isDark)}
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentProject ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-medium text-gray-900 dark:text-white">Tarefas</h2>
                  <button
                    onClick={() => setCurrentProject(null)}
                    className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-500"
                  >
                    Voltar aos Projetos
                  </button>
                </div>
                {projects.find(p => p.id === currentProject)?.tasks.length === 0 ? (
                  <div className="text-center py-12">
                    <ClipboardList className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                      Nenhuma tarefa
                    </h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      Comece adicionando uma nova tarefa ao seu projeto.
                    </p>
                  </div>
                ) : (
                  <TaskList
                    tasks={projects.find(p => p.id === currentProject)?.tasks || []}
                    onTaskUpdate={handleTaskUpdate}
                  />
                )}
              </div>
            </div>

            <div>
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Nova Tarefa
                </h2>
                <TaskForm onSubmit={handleAddTask} />
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mt-6">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Resumo</h2>
                {currentProject && (
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Total de Tarefas:</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {projects.find(p => p.id === currentProject)?.tasks.length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Em Andamento:</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {projects.find(p => p.id === currentProject)?.tasks.filter(t => t.status === 'in-progress').length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Concluídas:</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {projects.find(p => p.id === currentProject)?.tasks.filter(t => t.status === 'completed').length}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Novo Projeto
              </h2>
              <ProjectForm onSubmit={handleAddProject} />
            </div>

            <div>
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Seus Projetos
              </h2>
              {projects.length === 0 ? (
                <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                  <ClipboardList className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                    Nenhum projeto
                  </h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Comece criando seu primeiro projeto.
                  </p>
                </div>
              ) : (
                <ProjectList projects={projects} onSelectProject={setCurrentProject} />
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;