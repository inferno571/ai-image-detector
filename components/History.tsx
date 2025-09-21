
import React from 'react';
import type { AnalysisRecord } from '../types';
import { Classification } from '../types';
import { HistoryIcon } from './icons';

interface HistoryProps {
  history: AnalysisRecord[];
  onSelect: (record: AnalysisRecord) => void;
}

const getClassificationBadge = (classification: Classification) => {
    switch (classification) {
        case Classification.REAL:
            return <div className="absolute top-1 right-1 text-xs bg-green-500 text-white rounded-full px-2 py-0.5">Real</div>;
        case Classification.FAKE:
            return <div className="absolute top-1 right-1 text-xs bg-red-500 text-white rounded-full px-2 py-0.5">AI</div>;
        default:
            return <div className="absolute top-1 right-1 text-xs bg-yellow-500 text-white rounded-full px-2 py-0.5">?</div>;
    }
}

export const History: React.FC<HistoryProps> = ({ history, onSelect }) => {
  return (
    <div className="w-full max-w-6xl mt-8 bg-brand-secondary border border-brand-border rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-semibold text-brand-text mb-4 flex items-center gap-2">
        <HistoryIcon />
        Analysis History
      </h2>
      <div className="flex overflow-x-auto space-x-4 pb-4">
        {history.map(record => (
          <button 
            key={record.id} 
            onClick={() => onSelect(record)}
            className="flex-shrink-0 w-32 h-32 rounded-lg overflow-hidden border-2 border-brand-border hover:border-brand-accent focus:border-brand-accent focus:outline-none transition-all relative group"
            aria-label={`Select analysis for ${record.imageFile.name}`}
            >
            <img src={record.imageSrc} alt={record.imageFile.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            {getClassificationBadge(record.result.classification)}
          </button>
        ))}
      </div>
    </div>
  );
};
