import {Command} from 'commander';

import {getConfiguration} from '../lib/configuration';

export const buildCommand = new Command()
  .name('build')
  .description('builds a module from a sparse directory structure')
  .action(() => {
    console.log('Build command executed!');
    const configuration = getConfiguration();
    console.log('Configuration loaded', configuration);
  });
