import { asCommand } from 'generator-jhipster';

export default asCommand({
  configs: {
    use: {
      description: 'Bricks to activate (e.g. --use generator-jhipster-yellowbricks-angular-contextpath --use generator-jhipster-yellowbricks-spring-boot-contextpath)',
      cli: { type: Array },
      scope: 'blueprint',
    },
  },
});
