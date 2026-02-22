import { createRequire } from 'node:module';

import BaseApplicationGenerator from 'generator-jhipster/generators/base-application';

const require = createRequire(import.meta.url);

const BRICK_MAP = {
  'angular-contextpath': {
    pkg: 'generator-jhipster-yellowbricks-angular-contextpath',
    gen: 'angular',
  },
  'spring-boot-contextpath': {
    pkg: 'generator-jhipster-yellowbricks-spring-boot-contextpath',
    gen: 'spring-boot',
  },
  'client-contextpath': {
    pkg: 'generator-jhipster-yellowbricks-client-contextpath',
    gen: 'client',
  },
  'angular-relativepathresource': {
    pkg: 'generator-jhipster-yellowbricks-angular-relativepathresource',
    gen: 'angular',
  },
  'client-relativepathresource': {
    pkg: 'generator-jhipster-yellowbricks-client-relativepathresource',
    gen: 'client',
  },
};

export default class extends BaseApplicationGenerator {
  constructor(args, opts, features) {
    super(args, opts, { ...features, sbsBlueprint: true });
  }

  get [BaseApplicationGenerator.COMPOSING]() {
    return this.asComposingTaskGroup({
      async composeBricks() {
        const requested = (this.blueprintConfig.bricks ?? '')
          .split(',')
          .map(b => b.trim())
          .filter(Boolean);

        for (const brickName of requested) {
          const brick = BRICK_MAP[brickName];
          if (!brick) {
            this.log.warn(`[yellowbricks] unknown brick "${brickName}"`);
            continue;
          }
          const resolved = require.resolve(`${brick.pkg}/generators/${brick.gen}`);
          await this.composeWith(resolved);
          this.log.info(`[yellowbricks] activated brick: ${brickName}`);
        }
      },
    });
  }
}
