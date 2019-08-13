# jsondiff-report

A utility to diff JSON files in 2 directories.

## Usage

```bash
@ufonion/jsondiff-report 0.0.3
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
```

## Example

### Diff 2 Files

`File1: test/fixtures/a/1.json`

```json
{
  "a": 1,
  "b": [1, 2, 3]
}
```

`File2: test/fixtures/b/1.json`

```json
{
  "a": 2,
  "b": [1, 3, 2],
  "c": {
    "d": "xxx"
  }
}
```

Execute as below.

```bash
$ jsondiff-report -f test/fixtures/a/1.json test/fixtures/b/1.json
{
  "baseDir": {
    "left": "test/fixtures/a/1.json",
    "right": "test/fixtures/b/1.json"
  },
  "jsonFileDiff": {
    "test/fixtures/a/1.json": {
      "c__added": {
        "d": "xxx"
      },
      "a": {
        "__old": 1,
        "__new": 2
      },
      "b": [
        [
          " ",
          1
        ],
        [
          "+",
          3
        ],
        [
          " ",
          2
        ],
        [
          "-",
          3
        ]
      ]
    }
  }
}
```

### Diff 2 Dirs

`Dir1`

```bash
test/fixtures/a/
├── 1.json
├── 4.json
├── b
│   ├── 2.json
│   ├── 3.json
│   └── d
│       ├── 1.json
│       └── 2.json
└── c
    └── 1.json

3 directories, 7 files
```

`Dir2`

```bash
test/fixtures/b
├── 1.json
├── 3.json
└── b
    ├── 1.json
    ├── 2.json
    └── d
        ├── 1.json
        └── 3.json

2 directories, 6 files
```

Execute as below.

```bash
$ jsondiff-report test/fixtures/a/ test/fixtures/b/
{
  "baseDir": {
    "left": "test/fixtures/a/",
    "right": "test/fixtures/b/"
  },
  "leftOnly": [
    "4.json",
    "b/3.json",
    "b/d/2.json",
    "c/1.json"
  ],
  "rightOnly": [
    "3.json",
    "b/1.json",
    "b/d/3.json"
  ],
  "all": [
    "1.json",
    "b/2.json",
    "b/d/1.json"
  ],
  "jsonFileDiff": {
    "1.json": {
      "c__added": {
        "d": "xxx"
      },
      "a": {
        "__old": 1,
        "__new": 2
      },
      "b": [
        [
          " ",
          1
        ],
        [
          "+",
          3
        ],
        [
          " ",
          2
        ],
        [
          "-",
          3
        ]
      ]
    },
    "b/2.json": "Unexpected end of JSON input",
    "b/d/1.json": "Unexpected end of JSON input"
  }
}
```

## Output Description

| Property       | Description                                                           |
| -------------- | --------------------------------------------------------------------- |
| `baseDir`      | The base dir: `left` for `dir1/file1`, `right` for `dir2/file2`.      |
| `leftOnly`     | List of files that only exists in `baseDir.left`.                     |
| `rightOnly`    | List of files that only exists in `baseDir.right`.                    |
| `all`          | List of files that exists in both `baseDir.left` and `baseDir.right`. |
| `jsonFileDiff` | The json-diff result for every file                                   |
