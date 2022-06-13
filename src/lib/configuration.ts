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

const defaultConfiguration: Configuration = {
  destination: {
    directory: 'output',
  },
  source: {
    directory: 'module',
    authorsDirectory: 'author',
    content: {},
  },
};

module.exports = {
  defaultConfiguration,
};
