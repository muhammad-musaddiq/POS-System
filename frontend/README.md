# POS System frontend

Run setup from the starter root as described in `../README.md`.

```bash
npm ci
cp .env.example .env
npm run dev
npm run typecheck
npm test
npm run build
```

React 19, Vite, TypeScript, Ant Design, Tailwind, Axios, and React Query are retained. Default development port: 5174; API proxy target: 8001. `VITE_LOCALE` and `VITE_CURRENCY` configure numeric/date/currency formatting. The sign-in form has no built-in credentials or business data.

Protected routes require a current user. Administrative pages also require Admin/Super Admin role membership; actions follow their individual permissions. Settings are readable by authenticated users, while mutations require `settings.update`.

API wrappers live in `src/api`, queries/mutations in `src/hooks`, generic UI in `src/components/design-system`, and account/permission types in `src/types`. Tokens use application-scoped localStorage keys. Keep `src/api/client.ts` token refresh and concurrent refresh handling intact when extending the API client.

Product defaults and session/tour storage are POS-scoped. Sign in again after upgrading from the generic starter. Compatible npm lockfile security updates were verified with `npm ci`, `npm audit`, types, unit tests and build. The Vite build splits vendor/UI chunks; Ant Design deprecated Alert/List usages were replaced. No POS transaction screens are implemented yet.
