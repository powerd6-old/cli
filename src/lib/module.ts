import assert = require('assert');
import {existsSync, mkdirSync, writeFileSync} from 'fs';
import {resolve} from 'path';
import {Configuration} from './configuration';
import {findDataFile, getDataFilesInFolder, loadDataFile} from './datafile';

interface Author {
  id: string;
  name: string;
  biography?: string;
}

export interface Module {
  id: string;
  name: string;
  description: string;
  authors: Author[];
  models: {
    '^.$'?: string;
    [k: string]: unknown;
  };
  content: {
    '^.$'?: {
      [k: string]: unknown;
    }[];
    [k: string]: unknown;
  };
}

export function getModuleDefinition(configuration: Configuration): Module {
  const modulePath = resolve(configuration.source?.directory || './');
  const moduleFilePath = findDataFile(modulePath, 'module');
  if (moduleFilePath) {
    return loadDataFile(moduleFilePath) as Module;
  } else {
    throw new Error('Module not found.');
  }
}

export function withAuthors(
  module: Module,
  configuration: Configuration
): Module {
  assert(configuration.source?.directory);
  assert(configuration.source?.authorsDirectory);
  const authors = getDataFilesInFolder(
    resolve(
      configuration.source?.directory,
      configuration.source?.authorsDirectory
    )
  ).map(authorFilePath => loadDataFile(authorFilePath) as Author);
  module.authors = authors;
  return module;
}

export function withContent(
  module: Module,
  configuration: Configuration
): Module {
  Object.keys(module.models).forEach(modelKey => {
    assert(configuration.source?.directory);
    assert(configuration.source?.content[modelKey]);
    const content = getDataFilesInFolder(
      resolve(
        configuration.source?.directory,
        configuration.source?.content[modelKey]
      )
    ).map(contentFilePath => loadDataFile(contentFilePath));
    module.content[modelKey] = content;
  });
  return module;
}

export function toFile(module: Module, configuration: Configuration): string {
  assert(configuration.destination?.directory);
  if (!existsSync(resolve(configuration.destination?.directory))) {
    mkdirSync(resolve(configuration.destination?.directory));
  }
  const filePath = resolve(configuration.destination?.directory, 'module.json');
  writeFileSync(filePath, JSON.stringify(module));
  return filePath;
}
