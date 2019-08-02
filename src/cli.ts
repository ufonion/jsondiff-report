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
  alias: {
    help: ['h'],
    output: ['o'],
  }
}));

async function main(argv: minimist.ParsedArgs): Promise<void> {
  if (argv.help) {
    printHelp();
    process.exit(0);
  }

  // tslint:disable-next-line: no-commented-code
  // tslint:disable: no-unsafe-any
  // const argIn: string = argv._[0] || argv.input;
  // const argOut: string = argv._[1] || argv.output;

  try {
    const left = await generateFileList(argv._[0]);
    const right = await generateFileList(argv._[1]);
    const fileDiff = generateFileListDiff(left, right);
    const output: string | undefined = argv.output;

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
        // tslint:disable-next-line: no-console
        console.warn(whiteBright.bgRedBright('warn'), error);
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
    Usage: jsondiff-report [--output, -o] [OUT_FILE] dir1 dir2

    Generate a JSON-diff report for 2 directories.
    `
  );
}
