import React, { useState } from 'react';
import { Plus, Trash2, Edit2, Check, X, Info } from 'lucide-react';
import { BitField, COLORS, TAILWIND_COLORS_HEX } from '../types';
import { getFieldValue, setFieldValue, formatBigInt, parseBigInt } from '../utils/bitUtils';

interface FieldConfiguratorProps {
  fields: BitField[];
  totalBits: number;
  globalValue: bigint;
  onAddField: (field: BitField) => void;
  onRemoveField: (id: string) => void;
  onUpdateField: (field: BitField) => void;
  onValueChange: (newValue: bigint) => void;
  hoveredFieldId: string | null;
  setHoveredFieldId: (id: string | null) => void;
}

const FieldConfigurator: React.FC<FieldConfiguratorProps> = ({
  fields,
  totalBits,
  globalValue,
  onAddField,
  onRemoveField,
  onUpdateField,
  onValueChange,
  hoveredFieldId,
  setHoveredFieldId
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newField, setNewField] = useState<Partial<BitField>>({
    name: 'New Field',
    startBit: 0,
    endBit: 0
  });

  const handleAddField = () => {
    if (newField.name && newField.startBit !== undefined && newField.endBit !== undefined) {
      onAddField({
        id: crypto.randomUUID(),
        name: newField.name,
        startBit: Math.min(Math.max(0, newField.startBit), totalBits - 1),
        endBit: Math.min(Math.max(0, newField.endBit), totalBits - 1),
        color: COLORS[fields.length % COLORS.length]
      });
      setIsAdding(false);
      setNewField({ name: 'New Field', startBit: 0, endBit: 0 });
    }
  };

  const handleFieldValChange = (field: BitField, inputVal: string) => {
    const val = parseBigInt(inputVal, 10); // Assume decimal input for field values for simplicity
    const newVal = setFieldValue(globalValue, field.startBit, field.endBit, val);
    onValueChange(newVal);
  };

  return (
    <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-6 shadow-xl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
          <Edit2 size={20} className="text-emerald-400" />
          Field Configuration
        </h2>
        <button
          onClick={() => setIsAdding(true)}
          disabled={isAdding}
          className="flex items-center gap-2 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors"
        >
          <Plus size={16} /> Add Field
        </button>
      </div>

      <div className="space-y-3">
        {/* Table Header */}
        {fields.length > 0 && (
          <div className="grid grid-cols-12 gap-4 text-xs font-semibold text-slate-400 px-4 uppercase tracking-wider mb-2">
            <div className="col-span-1">Color</div>
            <div className="col-span-3">Name</div>
            <div className="col-span-2 text-center">Bits</div>
            <div className="col-span-4">Value (Dec)</div>
            <div className="col-span-2 text-right">Actions</div>
          </div>
        )}

        {/* Existing Fields */}
        {fields.map((field, idx) => {
          const fieldValue = getFieldValue(globalValue, field.startBit, field.endBit);
          const maxVal = (1n << (BigInt(Math.abs(field.endBit - field.startBit)) + 1n)) - 1n;
          const isHovered = hoveredFieldId === field.id;

          return (
            <div 
              key={field.id}
              className={`grid grid-cols-12 gap-4 items-center bg-slate-800 p-3 rounded-lg border transition-all duration-200 ${isHovered ? 'border-slate-500 ring-1 ring-slate-500' : 'border-slate-700'}`}
              onMouseEnter={() => setHoveredFieldId(field.id)}
              onMouseLeave={() => setHoveredFieldId(null)}
            >
              <div className="col-span-1 flex justify-center">
                <div 
                  className="w-4 h-4 rounded-full shadow-lg" 
                  style={{ backgroundColor: TAILWIND_COLORS_HEX[idx % TAILWIND_COLORS_HEX.length] }}
                />
              </div>
              <div className="col-span-3">
                <input
                  type="text"
                  value={field.name}
                  onChange={(e) => onUpdateField({ ...field, name: e.target.value })}
                  className="w-full bg-transparent text-white text-sm focus:outline-none focus:border-b focus:border-slate-500 font-medium"
                />
              </div>
              <div className="col-span-2 text-center font-mono text-slate-300 text-sm">
                {Math.max(field.startBit, field.endBit)}:{Math.min(field.startBit, field.endBit)}
              </div>
              <div className="col-span-4">
                <div className="relative">
                  <input 
                    type="text"
                    value={fieldValue.toString()}
                    onChange={(e) => handleFieldValChange(field, e.target.value)}
                    className="w-full bg-slate-900 border border-slate-600 rounded px-2 py-1 text-right font-mono text-emerald-400 focus:outline-none focus:border-emerald-500"
                  />
                  <div className="text-[10px] text-slate-500 text-right mt-0.5">
                    Max: {maxVal.toString()}
                  </div>
                </div>
              </div>
              <div className="col-span-2 flex justify-end">
                <button
                  onClick={() => onRemoveField(field.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-400/10 rounded transition-colors"
                  title="Remove Field"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          );
        })}

        {/* Add New Field Form */}
        {isAdding && (
          <div className="flex gap-4 bg-slate-700/30 p-4 rounded-lg border border-dashed border-slate-600 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="shrink-0 mt-2">
              <div className="w-4 h-4 rounded-full bg-slate-600" />
            </div>
            
            <div className="flex-grow flex flex-wrap gap-x-4 gap-y-3 items-center">
              <div className="flex-grow min-w-[120px]">
                <input
                  type="text"
                  placeholder="Field Name"
                  value={newField.name}
                  onChange={(e) => setNewField({ ...newField, name: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-600 rounded px-2 py-1 text-sm text-white focus:ring-1 focus:ring-emerald-500 outline-none"
                  autoFocus
                />
              </div>
              
              <div className="flex items-center gap-2 shrink-0">
                <input
                  type="number"
                  placeholder="Start"
                  min={0}
                  max={totalBits - 1}
                  value={newField.startBit}
                  onChange={(e) => setNewField({ ...newField, startBit: parseInt(e.target.value) || 0 })}
                  className="w-16 bg-slate-900 border border-slate-600 rounded px-2 py-1 text-sm text-center text-white focus:ring-1 focus:ring-emerald-500 outline-none"
                />
                <span className="text-slate-400">-</span>
                <input
                  type="number"
                  placeholder="End"
                  min={0}
                  max={totalBits - 1}
                  value={newField.endBit}
                  onChange={(e) => setNewField({ ...newField, endBit: parseInt(e.target.value) || 0 })}
                  className="w-16 bg-slate-900 border border-slate-600 rounded px-2 py-1 text-sm text-center text-white focus:ring-1 focus:ring-emerald-500 outline-none"
                />
              </div>

              <div className="flex items-center gap-2 ml-auto">
                <button
                  onClick={handleAddField}
                  className="flex items-center gap-1 px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white text-xs rounded transition-colors whitespace-nowrap"
                >
                  <Check size={14} /> Save
                </button>
                <button
                  onClick={() => setIsAdding(false)}
                  className="flex items-center gap-1 px-3 py-1 bg-slate-600 hover:bg-slate-500 text-white text-xs rounded transition-colors whitespace-nowrap"
                >
                  <X size={14} /> Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {fields.length === 0 && !isAdding && (
          <div className="text-center py-8 text-slate-500 border-2 border-dashed border-slate-700/50 rounded-lg">
            <Info size={32} className="mx-auto mb-2 opacity-50" />
            <p>No fields defined. Click "Add Field" to define ranges.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FieldConfigurator;
