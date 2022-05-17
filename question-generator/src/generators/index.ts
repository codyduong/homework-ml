import { nav } from '@codyduong/nav';
import { Get, Split } from 'type-fest';
import type { FunctionStringUnionWithoutPermutations } from '../configuration/configuration.type';
import { Result } from './.types';
import Calculus_III from './Calculus_III';

// https://stackoverflow.com/a/57015870/17954209
function permutateBetweenArrays([
  head,
  ...[headTail, ...tailTail]
]: any[]): Array<any> {
  if (!headTail) return head;

  const combined = headTail.reduce((acc: string | any[], x: any) => {
    return acc.concat(head.map((h: any) => ({ ...h, ...x })));
  }, []);

  return permutateBetweenArrays([combined, ...tailTail]);
}

type ParametersWithoutPermutations<
  fPath extends FunctionStringUnionWithoutPermutations
> = Parameters<Get<typeof Generators, Split<fPath, '.'>>>;

type GenerateAllPermutationsOptions<
  P extends FunctionStringUnionWithoutPermutations,
  T extends ParametersWithoutPermutations<P> = ParametersWithoutPermutations<P>,
  U extends { [I in keyof T]-?: T[I] } = { [I in keyof T]-?: T[I] }
> = U extends [infer First, infer Second]
  ? [First, { [K in keyof Second]: Array<Second[K]> }]
  : never;

function GenerateAllPermutations<
  P extends FunctionStringUnionWithoutPermutations
>(
  functionPath: P,
  options?: GenerateAllPermutationsOptions<P>,
  disabled?: boolean
): Result[] {
  const results: Result[] = [];
  // Prevent some nonsense with infinite recursion
  const runnerFunction = nav<any, any, any>(
    Generators,
    functionPath.split('.')
  );
  if (disabled) {
    return [
      {
        generatedBy: 'GenerateAllPermutations',
        errors: 'disabled',
      },
    ];
  }
  if (!runnerFunction) {
    return [
      {
        generatedBy: 'GenerateAllPermutations',
        errors: `GenerateAllPermutations could not find function: ${functionPath}`,
      },
    ];
  }
  if (!options) {
    results.push(runnerFunction());
    return results;
  }

  const arrayOfArrays: Array<Array<any>> = [];

  Object.entries(options[1] ?? {}).forEach((v) => {
    const currentSubArray = [];
    for (const permutation of v[1] as any[]) {
      currentSubArray.push({ [v[0]]: permutation });
    }
    arrayOfArrays.push(currentSubArray);
  });
  const permutations: Array<any> = permutateBetweenArrays(arrayOfArrays);

  permutations.forEach((permutation) => {
    results.push(runnerFunction(...[options[0], permutation]));
  });
  return results;
}

const Generators = {
  Calculus_III,
} as const;

const GeneratorsWithPermutator = {
  ...Generators,
  GenerateAllPermutations,
} as const;

export default GeneratorsWithPermutator;
