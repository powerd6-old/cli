#!/usr/bin/env node

import {program} from 'commander';

import {buildCommand} from './commands/build';
import {renderCommand} from './commands/render';

program
  .name('powerd6-cli')
  .description(
    'A cli tool to help with building and maintaining powerd6 modules'
  );

[buildCommand, renderCommand]
  .map(c =>
    c.option(
      '-v, --verbose',
      'whether or not to log extra messages during runtime',
      false
    )
  )
  .forEach(c => program.addCommand(c));

program.parse();
