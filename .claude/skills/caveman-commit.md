Generate ultra-compressed commit messages following Conventional Commits format.

**Activation:** User says "write a commit," "commit message," or uses `/caveman-commit`.

**Subject line format:** `<type>(<scope>): <summary>` — hard cap 72 chars, imperative mood.

**Types:** `feat`, `fix`, `refactor`, `perf`, `docs`, `test`, `chore`, `build`, `ci`, `style`, `revert`

**Body:** Skip when subject is self-explanatory. Include only for:
- Breaking changes
- Non-obvious reasoning
- Migration notes
- Linked issues

Wrap body at 72 chars. Use dashes for bullets.

**Avoid:**
- "This commit does X" (self-referential)
- First-person pronouns
- AI attribution
- Emoji (unless project convention requires)
- Filename repetition when scope already captures it

**Output:** Message text only — do not run `git commit`, stage files, or amend. User pastes output directly.
