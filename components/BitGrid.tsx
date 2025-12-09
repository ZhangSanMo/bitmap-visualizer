import React, { useMemo, useState } from 'react';
import { BitField, COLORS, TAILWIND_COLORS_HEX } from '../types';
import { isBitSet } from '../utils/bitUtils';

interface BitGridProps {
  totalBits: number;
  value: bigint;
  fields: BitField[];
  onToggleBit: (index: number) => void;
  hoveredFieldId: string | null;
  setHoveredFieldId: (id: string | null) => void;
}

const BitGrid: React.FC<BitGridProps> = ({ 
  totalBits, 
  value, 
  fields, 
  onToggleBit,
  hoveredFieldId,
  setHoveredFieldId
}) => {
  // Track which specific bit is being hovered to show the tooltip only there
  const [hoveredBitIndex, setHoveredBitIndex] = useState<number | null>(null);
  
  // Map bit index to field
  const bitToFieldMap = useMemo(() => {
    const map = new Map<number, BitField>();
    fields.forEach(field => {
      const start = Math.min(field.startBit, field.endBit);
      const end = Math.max(field.startBit, field.endBit);
      for (let i = start; i <= end; i++) {
        map.set(i, field);
      }
    });
    return map;
  }, [fields]);

  // Group bits into bytes (chunks of 8 aligned to LSB)
  const byteGroups = useMemo(() => {
    const groups: number[][] = [];
    const maxByteIndex = Math.floor((totalBits - 1) / 8);
    
    // Iterate from highest byte to lowest byte so they render MSB -> LSB
    for (let b = maxByteIndex; b >= 0; b--) {
        const groupBits: number[] = [];
        const startBit = Math.min(totalBits - 1, (b * 8) + 7);
        const endBit = b * 8;
        
        // Push bits in descending order (MSB to LSB within the byte)
        for (let i = startBit; i >= endBit; i--) {
            groupBits.push(i);
        }
        groups.push(groupBits);
    }
    return groups;
  }, [totalBits]);

  return (
    <div className="w-full px-2">
      {/* 
        flex-wrap: Ensures bytes wrap to the next line if they don't fit.
        gap-x-6: Spacing between byte groups.
      */}
      <div className="flex flex-wrap gap-x-6 gap-y-6">
        {byteGroups.map((group, groupIdx) => (
          <div key={groupIdx} className="flex gap-1 relative p-1">
             {group.map((bitIndex) => {
                const isActive = isBitSet(value, bitIndex);
                const field = bitToFieldMap.get(bitIndex);
                // Separator between nibbles (every 4 bits).
                const isNibbleSeparator = (bitIndex % 4 === 0) && (bitIndex % 8 !== 0);
                
                // Color logic
                let borderColor = 'border-slate-700';
                let bgColor = 'bg-slate-800';
                let textColor = 'text-slate-500';
                let bottomBorderColor = undefined;
                
                if (field) {
                    const colorIndex = fields.findIndex(f => f.id === field.id) % COLORS.length;
                    const hexColor = TAILWIND_COLORS_HEX[colorIndex];
                    const isFieldHovered = hoveredFieldId === field.id;
                    const isHoveringOther = hoveredFieldId && !isFieldHovered;
                    
                    if (isActive) {
                        bgColor = isHoveringOther ? 'bg-slate-700' : COLORS[colorIndex];
                        textColor = isHoveringOther ? 'text-slate-500' : 'text-white';
                        borderColor = isHoveringOther ? 'border-slate-600' : 'border-transparent';
                    } else {
                        // Inactive bit but part of a field
                        borderColor = isHoveringOther ? 'border-slate-700' : 'border-slate-700';
                        bottomBorderColor = isHoveringOther ? undefined : hexColor;
                        textColor = isHoveringOther ? 'text-slate-600' : 'text-slate-400';
                        
                        // Slightly highlight the background of inactive bits in the hovered field
                        if (isFieldHovered && !isActive) {
                             bgColor = 'bg-slate-750'; 
                             borderColor = 'border-slate-600';
                        }
                    }
                } else {
                    if (isActive) {
                        bgColor = 'bg-slate-200';
                        textColor = 'text-slate-900';
                    }
                }

                // Tooltip is shown only if this specific bit is the one being hovered
                const showTooltip = field && hoveredBitIndex === bitIndex;

                return (
                   <React.Fragment key={bitIndex}>
                      <div className="flex flex-col items-center group relative">
                        <button
                          onClick={() => onToggleBit(bitIndex)}
                          onMouseEnter={() => {
                              if (field) setHoveredFieldId(field.id);
                              setHoveredBitIndex(bitIndex);
                          }}
                          onMouseLeave={() => {
                              setHoveredFieldId(null);
                              setHoveredBitIndex(null);
                          }}
                          className={`
                            w-8 h-12 sm:w-10 sm:h-14 flex flex-col items-center justify-center 
                            border-b-4 rounded-t-sm transition-all duration-150
                            hover:brightness-110 active:scale-95
                            ${bgColor} ${textColor}
                            ${!field && !isActive ? 'border-slate-700' : ''}
                            ${field && isActive ? borderColor : ''} 
                          `}
                          style={{
                            borderBottomColor: bottomBorderColor 
                          }}
                          // Removed native title to use custom tooltip
                        >
                          <span className="font-mono text-lg font-bold">
                            {isActive ? '1' : '0'}
                          </span>
                          <span className="text-[10px] opacity-60 font-mono mt-1">
                            {bitIndex}
                          </span>
                        </button>
                        
                        {/* Custom Floating Tooltip */}
                        {showTooltip && (
                          <div className="absolute bottom-full mb-2 z-50 whitespace-nowrap bg-slate-900 text-white text-xs px-3 py-1.5 rounded-md border border-slate-600 shadow-xl pointer-events-none animate-in fade-in slide-in-from-bottom-1 duration-150">
                            <div className="flex items-center gap-2">
                                <span className="font-bold text-emerald-400">{field.name}</span>
                                <span className="text-slate-400 font-mono text-[10px]">
                                    [{Math.max(field.startBit, field.endBit)}:{Math.min(field.startBit, field.endBit)}]
                                </span>
                            </div>
                            {/* Little triangle arrow */}
                            <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px border-4 border-transparent border-t-slate-600" />
                          </div>
                        )}
                      </div>
                      
                      {isNibbleSeparator && <div className="w-2" />}
                   </React.Fragment>
                );
             })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BitGrid;