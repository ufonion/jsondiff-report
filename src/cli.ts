import { readFile, writeFile, stat } from 'mz/fs';
import { json } from 'mrm-core';
  boolean: ['git'],
    git: ['g'],
// tslint:disable-next-line: no-big-function
  let result: Partial<JsonDiffResult> = {};

  const left = argv._[0];
  const right = argv._[1];

  let fileCompare = false;

  const leftStat = await stat(left);
  const rightStat = await stat(right);

  if (leftStat.isFile() && rightStat.isFile()) {
    fileCompare = true;
  } else if ((leftStat.isDirectory() && rightStat.isFile())
    || (leftStat.isFile() && rightStat.isDirectory())) {
    // tslint:disable-next-line: no-console
    console.error(whiteBright.bgRedBright('error'),
      new Error('2 positional arugments must be both files or directories'));
    process.exit(1);
  }

  if (fileCompare) {
    result = {
      const diffString: any = argv.git ?
        jsonDiff.diffString(leftJson, rightJson) : jsonDiff.diff(leftJson, rightJson);
  } else {
    try {
      const leftDir = await generateFileList(left);
      const rightDir = await generateFileList(right);
      const fileDiff = generateFileListDiff(leftDir, rightDir);
      result = {
        ...fileDiff,
        jsonFileDiff: {},
      };

      for (const file of fileDiff.all) {
        let leftJson: any;
        let rightJson: any;
        let fullPath: string = '';
        try {
          fullPath = join(fileDiff.baseDir.left, file);
          leftJson = JSON.parse((await readFile(fullPath)).toString());
        } catch (error) {
          (result.jsonFileDiff as any)[file] = fullPath + ' - ' + (error as Error).toString() + '\n';
          continue;
        }
        try {
          fullPath = join(fileDiff.baseDir.right, file);
          rightJson = JSON.parse((await readFile(fullPath)).toString());
        } catch (error) {
          (result.jsonFileDiff as any)[file] = fullPath + ' - ' + (error as Error).toString() + '\n';
          continue;
        }
        const diffString: any = argv.git ?
          jsonDiff.diffString(leftJson, rightJson) : jsonDiff.diff(leftJson, rightJson);
        (result.jsonFileDiff as any)[file] = diffString;
      }
    } catch (e) {
      // tslint:disable-next-line: no-console
      console.error(whiteBright.bgRedBright('error'), e);
      process.exit(1);
    }
  if (!argv.git) {
    await writeOutput(JSON.stringify(result, undefined, 2), output);
  } else {
    const source = result as JsonDiffResult;
    const prefixA = source.baseDir.left;
    const prefixB = source.baseDir.right;
    let gitOutput = '';
    if (source.leftOnly) {
      source.leftOnly.forEach((file) => {
        gitOutput += `jsondiff-report --git ${join(prefixA, file)} ${join(prefixB, file)}\n`;
        gitOutput += 'deleted file mode 10644\n';
        gitOutput += `--- ${join(prefixA, file)}\n`;
        gitOutput += '+++ /dev/null\n';
      });
    }
    if (source.rightOnly) {
      source.rightOnly.forEach((file) => {
        gitOutput += `jsondiff-report --git ${join(prefixA, file)} ${join(prefixB, file)}\n`;
        gitOutput += 'new file mode 10644\n';
        gitOutput += '--- /dev/null\n';
        gitOutput += `+++ ${join(prefixA, file)}\n`;
      });
    }
    if (source.all) {
      for (const all of source.all) {
        let fileA: string;
        let fileB: string;
        fileA = join(source.baseDir.left, all);
        fileB = join(source.baseDir.right, all);
        gitOutput += `json-diff --git ${fileA} ${fileB}\n`;
        gitOutput += source.jsonFileDiff[all];
    } else {
      gitOutput += `json-diff --git ${source.baseDir.left} ${source.baseDir.right}\n`;
      gitOutput += source.jsonFileDiff[source.baseDir.left];

    await writeOutput(gitOutput, output);
  const pkg = json('../package.json');
  const helpMessage =
${pkg.get('name')} ${pkg.get('version')}
  jsondiff-report [--output, -o] [OUT_FILE] [--git, -g] dir1 dir2
  jsondiff-report [--file, -f] [--output, -o] [OUT_FILE] [--git, -g] file1 file2
  -g, --git     output like git diff

Default


Git

json-diff --git test/fixtures/a/4.json test/fixtures/b/4.json
deleted file mode 10644
--- test/fixtures/a/4.json
+++ /dev/null
json-diff --git test/fixtures/a/b/3.json test/fixtures/b/b/3.json
deleted file mode 10644
--- test/fixtures/a/b/3.json
+++ /dev/null
json-diff --git test/fixtures/a/b/d/2.json test/fixtures/b/b/d/2.json
deleted file mode 10644
--- test/fixtures/a/b/d/2.json
+++ /dev/null
json-diff --git test/fixtures/a/c/1.json test/fixtures/b/c/1.json
deleted file mode 10644
--- test/fixtures/a/c/1.json
+++ /dev/null
json-diff --git test/fixtures/a/3.json test/fixtures/b/3.json
new file mode 10644
--- /dev/null
+++ test/fixtures/a/3.json
json-diff --git test/fixtures/a/b/1.json test/fixtures/b/b/1.json
new file mode 10644
--- /dev/null
+++ test/fixtures/a/b/1.json
json-diff --git test/fixtures/a/b/d/3.json test/fixtures/b/b/d/3.json
new file mode 10644
--- /dev/null
+++ test/fixtures/a/b/d/3.json
json-diff --git test/fixtures/a/1.json test/fixtures/b/1.json
 {
+  c: {
+    d: "xxx"
+  }
-  a: 1
+  a: 2
   b: [
     1
+    3
     2
-    3
   ]
 }
json-diff --git test/fixtures/a/b/2.json test/fixtures/b/b/2.json
test/fixtures/a/b/2.json - SyntaxError: Unexpected end of JSON input
json-diff --git test/fixtures/a/b/d/1.json test/fixtures/b/b/d/1.json
test/fixtures/a/b/d/1.json - SyntaxError: Unexpected end of JSON input
`;
  process.stdout.write(helpMessage);