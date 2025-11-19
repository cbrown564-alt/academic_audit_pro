import React, { useState, useRef } from 'react';
import { Upload, FileText, X, FileType, Clipboard, MousePointerClick } from 'lucide-react';
import { InputData } from '../types';

interface InputPanelProps {
  title: string;
  subLabel?: string;
  data: InputData;
  onChange: (data: InputData) => void;
}

export const InputPanel: React.FC<InputPanelProps> = ({ title, subLabel, data, onChange }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [showPasteInput, setShowPasteInput] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    processFile(file);
  };

  const processFile = (file?: File) => {
    if (!file) return;

    // If it's a text-readable format, read as text
    if (file.name.endsWith('.ipynb') || file.name.endsWith('.txt') || file.name.endsWith('.md') || file.name.endsWith('.json') || file.name.endsWith('.py')) {
        const textReader = new FileReader();
        textReader.onload = () => {
             onChange({
                type: 'text',
                content: textReader.result as string,
                fileName: file.name,
            });
        }
        textReader.readAsText(file);
    } else {
        // Otherwise read as Base64 (PDFs, Images, etc)
        const reader = new FileReader();
        reader.onload = () => {
          const base64String = (reader.result as string).split(',')[1];
          onChange({
            type: 'file',
            content: base64String,
            mimeType: file.type,
            fileName: file.name,
          });
        };
        reader.readAsDataURL(file);
    }
    setShowPasteInput(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    processFile(file);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange({
      type: 'text',
      content: e.target.value,
      fileName: 'Pasted Text',
    });
  };

  const clearInput = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange({ type: 'text', content: '' });
    setShowPasteInput(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const hasContent = data.content.length > 0;

  // Paste Input View
  if (showPasteInput && !hasContent) {
      return (
        <div className="relative h-full min-h-[60px] w-full bg-white rounded-lg border-2 border-indigo-500 shadow-sm p-1 animate-in fade-in duration-200">
            <textarea
                autoFocus
                className="w-full h-full min-h-[50px] text-xs p-2 resize-none focus:outline-none text-zinc-700 bg-transparent"
                placeholder="Paste your text here..."
                onBlur={(e) => {
                    if (!e.target.value) setShowPasteInput(false);
                    else handleTextChange(e);
                }}
                onChange={handleTextChange}
            />
            <button 
                onMouseDown={() => setShowPasteInput(false)} // onMouseDown fires before onBlur
                className="absolute top-2 right-2 p-1 bg-zinc-100 hover:bg-zinc-200 rounded-md text-zinc-500"
            >
                <X size={12} />
            </button>
        </div>
      );
  }

  return (
    <div 
        className={`relative h-full min-h-[60px] w-full rounded-lg transition-all duration-200 group
            ${hasContent 
                ? 'bg-white border border-zinc-200 shadow-sm hover:border-indigo-200' 
                : isDragging 
                    ? 'bg-indigo-50 border-2 border-dashed border-indigo-400' 
                    : 'bg-zinc-50 border border-dashed border-zinc-300 hover:border-indigo-300 hover:bg-white'
            }
        `}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => !hasContent && fileInputRef.current?.click()}
    >
        <input 
            type="file" 
            ref={fileInputRef}
            className="hidden" 
            accept=".pdf,.ipynb,.txt,.md,.json,.py"
            onChange={handleFileUpload} 
        />

        {hasContent ? (
            // Filled State
            <div className="flex items-center h-full p-3 gap-3 cursor-default">
                <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${data.type === 'file' ? 'bg-rose-50 text-rose-600' : 'bg-indigo-50 text-indigo-600'}`}>
                    {data.type === 'file' ? <FileType size={20} /> : <FileText size={20} />}
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-zinc-900 truncate" title={data.fileName}>
                        {data.fileName || 'Content Loaded'}
                    </p>
                    <p className="text-[10px] text-zinc-500 truncate">
                        {data.type === 'file' ? 'File Uploaded' : 'Text Content'}
                    </p>
                </div>
                <button 
                    onClick={clearInput}
                    className="p-1.5 text-zinc-400 hover:text-rose-500 hover:bg-rose-50 rounded-md transition-colors"
                    title="Remove"
                >
                    <X size={16} />
                </button>
            </div>
        ) : (
            // Empty State
            <div className="flex flex-col justify-center items-center h-full p-2 cursor-pointer text-center">
                <div className="flex items-center gap-2 mb-1">
                    <div className="bg-white p-1.5 rounded-md shadow-sm border border-zinc-100 text-zinc-400 group-hover:text-indigo-500 transition-colors">
                        <Upload size={14} />
                    </div>
                    <span className="font-medium text-zinc-700 text-sm group-hover:text-indigo-600 transition-colors">
                        {title}
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-[10px] text-zinc-400">
                        {subLabel || "Drag & Drop PDF or Text"}
                    </span>
                    <span className="text-[10px] text-zinc-300">|</span>
                    <button 
                        onClick={(e) => {
                            e.stopPropagation();
                            setShowPasteInput(true);
                        }}
                        className="text-[10px] font-medium text-indigo-600 hover:text-indigo-700 hover:underline decoration-indigo-300 underline-offset-2 flex items-center gap-1"
                    >
                        <Clipboard size={10} /> Paste Text
                    </button>
                </div>
            </div>
        )}
    </div>
  );
};
