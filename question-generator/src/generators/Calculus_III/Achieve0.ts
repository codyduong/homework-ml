/**
 * Contains question generators for questions found on Achieve 0,
 * Also is just review questions from Calc II.
 */
import { MATHEMATICAL_BOLD, MATHEMATICAL_ITALIC, Util } from '../.util';
import type { AlphaStringSingular, Data, Result } from '../.types';
import * as math from 'mathjs';
import MathMore from '../../math-more';

/**
 * ACHIEVE 0, QUESTION 1
 */
export interface GenerateVectorOptions {
  dimensions?: 2 | 3 | '2' | '3'; //Default is 2
  plaintext?: boolean; // Default is true; If true, restricts set of chars to what can be input on keyboard easily.
  vectorNotation?: 'orderedSet' | 'unitVector'; //Default is unitVecotr; Matrix not supported
  numberType?: 'decimal' | 'fraction' | 'whole'; //Default is whole; Choose whether we use ints/floats/et. cetera
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
    numberType = 'whole',
    vectorLabels = ['w', 'v'],
    catchErrors = false,
    min = -1000,
    max = 1000,
    displayMode = 'toString',
  } = options ?? {};

  try {
    const data: Data[] = [];

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
              Util.getRandomAlpha(availableLetters),
              Util.getRandomAlpha(availableLetters),
            ] as const);

      // Setup equation variables
      const [x, y, z] = Util.getRandomNumbers(
        Number(dimensions),
        numberType,
        min,
        max
      );
      const length = Util.getRandomNumber(numberType, min, max);

      const content1Letter1 = plaintext ? letter1 : MATHEMATICAL_BOLD[letter1];
      const content1Letter2 = plaintext ? letter2 : MATHEMATICAL_BOLD[letter2];

      const content1Equation1 = length;
      const content1Equation2 = MathMore.Vector.formatVectorToString(
        [x, y, z],
        `${vectorNotation}Notation`,
        displayMode,
        plaintext
      );

      const content1 = `Find the vector ${content1Letter1} of length ${content1Equation1} in the direction of ${content1Letter2}=${content1Equation2}. (Give your answer using component form or standard basis vectors. Express numbers in exact form. Use symbolic notation and fractions where needed.)`;

      const content2Equation1 = `${content1Letter1}=`;
      const content2 = `${content2Equation1}`;

      // Get the unit magnitude
      const _uVecMag = MathMore.getMagnitude(
        x.toString(),
        y.toString(),
        z?.toString()
      ).toString();

      const answer = [
        math.parse(`(${x.toString()} * ${length} / ${_uVecMag})`),
        math.parse(`(${y.toString()} * ${length} / ${_uVecMag})`),
        z
          ? math.parse(`(${z.toString()} * ${length} / ${_uVecMag})`)
          : undefined,
      ];

      const content2Answer = MathMore.Vector.formatVectorToString(
        answer,
        `${vectorNotation}Notation`,
        displayMode,
        plaintext
      );

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

/**
 * ACHIEVE 0, QUESTION 15
 */
type GenerateTraceOfPlaneQuestionOptions = {
  plane?: typeof PossiblePlanes[number];
  min?: number;
  max?: number;
  numberType?: 'decimal' | 'fraction' | 'whole';
  dimensions?: 2 | 3 | '2' | '3'; //Default is 2
  plaintext?: boolean;
  displayMode?: 'toString' | 'toTex';
};

const PossiblePlanes = ['xy', 'xz', 'yx', 'yz', 'zx', 'zy'] as const;

const SplicedElement: { [k in typeof PossiblePlanes[number]]: number } = {
  xy: 2,
  xz: 1,
  yx: 2,
  yz: 0,
  zx: 1,
  zy: 0,
};

export function GenerateTraceOfPlaneQuestion(
  quantity = 100,
  options?: GenerateTraceOfPlaneQuestionOptions
): Result {
  const {
    plane = 'xy',
    min = -1000,
    max = 1000,
    numberType = 'whole',
    plaintext = true,
    displayMode = 'toString',
  } = options ?? {};

  const data: Data[] = [];
  for (let i = quantity; i--; ) {
    const [x, y, z] = Util.getRandomNumbers(3, numberType, min, max);

    const chars = plaintext
      ? ['x', 'y', 'z']
      : [
          MATHEMATICAL_ITALIC['x'],
          MATHEMATICAL_ITALIC['y'],
          MATHEMATICAL_ITALIC['z'],
        ];

    const content1Equation1 = [x, y, z]
      .map((v, i) => `${v[displayMode]()}${chars[i]}`)
      .join(' + ');

    const rightSideEquality = Util.getRandomNumber(numberType, min, max);

    const readjusted: (undefined | math.MathNode)[] = [x, y, z];
    readjusted[SplicedElement[plane]] = undefined;
    const content2Answer = readjusted
      .map((v, i) => (v ? `${v[displayMode]()}${chars[i]}` : undefined))
      .filter((v): v is string => v !== undefined)
      .join(' + ');

    const content1PlaneText = plaintext
      ? plane
      : (plane.split('') as AlphaStringSingular[])
          .map((c) => MATHEMATICAL_ITALIC[c])
          .join('');
    const content1HelperText = plaintext ? 'ax+by+cz=d' : '𝑎𝑥+𝑏𝑦+𝑐𝑧=𝑑';

    const content1 = `Find the trace of the plane ${content1Equation1} = ${rightSideEquality[
      displayMode
    ]()} in the coordinate ${content1PlaneText}-plane. (Use symbolic notation and fractions where needed. Give your answer in the form ${content1HelperText}.)`;

    data.push([
      {
        type: 'info',
        content: content1,
      },
      {
        type: 'prompt_frq',
        content: 'equation of the trace:',
        answer: content2Answer,
      },
    ]);
  }

  return {
    generatedBy: 'GenerateTraceOfPlaneQuestion',
    data,
  };
}
