import { nav } from '@codyduong/nav';
import { Result } from './.types';
import { Calculus_III } from './Achieve.CalcIII';

export { Calculus_III };

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

function GenerateAllPermutations(
  functionPath: string,
  options?: [number, Record<string, Array<any>>],
  disabled?: boolean
): Result[] {
  const results: Result[] = [];
  // Prevent some nonsense with infinite recursion
  const runnerFunction = nav<any, any, any>(
    GENERATORS,
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
  Object.entries(options[1]).forEach((v) => {
    const currentSubArray = [];
    for (const permutation of v[1]) {
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

const GENERATORS: {
  [key: string]: { [key: string]: (q?: number, o?: any) => Result };
} = {
  Calculus_III,
};

const GENERATORSWithPermutations = {
  ...GENERATORS,
  GenerateAllPermutations,
};

export default GENERATORSWithPermutations;
