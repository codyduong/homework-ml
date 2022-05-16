import type { AlphaStringSingular } from "./.types"

export const MATHEMATICAL_BOLD: {
  [key in AlphaStringSingular]: string
} = {
  A: '\u{1D400}',
  B: '\u{1D401}',
  C: '\u{1D402}',
  D: '\u{1D403}',
  E: '\u{1D404}',
  F: '\u{1D405}',
  G: '\u{1D406}',
  H: '\u{1D407}',
  I: '\u{1D408}',
  J: '\u{1D409}',
  K: '\u{1D40A}',
  L: '\u{1D40B}',
  M: '\u{1D40C}',
  N: '\u{1D40D}',
  O: '\u{1D40E}',
  P: '\u{1D40F}',
  Q: '\u{1D410}',
  R: '\u{1D411}',
  S: '\u{1D412}',
  T: '\u{1D413}',
  U: '\u{1D414}',
  V: '\u{1D415}',
  W: '\u{1D416}',
  X: '\u{1D417}',
  Y: '\u{1D418}',
  Z: '\u{1D419}',
  a: '\u{1D41A}',
  b: '\u{1D41B}',
  c: '\u{1D41C}',
  d: '\u{1D41D}',
  e: '\u{1D41E}',
  f: '\u{1D41F}',
  g: '\u{1D420}',
  h: '\u{1D421}',
  i: '\u{1D422}',
  j: '\u{1D423}',
  k: '\u{1D424}',
  l: '\u{1D425}',
  m: '\u{1D426}',
  n: '\u{1D427}',
  o: '\u{1D428}',
  p: '\u{1D429}',
  q: '\u{1D42A}',
  r: '\u{1D42B}',
  s: '\u{1D42C}',
  t: '\u{1D42D}',
  u: '\u{1D42E}',
  v: '\u{1D42F}',
  w: '\u{1D430}', 
  x: '\u{1D431}',
  y: '\u{1D432}',
  z: '\u{1D433}',
}

// TODO
// export const GREEK_ALPHABET = {}

function randomIntRange(min: number, max: number): number {
  return Math.floor((Math.random() * (max - min)) + min)
}
function randomRange(min: number, max: number): number {
  return (Math.random() * (max - min)) + min
}

export const Util = {
  randomIntRange,
  randomRange
}
