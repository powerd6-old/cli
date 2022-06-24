import assert = require('assert');
import {existsSync, mkdirSync, writeFileSync} from 'fs';
import {Module, _Module} from '@powerd6/schemas/src/lib/schemas/module';
import {_Author} from '@powerd6/schemas/src/lib/schemas/author';
import {resolve} from 'path';
import {Configuration} from './configuration';
import {findDataFile, getDataFilesInFolder, loadDataFile} from './datafile';

export function getModuleDefinition(configuration: Configuration) {
  const modulePath = resolve(configuration.source?.directory || './');
  const moduleFilePath = findDataFile(modulePath, 'module');
  if (moduleFilePath) {
    return _Module.parse(loadDataFile(moduleFilePath));
  } else {
    throw new Error('Module not found.');
  }
}

export function withAuthors(module: Module, configuration: Configuration) {
  assert(configuration.source?.directory);
  assert(configuration.source?.authorsDirectory);
  const authors = getDataFilesInFolder(
    resolve(
      configuration.source?.directory,
      configuration.source?.authorsDirectory
    )
  ).map(authorFilePath => _Author.parse(loadDataFile(authorFilePath)));
  module.authors = authors;
  return module;
}

export function withContent(
  module: Module,
  configuration: Configuration
): Module {
  Object.keys(module.models).forEach(modelKey => {
    assert(configuration.source?.directory);
    assert(configuration.source?.content?.get(modelKey));
    const content = getDataFilesInFolder(
      resolve(
        configuration.source?.directory,
        configuration.source?.content?.get(modelKey) || modelKey
      )
    ).map(contentFilePath => loadDataFile(contentFilePath));
    module.content.set(modelKey, content);
  });
  return module;
}

export function toFile(module: Module, configuration: Configuration) {
  assert(configuration.destination?.directory);
  if (!existsSync(resolve(configuration.destination?.directory))) {
    mkdirSync(resolve(configuration.destination?.directory));
  }
  const filePath = resolve(configuration.destination?.directory, 'module.json');
  writeFileSync(filePath, JSON.stringify(module));
  return filePath;
}

export function fromFile(configuration: Configuration) {
  assert(configuration.destination?.directory);
  const moduleFilePath = resolve(
    configuration.destination.directory,
    'module.json'
  );
  if (existsSync(moduleFilePath)) {
    _Module.parse(loadDataFile(moduleFilePath));
  }
  return undefined;
}
