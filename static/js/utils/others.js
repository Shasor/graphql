export function ConvertXpToStr(xp) {
  return `${xp >= 1000000 ? `${(xp / 1000000).toFixed(2)} MB` : `${(xp / 1000).toFixed(0)} kB`}`;
}
