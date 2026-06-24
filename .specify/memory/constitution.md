# my-project Constitution

## Core Principles

### I. Code Quality (NON-NEGOTIABLE)
Every file must be clean, readable, and maintainable before it is merged:
- Functions have a single responsibility; no function exceeds ~40 lines
- No dead code, commented-out blocks, or speculative abstractions
- Naming is explicit and self-documenting — comments explain *why*, not *what*
- Linting and static analysis must pass with zero warnings on every PR
- Complexity must be justified in writing; simple solutions are always preferred

### II. Testing Standards (NON-NEGOTIABLE)
Test-driven development is mandatory:
- TDD cycle enforced: write tests → get approval → tests fail → implement → green → refactor
- Unit test coverage floor: 80% lines, 100% of public API surface
- Integration tests required for every cross-module boundary and external dependency
- No PR merges with failing or skipped tests unless explicitly documented with a ticket
- Tests are treated as first-class code: same quality bar, same review process

### III. User Experience Consistency
Every user-facing surface must feel like part of the same product:
- Shared design tokens (colors, spacing, typography) must be used — no one-off values
- Interaction patterns (loading states, error messages, empty states) follow the pattern library
- Accessibility: WCAG 2.1 AA minimum; keyboard navigation and screen reader support required
- UX changes require designer sign-off before implementation begins
- Regressions in existing UX patterns block the PR

### IV. Performance Requirements
Performance is a feature and is tracked continuously:
- Core Web Vitals targets: LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1
- API response time p95 ≤ 300 ms under baseline load; p99 ≤ 1 s
- Bundle size increases > 5 kB (gzipped) require explicit justification
- Performance budgets are checked in CI; regressions block merge
- Profiling is required before any optimization to avoid premature work

## Quality Gates

Every PR must satisfy all gates before merge:

| Gate | Requirement |
|------|-------------|
| Linting | Zero warnings/errors |
| Unit tests | All pass; coverage ≥ 80% |
| Integration tests | All pass |
| Performance budget | No regressions vs. main |
| UX review | Required for user-facing changes |
| Accessibility audit | WCAG 2.1 AA for new UI |

## Development Workflow

1. **Spec first** — no implementation starts without an approved spec (`/speckit.specify`)
2. **Plan before coding** — use `/speckit.plan` to align on approach
3. **Tasks are atomic** — each task in `/speckit.tasks` should be completable in one session
4. **Constitution check** — every PR description includes a constitution compliance section
5. **Converge regularly** — run `/speckit.converge` after each milestone to surface remaining work

## Governance

This constitution supersedes all other practices and style guides. Amendments require:
1. A written rationale explaining the problem the amendment solves
2. Team approval (majority vote)
3. A migration plan for existing code that violates the new rule

All code reviews must verify compliance with this constitution. Violations are blocking.

**Version**: 1.0.0 | **Ratified**: 2026-06-24 | **Last Amended**: 2026-06-24
