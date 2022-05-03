import FRQ from './FRQ';
import { Results } from './types';

const PARSERS = [FRQ];

export function useParser(data: Document, filename: string): Results {
  const errors = [];
  for (const parser of PARSERS) {
    try {
      return parser(data, filename);
    } catch (e) {
      const er = e as any;
      errors.push(er.message);
    }
  }
  return {
    name: filename,
    errors,
  };
}
