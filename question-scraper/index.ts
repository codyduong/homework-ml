import fs from 'fs';
import { JSDOM } from 'jsdom';
import path from 'path';
import { useParser } from './parsers';
import { quotedPrintableDecode } from './parsers/.util';

async function parseMHTML(dirname: string, filename: string) {
  const fileData = fs.readFileSync(path.resolve(`${dirname}/${filename}`), {
    encoding: 'utf-8',
  });
  const decodedFile = quotedPrintableDecode(fileData.replace(/&nbsp;/g, ' '));
  const htmlStart = decodedFile.match(/<!DOCTYPE html>/);
  const htmlEnd = decodedFile.match(/<\/html>/);
  if (!htmlStart || !htmlEnd) {
    console.log(`Warning: No HTML found in ${filename}`);
    return;
  }
  const HTMLraw = decodedFile.slice(htmlStart.index, htmlEnd.index);

  // Get the url to determine which parser to use.
  const contentLocationStart = decodedFile.match(/Content-Location/);

  // if (!contentLocationStart?.groups?.[0]) {
  //   console.log('Warning: No content-location found');
  //   //return;
  // }

  const dom = new JSDOM(HTMLraw);
  const document = dom.window.document;
  return useParser(document, {
    filename,
    'content-location': '',
  });
}

async function parseDirectory(
  files: string[],
  inputPath: string,
  outputPath: string
): Promise<any> {
  const results: any[] = [];

  for await (const file of files) {
    console.log(`Parsing ${file.padEnd(70)}`);

    const filepath = path.resolve(`${inputPath}/${file}`);
    const lstat = fs.lstatSync(filepath);

    // If a directory, instead add it to parsing tree via recursion
    if (lstat.isDirectory()) {
      parseDirectory(
        fs.readdirSync(filepath),
        filepath,
        path.resolve(`${outputPath}/${file}/`)
      );
      continue;
    }

    // If not a mhtml file instead just copy the file
    if (path.extname(filepath) !== '.mhtml') {
      fs.copyFileSync(filepath, path.resolve(`${outputPath}/${file}`));
      continue;
    }

    const parsedFile = await parseMHTML(inputPath, file);
    parsedFile && results.push(parsedFile);
  }

  function writeToFile() {
    results.length > 0 &&
      fs.writeFileSync(
        path.resolve(`${outputPath}/results.json`),
        JSON.stringify(results, undefined, 4)
      );
  }

  try {
    writeToFile();
  } catch (e) {
    const error = e as any;
    // syscall: open ; code: ENOENT
    if (error.errno == -4058) {
      fs.mkdirSync(path.resolve(outputPath), { recursive: true });
    }
  } finally {
    writeToFile();
  }
}

function readFiles(inputDirname: string, outputDirname: string): void {
  const directory = fs.readdirSync(path.resolve(inputDirname));

  // remove example.mhtml
  directory.splice(directory.indexOf('example.mhtml'), 1);

  //remove git
  directory.splice(directory.indexOf('.git'), 1);

  parseDirectory(directory, inputDirname, outputDirname);
}

readFiles(__dirname + '/input/', __dirname + '/output/');
