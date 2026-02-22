# generator-jhipster-yellowbricks

[![Yellow Bricks Badge](https://img.shields.io/badge/YELLOWBRICKS--yellow?style=for-the-badge&labelColor=black)](https://github.com/idNoRD/generator-jhipster-yellowbricks) blueprint — a [JHipster](https://www.jhipster.tech/) blueprint that orchestrates all yellowbricks in a single `--blueprints` flag.

[![NPM version][npm-image]][npm-url]
[![Generator][github-generator-image]][github-generator-url]
![GitHub Maintained](https://img.shields.io/maintenance/yes/2026)

## Concept

```
  generator-jhipster-yellowbricks          ← (aggregator + orchestrator) blueprint
  ├── generator-jhipster-yellowbricks-angular-contextpath
  ├── generator-jhipster-yellowbricks-spring-boot-contextpath
  ├── generator-jhipster-yellowbricks-client-contextpath
  ├── generator-jhipster-yellowbricks-angular-relativepathresource
  └── generator-jhipster-yellowbricks-client-relativepathresource
```

### Rules

- Every yellowbrick is a standalone JHipster blueprint — usable without this meta package
- This meta package exists only to group and activate them
- Each brick has exactly one responsibility

## Available yellowbricks

| Yellowbrick name                                                                                                                                       | What it does                                                   |
| ------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------- |
| [generator-jhipster-yellowbricks-angular-contextpath](https://github.com/idNoRD/generator-jhipster-yellowbricks-angular-contextpath)                   | Sets `baseHref` in `angular.json`                              |
| [generator-jhipster-yellowbricks-spring-boot-contextpath](https://github.com/idNoRD/generator-jhipster-yellowbricks-spring-boot-contextpath)           | Sets `context-path` in `application.yml`                       |
| [generator-jhipster-yellowbricks-client-contextpath](https://github.com/idNoRD/generator-jhipster-yellowbricks-client-contextpath)                     | Sets `<base href>` in `index.html` and `swagger-ui/index.html` |
| [generator-jhipster-yellowbricks-angular-relativepathresource](https://github.com/idNoRD/generator-jhipster-yellowbricks-angular-relativepathresource) | Makes logo URL relative in `navbar.scss`                       |
| [generator-jhipster-yellowbricks-client-relativepathresource](https://github.com/idNoRD/generator-jhipster-yellowbricks-client-relativepathresource)   | Makes logo URL relative in `loading.css`                       |

## Prerequisites

- Node.js `^22.18.0 || >=24.11.0`
- JHipster 9

## Installation

```bash
npm install -g generator-jhipster-yellowbricks
```

## Usage

Create a `.yo-rc.json` in your project directory selecting which bricks to use and configuring any that need it.

> [!TIP]
> Only activate bricks that match your stack. If your JHipster app uses Vue or React instead of Angular, skip `angular-contextpath` and `angular-relativepathresource` — those bricks target Angular-specific files that won't exist in your project.

```json
{
  "generator-jhipster-yellowbricks": {
    "use": [
      "angular-contextpath",
      "spring-boot-contextpath",
      "client-contextpath",
      "angular-relativepathresource",
      "client-relativepathresource"
    ]
  },
  "generator-jhipster-yellowbricks-angular-contextpath": {
    "contextPath": "/jh/"
  },
  "generator-jhipster-yellowbricks-spring-boot-contextpath": {
    "contextPath": "/jh/"
  },
  "generator-jhipster-yellowbricks-client-contextpath": {
    "contextPath": "/jh/"
  }
}
```

The `angular-relativepathresource` and `client-relativepathresource` bricks require no configuration.

Then run JHipster with this blueprint:

```bash
# Standard generator
jhipster --blueprints yellowbricks

# With JDL
jhipster import-jdl your-app.jdl --blueprints yellowbricks
```

## How to create a new yellowbrick

All yellowbricks start from the `generator-jhipster-yellowbricks-` prefix followed by the generator name and a purpose suffix.

To find the generator name, search the JHipster source for the template file you want to modify: https://github.com/search?q=repo%3Ajhipster%2Fgenerator-jhipster&type=code

For example, `generators/angular/templates/angular.json.ejs` lives under `generators/angular` — so the generator name is `angular` and the brick would be `generator-jhipster-yellowbricks-angular-<purpose>`.

### Bricks that modify existing JHipster output

Override the specific sub-generator with `sbsBlueprint: true`:

```bash
mkdir generator-jhipster-yellowbricks-<generator>-<purpose>
cd generator-jhipster-yellowbricks-<generator>-<purpose>
jhipster generate-blueprint --sub-generators <generator> --all-priorities --defaults --skip-git
```

Answer:

| Prompt                                               | Answer |
| ---------------------------------------------------- | ------ |
| Is `<generator>` generator a side-by-side blueprint? | Y      |
| Is `<generator>` generator a cli command?            | N      |

### Bricks that add new files

Override the `app` generator with `sbsBlueprint: true`:

```bash
jhipster generate-blueprint --sub-generators app --defaults --skip-git
```

Answer:

| Prompt                                     | Answer |
| ------------------------------------------ | ------ |
| Is app generator a side-by-side blueprint? | Y      |
| Is app generator a cli command?            | N      |

[npm-image]: https://img.shields.io/npm/v/generator-jhipster-yellowbricks.svg
[npm-url]: https://npmjs.org/package/generator-jhipster-yellowbricks
[github-generator-image]: https://github.com/idNoRD/generator-jhipster-yellowbricks/actions/workflows/generator.yml/badge.svg
[github-generator-url]: https://github.com/idNoRD/generator-jhipster-yellowbricks/actions/workflows/generator.yml
