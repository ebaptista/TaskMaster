const STORAGE_KEY = 'taskmaster-data';

export interface AppState {
  projects: Project[];
  theme: ThemeState;
}

export function saveState(state: AppState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function loadState(): AppState {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) {
    return {
      projects: [],
      theme: { isDark: false }
    };
  }
  return JSON.parse(saved);
}