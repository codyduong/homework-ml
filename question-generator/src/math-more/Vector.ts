import * as math from 'mathjs';
import { FixedLengthArray } from 'type-fest';
import { MATHEMATICAL_BOLD } from '../generators/.util';

function formatVectorToString(
  vector: (math.MathNode | undefined)[],
  type: 'orderedSetNotation' | 'unitVectorNotation' | 'matrixNotation',
  displayMode: 'toTex' | 'toString', //| 'toHTML'
  plaintext: boolean
): string {
  const filteredVector = vector.filter(
    (v): v is math.MathNode => v !== undefined
  );

  switch (type) {
    case 'matrixNotation': {
      throw new Error('Matrix notation not implemented');
    }
    case 'orderedSetNotation': {
      const [OB, CB] = plaintext ? ['<', '>'] : ['⟨', '⟩'];

      return OB + filteredVector.map((v) => v[displayMode]()).join(', ') + CB;
    }
    case 'unitVectorNotation':
    default: {
      const unitVectors = plaintext
        ? ['i', 'j', 'k', 'l', 'm', 'n']
        : [
            MATHEMATICAL_BOLD['i'],
            MATHEMATICAL_BOLD['j'],
            MATHEMATICAL_BOLD['k'],
            MATHEMATICAL_BOLD['l'],
            MATHEMATICAL_BOLD['m'],
            MATHEMATICAL_BOLD['n'],
          ];

      return filteredVector
        .map((v, i) => `${v[displayMode]()}${unitVectors[i]}`)
        .join(' + ');
    }
  }
}

export default class Vector<dims extends number = number> {
  dimensions: dims;
  matrix: math.Matrix;
  constructor(
    dims: dims,
    values: FixedLengthArray<number, dims, [number, ...number[]]>
  ) {
    this.dimensions = dims;
    this.matrix = math.matrix(values as unknown as Array<number>);
  }

  toOrderedSetNotation(_displayMode: 'toTex' | 'toString' | 'toHTML') {
    throw new Error('Not yet implemented');
  }

  toUnitVectorNotation(_displayMode: 'toTex' | 'toString' | 'toHTML') {
    throw new Error('Not yet implemented');
  }

  static formatVectorToString = formatVectorToString;
}

export function getMagnitude(
  n1: number | string,
  ...n: (number | string | undefined)[]
): math.MathNode {
  const otherFilter = n.filter((v): v is number | string => v !== undefined);

  return math.parse(
    `sqrt(${[n1, ...(otherFilter ?? [])].reduce<string>(
      (p, c) => p + (p ? '+' : '') + '(' + c + ')^2',
      ''
    )})`
  );
}
