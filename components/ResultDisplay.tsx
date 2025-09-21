import React from 'react';
import { motion } from 'framer-motion';
import type { AnalysisResult } from '../types';
import { Classification } from '../types';
import { CheckCircleIcon, ExclamationIcon, QuestionMarkCircleIcon, SparklesIcon } from './icons';
import { Loader } from './Loader';

interface ResultDisplayProps {
  result: AnalysisResult;
  onHighlightClick: () => void;
  isHighlighting: boolean;
}

const getClassificationStyles = (classification: Classification) => {
  switch (classification) {
    case Classification.REAL:
      return {
        textColor: 'text-green-400',
        Icon: CheckCircleIcon,
        text: 'Likely Real',
      };
    case Classification.FAKE:
      return {
        textColor: 'text-red-400',
        Icon: ExclamationIcon,
        text: 'Likely AI-Generated',
      };
    case Classification.UNCERTAIN:
    default:
      return {
        textColor: 'text-yellow-400',
        Icon: QuestionMarkCircleIcon,
        text: 'Uncertain',
      };
  }
};

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ result, onHighlightClick, isHighlighting }) => {
  const { classification, reasoning } = result;
  const { textColor, Icon, text } = getClassificationStyles(classification);

  return (
    <motion.div
      className="w-full h-full flex flex-col justify-between"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <div>
        <div className="text-center">
          <div className={`inline-flex items-center justify-center px-4 py-2 rounded-full font-bold ${textColor}`}>
            <Icon className="h-8 w-8" />
            <span className="ml-3 text-2xl tracking-tight">{text}</span>
          </div>
        </div>
        <div className="mt-6 pt-4 border-t border-glass-border w-full">
          <h4 className="font-semibold text-brand-text mb-2">AI Reasoning:</h4>
          <p className="text-brand-subtle text-sm leading-relaxed">{reasoning}</p>
        </div>
      </div>

      {classification === Classification.FAKE && (
        <div className="mt-6">
          <motion.button
            onClick={onHighlightClick}
            disabled={isHighlighting}
            className="w-full bg-brand-accent text-brand-primary font-bold py-3 px-4 rounded-lg hover:bg-brand-accent-dark disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg shadow-brand-accent/20 hover:shadow-brand-accent/40"
            whileHover={{ y: -2 }}
            whileTap={{ y: 1 }}
          >
            {isHighlighting ? <Loader /> : <SparklesIcon className="h-5 w-5" />}
            <span>{isHighlighting ? 'Highlighting...' : 'Highlight Artifacts'}</span>
          </motion.button>
        </div>
      )}
    </motion.div>
  );
};
