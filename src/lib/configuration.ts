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

interface Configuration {
  destination: DestinationConfiguration;
  source: SourceConfiguration;
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
  // TODO: fetch the configuration from a local file
  return defaultConfiguration;
}