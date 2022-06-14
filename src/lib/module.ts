import {resolve} from 'path';
import {Configuration} from './configuration';
import {findDataFile, loadDataFile} from './datafile';

export interface Module {
  id: string;
  name: string;
  description: string;
  authors: {
    [k: string]: unknown;
  }[];
  models: {
    '^.$'?: string;
    [k: string]: unknown;
  };
  content?: {
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
