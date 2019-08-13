/**
 * File list
 */
export interface FileList {
  /**
   * The base directory of the file list.
   */
  baseDir: string;
  /**
   * The list of files under the {@link FileList.baseDir}.
   */
  files: string[];
}

/**
 * Base dir diff
 */
export interface BaseDirDiff {
  left: string;
  right: string;
}

/**
 * File list diff
 */
export interface FileListDiff {
  /**
   * The base directories of 2 diff target.
   */
  baseDir: BaseDirDiff;
  /**
   * The list of files that are only under {@link BaseDirDiff.left}.
   */
  leftOnly: string[];
  /**
   * The list of files that are only under {@link BaseDirDiff.right}.
   */
  rightOnly: string[];
  /**
   * The list of files that are under both {@link BaseDirDiff.left} and {@link BaseDirDiff.right}.
   */
  all: string[];
}
