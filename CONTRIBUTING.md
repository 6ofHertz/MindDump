# Contributing to MindDump

Thank you for your interest in contributing to **MindDump**! We welcome contributions from the community to help make this project better.

---

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Branching Model](#branching-model)
- [Submitting Changes](#submitting-changes)
- [Reporting Bugs](#reporting-bugs)
- [Suggesting Features](#suggesting-features)

---

## 📜 Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inclusive experience for everyone. We expect all contributors to:

- Be respectful and considerate
- Accept constructive criticism gracefully
- Focus on what's best for the community
- Show empathy towards others

### Unacceptable Behavior

- Harassment, trolling, or discriminatory comments
- Publishing others' private information
- Other conduct that would be unprofessional

---

## 🤝 How Can I Contribute?

### Reporting Bugs

If you find a bug, please create an issue with:

1. **Clear title** — Descriptive and specific
2. **Steps to reproduce** — Detailed instructions
3. **Expected behavior** — What should happen
4. **Actual behavior** — What actually happens
5. **Screenshots** — If applicable
6. **Environment** — Browser, OS, Node.js version

**Example:**
```
Title: Auto-save fails when entry exceeds 10,000 characters

Steps to reproduce:
1. Write 10,000+ characters in the textarea
2. Wait for auto-save (500ms debounce)
3. Check localStorage

Expected: Draft saves successfully
Actual: localStorage quota exceeded error

Environment: Chrome 120, macOS 14.1, Node.js 20.10
```

### Suggesting Features

We welcome feature suggestions! Please:

1. **Check existing issues** — Avoid duplicates
2. **Align with project philosophy** — MindDump should remain minimal and distraction-free
3. **Provide context** — Explain the problem your feature solves
4. **Consider alternatives** — What other solutions did you consider?

**Note:** Features that add complexity or distract from pure writing may not align with MindDump's core philosophy.

### Writing Code

You can contribute code for:

- Bug fixes
- Performance improvements
- Documentation updates
- UI/UX enhancements (that maintain simplicity)
- Accessibility improvements
- Test coverage

---

## 🔧 Development Workflow

### 1. Fork the Repository

Click the **Fork** button on GitHub to create your own copy.

### 2. Clone Your Fork

```bash
git clone https://github.com/YOUR_USERNAME/minddump.git
cd minddump
```

### 3. Create a Branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/bug-description
```

### 4. Install Dependencies

```bash
npm install
# or
bun install
```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your changes live.

### 6. Make Your Changes

- Write clean, readable code
- Follow the coding standards below
- Test your changes thoroughly
- Update documentation if needed

### 7. Test Your Changes

```bash
# Run linter
npm run lint

# Build for production (ensure no errors)
npm run build
```

### 8. Commit Your Changes

```bash
git add .
git commit -m "feat: add dark mode toggle button"
```

See [Commit Message Guidelines](#commit-message-guidelines) below.

### 9. Push to Your Fork

```bash
git push origin feature/your-feature-name
```

### 10. Open a Pull Request

Go to the original repository and click **New Pull Request**.

---

## 🎨 Coding Standards

### TypeScript

- **Use TypeScript** — No plain JavaScript files
- **Strict mode** — All types must be explicitly defined
- **No `any` types** — Use proper types or `unknown`
- **Interface over type** — Prefer `interface` for object shapes

**Example:**
```typescript
// Good
interface Entry {
  id: string;
  content: string;
  timestamp: number;
}

// Avoid
type Entry = {
  id: any;  // ❌ Don't use 'any'
  content: string;
  timestamp: number;
};
```

### React

- **Functional components only** — No class components
- **Named exports** for components — `export const ComponentName`
- **Default exports** for pages — `export default function PageName()`
- **Use hooks** — `useState`, `useEffect`, `useCallback`, `useMemo`
- **Client components** — Add `"use client"` directive when needed

**Example:**
```typescript
"use client";

import { useState } from "react";

export const MyComponent = () => {
  const [state, setState] = useState("");
  return <div>{state}</div>;
};
```

### Styling

- **Tailwind CSS only** — No inline styles or CSS modules
- **Use design system** — Follow existing color palette and spacing
- **Dark mode** — Use `dark:` prefix for dark mode styles
- **Responsive** — Use `sm:`, `md:`, `lg:` breakpoints

**Example:**
```tsx
<div className="p-6 bg-white dark:bg-gray-900 rounded-lg md:p-8">
  <p className="text-gray-800 dark:text-gray-100">Content</p>
</div>
```

### File Naming

- **Components:** `PascalCase.tsx` — e.g., `MindDump.tsx`
- **Utilities:** `camelCase.ts` — e.g., `formatDate.ts`
- **Pages:** `page.tsx` or `layout.tsx` (Next.js conventions)

### Code Organization

- **One component per file**
- **Group related logic** — Keep useState hooks together
- **Extract complex logic** — Create custom hooks
- **Comments** — Only when necessary to explain "why", not "what"

---

## 🌿 Branching Model

We follow a simplified Git Flow model:

### Branch Types

- **`main`** — Production-ready code (protected)
- **`feature/*`** — New features (e.g., `feature/export-to-markdown`)
- **`fix/*`** — Bug fixes (e.g., `fix/auto-save-memory-leak`)
- **`docs/*`** — Documentation updates (e.g., `docs/update-readme`)
- **`refactor/*`** — Code refactoring (e.g., `refactor/optimize-date-formatting`)

### Branch Naming

Use descriptive, lowercase names with hyphens:

```bash
feature/add-search-functionality
fix/textarea-overflow-on-mobile
docs/add-deployment-guide
refactor/extract-date-utils
```

### Workflow

1. Create branch from `main`
2. Make changes
3. Open PR to merge back into `main`
4. PR reviewed and merged
5. Delete feature branch

---

## 📤 Submitting Changes

### Pull Request Process

1. **Update documentation** — README, CHANGELOG if needed
2. **Test thoroughly** — Ensure no regressions
3. **Write clear PR description:**
   - What changes were made
   - Why (link to issue if applicable)
   - How to test
   - Screenshots/GIFs for UI changes

**PR Template:**
```markdown
## Description
Brief description of changes

## Related Issue
Closes #123

## Changes Made
- Added dark mode toggle button
- Updated button component styling
- Added tests for toggle functionality

## How to Test
1. Run `npm run dev`
2. Navigate to settings
3. Click dark mode toggle
4. Verify theme changes

## Screenshots
[Add screenshots here]

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No breaking changes
- [ ] Tested in multiple browsers
```

### Commit Message Guidelines

We follow **Conventional Commits** for clear, semantic commit history:

**Format:**
```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat:` — New feature
- `fix:` — Bug fix
- `docs:` — Documentation changes
- `style:` — Formatting (no code change)
- `refactor:` — Code restructuring
- `perf:` — Performance improvements
- `test:` — Adding tests
- `chore:` — Maintenance tasks

**Examples:**
```bash
feat(entries): add search functionality

fix(auto-save): prevent memory leak on unmount

docs(readme): update installation instructions

refactor(date-utils): extract formatDate to separate module

perf(entries): virtualize long entry lists
```

### Code Review Process

1. **Automated checks** — Linting, type checking, build must pass
2. **Maintainer review** — Code quality, design alignment
3. **Feedback** — Address review comments
4. **Approval** — At least one maintainer approval required
5. **Merge** — Squash merge into `main`

---

## 🐛 Reporting Bugs

### Before Submitting

1. **Check existing issues** — Your bug may already be reported
2. **Reproduce the bug** — Ensure it's consistent
3. **Test in different browsers** — Chrome, Firefox, Safari

### Bug Report Template

```markdown
**Bug Description**
A clear description of the bug.

**Steps to Reproduce**
1. Go to '...'
2. Click on '...'
3. Scroll down to '...'
4. See error

**Expected Behavior**
What should happen.

**Actual Behavior**
What actually happens.

**Screenshots**
If applicable, add screenshots.

**Environment**
- Browser: Chrome 120
- OS: macOS 14.1
- Node.js: 20.10
- MindDump version: 1.0.0

**Additional Context**
Any other relevant information.
```

---

## 💡 Suggesting Features

### Feature Request Template

```markdown
**Feature Title**
Clear, descriptive title

**Problem Statement**
What problem does this solve?

**Proposed Solution**
How would this feature work?

**Alternatives Considered**
What other solutions did you think about?

**Alignment with MindDump Philosophy**
How does this maintain simplicity and focus on pure writing?

**Additional Context**
Mockups, examples, references
```

---

## ✅ Definition of Done

A contribution is considered complete when:

- [ ] Code is written and tested
- [ ] Linter passes (`npm run lint`)
- [ ] Build succeeds (`npm run build`)
- [ ] Documentation updated (if needed)
- [ ] PR description is clear and complete
- [ ] All review feedback addressed
- [ ] Maintainer approval received

---

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Conventional Commits](https://www.conventionalcommits.org/)

---

## 🙏 Thank You!

Your contributions help make MindDump better for everyone. We appreciate your time and effort!

If you have questions, feel free to:
- Open a [GitHub Discussion](https://github.com/yourusername/minddump/discussions)
- Comment on an existing issue
- Reach out to maintainers

Happy contributing! 🚀
