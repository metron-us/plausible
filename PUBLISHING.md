# Publishing to JSR

This document outlines the process for publishing `@metron/plausible` to JSR (JavaScript Registry).

## Prerequisites

### 1. JSR Account

- Create an account at [jsr.io](https://jsr.io)
- The `@metron` scope must be available or you must be a member of it

### 2. Local Setup

- Git repository initialized with committed changes
- All tests passing
- No uncommitted changes (or use `--allow-dirty` flag)

## Pre-Publishing Checklist

Before publishing, ensure all of the following are complete:

- [ ] All tests pass: `deno task test`
- [ ] Type checking passes: `deno task check`
- [ ] Linting passes: `deno task lint`
- [ ] Code is formatted: `deno task fmt`
- [ ] Version number updated in `deno.json`
- [ ] CHANGELOG updated (if applicable)
- [ ] README is up to date
- [ ] All changes are committed to git
- [ ] Dry-run succeeds: `deno task publish:check`

## Version Numbering

This project follows [Semantic Versioning](https://semver.org/):

- **MAJOR** version for incompatible API changes
- **MINOR** version for new functionality in a backward-compatible manner
- **PATCH** version for backward-compatible bug fixes

Update the `version` field in `deno.json` before publishing.

## Publishing Steps

### Option 1: Local Publishing

1. **Update version number** in `deno.json`:
   ```json
   {
     "version": "0.2.0"
   }
   ```

2. **Run pre-publish checks**:
   ```bash
   deno task test
   deno task check
   deno task lint
   deno task publish:check
   ```

3. **Commit changes**:
   ```bash
   git add deno.json
   git commit -m "chore: bump version to 0.2.0"
   git tag v0.2.0
   ```

4. **Publish to JSR**:
   ```bash
   deno publish
   ```

5. **Follow authentication prompts**:
   - Your browser will open automatically
   - Log in to JSR if needed
   - Grant permission to publish `@metron/plausible`
   - Click "Allow"

6. **Push tags and changes**:
   ```bash
   git push origin main
   git push origin v0.2.0
   ```

### Option 2: GitHub Actions (Recommended for CI/CD)

1. **Link package to GitHub repository**:
   - Go to [jsr.io](https://jsr.io)
   - Navigate to your package settings
   - Link the GitHub repository

2. **Create `.github/workflows/publish.yml`**:
   ```yaml
   name: Publish to JSR

   on:
     push:
       tags:
         - "v*"

   permissions:
     contents: read
     id-token: write

   jobs:
     publish:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v4

         - uses: denoland/setup-deno@v1
           with:
             deno-version: v1.x

         - name: Run tests
           run: deno task test

         - name: Type check
           run: deno task check

         - name: Lint
           run: deno task lint

         - name: Publish to JSR
           run: deno publish
   ```

3. **Tag and push**:
   ```bash
   git tag v0.2.0
   git push origin v0.2.0
   ```

4. GitHub Actions will automatically publish the package

## Troubleshooting

### Slow Types Error

If you encounter "slow types" errors, you have two options:

1. **Fix the types** (recommended): Refactor to use explicit types
2. **Allow slow types** (temporary): Add `--allow-slow-types` flag
   ```bash
   deno publish --allow-slow-types
   ```

### Uncommitted Changes

If you have uncommitted changes and want to publish anyway:

```bash
deno publish --allow-dirty
```

**Note**: This is not recommended for production releases.

### Excluded Module Errors

If files are being excluded incorrectly:

1. Check `.gitignore` - files listed there are excluded by default
2. Update `publish.exclude` in `deno.json` to override
3. Ensure all source files are committed to git

## Post-Publishing

After successful publication:

1. **Verify on JSR**:
   - Visit `https://jsr.io/@metron/plausible`
   - Check documentation is rendering correctly
   - Test installation in a sample project

2. **Update NPM** (if dual-publishing):
   - Build NPM package with `@deno/dnt`
   - Publish to NPM registry

3. **Announce** the new version:
   - GitHub releases
   - Social media (if applicable)
   - Documentation updates

## Useful Commands

```bash
# Check what will be published
deno task publish:check

# Publish (full process)
deno publish

# Publish with dirty working directory
deno publish --allow-dirty

# Publish allowing slow types
deno publish --allow-slow-types
```

## Additional Resources

- [JSR Publishing Docs](https://jsr.io/docs/publishing-packages)
- [Deno Publish CLI](https://docs.deno.com/runtime/reference/cli/publish/)
- [Semantic Versioning](https://semver.org/)
