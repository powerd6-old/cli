import {
  Module,
  Author,
  Attribute,
  Character,
  Effect,
  Focus,
  Injury,
  Item,
  Module,
  Rule,
  Species,
  Spell,
} from "@powerd6/schemas/src";

export function moduleToMarkdown(module: Module): string {
  const heading = `
  # ${module.name} {#module-${module.id}}

  ${module.description}

  ## Authors

  ${module.authors.map(authorToMarkdown)}
  `;

  const contents = Object.keys(module.contents)
    .map(
      (model) => `
  # ${model}

  ${module.contents[model]
    .map((content) => contentSectionToMarkdown(model, content))
    .join("\n\n")}
  `
    )
    .join("\n\n");

  return `
  ${heading}

  ---

  ${contents}
  `;
}

export function authorToMarkdown(author: Author): string {
  return `### ${author.name} {#author-${author.id}}

  ${author.biography || ""}
  `;
}

export function contentSectionToMarkdown(model: string, content: any): string {
  let data;
  switch (model.toLocaleLowerCase()) {
    case "attribute":
      data = content as Attribute;
      return `
        ## [${data.associated_number}] ${data.name} (${
        data.abbreviation
      }) {#${model}-${data.id}}

        ${data.description}

        ### Focuses:

        ${data.focuses.map((f) => ` - [${f.id}](${f.model}-${f.id})`)}
        `;
    case "effect":
      data = content as Effect;
      return `
        ## ${data.name} {#${model}-${data.id}}

        ${data.description}
      `;
      break;
    case "focus":
      break;
    case "injury":
      break;
    case "item":
      break;
    case "rule":
      data = content as Effect;
      return `
        ## ${data.name} {#${model}-${data.id}}

        ${data.description}
      `;
      break;
    case "species":
      break;
    case "spell":
      break;
    case "character":
    case "module":
    case "reference":
      throw new Error(
        `This content type (${model}) has no implementation yet.`
      );
      break;
    default:
      throw new Error(`This content type (${model}) is not supported!`);
  }
}
