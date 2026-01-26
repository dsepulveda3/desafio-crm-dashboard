"use client";

import { useState } from "react";

interface InfoTooltipProps {
  text: string;
}

export function InfoTooltip({ text }: InfoTooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative inline-block">
      <button
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onClick={() => setIsVisible(!isVisible)}
        className="w-5 h-5 rounded-full bg-slate-700 hover:bg-slate-600 text-slate-400 hover:text-white text-xs flex items-center justify-center transition-colors"
        aria-label="Información"
      >
        i
      </button>

      {isVisible && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-50 animate-fade-in">
          <p className="text-sm text-slate-300">{text}</p>
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1">
            <div className="border-8 border-transparent border-t-slate-800" />
          </div>
        </div>
      )}
    </div>
  );
}
