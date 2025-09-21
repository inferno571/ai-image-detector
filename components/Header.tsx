
import React from 'react';
import { AIEyeIcon } from './icons';

export const Header: React.FC = () => {
  return (
    <header className="w-full max-w-4xl text-center mb-8">
      <div className="flex justify-center items-center gap-4 mb-2">
        <AIEyeIcon />
        <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300">
          AI Image Detector
        </h1>
      </div>
      <p className="text-md md:text-lg text-brand-subtle">
        Leveraging Deep Learning to Distinguish Real Photos from AI Creations
      </p>
    </header>
  );
};
