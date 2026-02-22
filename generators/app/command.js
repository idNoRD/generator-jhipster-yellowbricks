import { asCommand } from 'generator-jhipster';

export default asCommand({
  configs: {
    bricks: {
      description: 'Comma-separated list of bricks to activate (e.g. angular-contextpath,spring-boot-contextpath)',
      cli: { type: String },
      scope: 'blueprint',
    },
  },
});
