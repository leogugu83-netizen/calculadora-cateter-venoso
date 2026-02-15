import React from 'react';
import { HelpCircle } from 'lucide-react';

interface InfoTooltipProps {
  content: string;
}

const InfoTooltip: React.FC<InfoTooltipProps> = ({ content }) => {
  return (
    <div className="group relative inline-block ml-2">
      <HelpCircle className="w-4 h-4 text-slate-400 hover:text-blue-500 cursor-help" />
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-slate-800 text-white text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
        {content}
        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800"></div>
      </div>
    </div>
  );
};

export default InfoTooltip;