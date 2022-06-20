#!/usr/bin/env node

import {program} from 'commander';

import {buildCommand} from './commands/build';
import {renderCommand} from './commands/render';

program
  .name('powerd6-cli')
  .description(
    'A cli tool to help with building and maintaining powerd6 modules'
  );

program.addCommand(buildCommand);
program.addCommand(renderCommand);

program.parse();
