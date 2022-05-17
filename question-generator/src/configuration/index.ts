import { assert } from 'console';
import config from '../../config.json';
import { nav } from '@codyduong/nav';
import GENERATORS from '../generators';

export function parseConfiguration() {
  const results = [];
  for (const [i, run] of config.runs.entries()) {
    assert(typeof run.function === 'string', 'A function must be set');
    if (run.disabled === true) {
      continue;
    }
    const path = run.function.split('.');
    const runnerFunction = nav<any, any, any>(GENERATORS, path);
    if (!runnerFunction) {
      console.error(`${i}: No function found ${run.function}`);
      continue;
    }
    console.log(
      `${i}: ${runnerFunction.name} with parameters ${JSON.stringify(
        run.parameters,
        null,
        4
      )}`
    );
    results.push(runnerFunction(...run.parameters));
  }
  return results;
}
