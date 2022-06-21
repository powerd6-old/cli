import {
  Author,
  Attribute,
  Effect,
  Focus,
  Injury,
  Item,
  Module,
  Rule,
  Species,
  Spell,
} from '@powerd6/schemas/src';
import jsonpath = require('jsonpath');
import assert = require('node:assert');

export function moduleToMarkdown(module: Module): string {
  const heading = [
    `<h1 id='module-${module.id}'>${module.name} </h1>`,
    '',
    module.description,
    '',
    '## Authors',
    '',
    ...module.authors.map(authorToMarkdown),
  ];

  assert(module.content);
  const moduleContentEntries = Object.entries(module.content) as [
    string,
    (
      | Author[]
      | Attribute[]
      | Effect[]
      | Focus[]
      | Injury[]
      | Item[]
      | Module[]
      | Rule[]
      | Species[]
      | Spell[]
    )
  ][];

  const renderedContent = moduleContentEntries
    .filter(
      ([model, contents]) =>
        model && model.length > 0 && contents && contents.length > 0
    )
    .map(([model, contents]) =>
      [
        `# ${model}`,
        '',
        contents
          .sort(sortModelContents(model))
          .map(c => contentSectionToMarkdown(model, c))
          .join('\n\n'),
        '',
      ].join('\n')
    );

  const rendered = [...heading, '', '---', '', ...renderedContent].join('\n');

  return replaceCustomMarkdownLinks(module, rendered);
}

function sortModelContents(model: string) {
  return (
    a:
      | Author
      | Attribute
      | Effect
      | Focus
      | Injury
      | Item
      | Module
      | Rule
      | Species
      | Spell,
    b:
      | Author
      | Attribute
      | Effect
      | Focus
      | Injury
      | Item
      | Module
      | Rule
      | Species
      | Spell
  ): 1 | -1 => {
    let aCast, bCast;
    switch (model) {
      case 'attribute':
        aCast = a as Attribute;
        bCast = b as Attribute;
        return aCast.associated_number > bCast.associated_number ? 1 : -1;
      case 'focus':
        aCast = a as Focus;
        bCast = b as Focus;
        if (aCast.attribute === bCast.attribute) {
          return aCast.id > bCast.id ? 1 : -1;
        } else {
          return aCast.attribute > bCast.attribute ? 1 : -1;
        }

      default:
        return a.id > b.id ? 1 : -1;
    }
  };
}

function replaceCustomMarkdownLinks(module: Module, content: string): string {
  const customLinkRegex = /\[(.*?)\]{(.*?)}/g;
  const modelRegex = /\$\.content\.(.*?)\[.*/g;
  return content.replace(
    customLinkRegex,
    (match, displayText, jsonReference) => {
      const referencedElement:
        | Author
        | Attribute
        | Effect
        | Focus
        | Injury
        | Item
        | Module
        | Rule
        | Species
        | Spell = jsonpath.query(module, jsonReference)[0];
      if (referencedElement) {
        let referencedModel;
        if ((referencedModel = modelRegex.exec(jsonReference)) !== null) {
          return `[${displayText}](#${referencedModel}-${referencedElement.id})`;
        } else {
          return `[${displayText}](#${referencedElement.id})`;
        }
      } else {
        console.error('Reference not found!', match);
        return match;
      }
    }
  );
}

export function authorToMarkdown(author: Author): string[] {
  return [
    `<h3 id='#author-${author.id}'>${author.name}</h3>`,
    '',
    author.biography || '',
  ];
}

export function contentSectionToMarkdown(
  model: string,
  content:
    | Author
    | Attribute
    | Effect
    | Focus
    | Injury
    | Item
    | Module
    | Rule
    | Species
    | Spell
): string {
  let data;
  let result: string[];
  switch (model.toLocaleLowerCase()) {
    case 'attribute':
      data = content as Attribute;
      result = [
        `<h2 id='${model}-${data.id}'>[${data.associated_number}] ${data.name} (${data.abbreviation})</h2>`,
        '',
        data.description,
        '',
        '### Focuses:',
        '',
        ...data.focuses.map(f => ` - [${f.id}](#${f.model}-${f.id})`),
      ];
      break;
    case 'effect':
      data = content as Effect;
      result = [
        `<h2 id='${model}-${data.id}'>${data.name}</h2>`,
        '',
        data.description,
      ];
      break;
    case 'focus':
      data = content as Focus;
      result = [
        `<h2 id='${model}-${data.id}'>${data.name}</h2>`,
        '',
        data.description,
        '',
        `*Relates to [${data.attribute.id}](#${data.attribute.model}-${data.attribute.id}).*`,
      ];
      break;
    case 'injury':
      data = content as Injury;
      result = [
        `<h2 id='${model}-${data.id}'>${data.name}</h2>`,
        '',
        `${data.description}`,
        ...(data.effects || []).map(
          effect => ` - [${effect.id}](#${effect.model}-${effect.id})`
        ),
      ];
      break;
    case 'item':
      data = content as Item;
      result = [
        `<h2 id='${model}-${data.id}'>${data.name}</h2>`,
        '',
        data.description,
        '',
        ...(data.effects || []).map(
          effect => ` - [${effect.id}](#${effect.model}-${effect.id})`
        ),
      ];
      break;
    case 'rule':
      data = content as Rule;
      result = [
        `<h2 id='${model}-${data.id}'>${data.name}</h2>`,
        '',
        data.description,
      ];
      break;
    case 'species':
      data = content as Species;
      result = [
        `<h2 id='${model}-${data.id}'>${data.name}</h2>`,
        '',
        data.description,
        '',
        ...(data.effects || []).map(
          effect => ` - [${effect.id}](#${effect.model}-${effect.id})`
        ),
      ];
      break;
    case 'spell':
      data = content as Spell;
      result = [
        `<h2 id='${model}-${data.id}'>${data.name}</h2>`,
        '',
        data.description,
        '',
        '### Learning Requirements:',
        '',
        data.learning_requirements,
        data.activation_requirements
          ? `
        ### Activation Requirements:
        
        ${data.activation_requirements}
        `
          : '',
        '',
        '### Effects:',
        ...data.effects.map(
          effect => ` - [${effect.id}](#${effect.model}-${effect.id})`
        ),
      ];
      break;
    case 'character':
    case 'module':
    case 'reference':
      throw new Error(
        `This content type (${model}) has no implementation yet.`
      );
    default:
      throw new Error(`This content type (${model}) is not supported!`);
  }
  return result.join('\n');
}
