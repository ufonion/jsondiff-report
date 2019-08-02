import { FileList, FileListDiff } from './definitions';
// tslint:disable-next-line: no-submodule-imports
import { readdir, stat } from 'mz/fs';
import * as path from 'path';

async function traversePath(base: string, func: (file: string) => void): Promise<void> {
  const files = await readdir(base);

  for (const file of files) {
    const fullName = path.join(base, file);
    const fileStat = await stat(fullName);
    if (fileStat.isFile()) {
      func(fullName);
      // tslint:disable-next-line: no-collapsible-if
    } else if (fileStat.isDirectory()) {
      await traversePath(fullName, func);
    }
  }
}

export async function generateFileList(baseDir: string): Promise<FileList> {
  let normalizedBase = path.normalize(baseDir);
  if (normalizedBase.charAt(normalizedBase.length - 1) !== path.sep) {
    normalizedBase += path.sep;
  }

  const fileList: FileList = {
    baseDir: normalizedBase,
    files: []
  };

  await traversePath(normalizedBase, (file: string) => {
    const final = path.relative(normalizedBase, file);
    fileList.files.push(final);
  });

  return fileList;
}

export function generateFileListDiff(left: FileList, right: FileList): FileListDiff {
  return {
    baseDir: {
      left: left.baseDir,
      right: right.baseDir,
    },
    leftOnly: left.files.filter((file) => !right.files.includes(file)),
    rightOnly: right.files.filter((file) => !left.files.includes(file)),
    all: left.files.filter((file) => right.files.includes(file)),
  };
}
