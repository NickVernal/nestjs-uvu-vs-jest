export function createMask(fields: string[], maskValue = '*') {
  function mask(obj: Record<string, unknown>) {
    Object.keys(obj).forEach((key) => {
      if (fields.includes(key)) {
        obj[key] = maskValue;
      } else if (typeof obj[key] === 'object') {
        mask(obj[key] as Record<string, unknown>);
      }
    });
    return obj;
  }
  return mask;
}
