import {existsSync, mkdirSync, writeFileSync} from 'fs';
import assert = require('node:assert');
import {resolve} from 'path';
import {Configuration} from './configuration';

export function toFile(
  configuration: Configuration,
  contents: string,
  extension: string
): string {
  assert(configuration.destination?.directory);
  if (!existsSync(resolve(configuration.destination?.directory))) {
    mkdirSync(resolve(configuration.destination?.directory));
  }
  const filePath = resolve(
    configuration.destination?.directory,
    `module.${extension}`
  );
  writeFileSync(filePath, contents);
  return filePath;
}
