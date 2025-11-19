import React from 'react';
import { Sparkles, Star } from 'lucide-react';

interface StarSuggestionsProps {
  suggestions: string[];
}

export const StarSuggestions: React.FC<StarSuggestionsProps> = ({ suggestions }) => {
  if (!suggestions || suggestions.length === 0) return null;

  // Helper to process markdown-style bolding
  const formatText = (text: string) => {
    // Split by markdown bold syntax **text**
    const parts = text.split(/(\*\*.*?\*\*)/g);
    
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <span key={i} className="font-bold text-indigo-900">
            {part.slice(2, -2)}
          </span>
        );
      }
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <div className="bg-gradient-to-br from-white to-indigo-50/50 rounded-2xl border border-indigo-100 shadow-sm overflow-hidden">
      <div className="p-5 border-b border-indigo-100/50 bg-indigo-50/30 flex items-center gap-2">
        <div className="p-1.5 bg-indigo-100 text-indigo-600 rounded-md">
            <Sparkles size={16} fill="currentColor" className="text-indigo-500" />
        </div>
        <div>
             <h3 className="font-semibold text-indigo-900 text-sm">Reaching for the Stars</h3>
             <p className="text-[11px] text-indigo-600/80">Optional ways to make this work exceptional</p>
        </div>
      </div>
      
      <div className="p-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {suggestions.map((tip, idx) => (
          <div key={idx} className="flex gap-3 items-start group">
            <div className="mt-0.5 text-indigo-300 group-hover:text-indigo-500 transition-colors flex-shrink-0">
                <Star size={14} fill="currentColor" />
            </div>
            <p className="text-sm text-zinc-600 leading-relaxed group-hover:text-indigo-900 transition-colors">
                {formatText(tip)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};