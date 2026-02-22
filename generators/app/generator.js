import { createRequire } from 'node:module';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

import BaseApplicationGenerator from 'generator-jhipster/generators/base-application';
import stripJsonComments from 'strip-json-comments';

const require = createRequire(import.meta.url);

const BRICK_MAP = {
  'generator-jhipster-yellowbricks-angular-contextpath': { gen: 'angular' },
  'generator-jhipster-yellowbricks-spring-boot-contextpath': { gen: 'spring-boot' },
  'generator-jhipster-yellowbricks-client-contextpath': { gen: 'client' },
  'generator-jhipster-yellowbricks-angular-relativepathresource': { gen: 'angular' },
  'generator-jhipster-yellowbricks-client-relativepathresource': { gen: 'client' },
};

export default class extends BaseApplicationGenerator {
  constructor(args, opts, features) {
    super(args, opts, { ...features, sbsBlueprint: true });
  }

  get [BaseApplicationGenerator.COMPOSING]() {
    return this.asComposingTaskGroup({
      async composeBricks() {
        let useList = this.blueprintConfig.use ?? [];

        try {
          const raw = await readFile(join(this.destinationRoot(), '.yellowbricks.jsonc'), 'utf8');
          const parsed = JSON.parse(stripJsonComments(raw));

          if (Array.isArray(parsed.use)) {
            useList = parsed.use;
          }

          // Merge brick configs into .yo-rc.json so child generators can read them
          const yorcPath = this.destinationPath('.yo-rc.json');
          const yorc = this.fs.readJSON(yorcPath) ?? {};

          for (const [key, value] of Object.entries(parsed)) {
            if (key === 'use') continue;
            yorc[key] = { ...yorc[key], ...value };
          }

          this.fs.writeJSON(yorcPath, yorc);
        } catch {
          // file absent or unreadable — fall back to .yo-rc.json
        }

        const requested = useList.map(b => b.trim()).filter(Boolean);

        for (const pkgName of requested) {
          const brick = BRICK_MAP[pkgName];
          if (!brick) {
            this.log.warn(`[yellowbricks] unknown brick "${pkgName}"`);
            continue;
          }
          const resolved = require.resolve(`${pkgName}/generators/${brick.gen}`);
          await this.composeWith(resolved);
          this.log.info(`[yellowbricks] activated brick: ${pkgName}`);
        }
      },
    });
  }
}
