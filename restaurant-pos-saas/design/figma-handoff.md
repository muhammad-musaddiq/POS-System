# Design Source / Figma Handoff Register

**Status:** Awaiting actual design references from product owner. Do not assume Figma links, frame IDs, logos or assets exist.

| Field | Value |
|---|---|
| Design source tool | TBD (Figma or supplied export) |
| Link/file | **To be supplied by owner** |
| Date/version | TBD |
| Target platforms | PWA desktop first; responsive tablet where validated |
| Brand tokens | TBD; must be runtime-configurable |
| Assets directory | `design/assets/` when provided |
| Screenshot references | `design/references/` when provided |

## Mapping template

| UI ID | Design page/frame | Asset refs | Implementation task | Status / deviation |
|---|---|---|---|---|
| UI-001 | Pending | Pending | M1 UI tickets | Not started |
| UI-004 | Pending | Pending | M3/M4 UI tickets | Not started |
| UI-015 | Pending | Pending | M6 billing tickets | Not started |

Add remaining screen mappings as designs become available.

## Codex instructions for design implementation

1. Read actual selected frames/components and relevant design token definitions using available tools/files; don't use placeholder imagery as if approved.
2. Extract layout breakpoints, sizes, spacing, typography, interaction feedback and variants.
3. Implement semantic, reusable, brand-token-driven React components rather than absolute-positioned mockups.
4. Match behavior to PRD/workflows/permission/entitlement rules, even if the design only shows happy path.
5. Add missing offline, error, grace/suspension, role-denied and loading states with consistent visual language; document proposed additions.
6. Save any visual deviations to this register with owner approval if necessary.
7. Respect copyright, image/asset licenses and do not embed secrets in design-related files.

## Missing-design checklist

- [ ] Actual design file/frame source supplied
- [ ] Logo/brand assets and font licensing clarified
- [ ] POS desktop and tablet breakpoints defined
- [ ] Kitchen/printing UX designed
- [ ] Offline and sync conflict UX designed
- [ ] Subscription cancellation and suspension screens designed
- [ ] Feature-disabled and plan-locked states designed
- [ ] Manager permission/error states designed
