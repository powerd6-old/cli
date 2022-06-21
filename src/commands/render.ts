import {Command} from 'commander';
import {getConfiguration} from '../lib/configuration';
import {fromFile} from '../lib/module';
import {toFile} from '../lib/rendering';
import {moduleToMarkdown} from '../lib/rendering/markdown';

const renderAction = (options: {format: string; verbose: boolean}) => {
  const {format, verbose} = options;

  console.log('Loading built module...');
  const configuration = getConfiguration();
  const module = fromFile(configuration);

  if (!module) {
    throw new Error('Module not present! Please build it beforehand.');
  }

  let result;
  let resultingExtension;
  switch (format) {
    case 'html':
      if (verbose) {
        console.log('Saving to html');
      }
      resultingExtension = 'html';
      break;
    case 'markdown':
    case 'md':
      if (verbose) {
        console.log('Saving to markdown');
      }
      resultingExtension = 'md';
      result = moduleToMarkdown(module);
      break;

    default:
      break;
  }
  if (result && resultingExtension) {
    const destinationFile = toFile(configuration, result, resultingExtension);
    console.log(`Rendered module on: ${destinationFile}`);
  } else {
    console.log('Nothing was rendered!');
  }
};

export const renderCommand = new Command()
  .name('render')
  .description('renders a (built) module into a distributable format')
  .option('-f, --format <string>', 'the format of the output file', 'markdown')
  .action(renderAction);
