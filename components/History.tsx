import React from 'react';
import { motion } from 'framer-motion';
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
            return <div className="absolute top-2 right-2 text-xs bg-green-500/80 text-white rounded-full px-2 py-1 font-bold shadow-md border border-white/20">REAL</div>;
        case Classification.FAKE:
            return <div className="absolute top-2 right-2 text-xs bg-red-500/80 text-white rounded-full px-2 py-1 font-bold shadow-md border border-white/20">AI</div>;
        default:
            return <div className="absolute top-2 right-2 text-xs bg-yellow-500/80 text-white rounded-full px-2 py-1 font-bold shadow-md border border-white/20">?</div>;
    }
}

export const History: React.FC<HistoryProps> = ({ history, onSelect }) => {
  return (
    <motion.div
        className="w-full max-w-7xl mt-12 bg-brand-secondary/50 border border-glass-border rounded-2xl shadow-glass backdrop-blur-lg p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
    >
      <h2 className="text-xl font-semibold text-brand-text mb-4 flex items-center gap-3">
        <HistoryIcon className="h-6 w-6 text-brand-accent" />
        Analysis History
      </h2>
      <div className="flex overflow-x-auto space-x-4 pb-4 -mx-6 px-6">
        {history.map((record) => (
          <motion.button
            key={record.id} 
            onClick={() => onSelect(record)}
            className="relative flex-shrink-0 w-32 h-32 rounded-lg overflow-hidden border-2 border-glass-border focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-primary focus:ring-brand-accent transition-all group"
            aria-label={`Select analysis for ${record.imageFile.name}`}
            whileHover={{ y: -5, scale: 1.05, boxShadow: '0 10px 20px rgba(0,0,0,0.2)' }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <img src={record.imageSrc} alt={record.imageFile.name} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
            {getClassificationBadge(record.result.classification)}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};
