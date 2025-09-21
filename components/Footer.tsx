
import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full max-w-4xl mt-12 text-center text-xs text-brand-subtle">
      <div className="bg-brand-secondary border border-brand-border rounded-lg p-4">
        <h4 className="font-bold text-sm text-brand-text mb-2">Important Information</h4>
        <p className="mb-2">
          This application is a frontend demonstration that simulates the functionality described in the project synopsis. Instead of a custom-trained model on a Flask backend, it utilizes the powerful image analysis capabilities of the Google Gemini API.
        </p>
        <p className="font-semibold text-yellow-400">
          To make this project functional, you MUST create a `.env` file in the root directory and add your Google Gemini API key as `API_KEY=your_api_key_here`.
        </p>
        <p className="mt-2">
          Disclaimer: The analysis is performed by a generative AI model and may not be 100% accurate. Always use results as a reference, not a definitive conclusion.
        </p>
      </div>
      <p className="mt-4">
        Built with React, TypeScript, and Tailwind CSS.
      </p>
    </footer>
  );
};
