import { writeFileSync } from 'fs';
import path from 'path';
import { parseConfiguration } from './src/configuration';

const datas = parseConfiguration();

writeFileSync(
  path.resolve(__dirname + '/result.json'),
  JSON.stringify(datas, null, 2)
);
