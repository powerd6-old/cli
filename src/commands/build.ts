import {Command} from 'commander';

export const buildCommand = new Command()
  .name('build')
  .description('builds a module from a sparse directory structure')
  .action(() => {
    console.log('Build command executed!');
  });
