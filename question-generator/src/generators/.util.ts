import * as math from "mathjs"
import { FixedLengthArray } from "type-fest"
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

export const MATHEMATICAL_ITALIC: {
  [key in AlphaStringSingular]: string
} = {
  A: '\u{1D434}',
  B: '\u{1D435}',
  C: '\u{1D436}',
  D: '\u{1D437}',
  E: '\u{1D438}',
  F: '\u{1D439}',
  G: '\u{1D43A}',
  H: '\u{1D43B}',
  I: '\u{1D43C}',
  J: '\u{1D43D}',
  K: '\u{1D43E}',
  L: '\u{1D43F}',
  M: '\u{1D440}',
  N: '\u{1D441}',
  O: '\u{1D442}',
  P: '\u{1D443}',
  Q: '\u{1D444}',
  R: '\u{1D445}',
  S: '\u{1D446}',
  T: '\u{1D447}',
  U: '\u{1D448}',
  V: '\u{1D449}',
  W: '\u{1D44A}',
  X: '\u{1D44B}',
  Y: '\u{1D44C}',
  Z: '\u{1D44D}',
  a: '\u{1D44E}',
  b: '\u{1D44F}',
  c: '\u{1D450}',
  d: '\u{1D451}',
  e: '\u{1D452}',
  f: '\u{1D453}',
  g: '\u{1D454}',
  h: '\u{1D455}',
  i: '\u{1D456}',
  j: '\u{1D457}',
  k: '\u{1D458}',
  l: '\u{1D459}',
  m: '\u{1D45A}',
  n: '\u{1D45B}',
  o: '\u{1D45C}',
  p: '\u{1D45D}',
  q: '\u{1D45E}',
  r: '\u{1D45F}',
  s: '\u{1D460}',
  t: '\u{1D461}',
  u: '\u{1D462}',
  v: '\u{1D463}',
  w: '\u{1D464}', 
  x: '\u{1D465}',
  y: '\u{1D466}',
  z: '\u{1D467}',
}

// TODO
// export const GREEK_ALPHABET = {}

function randomIntRange(min: number, max: number): number {
  return Math.floor((Math.random() * (max - min)) + min)
}
function randomRange(min: number, max: number): number {
  return (Math.random() * (max - min)) + min
}

type NumberTypes = 'whole' | 'fraction' | 'decimal'

function getRandomNumber(numberType: NumberTypes, min: number, max: number): math.MathNode {
  switch (numberType) {
    case 'fraction': {
      return math.parse(
        `${randomIntRange(min, max)} / ${randomIntRange(
          min,
          max
        ) || 1}`
      )
    }
    case 'decimal': {
      return math.parse(`${randomRange(min, max)}`)
    }
    case 'whole':
    default: {
      return math.parse(`${randomIntRange(min, max)}`)
    }
  }
}

function getRandomNumbers<Q extends number = number>(quantity: Q, numberType: NumberTypes, min: number, max: number): FixedLengthArray<math.MathNode, Q> {
  return new Array<math.MathNode>(quantity).fill(undefined as any).map(() => getRandomNumber(numberType, min, max)) as any
}

function getRandomAlpha(
  chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
): AlphaStringSingular {
  return chars.charAt(Util.randomIntRange(0, chars.length)) as any;
}

export const Util = {
  randomIntRange,
  randomRange,
  getRandomNumber,
  getRandomNumbers,
  getRandomAlpha,
}
