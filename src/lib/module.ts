import assert = require('assert');
import {existsSync, mkdirSync, writeFileSync} from 'fs';
import {Module, _Module} from '@powerd6/schemas/src/lib/schemas/module';
import {_Author} from '@powerd6/schemas/src/lib/schemas/author';
import {_Attribute} from '@powerd6/schemas/src/lib/schemas/attribute';
import {_Character} from '@powerd6/schemas/src/lib/schemas/character';
import {_Effect} from '@powerd6/schemas/src/lib/schemas/effect';
import {_Focus} from '@powerd6/schemas/src/lib/schemas/focus';
import {_Injury} from '@powerd6/schemas/src/lib/schemas/injury';
import {_Item} from '@powerd6/schemas/src/lib/schemas/item';
import {_Reference} from '@powerd6/schemas/src/lib/schemas/reference';
import {_Rule} from '@powerd6/schemas/src/lib/schemas/rule';
import {_Species} from '@powerd6/schemas/src/lib/schemas/species';
import {_Spell} from '@powerd6/schemas/src/lib/schemas/spell';
import {resolve} from 'path';
import {Configuration} from './configuration';
import {findDataFile, getDataFilesInFolder, loadDataFile} from './datafile';
import {_MarkdownString} from '@powerd6/schemas/src/lib/schemas/markdown-string';

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
    )
      .map(contentFilePath => loadDataFile(contentFilePath))
      .map(contents => validateContents(contents, modelKey));
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

function validateContents(contents: object, modelKey: string) {
  let validator;
  switch (modelKey) {
    case 'attribute':
      validator = _Attribute;
      break;
    case 'author':
      validator = _Author;
      break;
    case 'character':
      validator = _Character;
      break;
    case 'effect':
      validator = _Effect;
      break;
    case 'focus':
      validator = _Focus;
      break;
    case 'injury':
      validator = _Injury;
      break;
    case 'item':
      validator = _Item;
      break;
    case 'markdown-string':
      validator = _MarkdownString;
      break;
    case 'module':
      validator = _Module;
      break;
    case 'reference':
      validator = _Reference;
      break;
    case 'rule':
      validator = _Rule;
      break;
    case 'species':
      validator = _Species;
      break;
    case 'spell':
      validator = _Spell;
      break;

    default:
      break;
  }

  if (validator) {
    return validator.parse(contents);
  } else {
    return contents;
  }
}
