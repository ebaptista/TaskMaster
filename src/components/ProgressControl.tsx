import React from 'react';
import { Minus, Plus } from 'lucide-react';

interface ProgressControlProps {
  progress: number;
  onProgressChange: (newProgress: number) => void;
}

export function ProgressControl({ progress, onProgressChange }: ProgressControlProps) {
  const handleProgressChange = (increment: boolean) => {
    const newProgress = increment
      ? Math.min(100, progress + 10)
      : Math.max(0, progress - 10);
    onProgressChange(newProgress);
  };

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={() => handleProgressChange(false)}
        className="p-1 rounded hover:bg-gray-100"
        disabled={progress <= 0}
      >
        <Minus className="w-4 h-4 text-gray-500" />
      </button>
      <div className="flex items-center space-x-2">
        <div className="w-32 h-2 bg-gray-200 rounded-full">
          <div
            className="h-2 bg-blue-500 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="text-sm text-gray-600 min-w-[3ch]">{progress}%</span>
      </div>
      <button
        onClick={() => handleProgressChange(true)}
        className="p-1 rounded hover:bg-gray-100"
        disabled={progress >= 100}
      >
        <Plus className="w-4 h-4 text-gray-500" />
      </button>
    </div>
  );
}