import {existsSync, readFileSync} from 'fs';
import {resolve} from 'path';
import {parse} from 'yaml';

export function findDataFile(
  path: string,
  filename: string
): string | undefined {
  const acceptedExtensions = ['json', 'yaml', 'yml'];

  return acceptedExtensions
    .map(extension => resolve(path, `${filename}.${extension}`))
    .find(extension => existsSync(extension));
}

export function loadDataFile(filepath: string): object {
  const extension = filepath.split('.').pop();
  switch (extension) {
    case 'json':
      return JSON.parse(readFileSync(filepath).toString());
    case 'yaml':
    case 'yml':
      return parse(readFileSync(filepath).toString());

    default:
      throw new Error(`File extension is not supported: ${extension}`);
  }
}
