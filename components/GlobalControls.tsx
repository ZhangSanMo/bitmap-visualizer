import React from 'react';
import { Copy, RefreshCw } from 'lucide-react';
import { parseBigInt, formatBigInt } from '../utils/bitUtils';

interface GlobalControlsProps {
  value: bigint;
  onValueChange: (val: bigint) => void;
  totalBits: number;
  onTotalBitsChange: (bits: number) => void;
}

const GlobalControls: React.FC<GlobalControlsProps> = ({
  value,
  onValueChange,
  totalBits,
  onTotalBitsChange
}) => {
  
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    // Could add toast notification here
  };

  const commonBitSizes = [8, 16, 32, 64];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {/* Inputs Card */}
      <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 shadow-xl">
        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Global Value</h2>
        <div className="space-y-4">
          <div className="group">
            <label className="text-xs text-slate-500 mb-1 block">Hexadecimal</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-mono">0x</span>
              <input
                type="text"
                value={formatBigInt(value, 16)}
                onChange={(e) => onValueChange(parseBigInt(e.target.value, 16))}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2 pl-8 pr-10 font-mono text-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
              />
              <button 
                onClick={() => handleCopy(`0x${formatBigInt(value, 16)}`)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-300 transition-colors p-1"
              >
                <Copy size={14} />
              </button>
            </div>
          </div>

          <div className="group">
            <label className="text-xs text-slate-500 mb-1 block">Decimal</label>
            <div className="relative">
              <input
                type="text"
                value={value.toString()}
                onChange={(e) => onValueChange(parseBigInt(e.target.value, 10))}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2 px-3 pr-10 font-mono text-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
              />
              <button 
                onClick={() => handleCopy(value.toString())}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-300 transition-colors p-1"
              >
                <Copy size={14} />
              </button>
            </div>
          </div>
          
          <div className="group">
            <label className="text-xs text-slate-500 mb-1 block">Binary</label>
             <div className="relative">
               <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-mono">0b</span>
              <textarea
                value={formatBigInt(value, 2)}
                onChange={(e) => onValueChange(parseBigInt(e.target.value, 2))}
                rows={1}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2 pl-8 pr-10 font-mono text-xs text-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all resize-none overflow-hidden h-10"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Settings Card */}
      <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 shadow-xl flex flex-col justify-between">
         <div>
            <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Configuration</h2>
            <div className="mb-4">
              <label className="text-xs text-slate-500 mb-2 block">Bit Width</label>
              <div className="flex flex-wrap gap-2">
                {commonBitSizes.map(size => (
                  <button
                    key={size}
                    onClick={() => onTotalBitsChange(size)}
                    className={`px-4 py-2 rounded-lg font-mono text-sm font-medium transition-all ${
                      totalBits === size 
                        ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/50' 
                        : 'bg-slate-700 text-slate-400 hover:bg-slate-600 hover:text-white'
                    }`}
                  >
                    {size}-bit
                  </button>
                ))}
              </div>
            </div>
            
            <div className="mt-4">
                <label className="text-xs text-slate-500 mb-2 block">Custom Width</label>
                 <input
                  type="number"
                  min="1"
                  max="64"
                  value={totalBits}
                  onChange={(e) => onTotalBitsChange(Math.min(64, Math.max(1, parseInt(e.target.value) || 8)))}
                  className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white w-full sm:w-32 focus:outline-none focus:border-emerald-500"
                />
            </div>
         </div>

         <div className="mt-6 pt-6 border-t border-slate-700 flex justify-end">
            <button 
              onClick={() => onValueChange(0n)}
              className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm px-3 py-2 rounded hover:bg-slate-700"
            >
              <RefreshCw size={14} /> Clear All Bits
            </button>
         </div>
      </div>
    </div>
  );
};

export default GlobalControls;
