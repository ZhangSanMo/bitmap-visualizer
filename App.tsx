import React, { useState, useEffect } from 'react';
import { Layers, Share2, Check } from 'lucide-react';
import BitGrid from './components/BitGrid';
import FieldConfigurator from './components/FieldConfigurator';
import GlobalControls from './components/GlobalControls';
import { BitField, COLORS } from './types';
import { toggleBit } from './utils/bitUtils';

const App: React.FC = () => {
  const [totalBits, setTotalBits] = useState(32);
  const [value, setValue] = useState<bigint>(0n);
  const [fields, setFields] = useState<BitField[]>([
    { id: '1', name: 'Flag A', startBit: 0, endBit: 0, color: '' },
    { id: '2', name: 'Mode', startBit: 1, endBit: 3, color: '' },
    { id: '3', name: 'Data', startBit: 4, endBit: 7, color: '' }
  ]);
  const [hoveredFieldId, setHoveredFieldId] = useState<string | null>(null);
  const [isUrlCopied, setIsUrlCopied] = useState(false);

  // Parse URL parameters on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const bitsParam = params.get('b');
    const valParam = params.get('v');
    const fieldsParam = params.get('f');

    // 1. Load Bits
    if (bitsParam) {
      const b = parseInt(bitsParam, 10);
      if (!isNaN(b) && b > 0 && b <= 64) setTotalBits(b);
    }

    // 2. Load Value (Hex expected)
    if (valParam) {
      try {
        const cleanHex = valParam.replace(/^0x/, '');
        if (cleanHex) {
            setValue(BigInt(`0x${cleanHex}`));
        }
      } catch (e) {
        console.error("Invalid value param in URL");
      }
    }

    // 3. Load Fields (Base64 encoded JSON)
    if (fieldsParam) {
      try {
        // Decode: Base64 -> URI Component -> JSON string
        const jsonString = decodeURIComponent(escape(atob(fieldsParam)));
        const parsed = JSON.parse(jsonString);
        
        if (Array.isArray(parsed)) {
          const loadedFields = parsed.map((f: any, i: number) => ({
             id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substr(2, 9),
             name: f.n || 'Field',
             startBit: typeof f.s === 'number' ? f.s : 0,
             endBit: typeof f.e === 'number' ? f.e : 0,
             // Cycle through colors
             color: COLORS[i % COLORS.length]
          }));
          setFields(loadedFields);
        }
      } catch (e) {
        console.error("Failed to parse fields from URL", e);
      }
    }
  }, []);

  // Ensure value gets truncated if totalBits reduces (only runs after initial mount interaction)
  useEffect(() => {
    const mask = (1n << BigInt(totalBits)) - 1n;
    if (value > mask) {
      setValue(value & mask);
    }
  }, [totalBits, value]);

  const handleToggleBit = (index: number) => {
    setValue(prev => toggleBit(prev, index));
  };

  const handleAddField = (newField: BitField) => {
    setFields([...fields, newField]);
  };

  const handleRemoveField = (id: string) => {
    setFields(fields.filter(f => f.id !== id));
  };

  const handleUpdateField = (updatedField: BitField) => {
    setFields(fields.map(f => f.id === updatedField.id ? updatedField : f));
  };

  const generateShareUrl = () => {
    const params = new URLSearchParams();
    
    // b: Total Bits
    params.set('b', totalBits.toString());
    
    // v: Value (Hex)
    params.set('v', value.toString(16).toUpperCase());
    
    // f: Fields (Minified JSON + Base64)
    const simplifiedFields = fields.map(f => ({
      n: f.name,
      s: f.startBit,
      e: f.endBit
    }));
    
    try {
      const json = JSON.stringify(simplifiedFields);
      // Encode: JSON string -> URI Component -> Base64
      // unescape/encodeURIComponent handles Unicode characters properly for btoa
      const encoded = btoa(unescape(encodeURIComponent(json)));
      params.set('f', encoded);
    } catch (e) {
      console.error("Failed to encode fields for URL");
    }

    return `${window.location.origin}${window.location.pathname}?${params.toString()}`;
  };

  const handleShare = () => {
    const url = generateShareUrl();
    navigator.clipboard.writeText(url).then(() => {
      setIsUrlCopied(true);
      
      // Update browser URL without reloading to reflect current state
      window.history.replaceState(null, '', url);
      
      setTimeout(() => setIsUrlCopied(false), 2000);
    }).catch(err => {
      console.error("Failed to copy URL", err);
    });
  };

  return (
    <div className="min-h-screen p-4 md:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <header className="mb-8 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-500/20 rounded-lg text-emerald-400 border border-emerald-500/30">
            <Layers size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">
              BitMap Visualizer
            </h1>
            <p className="text-slate-400 text-sm">Interactive bit field calculator & analyzer</p>
          </div>
        </div>
        
        <button
          onClick={handleShare}
          className={`
            flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all border
            ${isUrlCopied 
              ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400' 
              : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white hover:border-slate-600'
            }
          `}
        >
          {isUrlCopied ? <Check size={16} /> : <Share2 size={16} />}
          {isUrlCopied ? 'Copied Link!' : 'Share Config'}
        </button>
      </header>

      {/* Main Visualization */}
      <div className="bg-slate-900 rounded-2xl p-6 shadow-2xl border border-slate-800 mb-8 overflow-hidden">
        <div className="mb-4 flex justify-between items-end">
           <h3 className="text-slate-400 text-sm font-medium uppercase tracking-wider">Bit Sequence</h3>
           <span className="text-slate-600 text-xs font-mono">MSB ← LSB</span>
        </div>
        
        <BitGrid 
          totalBits={totalBits}
          value={value}
          fields={fields}
          onToggleBit={handleToggleBit}
          hoveredFieldId={hoveredFieldId}
          setHoveredFieldId={setHoveredFieldId}
        />
      </div>

      {/* Controls & Configuration */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        <div className="xl:col-span-2 space-y-8">
          <GlobalControls 
            value={value}
            onValueChange={setValue}
            totalBits={totalBits}
            onTotalBitsChange={setTotalBits}
          />

           {/* Mobile layout tip */}
           <div className="block xl:hidden text-center text-slate-500 text-sm py-4">
             Scroll down for Field Configuration
           </div>
        </div>

        <div className="xl:col-span-1">
          <FieldConfigurator 
            fields={fields}
            totalBits={totalBits}
            globalValue={value}
            onAddField={handleAddField}
            onRemoveField={handleRemoveField}
            onUpdateField={handleUpdateField}
            onValueChange={setValue}
            hoveredFieldId={hoveredFieldId}
            setHoveredFieldId={setHoveredFieldId}
          />
        </div>
      </div>
      
      <footer className="mt-12 text-center text-slate-600 text-sm pb-8">
        <p>Supports up to 64-bit integers. Double-click bits to toggle.</p>
      </footer>
    </div>
  );
};

export default App;