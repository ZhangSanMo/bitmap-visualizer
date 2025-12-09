export interface BitField {
  id: string;
  name: string;
  startBit: number; // Inclusive, 0-indexed
  endBit: number;   // Inclusive, 0-indexed
  color: string;
  description?: string;
}

export const COLORS = [
  'bg-blue-500',
  'bg-emerald-500',
  'bg-purple-500',
  'bg-amber-500',
  'bg-rose-500',
  'bg-cyan-500',
  'bg-lime-500',
  'bg-fuchsia-500',
  'bg-orange-500',
  'bg-indigo-500',
];

export const TAILWIND_COLORS_HEX = [
  '#3b82f6', // blue-500
  '#10b981', // emerald-500
  '#a855f7', // purple-500
  '#f59e0b', // amber-500
  '#f43f5e', // rose-500
  '#06b6d4', // cyan-500
  '#84cc16', // lime-500
  '#d946ef', // fuchsia-500
  '#f97316', // orange-500
  '#6366f1', // indigo-500
];

export enum NumberBase {
  HEX = 16,
  DEC = 10,
  BIN = 2,
}