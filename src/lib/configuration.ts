import {findDataFile, loadDataFile} from './datafile';

import {Module} from '@powerd6/schemas/src/lib/schemas/module';

import {z} from 'zod';

export const _Configuration = z.object({
  destination: z.object({
    directory: z.string().default('output'),
  }),
  source: z.object({
    directory: z.string().default('module'),
    authorsDirectory: z.string().default('author'),
    content: z.map(z.string(), z.string()).optional(),
  }),
});

export type Configuration = z.infer<typeof _Configuration>;

export function getConfiguration() {
  const filePath = findDataFile(process.cwd(), '.powerd6');
  if (filePath) {
    const loadedConfiguration = loadDataFile(filePath);
    return _Configuration.parse(loadedConfiguration);
  }
  return _Configuration.parse(undefined); // Use the default configurations
}

export function fixConfiguration(configuration: Configuration, module: Module) {
  Object.keys(module.models).forEach(modelKey => {
    if (
      configuration.source &&
      configuration.source.content &&
      !configuration.source.content.get(modelKey)
    ) {
      configuration.source.content.set(modelKey, modelKey);
    }
  });
  return configuration;
}
