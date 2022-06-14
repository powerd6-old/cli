import {existsSync, readFileSync} from 'fs';

interface DestinationConfiguration {
  directory?: string;
}

interface SourceConfiguration {
  directory?: string;
  authorsDirectory?: string;
  content?: SourceContentConfiguration;
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
  const filePath = `${process.cwd()}/.powerd6.json`;
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
