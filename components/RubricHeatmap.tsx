import React from 'react';
import { RubricItem } from '../types';

interface RubricHeatmapProps {
  items: RubricItem[];
}

export const RubricHeatmap: React.FC<RubricHeatmapProps> = ({ items }) => {
  // Helper to render Markdown-style bold text
  const formatFeedback = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <span key={i} className="font-bold text-zinc-800">{part.slice(2, -2)}</span>;
      }
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <div>
      <div className="space-y-8">
        {items.map((item, idx) => {
          let barColor = 'bg-zinc-300';
          let textColor = 'text-zinc-500';
          let borderColor = 'border-zinc-200';
          
          const percentage = (item.score / item.maxScore) * 100;
          
          // Strict academic color coding matches legend based on percentage
          if (percentage >= 70 || item.performance === 'Excellent') {
              barColor = 'bg-emerald-500';
              textColor = 'text-emerald-700';
              borderColor = 'border-emerald-200';
          } else if (percentage >= 60 || item.performance === 'Good') {
              barColor = 'bg-indigo-500';
              textColor = 'text-indigo-700';
              borderColor = 'border-indigo-200';
          } else if (percentage >= 40 || item.performance === 'Needs Improvement') {
              barColor = 'bg-amber-400';
              textColor = 'text-amber-700';
              borderColor = 'border-amber-200';
          } else {
              barColor = 'bg-rose-500';
              textColor = 'text-rose-700';
              borderColor = 'border-rose-200';
          }

          return (
            <div key={idx} className="group">
              <div className="flex justify-between items-end mb-2">
                <h4 className="font-medium text-zinc-800 text-sm w-2/3">{item.criterion}</h4>
                <div className="flex items-center gap-2 text-right">
                   <span className="text-xs font-bold text-zinc-900">{item.score}/{item.maxScore}</span>
                   <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border ${borderColor} bg-opacity-10 ${barColor.replace('bg-', 'bg-opacity-10 bg-')} ${textColor}`}>
                      {item.performance}
                   </span>
                </div>
              </div>
              
              {/* Progress Bar Background */}
              <div className="h-3 w-full bg-zinc-100 rounded-md overflow-hidden mb-3 border border-zinc-100 relative">
                 {/* Markers for pass/distinction */}
                 <div className="absolute top-0 bottom-0 left-[40%] w-px bg-zinc-300 z-10 opacity-50" title="Pass (40%)"></div>
                 <div className="absolute top-0 bottom-0 left-[70%] w-px bg-zinc-300 z-10 opacity-50" title="Distinction (70%)"></div>

                {/* Actual Bar */}
                <div 
                  className={`h-full ${barColor} rounded-r-sm transition-all duration-1000 ease-out relative z-0`}
                  style={{ width: `${Math.min(percentage, 100)}%` }}
                />
              </div>
              
              <p className="text-xs text-zinc-600 leading-relaxed">
                {formatFeedback(item.feedback)}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};