#!/usr/bin/env node
import * as minimist from 'minimist';
// tslint:disable-next-line: no-submodule-imports
import { readFile, writeFile } from 'mz/fs';
import { join } from 'path';
import { whiteBright } from 'cli-color';
import { generateFileList, generateFileListDiff } from './fileList';
import { FileListDiff } from './definitions';
// tslint:disable-next-line: no-require-imports
const jsonDiff = require('json-diff');

interface JsonDiffResult extends FileListDiff {
  jsonFileDiff: {
    [key: string]: string;
  };
}

// tslint:disable-next-line: no-floating-promises
main(minimist(process.argv.slice(2), {
  boolean: ['file'],
  alias: {
    help: ['h'],
    output: ['o'],
    file: ['f']
  }
}));

async function main(argv: minimist.ParsedArgs): Promise<void> {
  if (argv.help) {
    printHelp();
    process.exit(0);
  }

  const output: string | undefined = argv.output;

  if (argv.file) {
    const left: string = argv._[0];
    const right: string = argv._[1];
    const result = {
      baseDir: { left, right, },
      jsonFileDiff: {},
    };

    try {
      const leftJson = JSON.parse((await readFile(left)).toString());
      const rightJson = JSON.parse((await readFile(right)).toString());
      const diffString: string = jsonDiff.diff(leftJson, rightJson);
      (result.jsonFileDiff as any)[left] = diffString;
    } catch (error) {
      (result.jsonFileDiff as any)[left] = (error as Error).message;
    }
    await writeOutput(JSON.stringify(result, undefined, 2), output);
    return;
  }

  try {
    const left = await generateFileList(argv._[0]);
    const right = await generateFileList(argv._[1]);
    const fileDiff = generateFileListDiff(left, right);

    const result: JsonDiffResult = {
      ...fileDiff,
      jsonFileDiff: {},
    };

    for (const file of fileDiff.all) {
      try {
        const leftJson = JSON.parse((await readFile(join(fileDiff.baseDir.left, file))).toString());
        const rightJson = JSON.parse((await readFile(join(fileDiff.baseDir.right, file))).toString());
        const diffString: string = jsonDiff.diff(leftJson, rightJson);
        result.jsonFileDiff[file] = diffString;
      } catch (error) {
        result.jsonFileDiff[file] = (error as Error).message;
      }
    }
    await writeOutput(JSON.stringify(result, undefined, 2), output);
  } catch (e) {
    // tslint:disable-next-line: no-console
    console.error(whiteBright.bgRedBright('error'), e);
    process.exit(1);
  }
}

function writeOutput(ts: string, argOut?: string): Promise<void> {
  if (!argOut) {
    try {
      process.stdout.write(ts);
      return Promise.resolve();
    } catch (err) {
      return Promise.reject(err);
    }
  }
  return writeFile(argOut, ts);
}

function printHelp(): void {
  // tslint:disable: no-require-imports
  // tslint:disable-next-line: no-implicit-dependencies
  const pkg = require('../package.json');

  process.stdout.write(
    `
${pkg.name} ${pkg.version}
Usage:
  jsondiff-report [--output, -o] [OUT_FILE] dir1 dir2
  jsondiff-report [--file, -f] [--output, -o] [OUT_FILE] file1 file2
  jsondiff-report [--help, -h]
Generate a JSON-diff report for 2 directories/files.

positional arguments:
  dir1/file1
  dir2/file2

optional arguments:
  -h, --help    show this help message and exit
  -f, --file    compare 2 files
  -o, --output  the report output file, if this option is absent,
                the programe will use the standard output

Output Format:
| Property       | Description                                                           |
| -------------- | --------------------------------------------------------------------- |
| baseDir        | The base dir: left for dir1 / file1, right for dir2 / file2.          |
| leftOnly       | List of files that only exists in baseDir.left.                       |
| rightOnly      | List of files that only exists in baseDir.right.                      |
| all            | List of files that exists in both baseDir.left and baseDir.right.     |
| jsonFileDiff   | The json-diff result for every file                                   |
`);
}
