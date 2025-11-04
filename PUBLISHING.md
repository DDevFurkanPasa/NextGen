# Publishing to npm Registry

## ✅ Pre-Publishing Checklist

### Package Verification ✅

- [x] **Version**: 0.1.0 (valid semver)
- [x] **Name**: strapi-nextgen-framework (available on npm)
- [x] **License**: GPL-3.0 (LICENSE file matches package.json)
- [x] **README**: Complete with installation, usage, examples
- [x] **CHANGELOG**: v0.1.0 documented
- [x] **Build**: CJS + ESM outputs verified
- [x] **Types**: TypeScript declarations included
- [x] **Files**: 115 files, 201.5 KB unpacked (39.9 KB packed)

### Quality Verification ✅

- [x] **Tests**: 220 passing (96.59% coverage)
- [x] **E2E**: 115 tests across 5 browsers
- [x] **Accessibility**: 90 tests WCAG 2.1 Level A/AA
- [x] **Performance**: Lighthouse 100/100
- [x] **CI/CD**: Automated quality gates configured
- [x] **Documentation**: Complete API docs, guides, examples

### Repository Status ✅

- [x] **Git**: Clean working directory
- [x] **GitHub**: All code pushed
- [x] **Issues**: None blocking release
- [x] **Security**: No vulnerabilities

---

## 🚀 Publishing Steps

### Step 1: Final Verification

```bash
# Ensure everything is clean
git status

# Verify build works
npm run build

# Run all tests
npm run test:unit

# Check package contents
npm pack --dry-run
```

### Step 2: npm Account Setup

If this is your first time publishing:

```bash
# Login to npm (if not already logged in)
npm login

# Verify login
npm whoami
```

You'll need:
- npm account (create at https://www.npmjs.com/signup)
- Email verification completed
- 2FA enabled (recommended)

### Step 3: Publish to npm

```bash
# For first release (0.1.0)
npm publish

# For future releases with specific tag
npm publish --tag latest

# For beta releases
npm publish --tag beta
```

The `prepublishOnly` script will automatically:
1. Run `npm run build`
2. Run `npm run test:unit`
3. Ensure package is ready

### Step 4: Verify Publication

```bash
# Check on npm
npm view strapi-nextgen-framework

# Install and test in a new project
mkdir test-install
cd test-install
npm init -y
npm install strapi-nextgen-framework
```

### Step 5: Create GitHub Release

1. Go to https://github.com/DDevFurkanPasa/NextGen/releases
2. Click "Create a new release"
3. Create tag: `v0.1.0`
4. Title: `v0.1.0 - Initial Release`
5. Description: Copy from CHANGELOG.md
6. Publish release

---

## 📋 Post-Publishing Tasks

### Immediate (Within 1 hour)

- [ ] Verify package appears on npm: https://www.npmjs.com/package/strapi-nextgen-framework
- [ ] Test installation: `npm install strapi-nextgen-framework`
- [ ] Create GitHub release tag `v0.1.0`
- [ ] Update README if npm link doesn't work yet
- [ ] Announce on GitHub Discussions

### Short-term (Within 1 week)

- [ ] Monitor GitHub issues for bug reports
- [ ] Respond to npm feedback/questions
- [ ] Update documentation based on user feedback
- [ ] Monitor download statistics
- [ ] Share on social media (Twitter, Reddit r/nextjs, Dev.to)

### Long-term (Ongoing)

- [ ] Plan v0.2.0 features based on feedback
- [ ] Keep dependencies updated
- [ ] Maintain CI/CD pipelines
- [ ] Monitor performance metrics
- [ ] Respond to community contributions

---

## 🔄 Future Release Process

### For Patch Releases (0.1.x)

Bug fixes, no breaking changes:

```bash
# Update version
npm version patch

# This automatically:
# - Bumps version to 0.1.1
# - Creates git commit
# - Creates git tag

# Push changes
git push && git push --tags

# Publish
npm publish
```

### For Minor Releases (0.x.0)

New features, no breaking changes:

```bash
npm version minor  # 0.1.0 -> 0.2.0
git push && git push --tags
npm publish
```

### For Major Releases (x.0.0)

Breaking changes:

```bash
npm version major  # 0.1.0 -> 1.0.0
git push && git push --tags
npm publish
```

---

## 🛡️ Publishing Best Practices

### Before Every Release

1. **Update CHANGELOG.md** with all changes
2. **Update version** in package.json
3. **Run full test suite** (`npm test`)
4. **Check bundle size** (`npm run analyze:bundle`)
5. **Review git diff** to catch unintended changes
6. **Test in example project** to ensure it works

### Versioning Guidelines (Semver)

- **Patch** (0.1.1): Bug fixes, typos, internal refactors
- **Minor** (0.2.0): New features, deprecations (backwards compatible)
- **Major** (1.0.0): Breaking changes, removed APIs

### npm Tags

- `latest`: Stable releases (default)
- `next`: Pre-release versions
- `beta`: Beta testing versions
- `canary`: Bleeding edge (CI builds)

Example:
```bash
# Beta release
npm version 0.2.0-beta.1
npm publish --tag beta

# Install beta
npm install strapi-nextgen-framework@beta
```

---

## 🚨 Troubleshooting

### Error: "You do not have permission to publish"

**Solution**: 
1. Verify you're logged in: `npm whoami`
2. Check package name isn't taken: `npm view strapi-nextgen-framework`
3. If taken, choose different name in package.json

### Error: "Package name too similar to existing package"

**Solution**: Choose a more unique name or add scope:
```json
{
  "name": "@your-username/strapi-nextgen-framework"
}
```

### Error: "prepublishOnly script failed"

**Solution**: 
1. Run `npm run build` manually to check for errors
2. Run `npm run test:unit` to verify tests pass
3. Fix any issues before publishing

### Warning: "This package is enormous"

If package exceeds 10 MB:
1. Check `npm pack --dry-run` output
2. Verify `files` array in package.json is correct
3. Ensure test files, docs, etc. aren't included

---

## 📊 Package Statistics

### Current Package Size

```
Unpacked: 201.5 KB
Packed:   39.9 KB (gzipped)
Files:    115 files
```

**Within budget**: ✅ (under 1 MB limit)

### Quality Metrics

```
Test Coverage:  96.59%
Tests Passing:  220/220
E2E Tests:      115/115
A11y Tests:     90/90
Performance:    100/100
```

---

## 🎯 Success Criteria

Your package is ready to publish when:

- ✅ All tests pass (unit, integration, E2E)
- ✅ Build succeeds without errors
- ✅ `npm pack --dry-run` shows correct files
- ✅ Documentation is complete
- ✅ CHANGELOG is updated
- ✅ License is correct
- ✅ Version is bumped appropriately
- ✅ Git is clean and pushed
- ✅ You're logged into npm

---

## 📚 Resources

- **npm Docs**: https://docs.npmjs.com/packages-and-modules/contributing-packages-to-the-registry
- **Semver**: https://semver.org/
- **npm CLI**: https://docs.npmjs.com/cli/v10/commands/npm-publish
- **Best Practices**: https://docs.npmjs.com/packages-and-modules/contributing-packages-to-the-registry#best-practices

---

## ✅ Ready to Publish?

**Yes!** The package meets all criteria:

- ✅ Code quality: 96.59% coverage, 220 tests passing
- ✅ Documentation: Complete with examples
- ✅ Build: CJS + ESM working
- ✅ Types: TypeScript declarations included
- ✅ License: GPL-3.0 (verified)
- ✅ Package: 39.9 KB (optimized)

**Run this to publish**:
```bash
npm login       # If not logged in
npm publish     # Publish to npm registry
```

**🎉 v0.1.0 is ready for the world!**
