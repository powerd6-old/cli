import {existsSync, readFileSync} from 'fs';
import {resolve} from 'path';
import {Module} from './module';

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
  const filePath = resolve(process.cwd(), '.powerd6.json');
  if (existsSync(filePath)) {
    const fileContents = readFileSync(filePath).toString();
    const fileConfiguration = JSON.parse(fileContents) as Configuration;
    return {
      ...defaultConfiguration,
      ...fileConfiguration,
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
