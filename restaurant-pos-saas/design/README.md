# Design Handoff Folder (Requirements Only)

**Why this folder exists:** The product owner plans to provide a Figma design (or export) to Codex. These documents tell Codex how to interpret, validate and implement that design. They **do not contain actual screen designs or pretend a Figma file was already supplied.**

## Contents

- [`requirements.md`](requirements.md): screen inventory, states, accessibility, touch/restaurant workflow requirements.
- [`figma-handoff.md`](figma-handoff.md): how to place user-provided references, map frames/components to tasks, and record deviations.

## When actual designs arrive

1. Add approved link(s) to `figma-handoff.md`, including file name, version/date, page/frame identifiers and asset paths.
2. If screenshots/assets are supplied, place files in `design/references/` and `design/assets/` (create folders as needed); do not redistribute private designs outside the project.
3. Identify missing screens/states against `requirements.md`.
4. Map screen frames to `delivery/backlog.md` tasks; request decisions only for critical ambiguity. Noncritical gaps should be documented as assumptions.
5. Record implementation deviations and update UI specs after approval.

## Source-of-truth split

- **Design files:** visual layout, typography, spacing, icons, component interactions where provided.
- **PRD and policies:** what features must do, permissions, subscription lifecycle, offline data integrity and compliance.
- **Backend contracts:** validation, tenant/branch authorization, data model and financial rules.

A pretty screen does not supersede financial security, offline integrity, or product policy.
