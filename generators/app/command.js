import { asCommand } from 'generator-jhipster';

export default asCommand({
  configs: {
    use: {
      description: 'Bricks to activate (e.g. --use angular-contextpath --use spring-boot-contextpath)',
      cli: { type: Array },
      scope: 'blueprint',
    },
  },
});
