import {Module, Author, Attribute} from '@powerd6/schemas/src';

export function moduleToMarkdown(module: Module): string {
  const heading = `
  # ${module.name} {#module-${module.id}}

  ${module.description}

  ## Authors

  ${module.authors.map(authorToMarkdown)}
  `;

  const contents = '';

  return `
  ${heading}

  ---

  ${contents}
  `;
}

export function authorToMarkdown(author: Author): string {
  return `### ${author.name} {#author-${author.id}}

  ${author.biography || ''}
  `;
}

export function contentSectionToMarkdown(model: string, content: any): string {
  let data;
  switch (model.toLocaleLowerCase()) {
    case 'attribute':
      data = content as Attribute;
      return `
        ## [${data.associated_number}] ${data.name} (${
        data.abbreviation
      }) {#${model}-${data.name}}

        ${data.description}

        ### Focuses:

        ${data.focuses.map(f => ` - [${f.id}](${f.model}-${f.id})`)}
        `;
    case 'character':
      break;
    case 'effect':
      break;
    case 'focus':
      break;
    case 'injury':
      break;
    case 'item':
      break;
    case 'module':
      break;
    case 'reference':
      break;
    case 'rule':
      break;
    case 'species':
      break;
    case 'spell':
      break;

    default:
      throw new Error(`This content type (${model}) is not supported!`);
  }
}
