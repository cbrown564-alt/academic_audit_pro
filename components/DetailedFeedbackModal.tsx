import React, { useState } from 'react';
import { X, Copy, Check, FileText } from 'lucide-react';
import { AuditResult } from '../types';

interface DetailedFeedbackModalProps {
  result: AuditResult;
  onClose: () => void;
}

export const DetailedFeedbackModal: React.FC<DetailedFeedbackModalProps> = ({ result, onClose }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    let text = `DETAILED FEEDBACK REPORT\n\n`;
    text += `Overall Grade: ${result.overallGrade} (${result.overallScore}/100)\n\n`;
    
    result.rubricBreakdown.forEach((item) => {
      text += `### ${item.criterion}\n`;
      text += `Score: ${item.score}/${item.maxScore} (${item.performance})\n`;
      text += `Feedback: ${item.feedback}\n\n`;
    });

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-3xl h-[85vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between bg-zinc-50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
              <FileText size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-zinc-900">Detailed Feedback</h2>
              <p className="text-xs text-zinc-500">Section-by-section breakdown</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-600 hover:text-indigo-600 bg-white border border-zinc-200 rounded-md hover:bg-indigo-50 transition-colors"
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              {copied ? 'Copied' : 'Copy Report'}
            </button>
            <button
              onClick={onClose}
              className="p-2 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 bg-white">
          <div className="space-y-8 max-w-2xl mx-auto">
            
            {/* Intro */}
            <div className="p-4 bg-indigo-50/50 rounded-xl border border-indigo-100 text-sm text-indigo-900/80 leading-relaxed">
              <span className="font-semibold block mb-1 text-indigo-900">Assessment Summary</span>
              {result.summary}
            </div>

            <div className="space-y-8">
              {result.rubricBreakdown.map((item, idx) => (
                <div key={idx} className="border-b border-zinc-100 pb-8 last:border-0">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-2">
                    <h3 className="font-bold text-zinc-900 text-base">
                      {item.criterion}
                    </h3>
                    <div className="flex items-center gap-3">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border
                            ${item.performance === 'Excellent' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                              item.performance === 'Good' ? 'bg-indigo-50 text-indigo-700 border-indigo-100' :
                              item.performance === 'Needs Improvement' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                              'bg-rose-50 text-rose-700 border-rose-100'
                            }
                        `}>
                            {item.performance}
                        </span>
                        <span className="text-sm font-bold text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded">
                            {item.score} <span className="text-zinc-400 font-normal">/ {item.maxScore}</span>
                        </span>
                    </div>
                  </div>
                  
                  <p className="text-zinc-600 text-sm leading-relaxed whitespace-pre-wrap">
                    {item.feedback}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};