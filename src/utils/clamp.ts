// inspired by https://developer.mozilla.org/en-US/docs/Web/CSS/clamp#parameters

function clamp(min: number, val: number, max: number) {
  return Math.min(Math.max(val, min), max);
}

export default clamp;
