export interface FileList {
  baseDir: string;
  files: string[];
}

export interface FileListDiff {
  baseDir: {
    left: string;
    right: string;
  };
  leftOnly: string[];
  rightOnly: string[];
  all: string[];
}
