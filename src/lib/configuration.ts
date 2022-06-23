import {Module} from '@powerd6/schemas/src/index';
import {findDataFile, loadDataFile} from './datafile';

interface DestinationConfiguration {
  directory: string;
}

interface SourceConfiguration {
  directory: string;
  authorsDirectory: string;
  content: SourceContentConfiguration;
}

interface SourceContentConfiguration {
  [index: string]: string;
}

export interface Configuration {
  destination?: DestinationConfiguration;
  source?: SourceConfiguration;
}

export const defaultConfiguration: Configuration = {
  destination: {
    directory: 'output',
  },
  source: {
    directory: 'module',
    authorsDirectory: 'author',
    content: {},
  },
};

export function getConfiguration(): Configuration {
  const filePath = findDataFile(process.cwd(), '.powerd6');
  if (filePath) {
    return {
      ...defaultConfiguration,
      ...loadDataFile(filePath),
    };
  }
  return defaultConfiguration;
}

export function fixConfiguration(
  configuration: Configuration,
  module: Module
): Configuration {
  Object.keys(module.models).forEach(modelKey => {
    if (
      configuration.source &&
      configuration.source.content &&
      !configuration.source.content[modelKey]
    ) {
      configuration.source.content[modelKey] = modelKey;
    }
  });
  return configuration;
}
