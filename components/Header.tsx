import React from 'react';
import { AIEyeIcon } from './icons';

export const Header: React.FC = () => {
  return (
    <header className="w-full max-w-7xl mx-auto p-4">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-3">
          <div className="bg-brand-accent/10 p-2 rounded-lg">
            <AIEyeIcon className="text-brand-accent h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold text-brand-text tracking-tight">
            AI Image Detector
          </h1>
        </div>
        {/* Placeholder for future actions/links */}
        <div className="flex items-center gap-4">
            {/* Example: <a href="#" className="text-brand-subtle hover:text-brand-text transition-colors">Docs</a> */}
        </div>
      </div>
    </header>
  );
};
