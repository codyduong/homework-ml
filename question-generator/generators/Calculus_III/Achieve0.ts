// Contains the question generator for various CalcIII questions
import { MATHEMATICAL_BOLD, Util } from '../.util';
import type { AlphaStringSingular, Data, Result } from '../.types';
import type { MathNode } from 'mathjs';
import * as math from 'mathjs';

/**
 * ACHIEVE 0, QUESTION 1
 */
function getRandomAlpha(
  chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
): AlphaStringSingular {
  return chars.charAt(Util.randomIntRange(0, chars.length)) as any;
}

export interface GenerateVectorOptions {
  dimensions?: 2 | 3 | '2' | '3'; //Default is 2
  plaintext?: boolean; // Default is true; If true, restricts set of chars to what can be input on keyboard easily.
  vectorNotation?: 'orderedSet' | 'unitVector'; //Default is unitVecotr; Matrix not supported
  decimalOrFraction?: 'decimal' | 'fraction' | 'whole'; //Default is whole; Choose whether we use ints/floats/et. cetera
  // eslint-disable-next-line prettier/prettier
  vectorLabels?: [AlphaStringSingular, AlphaStringSingular] | 'all' | 'null' | null; //Default is [w, v], if all, will select all valid characters
  catchErrors?: boolean; //Default is false
  min?: number; //default is -1000
  max?: number; //default is 1000
  displayMode?: 'toString' | 'toTex'; //Default is toString, 'toHTML' is not supported since json can't escape out of box
}

export function GenerateVectorInDirectionOfLength(
  quantity = 100,
  options?: GenerateVectorOptions
): Result {
  const {
    dimensions = 2,
    plaintext = true,
    vectorNotation = 'unitVector',
    decimalOrFraction = 'whole',
    vectorLabels = ['w', 'v'],
    catchErrors = false,
    min = -1000,
    max = 1000,
    displayMode = 'toString',
  } = options ?? {};

  try {
    const data: Data[] = [];

    const [I, J, K] = plaintext
      ? ['i', 'j', 'k']
      : [
          MATHEMATICAL_BOLD['i'],
          MATHEMATICAL_BOLD['j'],
          MATHEMATICAL_BOLD['k'],
        ];
    const [OB, CB] = plaintext ? ['<', '>'] : ['⟨', '⟩'];

    // Omit ijk if we are using unitVector notation
    const availableLetters =
      vectorNotation == 'unitVector'
        ? 'abcdefghlmnopqrstuvwxyzABCDEFGHLMNOPQRSTUVWXYZ'
        : undefined;

    for (let i = quantity; i--; ) {
      //get a random alpha if needed
      const [letter1, letter2] =
        typeof vectorLabels === 'object' && vectorLabels
          ? vectorLabels
          : vectorLabels == 'null'
          ? (['w', 'v'] as const)
          : ([
              getRandomAlpha(availableLetters),
              getRandomAlpha(availableLetters),
            ] as const);

      const values: MathNode[] = [];
      for (let dims = Number(dimensions); dims--; ) {
        values.push(
          decimalOrFraction === 'whole'
            ? math.parse(`${Util.randomIntRange(min, max)}`)
            : math.parse(
                `${Util.randomIntRange(min, max)} / ${Util.randomIntRange(
                  min,
                  max
                )}`
              )
        );
      }

      // Setup equation variables
      const [x, y, z] = values;
      const length =
        decimalOrFraction === 'whole'
          ? math.parse(`${Util.randomIntRange(min, max)}`)
          : math.parse(
              `${Util.randomIntRange(min, max)} / ${Util.randomIntRange(
                min,
                max
              )}`
            );

      const content1Letter1 = plaintext ? letter1 : MATHEMATICAL_BOLD[letter1];
      const content1Letter2 = plaintext ? letter2 : MATHEMATICAL_BOLD[letter2];

      const content1Equation1 = length;
      /* eslint-disable prettier/prettier */
      const content1Equation2 =
        vectorNotation === 'unitVector'
          ? `${x[displayMode]()}${I} + ${y[displayMode]()}${J}${z ? '+' + z[displayMode]() + K : ''}`
          : `${OB}${x[displayMode]()},${y[displayMode]()}${z ? ',' + z[displayMode]() : ''}${CB}`;

      const content1 = `Find the vector ${content1Letter1} of length ${content1Equation1} in the direction of ${content1Letter2}=${content1Equation2}. (Give your answer using component form or standard basis vectors. Express numbers in exact form. Use symbolic notation and fractions where needed.)`;

      const content2Equation1 = `${content1Letter1}=`;
      const content2 = `${content2Equation1}`;

      // Get the unit magnitude
      const _uVecMag = `sqrt((${x.toString()})^2 + (${y.toString()})^2 ${z ? '+(' + z.toString() + ')^2' : ''})`;

      const [newX, newY, newZ] = [
        math
          .parse(`(${x.toString()} * ${length} / ${_uVecMag})`)[displayMode](),
        math
          .parse(`(${y.toString()} * ${length} / ${_uVecMag})`)[displayMode](),
        math
          .parse(`(${z?.toString() ?? 0} * ${length} / ${_uVecMag})`)[displayMode](),
      ];
      /* eslint-enable prettier/prettier */

      const content2Answer =
        vectorNotation === 'unitVector'
          ? `${newX}${I} + ${newY}${J}${z ? '+' + newZ + K : ''}`
          : `${OB}${newX},${newY}${z ? ',' + newZ : ''}${CB}`;

      data.push([
        {
          type: 'info',
          content: content1,
        },
        {
          type: 'prompt_frq',
          content: content2,
          answer: content2Answer,
        },
      ]);
    }

    return {
      generatedBy: 'GenerateVectorInDirectionOfLength',
      data,
    };
  } catch (e) {
    if (!catchErrors) {
      throw e;
    }

    const error = e as any;
    return {
      generatedBy: 'GenerateVectorInDirectionOfLength',
      errors: error,
    };
  }
}
