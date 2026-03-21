# Development

## Prerequisites

- Node.js `^22.18.0 || >=24.11.0`
- JHipster 9 (`npm install -g generator-jhipster@9.0.0`)

## Setup

```bash
npm install
```

## Running tests

```bash
npm test
```

This runs Prettier, ESLint, and Vitest in sequence. To run only tests:

```bash
npm run vitest
```

To update snapshots after intentional output changes:

```bash
npm run update-snapshot
```

## Testing locally against a real JHipster project

### 1. Link this package and all bricks globally

From the root of this repository:

```bash
npm link
```

This also installs all brick dependencies. To make them discoverable globally you may also need to link each brick:

```bash
npm link generator-jhipster-yellowbricks-angular-contextpath
npm link generator-jhipster-yellowbricks-spring-boot-contextpath
npm link generator-jhipster-yellowbricks-client-contextpath
npm link generator-jhipster-yellowbricks-angular-relativepathresource
npm link generator-jhipster-yellowbricks-client-relativepathresource
```

### 2. Generate a JHipster app with the blueprint

```bash
mkdir /tmp/test-app && cd /tmp/test-app
cat > .yellowbricks.jsonc << 'EOF'
{
  // Order matters — bricks are activated in the order listed
  "use": [
    "generator-jhipster-yellowbricks-angular-contextpath",
    "generator-jhipster-yellowbricks-spring-boot-contextpath",
    "generator-jhipster-yellowbricks-client-contextpath",
    "generator-jhipster-yellowbricks-angular-relativepathresource",
    "generator-jhipster-yellowbricks-client-relativepathresource",
    // "generator-jhipster-yellowbricks-vue-relativepathresource",  // uncomment vue but don't forget to comment -angular-
  ],

  // Configuration for bricks that need it:
  // Keep contextPath the same across all context path bricks
  "generator-jhipster-yellowbricks-angular-contextpath": { "contextPath": "/jh/" },
  "generator-jhipster-yellowbricks-spring-boot-contextpath": { "contextPath": "/jh/" },
  "generator-jhipster-yellowbricks-client-contextpath": { "contextPath": "/jh/" }
}
EOF
jhipster --blueprints yellowbricks
```

### 3. Unlink when done

```bash
npm unlink -g generator-jhipster-yellowbricks
```

## Releasing to npm

Releases are fully automated via **semantic-release**. There is no manual version bump or `npm publish` step.

### How it works

Every push to `main` triggers the `Release` GitHub Actions workflow. semantic-release inspects the commit messages since the last release and, if there are releasable commits, it:

1. Determines the next version (patch / minor / major)
2. Updates `package.json`
3. Commits the version bump (`chore(release): x.y.z [skip ci]`)
4. Creates a git tag and a GitHub release with generated release notes

The `Publish Package` workflow then publishes to npm via OIDC (no stored secrets).

If there are no releasable commits, nothing happens.

### Commit message convention

semantic-release uses [Conventional Commits](https://www.conventionalcommits.org/) to determine the version bump:

| Commit prefix      | Example                            | Version bump |
| ------------------ | ---------------------------------- | ------------ |
| `fix:`             | `fix: handle unknown brick name`   | patch        |
| `feat:`            | `feat: add new brick to BRICK_MAP` | minor        |
| `BREAKING CHANGE:` | `feat!: rename bricks option`      | major        |

Commits with other prefixes (`chore:`, `docs:`, `test:`, etc.) do not trigger a release.

Emoji prefixes are supported (e.g. `🐞 fix: ...`, `✨ feat: ...`).

### One-time setup on npmjs.com

Before the first automated publish, configure a Trusted Publisher on npmjs.com so npm accepts the OIDC token from GitHub Actions (no stored secret needed):

1. Go to **npmjs.com → your package → Settings → Trusted Publishers**
2. Add GitHub Actions:
   - Owner: `<your github name/org>`
   - Repository: `generator-jhipster-yellowbricks`
   - Workflow: `publish.yml`
