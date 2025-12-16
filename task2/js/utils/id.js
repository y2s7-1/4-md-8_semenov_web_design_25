let counter = 0;
export function uid(prefix='w') {
  counter += 1;
  return `${prefix}-${Date.now()}-${counter}`;
}
