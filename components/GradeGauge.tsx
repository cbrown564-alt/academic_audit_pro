import React from 'react';

interface GradeGaugeProps {
  score: number;
  grade: string;
}

export const GradeGauge: React.FC<GradeGaugeProps> = ({ score, grade }) => {
  // SVG Config
  const radius = 50;
  const stroke = 8;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  // Color logic based on score
  let colorClass = 'stroke-indigo-500';
  if (score >= 70) colorClass = 'stroke-emerald-500';
  else if (score >= 60) colorClass = 'stroke-indigo-500';
  else if (score >= 50) colorClass = 'stroke-amber-500';
  else colorClass = 'stroke-rose-500';

  const diameter = radius * 2;

  return (
    <div className="flex items-center gap-6">
      <div className="relative w-32 h-32 flex-shrink-0">
        <svg
          viewBox={`0 0 ${diameter} ${diameter}`}
          className="transform -rotate-90 w-full h-full"
        >
          <circle
            className="stroke-zinc-100"
            strokeWidth={stroke}
            fill="transparent"
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
          <circle
            className={`${colorClass} transition-all duration-1000 ease-out`}
            strokeWidth={stroke}
            strokeDasharray={circumference + ' ' + circumference}
            style={{ strokeDashoffset }}
            strokeLinecap="round"
            fill="transparent"
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center select-none">
          <span className="text-2xl font-bold text-zinc-800 leading-none">{score}</span>
          <span className="text-[10px] font-semibold text-zinc-400 uppercase mt-1">Score</span>
        </div>
      </div>
      
      <div className="flex flex-col">
        <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">
            Estimated Grade
        </h2>
        <div className="text-3xl font-bold text-zinc-800 tracking-tight leading-tight">
            {grade}
        </div>
      </div>
    </div>
  );
};