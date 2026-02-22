# generator-jhipster-yellowbricks

Yellowbricks Blueprint Ecosystem - A [JHipster](https://www.jhipster.tech/) blueprint that groups other yellowbricks

## Concept
```
  generator-jhipster-yellowbricks          ← "parent" package (aggregator + orchestrator)
  ├── generator-jhipster-yellowbricks-angular-contextpath
  ├── generator-jhipster-yellowbricks-server-contextpath
  └── generator-jhipster-yellowbricks-... etc.
```
### Rules:
  - Every yellowbrick is a standalone jhipster blueprint with npm package and GitHub repo — usable without the "parent" generator-jhipster-yellowbricks
  - The "parent" generator-jhipster-yellowbricks package exists only to group them
  - Each brick has exactly one responsibility


## Prerequisites

- Node.js `^22.18.0 || >=24.11.0`
- JHipster 9

## Installation

```bash
npm install -g generator-jhipster-yellowbricks
```

## Usage

Create a `.yo-rc.json` in your project directory with the desired context path:

```json
{
  "generator-jhipster-yellowbricks-server-contextpath": {
    "contextPath": "/jh/"
  },
  "generator-jhipster-yellowbricks-angular-contextpath": {
    "contextPath": "/jh/"
  },
  "generator-jhipster-yellowbricks-client-contextpath": {
    "contextPath": "/jh/"
  }
}
```

Replace `/jh/` with your actual context path. The trailing slash is required.

Then run JHipster with this blueprint:

```bash
# Standard generator
jhipster --blueprints yellowbricks

# With JDL
jhipster import-jdl your-app.jdl --blueprints yellowbricks --yellowbricks=\
        yellowbricks-server-contextpath,\
        yellowbricks-angular-contextpath,\
        yellowbricks-client-contextpath,\
        yellowbricks-angular-relativepathresource,\
        yellowbricks-client-relativepathresource
```


# How to create a new yellowbrick
All yellowbricks start from `generator-jhipster-yellowbricks-` prefix followed by name of generator and a purpose suffix.   
For example if we need a yellowbrick that changes the angular.json file we need to find a name of corresponding generator in generator-jhipster repository (https://github.com/search?q=repo%3Ajhipster%2Fgenerator-jhipster+angular.json.ejs&type=code)   
As you can see `generators/angular/templates/angular.json.ejs` is located under `generators/angular` folder so the name of generator is `angular`.
And for adding a context path to angular.json the name of yellowbrick would be `generator-jhipster-yellowbricks-` + `angular` + `-contextpath`. Like here https://github.com/idNoRD/generator-jhipster-yellowbricks-angular-contextpath

  - Yellowbricks that modify existing JHipster generators override them with sbsBlueprint: true
    ```
    mkdir generator-jhipster-yellowbricks-<generator>-<purpose>
    cd generator-jhipster-yellowbricks-<generator>-<purpose>
    jhipster generate-blueprint --sub-generators <generator> --all-priorities --defaults --skip-git
    ┌───────────────────────────────────────────────┬────────┐
    │                    Prompt                     │ Answer │
    ├───────────────────────────────────────────────┼────────┤
    │ Is server generator a side-by-side blueprint? │ Y      │
    ├───────────────────────────────────────────────┼────────┤
    │ Is server generator a cli command?            │ N      │
    └───────────────────────────────────────────────┴────────┘
    ```
  - Yellowbricks that add new files override the `app` generator with sbsBlueprint: true
    ```
    jhipster generate-blueprint --sub-generators app --defaults --skip-git
    
    ┌────────────────────────────────────────────┬────────┐
    │                   Prompt                   │ Answer │
    ├────────────────────────────────────────────┼────────┤
    │ Is app generator a side-by-side blueprint? │ Y      │
    ├────────────────────────────────────────────┼────────┤
    │ Is app generator a cli command?            │ N      │
    └────────────────────────────────────────────┴────────┘
    ```
