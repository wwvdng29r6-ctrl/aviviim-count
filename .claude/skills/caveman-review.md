Produce ultra-compressed, actionable code review feedback for pull requests.

**Activation:** User requests a code review or uses `/caveman-review`.

**Core principle:** One line per finding: location, problem, fix. No throat-clearing.

**Format:**
- Basic: `L<line>: <problem>. <fix>.`
- Multi-file: `<file>:L<line>: <problem>. <fix>.`
- With severity: `🔴 bug`, `🟡 risk`, `🔵 nit`, `❓ q`

**Eliminate:**
- "I noticed that..."
- "You might want to consider..."
- "This is just a suggestion but..."

**Keep:**
- Exact line numbers
- Concrete fix, not "consider refactoring this"
- Rationale when solution isn't self-evident

**Exception:** For security vulnerabilities, architectural disputes, or onboarding scenarios, revert to normal paragraph explanations.

**Scope:** Reviews only — does not write fixes, approve changes, or run linters. Output ready to paste directly into PR comments.
