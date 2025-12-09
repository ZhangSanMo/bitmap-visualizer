/**
 * Checks if a specific bit is set in a BigInt value.
 */
export const isBitSet = (value: bigint, bitIndex: number): boolean => {
  return (value & (1n << BigInt(bitIndex))) !== 0n;
};

/**
 * Toggles a specific bit in a BigInt value.
 */
export const toggleBit = (value: bigint, bitIndex: number): bigint => {
  return value ^ (1n << BigInt(bitIndex));
};

/**
 * Extracts the value of a specific field range.
 * Returns the value right-shifted to 0.
 */
export const getFieldValue = (value: bigint, start: number, end: number): bigint => {
  const low = BigInt(Math.min(start, end));
  const high = BigInt(Math.max(start, end));
  const length = high - low + 1n;
  const mask = (1n << length) - 1n;
  return (value >> low) & mask;
};

/**
 * Sets the value of a specific field range.
 */
export const setFieldValue = (currentTotal: bigint, start: number, end: number, newFieldValue: bigint): bigint => {
  const low = BigInt(Math.min(start, end));
  const high = BigInt(Math.max(start, end));
  const length = high - low + 1n;
  
  // Create mask for the field at position 0
  const baseMask = (1n << length) - 1n;
  
  // Ensure the new value fits in the field
  const valueToInsert = newFieldValue & baseMask;
  
  // Create mask for the field at its actual position
  const positionMask = baseMask << low;
  
  // Clear the bits in the current total where the field is
  const clearedTotal = currentTotal & (~positionMask);
  
  // OR in the new value
  return clearedTotal | (valueToInsert << low);
};

/**
 * Safe parser for user input to BigInt.
 */
export const parseBigInt = (input: string, base: number = 10): bigint => {
  try {
    // Remove prefixes if present for convenience
    let cleanInput = input.trim();
    if (base === 16 && cleanInput.startsWith('0x')) cleanInput = cleanInput.slice(2);
    if (base === 2 && cleanInput.startsWith('0b')) cleanInput = cleanInput.slice(2);
    if (cleanInput === '') return 0n;
    
    // BigInt constructor doesn't take a radix argument like parseInt, 
    // so we need to add prefixes for hex/bin if we use the constructor,
    // OR we use parseInt for small numbers.
    // However, to support huge numbers, we should use the prefixes mechanism.
    
    if (base === 16) return BigInt(`0x${cleanInput}`);
    if (base === 2) return BigInt(`0b${cleanInput}`);
    return BigInt(cleanInput);
  } catch (e) {
    return 0n;
  }
};

export const formatBigInt = (val: bigint, base: number, padLength: number = 0): string => {
  let str = val.toString(base).toUpperCase();
  if (padLength > 0) {
    str = str.padStart(padLength, '0');
  }
  return str;
};
