# Complete Testing Guide

This document provides a comprehensive overview of all testing implemented in the Senate Way Guesthouse application.

## Testing Overview

The project implements a comprehensive testing strategy covering:

- **Unit Testing** - Individual component and function tests
- **Integration Testing** - Component interaction tests
- **Functional Testing** - User story validation
- **Regression Testing** - Critical path verification
- **Performance Testing** - Web vitals and performance metrics
- **Security Testing** - Vulnerability scanning and validation
- **Accessibility Testing** - WCAG compliance
- **CI/CD Testing** - Automated testing in GitHub Actions

## Test Structure

```
__tests__/
├── integration/          # Integration tests
│   ├── navigation.test.tsx
│   └── form-submission.test.tsx
├── functional/          # Functional/user story tests
│   └── user-stories.test.tsx
├── regression/         # Regression tests
│   └── critical-path.test.tsx
├── accessibility/      # A11y tests
│   └── a11y.test.tsx
├── performance/       # Performance tests
│   └── web-vitals.test.ts
└── security/          # Security tests
    └── security.test.ts

docs/testing/          # Testing documentation
├── TEST_REPORT_TEMPLATE.md
└── ACCEPTANCE_CRITERIA.md
```

## Running Tests

### All Tests
```bash
npm run test:all
```

### Specific Test Types
```bash
# Unit tests
npm test

# Integration tests
npm run test:integration

# Functional tests
npm run test:functional

# Regression tests
npm run test:regression

# Performance tests
npm run test:performance

# Security audit
npm run test:security

# Accessibility tests (requires server running)
npm run dev  # In one terminal
npm run test:a11y  # In another terminal
```

### Coverage Report
```bash
npm run test:coverage
```

## Test Coverage Goals

| Test Type | Target Coverage |
|-----------|----------------|
| Unit Tests | 90%+ |
| Integration | 70%+ |
| Functional | 100% of user stories |
| Regression | All critical paths |
| Security | 100% of checks |
| Accessibility | WCAG 2.1 AA |

## CI/CD Pipeline

The GitHub Actions workflow (`.github/workflows/ci.yml`) runs:

1. **Lint Check** - Code quality
2. **Unit Tests** - Fast feedback
3. **Integration Tests** - Component interactions
4. **Functional Tests** - User stories
5. **Regression Tests** - Critical paths
6. **Security Audit** - Vulnerability scan
7. **Build Verification** - Production build
8. **Performance Tests** - Web vitals

Triggered on:
- Every push to main/develop
- Pull requests
- Daily scheduled runs

## Test Documentation

### Test Reports
- Template: `docs/testing/TEST_REPORT_TEMPLATE.md`
- Generate reports after each test run
- Include in Portfolio of Evidence (PoE)

### Acceptance Criteria
- Document: `docs/testing/ACCEPTANCE_CRITERIA.md`
- Maps user stories to test cases
- Used for client sign-off

## Security Testing

### Automated Checks
- `npm audit` - Dependency vulnerabilities
- ESLint security plugin - Code security issues
- Snyk (optional) - Advanced vulnerability scanning

### Manual Checks
- Input sanitization
- XSS prevention
- Secure configuration
- Sensitive data handling

## Accessibility Testing

### Automated
- Basic structure validation
- Semantic HTML checks
- ARIA label verification

### Tools
- `pa11y` - CLI accessibility testing
- `@axe-core/react` - React component testing
- Lighthouse - Full accessibility audit

## Performance Testing

### Metrics Tracked
- **FCP** (First Contentful Paint) - Target: < 1.8s
- **LCP** (Largest Contentful Paint) - Target: < 2.5s
- **CLS** (Cumulative Layout Shift) - Target: < 0.1
- **TTI** (Time to Interactive) - Target: < 3.8s

### Tools
- Web Vitals API
- Lighthouse CI
- Bundle analyzer

## Real-World Testing

### Network Conditions
- Slow 3G simulation
- Offline behavior
- Intermittent connectivity

### Device Testing
- Desktop browsers
- Mobile devices
- Tablets

## Test Execution Checklist

Before release:
- [ ] All unit tests pass
- [ ] Integration tests pass
- [ ] Functional tests validate all user stories
- [ ] Regression tests verify critical paths
- [ ] Security audit passes
- [ ] Performance metrics meet targets
- [ ] Accessibility tests pass
- [ ] Build succeeds
- [ ] Documentation updated

## Reporting Issues

When tests fail:
1. Document the failure in test report
2. Create GitHub issue with:
   - Test name and location
   - Expected vs actual behavior
   - Steps to reproduce
   - Environment details
3. Fix and verify
4. Update test documentation

## Additional Resources

- **TDD Guide**: `TDD_GUIDE.md` - Test-Driven Development approach
- **Step-by-Step**: `TDD_STEP_BY_STEP.md` - Detailed TDD instructions
- **Quick Start**: `QUICK_START_TESTING.md` - Quick reference
- **Strategy**: `TESTING_STRATEGY.md` - Complete testing strategy


