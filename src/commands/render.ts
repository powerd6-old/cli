import {Command} from 'commander';
import {getConfiguration} from '../lib/configuration';
import {fromFile} from '../lib/module';

const renderAction = (options: {format: string; verbose: boolean}) => {
  const {format, verbose} = options;

  console.log('Loading built module...');
  const configuration = getConfiguration();
  const module = fromFile(configuration);

  if (!module) {
    throw new Error('Module not present! Please build it beforehand.');
  }

  switch (format) {
    case 'html':
      if (verbose) {
        console.log('Saving to html');
      }

      break;
    case 'markdown':
    case 'md':
      if (verbose) {
        console.log('Saving to markdown');
      }

      break;

    default:
      break;
  }
};

export const renderCommand = new Command()
  .name('render')
  .description('renders a (built) module into a distributable format')
  .option('-f, --format <string>', 'the format of the output file', 'markdown')
  .action(renderAction);
