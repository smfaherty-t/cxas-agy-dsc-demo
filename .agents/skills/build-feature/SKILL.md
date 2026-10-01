---
name: build-feature
description: Guide for developing and shipping new features following world-class standards, GitHub issue tracking, local testing, and Conventional Commits.
---

# Feature Development Workflow

Use this skill whenever introducing new capabilities, UI components, or architectural modules.

## Standard Procedure

1. **GitHub Issue Alignment**:
   - Check or create a GitHub Issue (`gh issue create --title "feat: <feature-name>" --body "..." --label "enhancement"`).
   - Define acceptance criteria before writing code.

2. **Implementation & Standards**:
   - Maintain 100% technical ownership; adhere to Clean Architecture and DRY principles.
   - For UI, follow Tailwind CSS styling patterns and responsive design.

3. **Local Validation**:
   - Run unit/integration tests locally: `npm test`.
   - Run type-checking & build locally: `npm run build`.
   - Do NOT offload testing to GitHub Actions.

4. **Documentation & Versioning**:
   - Update `README.md` and inline documentation.
   - Commit with Conventional Commits: `feat(<scope>): <short description>`.
   - Link or close the GitHub issue in the commit message or PR.
