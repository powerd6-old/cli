import {existsSync, fstat, readdirSync, readFileSync} from 'fs';
import {extname, resolve} from 'path';
import {parse} from 'yaml';

const acceptedExtensions = ['json', 'yaml', 'yml'];

export function getDataFilesInFolder(path: string): string[] {
  const folderPath = resolve(path);
  if (existsSync(folderPath)) {
    return readdirSync(folderPath, {withFileTypes: true})
      ?.filter(
        entry =>
          entry.isFile() && acceptedExtensions.includes(extname(entry.name))
      )
      .map(entry => `${folderPath}/${entry.name}`);
  } else {
    return [];
  }
}

export function findDataFile(
  path: string,
  filename: string
): string | undefined {
  return acceptedExtensions
    .map(extension => resolve(path, `${filename}.${extension}`))
    .find(extension => existsSync(extension));
}

export function loadDataFile(filepath: string): object {
  const extension = extname(filepath);
  switch (extension) {
    case '.json':
      return JSON.parse(readFileSync(filepath).toString());
    case '.yaml':
    case '.yml':
      return parse(readFileSync(filepath).toString());

    default:
      throw new Error(`File extension is not supported: ${extension}`);
  }
}
