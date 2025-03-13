// inspired by https://developer.mozilla.org/en-US/docs/Web/CSS/clamp#parameters
export function clamp(min: number, val: number, max: number) {
  return Math.min(Math.max(val, min), max);
}
