import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { join } from 'node:path';

import BaseApplicationGenerator from 'generator-jhipster/generators/base-application';
import stripJsonComments from 'strip-json-comments';

const require = createRequire(import.meta.url);

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
    super(args, opts, { ...features, sbsBlueprint: true });
  }

  get [BaseApplicationGenerator.COMPOSING]() {
    return this.asComposingTaskGroup({
      async composeBricks() {
        this.log.info('');
        this.log.info('========================================');
        this.log.info('        YellowBricks blueprint          ');
        this.log.info('========================================');
        this.log.info('');

        let useList = this.blueprintConfig.use ?? [];

        const jsoncPath = join(this.destinationRoot(), '.yellowbricks.jsonc');
        try {
          const raw = await readFile(jsoncPath, 'utf8');
          this.log.info('[yellowbricks] reading config from .yellowbricks.jsonc');

          let parsed;
          try {
            // strip-json-comments removes // and /* */ but leaves trailing commas — strip those too
            parsed = JSON.parse(stripJsonComments(raw).replace(/,(?=\s*[}\]])/g, ''));
          } catch (e) {
            this.log.error(`[yellowbricks] failed to parse .yellowbricks.jsonc: ${e.message}`);
            parsed = {};
          }

          if (Array.isArray(parsed.use)) {
            useList = parsed.use;
            this.log.info(`[yellowbricks] found ${useList.length} brick(s) to activate`);
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
            this.log.info('[yellowbricks] no .yellowbricks.jsonc found, falling back to .yo-rc.json');
          } else {
            this.log.error(`[yellowbricks] error reading .yellowbricks.jsonc: ${e.message}`);
          }
        }

        const requested = useList.map(b => b.trim()).filter(Boolean);

        for (const pkgName of requested) {
          const gen = getGen(pkgName);
          if (!KNOWN_BRICKS.has(pkgName)) {
            this.log.info(`[yellowbricks] unofficial brick "${pkgName}", trying to run for generator=${gen}`);
          }
          try {
            const resolved = require.resolve(`${pkgName}/generators/${gen}`);
            await this.composeWith(resolved);
            this.log.info(`[yellowbricks] activated brick: ${pkgName}`);
          } catch {
            this.log.error(
              `[yellowbricks] could not load brick "${pkgName}" — check it is installed and has a generators/${gen} entry point`,
            );
          }
        }
      },
    });
  }
}
