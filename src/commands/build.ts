import {Command} from 'commander';

import {getConfiguraiton} from '../lib/configuration';

export const buildCommand = new Command()
  .name('build')
  .description('builds a module from a sparse directory structure')
  .action(() => {
    console.log('Build command executed!');
    const configuration = getConfiguraiton();
  });
