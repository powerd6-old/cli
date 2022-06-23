# cli

A cli tool to help with building and maintaining powerd6 modules.

[![Open Issues](https://img.shields.io/github/issues/powerd6/cli)](https://github.com/powerd6/cli/issues)
[![Code Style: Google](https://img.shields.io/badge/code%20style-google-blueviolet.svg)](https://github.com/google/gts)

## Usage

The following formats are allowed:

- JSON
- YAML

### Configuration

You can configure how this tool executed by creating a `.powerd6.json` file in your project.

This file must be placed at the top-level of your project (where you plan to run the command from).

This is an example configuration:
```yaml
destination:
  directory: output # output directory path
source:
  directory: module # source directory path
  authorsDirectory: author # authors directory path inside `source.directory`
  content: # content directory paths inside `source.directory`
    spell: spells # content directory paths inside `source.directory` for the `spell` model
```
These are the default values for the configuration:

```json
{
  "destination": {
    "directory": "output",
  },
  "source": {
    "directory": "module",
    "authorsDirectory": "author",
    "content": {},
  }
}
```

### Build

```bash
cd your_project/
powerd6-cli build
```