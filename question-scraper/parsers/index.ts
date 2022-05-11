import FRQ from './Achieve.FRQ.MC';
import { Results } from './types';

const PARSERS = [FRQ];

export type FileData = {
  filename: string;
  'content-location': string;
};

export function useParser(data: Document, fileData: FileData): Results {
  const errors = [];
  for (const parser of PARSERS) {
    try {
      return parser(data, fileData);
    } catch (e) {
      const er = e as any;
      errors.push(er.message);
    }
  }
  return {
    name: fileData.filename,
    errors,
  };
}
