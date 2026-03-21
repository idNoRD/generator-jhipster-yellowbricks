import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { join } from 'node:path';

import BaseApplicationGenerator from 'generator-jhipster/generators/base-application';
import stripJsonComments from 'strip-json-comments';

const require = createRequire(import.meta.url);

const REQUIRED_JHIPSTER_VERSION = '9.0.0';

const KNOWN_BRICKS = new Set([
  'generator-jhipster-yellowbricks-angular-contextpath',
  'generator-jhipster-yellowbricks-spring-boot-contextpath',
  'generator-jhipster-yellowbricks-client-contextpath',
  'generator-jhipster-yellowbricks-angular-relativepathresource',
  'generator-jhipster-yellowbricks-client-relativepathresource',
]);

const PREFIX = 'generator-jhipster-yellowbricks-';

function getGen(pkgName) {
  const withoutPrefix = pkgName.slice(PREFIX.length);
  return withoutPrefix.slice(0, withoutPrefix.lastIndexOf('-'));
}

export default class extends BaseApplicationGenerator {
  constructor(args, opts, features) {
    const { version } = require('../../package.json');
    console.log('');
    console.log('========================================');
    console.log(`  YellowBricks blueprint v${version}`);
    console.log(`  Requires JHipster ${REQUIRED_JHIPSTER_VERSION}+`);
    console.log('========================================');
    console.log('');
    super(args, opts, { ...features, sbsBlueprint: true });

    if (!('getContextMap' in this.env)) {
      throw new Error(
        `JHipster ${REQUIRED_JHIPSTER_VERSION} or later is required.\n` +
          `  Run: npm install -g generator-jhipster@${REQUIRED_JHIPSTER_VERSION}`,
      );
    }
  }

  get [BaseApplicationGenerator.COMPOSING]() {
    return this.asComposingTaskGroup({
      async composeBricks() {
        let useList = this.blueprintConfig.use ?? [];

        const jsoncPath = join(this.destinationRoot(), '.yellowbricks.jsonc');
        try {
          const raw = await readFile(jsoncPath, 'utf8');
          console.log('[yellowbricks] reading config from .yellowbricks.jsonc');

          let parsed;
          try {
            // strip-json-comments removes // and /* */ but leaves trailing commas — strip those too
            parsed = JSON.parse(stripJsonComments(raw).replace(/,(?=\s*[}\]])/g, ''));
          } catch (e) {
            console.error(`[yellowbricks] failed to parse .yellowbricks.jsonc: ${e.message}`);
            parsed = {};
          }

          if (Array.isArray(parsed.use)) {
            useList = parsed.use;
            console.log(`[yellowbricks] found ${useList.length} brick(s) to activate`);
          }

          // Merge brick configs into .yo-rc.json so child generators can read them
          const yorcPath = this.destinationPath('.yo-rc.json');
          const yorc = this.fs.readJSON(yorcPath) ?? {};

          for (const [key, value] of Object.entries(parsed)) {
            if (key === 'use') continue;
            yorc[key] = { ...yorc[key], ...value };
          }

          this.fs.writeJSON(yorcPath, yorc);
        } catch (e) {
          if (e.code === 'ENOENT') {
            console.log('[yellowbricks] no .yellowbricks.jsonc found, falling back to .yo-rc.json');
          } else {
            console.error(`[yellowbricks] error reading .yellowbricks.jsonc: ${e.message}`);
          }
        }

        const requested = useList.map(b => b.trim()).filter(Boolean);

        for (const pkgName of requested) {
          const gen = getGen(pkgName);
          if (!KNOWN_BRICKS.has(pkgName)) {
            console.log(`[yellowbricks] unofficial brick "${pkgName}", trying to run for generator=${gen}`);
          }
          try {
            const resolved = require.resolve(`${pkgName}/generators/${gen}`);
            await this.composeWith(resolved);
            console.log(`[yellowbricks] activated brick: ${pkgName}`);
          } catch {
            console.error(
              `[yellowbricks] could not load brick "${pkgName}" — check it is installed and has a generators/${gen} entry point`,
            );
          }
        }
      },
    });
  }
}
