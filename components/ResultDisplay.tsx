
import React from 'react';
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
        bgColor: 'bg-green-900/50',
        textColor: 'text-green-300',
        borderColor: 'border-green-500',
        Icon: CheckCircleIcon,
        text: 'Likely Real',
      };
    case Classification.FAKE:
      return {
        bgColor: 'bg-red-900/50',
        textColor: 'text-red-300',
        borderColor: 'border-red-500',
        Icon: ExclamationIcon,
        text: 'Likely AI-Generated',
      };
    case Classification.UNCERTAIN:
    default:
      return {
        bgColor: 'bg-yellow-900/50',
        textColor: 'text-yellow-300',
        borderColor: 'border-yellow-500',
        Icon: QuestionMarkCircleIcon,
        text: 'Uncertain',
      };
  }
};

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ result, onHighlightClick, isHighlighting }) => {
  const { classification, reasoning } = result;
  const { bgColor, textColor, borderColor, Icon, text } = getClassificationStyles(classification);

  return (
    <div className={`w-full h-full flex flex-col justify-between p-6 rounded-lg border ${borderColor} ${bgColor} animate-fade-in`}>
        <div>
            <div className="text-center">
                <h3 className="text-lg font-semibold text-brand-text mb-2">Analysis Complete</h3>
                <div className={`inline-flex items-center justify-center px-4 py-2 rounded-full font-bold ${textColor}`}>
                    <Icon />
                    <span className="ml-2 text-2xl">{text}</span>
                </div>
            </div>
            <div className="mt-4 pt-4 border-t border-brand-border w-full">
                <h4 className="font-semibold text-brand-text mb-2">AI Reasoning:</h4>
                <p className="text-brand-subtle text-sm leading-relaxed">{reasoning}</p>
            </div>
        </div>
        
        {classification === Classification.FAKE && (
            <div className="mt-6">
                <button
                    onClick={onHighlightClick}
                    disabled={isHighlighting}
                    className="w-full bg-yellow-500/20 text-yellow-300 font-bold py-3 px-4 rounded-lg hover:bg-yellow-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center space-x-2 border border-yellow-500"
                >
                    {isHighlighting ? <Loader /> : <SparklesIcon />}
                    <span>{isHighlighting ? 'Highlighting...' : 'Highlight Artifacts'}</span>
                </button>
            </div>
        )}
    </div>
  );
};
