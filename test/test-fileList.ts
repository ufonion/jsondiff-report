
import { generateFileList, generateFileListDiff } from '../src/fileList';
import { FileList, FileListDiff } from '../src/definitions';
import { createLogger } from '../src/common/logger';
import * as _ from 'lodash';
import { expect } from 'chai';
import * as path from 'path';

const logger = createLogger('test-fileList');

const dirA = 'test/fixtures/a';
const dirB = 'test/../test/fixtures/b/';

const realListA: FileList = {
  baseDir: dirA + path.sep,
  files: [
    '1.json',
    '4.json',
    'b/2.json',
    'b/3.json',
    'b/d/1.json',
    'b/d/2.json',
    'c/1.json',
  ],
};

const realListB: FileList = {
  baseDir: path.normalize(dirB),
  files: [
    '1.json',
    '3.json',
    'b/1.json',
    'b/2.json',
    'b/d/1.json',
    'b/d/3.json',
  ],
};

// tslint:disable-next-line: naming-convention
const diffAB: FileListDiff = {
  baseDir: {
    left: realListA.baseDir,
    right: realListB.baseDir,
  },
  leftOnly: [
    '4.json',
    'b/3.json',
    'b/d/2.json',
    'c/1.json',
  ],
  rightOnly: [
    '3.json',
    'b/1.json',
    'b/d/3.json',
  ],
  all: [
    '1.json',
    'b/2.json',
    'b/d/1.json',
  ],
};

describe('fileList', () => {
  it('generateFileList', async () => {
    const listA = await generateFileList(dirA);
    const listB = await generateFileList(dirB);
    logger.debug({ listA, listB, realListA, realListB });
    expect(_.isEqual(listA, realListA), 'File List for A check').to.be.true;
    expect(_.isEqual(listB, realListB), 'File List for B check').to.be.true;
  });

  it('generateFileListDiff', async () => {
    const listA = await generateFileList(dirA);
    const listB = await generateFileList(dirB);
    const diff = generateFileListDiff(listA, listB);
    logger.debug({ listA, listB, diff, diffAB });
    expect(_.isEqual(diff, diffAB), 'File List Diff check').to.be.true;
  });
});
