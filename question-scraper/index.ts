import fs from 'fs';
import { JSDOM } from 'jsdom';
import path from 'path';
import { useParser } from './parsers';
import { quotedPrintableDecode } from './parsers/util';

async function parseMHTML(dirname: string, filename: string) {
  const fileData = fs.readFileSync(path.resolve(`${dirname}/${filename}`), {
    encoding: 'utf-8',
  });
  const decodedFile = quotedPrintableDecode(fileData.replace(/&nbsp;/g, ' '));
  const htmlFirst = decodedFile.match(/<!DOCTYPE html>/);
  const htmlEnd = decodedFile.match(/<\/html>/);
  if (!htmlFirst || !htmlEnd) {
    console.log('No HTML found');
    return;
  }
  const HTMLraw = decodedFile.slice(htmlFirst.index, htmlEnd.index);

  const dom = new JSDOM(HTMLraw);
  const document = dom.window.document;
  return useParser(document, filename);
}

async function readFiles(inputDirname: string, outputDirname: string) {
  const directory = fs.readdirSync(path.resolve(inputDirname));
  const results: any[] = [];
  for await (const file of directory) {
    process.stdout.write(`Parsing ${file.padEnd(70)}\r`);
    try {
      results.push(await parseMHTML(inputDirname, file));
    } catch (e) {
      if (e instanceof Error) {
        continue;
      } else {
        throw e;
      }
    }
  }
  process.stdout.write('\r'.padStart(100));

  fs.writeFileSync(
    path.resolve(`${outputDirname}output.json`),
    JSON.stringify(results, undefined, 4)
  );
}

(async () => {
  await readFiles('./input/', './output/');
})();
