# AI development workflow

Inspect specs and affected code before editing. Keep domain logic in services and isolate persistence in repositories. Prefer the smallest coherent change; preserve working behavior and dependencies. All work in this nested starter must stay inside its folder.

Every database change needs models, schemas, a reversible Alembic migration and relevant tests. Every new action needs a permission, idempotent seed coverage, backend enforcement and frontend visibility. Run appropriate tests and document actual results.

Maintain `last_prompt.md` with completed work, remaining work, verification results and a final resume prompt. Synchronize README, ROADMAP, PROJECT_STATE and affected docs before finishing. Never copy live environment files, credentials, uploaded data, test output or business records into a reusable distribution.
