import {Command} from 'commander';

import {fixConfiguration, getConfiguration} from '../lib/configuration';
import {
  getModuleDefinition,
  toFile,
  withAuthors,
  withContent,
} from '../lib/module';

const buildAction = (options: {verbose: boolean}) => {
  const {verbose} = options;
  console.log('Build command executed!');
  let configuration = getConfiguration();
  if (verbose) {
    console.log('Configuration loaded', configuration);
  }

  console.log('Loading module...');
  let module = getModuleDefinition(configuration);
  if (verbose) {
    console.log('Module loaded', module);
  }

  configuration = fixConfiguration(configuration, module);
  if (verbose) {
    console.log('Configuration updated based on the module', configuration);
  }

  console.log('Fetching module authors...');
  module = withAuthors(module, configuration);
  if (verbose) {
    console.log('Module Authors loaded', module.authors);
  }

  console.log('Fetching module contents...');
  module = withContent(module, configuration);
  if (verbose) {
    console.log('Module contents loaded', module.content);
  }

  console.log('Saving module to file...');
  const destinationFile = toFile(module, configuration);
  console.log(`Saved module on: ${destinationFile}`);
};

export const buildCommand = new Command()
  .name('build')
  .description('builds a module from a sparse directory structure')
  .action(buildAction);
