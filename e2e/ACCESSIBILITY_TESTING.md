# Accessibility Testing Guide

## Overview

Automated accessibility testing using **axe-core** to ensure WCAG 2.1 Level A and AA compliance. Helps make your application usable by everyone, including people with disabilities.

## Quick Start

### Run Accessibility Tests

```bash
npm run test:e2e:a11y
```

### Debug Accessibility Tests

```bash
npm run test:e2e:a11y:debug
```

## Test Coverage

### ✅ 90 Accessibility Tests Created

#### 1. **Page-Level WCAG Scans** (6 tests × 5 browsers = 30 tests)
- Home page
- Test page
- Gallery page
- Blog page
- Error page
- Empty state page

#### 2. **Keyboard Navigation** (2 tests × 5 browsers = 10 tests)
- Tab navigation functionality
- Keyboard-accessible controls

#### 3. **ARIA Labels** (2 tests × 5 browsers = 10 tests)
- Image alt text verification
- Button accessible names

#### 4. **Color Contrast** (1 test × 5 browsers = 5 tests)
- WCAG AA contrast ratios (4.5:1 minimum)

#### 5. **Semantic HTML** (2 tests × 5 browsers = 10 tests)
- HTML landmarks (main, nav, header, footer)
- Heading hierarchy (h1 → h2 → h3)

#### 6. **Focus Management** (1 test × 5 browsers = 5 tests)
- Visible focus indicators

#### 7. **Mobile Accessibility** (2 tests × 5 browsers = 10 tests)
- Mobile viewport WCAG compliance
- Touch target sizes (44×44px minimum)

#### 8. **Screen Reader** (2 tests × 5 browsers = 10 tests)
- Page titles
- Language attributes

### Browser Coverage
- ✅ Chromium (Desktop Chrome)
- ✅ Firefox
- ✅ WebKit (Safari)
- ✅ Mobile Chrome (Pixel 5)
- ✅ Mobile Safari (iPhone 12)

## WCAG Compliance

### Standards Tested
- ✅ **WCAG 2.1 Level A** - Basic accessibility
- ✅ **WCAG 2.1 Level AA** - Enhanced accessibility (recommended)

### Common Issues Detected

#### 🔴 Critical
- Missing alt text on images
- Insufficient color contrast
- Missing form labels
- Keyboard traps
- Missing page titles

#### 🟡 Moderate
- Improper heading hierarchy
- Missing ARIA labels
- Small touch targets (< 44×44px)
- Missing landmarks

#### 🟢 Best Practices
- Redundant ARIA
- Suboptimal focus order
- Missing skip links

## Configuration

### Test Example

```typescript
const accessibilityScanResults = await new AxeBuilder({ page })
  .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
  .analyze();

expect(accessibilityScanResults.violations).toEqual([]);
```

### Customize Rules

```typescript
// Test specific areas
const results = await new AxeBuilder({ page })
  .include('#main-content')
  .exclude('.third-party-widget')
  .analyze();

// Disable specific rules temporarily
const results = await new AxeBuilder({ page })
  .disableRules(['color-contrast'])
  .analyze();
```

## Common Fixes

### 1. Missing Alt Text

**❌ Bad:**
```tsx
<img src="/image.jpg" />
```

**✅ Good:**
```tsx
<img src="/image.jpg" alt="Description of image" />
```

### 2. Color Contrast

**❌ Bad:**
```css
color: #999; /* Light gray on white - 2.8:1 */
```

**✅ Good:**
```css
color: #666; /* Darker gray on white - 5.7:1 */
```

### 3. Form Labels

**❌ Bad:**
```tsx
<input type="text" placeholder="Email" />
```

**✅ Good:**
```tsx
<label htmlFor="email">Email</label>
<input id="email" type="text" />
```

### 4. Keyboard Navigation

**❌ Bad:**
```tsx
<div onClick={handleClick}>Click me</div>
```

**✅ Good:**
```tsx
<button onClick={handleClick}>Click me</button>
```

### 5. Touch Targets

**❌ Bad:**
```tsx
<button className="w-8 h-8">X</button>
```

**✅ Good:**
```tsx
<button className="min-w-[44px] min-h-[44px]">X</button>
```

### 6. Focus Indicators

**❌ Bad:**
```css
button:focus {
  outline: none; /* Removes focus indicator */
}
```

**✅ Good:**
```css
button:focus {
  outline: 2px solid blue;
  outline-offset: 2px;
}
```

## CI/CD Integration

Accessibility tests run automatically in GitHub Actions:

```yaml
# .github/workflows/accessibility.yml
- name: Run accessibility tests
  run: npm run test:e2e:a11y

- name: Upload violations on failure
  if: failure()
  uses: actions/upload-artifact@v4
  with:
    name: accessibility-violations
    path: test-results/
```

## Best Practices

### 1. ✅ Test Early
Run accessibility tests during development, not just before release.

### 2. ✅ Use Semantic HTML
Use proper elements (`<button>`, `<nav>`, `<main>`) instead of `<div>`.

### 3. ✅ Provide Text Alternatives
All non-text content needs text alternatives.

### 4. ✅ Ensure Keyboard Access
All interactive elements must be keyboard accessible.

### 5. ✅ Use Sufficient Contrast
Text must have at least 4.5:1 contrast ratio.

### 6. ✅ Provide Focus Indicators
Visible focus indicators help keyboard users.

### 7. ✅ Test with Real Users
Automated tests catch ~30-40% of issues. Manual testing is essential.

## Tools & Resources

### Browser Extensions
- [axe DevTools](https://www.deque.com/axe/devtools/)
- [WAVE](https://wave.webaim.org/extension/)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)

### Screen Readers
- **NVDA** (Windows) - Free
- **JAWS** (Windows) - Commercial
- **VoiceOver** (macOS/iOS) - Built-in
- **TalkBack** (Android) - Built-in

### Guidelines
- [WCAG 2.1 Quick Reference](https://www.w3.org/WAI/WCAG21/quickref/)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [A11y Project Checklist](https://www.a11yproject.com/checklist/)

## Manual Testing Checklist

- [ ] Keyboard navigation works
- [ ] Screen reader announces content correctly
- [ ] Color contrast is sufficient
- [ ] Forms are properly labeled
- [ ] Images have alt text
- [ ] Videos have captions
- [ ] Focus indicators are visible
- [ ] Heading hierarchy is logical
- [ ] Touch targets are 44×44px minimum

## Troubleshooting

### Tests Pass but Site Isn't Accessible

Automated tests only catch ~30-40% of issues. Always:
1. Test with keyboard navigation
2. Test with screen readers
3. Test with real users with disabilities

### Color Contrast Failures

Use a contrast checker and adjust colors to meet 4.5:1 ratio.

### Touch Target Failures

Ensure all interactive elements are at least 44×44 pixels.

---

**Need help?** Open an issue on [GitHub](https://github.com/DDevFurkanPasa/NextGen/issues)
