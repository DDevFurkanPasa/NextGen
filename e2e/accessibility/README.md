# Accessibility Testing

Automated accessibility testing using axe-core to ensure WCAG 2.1 Level A and AA compliance.

## Overview

Accessibility testing helps ensure your application is usable by everyone, including people with disabilities who use assistive technologies like screen readers, keyboard navigation, or voice control.

## Running Tests

### Run All Accessibility Tests

```bash
npm run test:e2e:a11y
```

### Debug Accessibility Tests

```bash
npm run test:e2e:a11y:debug
```

### Run Specific Test

```bash
npx playwright test e2e/accessibility.spec.ts -g "home page"
```

## What We Test

### WCAG Compliance
- ✅ **WCAG 2.1 Level A** - Basic accessibility
- ✅ **WCAG 2.1 Level AA** - Enhanced accessibility (recommended)

### Test Categories

#### 1. **Page-Level Scans** (6 tests)
- Home page
- Test page
- Gallery page
- Blog page
- Error page
- Empty state page

#### 2. **Keyboard Navigation** (2 tests)
- Tab navigation
- Keyboard-accessible controls

#### 3. **ARIA Labels** (2 tests)
- Image alt text
- Button accessible names

#### 4. **Color Contrast** (1 test)
- Text readability
- WCAG AA contrast ratios

#### 5. **Semantic HTML** (2 tests)
- HTML landmarks (main, nav, etc.)
- Heading hierarchy (h1, h2, h3)

#### 6. **Focus Management** (1 test)
- Visible focus indicators
- Focus order

#### 7. **Mobile Accessibility** (2 tests)
- Mobile viewport compliance
- Touch target sizes (44×44px minimum)

#### 8. **Screen Reader** (2 tests)
- Page titles
- Language attributes

**Total**: 18 accessibility tests

## Common Issues Detected

### 🔴 Critical Issues
- Missing alt text on images
- Insufficient color contrast
- Missing form labels
- Keyboard traps
- Missing page titles

### 🟡 Moderate Issues
- Improper heading hierarchy
- Missing ARIA labels
- Small touch targets
- Missing landmarks

### 🟢 Best Practices
- Redundant ARIA
- Suboptimal focus order
- Missing skip links

## Understanding Results

### Violation Format

```typescript
{
  id: 'color-contrast',
  impact: 'serious',
  description: 'Elements must have sufficient color contrast',
  nodes: [
    {
      html: '<p class="text-gray-400">Low contrast text</p>',
      target: ['.text-gray-400'],
      failureSummary: 'Contrast ratio of 2.5:1 (minimum 4.5:1)'
    }
  ]
}
```

### Impact Levels
- **Critical**: Blocks users completely
- **Serious**: Major barrier to accessibility
- **Moderate**: Noticeable difficulty
- **Minor**: Small inconvenience

## Fixing Common Issues

### Missing Alt Text

**❌ Bad:**
```tsx
<img src="/image.jpg" />
```

**✅ Good:**
```tsx
<img src="/image.jpg" alt="Description of image" />
```

### Color Contrast

**❌ Bad:**
```css
.text {
  color: #999; /* Light gray */
  background: #fff; /* White */
  /* Contrast ratio: 2.8:1 - FAILS */
}
```

**✅ Good:**
```css
.text {
  color: #666; /* Darker gray */
  background: #fff; /* White */
  /* Contrast ratio: 5.7:1 - PASSES */
}
```

### Missing Form Labels

**❌ Bad:**
```tsx
<input type="text" placeholder="Email" />
```

**✅ Good:**
```tsx
<label htmlFor="email">Email</label>
<input id="email" type="text" />
```

### Keyboard Navigation

**❌ Bad:**
```tsx
<div onClick={handleClick}>Click me</div>
```

**✅ Good:**
```tsx
<button onClick={handleClick}>Click me</button>
```

### Heading Hierarchy

**❌ Bad:**
```tsx
<h1>Page Title</h1>
<h3>Section</h3> {/* Skipped h2 */}
```

**✅ Good:**
```tsx
<h1>Page Title</h1>
<h2>Section</h2>
<h3>Subsection</h3>
```

## Configuration

### Customize Rules

Test specific rules:

```typescript
const results = await new AxeBuilder({ page })
  .withTags(['wcag2a', 'wcag2aa'])
  .include('#main-content')
  .exclude('.third-party-widget')
  .analyze();
```

### Disable Specific Rules

```typescript
const results = await new AxeBuilder({ page })
  .disableRules(['color-contrast']) // Temporarily disable
  .analyze();
```

### Custom Severity

```typescript
const results = await new AxeBuilder({ page })
  .options({
    rules: {
      'color-contrast': { enabled: true },
    },
  })
  .analyze();
```

## CI/CD Integration

Accessibility tests run automatically in GitHub Actions:

```yaml
- name: Run accessibility tests
  run: npm run test:e2e:a11y

- name: Upload accessibility report
  if: failure()
  uses: actions/upload-artifact@v4
  with:
    name: accessibility-violations
    path: test-results/
```

## Best Practices

### 1. ✅ Test Early and Often
Run accessibility tests during development, not just before release.

### 2. ✅ Test with Real Users
Automated tests catch ~30-40% of issues. Manual testing with assistive technologies is essential.

### 3. ✅ Use Semantic HTML
Use proper HTML elements (`<button>`, `<nav>`, `<main>`) instead of generic `<div>` elements.

### 4. ✅ Provide Text Alternatives
All non-text content needs text alternatives (alt text, captions, transcripts).

### 5. ✅ Ensure Keyboard Access
All interactive elements must be keyboard accessible.

### 6. ✅ Use Sufficient Contrast
Text must have at least 4.5:1 contrast ratio (3:1 for large text).

### 7. ✅ Provide Focus Indicators
Visible focus indicators help keyboard users navigate.

### 8. ✅ Use ARIA Appropriately
Use ARIA to enhance, not replace, semantic HTML.

## Tools & Resources

### Browser Extensions
- [axe DevTools](https://www.deque.com/axe/devtools/) - Chrome/Firefox
- [WAVE](https://wave.webaim.org/extension/) - Chrome/Firefox
- [Lighthouse](https://developers.google.com/web/tools/lighthouse) - Chrome

### Screen Readers
- **NVDA** (Windows) - Free
- **JAWS** (Windows) - Commercial
- **VoiceOver** (macOS/iOS) - Built-in
- **TalkBack** (Android) - Built-in

### Manual Testing Checklist
- [ ] Keyboard navigation works
- [ ] Screen reader announces content correctly
- [ ] Color contrast is sufficient
- [ ] Forms are properly labeled
- [ ] Images have alt text
- [ ] Videos have captions
- [ ] Focus indicators are visible
- [ ] Heading hierarchy is logical

### WCAG Guidelines
- [WCAG 2.1 Quick Reference](https://www.w3.org/WAI/WCAG21/quickref/)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [A11y Project Checklist](https://www.a11yproject.com/checklist/)

## Troubleshooting

### Tests Pass but Site Isn't Accessible

**Cause**: Automated tests only catch ~30-40% of issues

**Solution**: 
1. Manual testing with keyboard
2. Screen reader testing
3. User testing with people with disabilities

### False Positives

**Cause**: axe-core may flag issues that aren't actually problems

**Solution**: Review violations carefully and disable specific rules if needed

### Color Contrast Failures

**Cause**: Insufficient contrast between text and background

**Solution**: Use a contrast checker tool and adjust colors

## Accessibility Statement

Consider adding an accessibility statement to your site:

```markdown
# Accessibility Statement

We are committed to ensuring digital accessibility for people with disabilities. We continually improve the user experience for everyone and apply relevant accessibility standards.

## Conformance Status
This website is partially conformant with WCAG 2.1 Level AA.

## Feedback
We welcome feedback on the accessibility of this site. Please contact us if you encounter accessibility barriers.
```

---

**Need help?** Open an issue on [GitHub](https://github.com/DDevFurkanPasa/NextGen/issues)
