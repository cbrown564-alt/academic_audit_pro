import React from 'react';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';

interface RedPenProps {
  improvements: string[];
}

export const RedPen: React.FC<RedPenProps> = ({ improvements }) => {
  if (!improvements || improvements.length === 0) {
      return (
          <div className="flex items-center gap-3 text-emerald-700 p-5 bg-emerald-50/50 rounded-xl border border-emerald-100 shadow-sm">
              <div className="p-2 bg-emerald-100 rounded-full shrink-0">
                <CheckCircle2 size={20} className="text-emerald-600" />
              </div>
              <div>
                <h4 className="font-semibold text-sm text-emerald-800">No critical issues found</h4>
                <p className="text-xs text-emerald-600/80 mt-0.5">Excellent work demonstrating high proficiency.</p>
              </div>
          </div>
      )
  }

  // Helper to process markdown-style bolding and code snippets
  const formatText = (text: string) => {
    // Split by markdown bold syntax **text** OR code syntax `text`
    // This regex captures the delimiters and content
    const parts = text.split(/(\*\*.*?\*\*|`[^`]+`)/g);
    
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        // Remove the ** markers and render bold
        return (
          <span key={i} className="font-bold text-zinc-900">
            {part.slice(2, -2)}
          </span>
        );
      } else if (part.startsWith('`') && part.endsWith('`')) {
        // Remove the ` markers and render as code
        return (
          <span key={i} className="font-mono text-[11px] bg-zinc-100 border border-zinc-200 px-1.5 py-0.5 rounded text-rose-700 mx-0.5">
            {part.slice(1, -1)}
          </span>
        );
      }
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <div className="space-y-3">
      {improvements.map((item, idx) => (
        <div 
          key={idx} 
          className="group relative p-4 bg-white rounded-xl border border-zinc-200 shadow-[0_2px_4px_rgba(0,0,0,0.02)] hover:shadow-[0_4px_12px_rgba(244,63,94,0.1)] hover:border-rose-200 transition-all duration-200 ease-in-out"
        >
          <div className="flex gap-4 items-start">
            {/* Icon Indicator */}
            <div className="flex-shrink-0 pt-0.5">
               <div className="w-6 h-6 rounded-full bg-rose-50 flex items-center justify-center border border-rose-100 group-hover:bg-rose-100 group-hover:scale-110 transition-all duration-200">
                  <AlertTriangle size={12} className="text-rose-600" strokeWidth={2.5} />
               </div>
            </div>

            {/* Text Content */}
            <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 group-hover:text-rose-500 transition-colors">
                        Priority Issue {idx + 1}
                    </span>
                </div>
                <p className="text-[13px] text-zinc-600 leading-relaxed font-normal group-hover:text-zinc-800 transition-colors">
                  {formatText(item)}
                </p>
            </div>
          </div>
          
          {/* Active Indicator Bar on Hover */}
          <div className="absolute left-0 top-3 bottom-3 w-[3px] bg-rose-500 rounded-r opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
        </div>
      ))}
    </div>
  );
};