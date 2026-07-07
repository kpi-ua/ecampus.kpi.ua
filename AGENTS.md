# AGENTS.md — eCampus Frontend Conventions

This file documents the *de facto* conventions used in this repo. Follow them so PRs match what already exists and don't churn through review.

For tech stack, commands, and env vars see [CLAUDE.md](./CLAUDE.md).

---

## Golden rule

**Match the surrounding code.** Before adding a new pattern, open 2–3 existing modules under `src/app/[locale]/(private)/module/` and copy their structure. If you find yourself introducing an abstraction (custom layout view, new helper file, new wrapper component) that no other module uses, stop — there is almost certainly an existing pattern you should be following instead.

Concrete examples of recent drift to avoid:
- Adding a separate mobile card view inside a table component (no other table does this — `<Table>` is used as-is).
- Wrapping create/edit forms in modal `<Dialog>` for primary CRUD flows. Inline forms above the table are the convention (see `announcement-management.tsx`).
- Inventing a new file type like `schema.ts` when the form's Zod schema is small enough to live next to `useForm`.

---

## 1. Module folder layout

```
src/app/[locale]/(private)/module/<name>/
├── page.tsx                # async server component, fetches data
├── page.content.tsx        # optional client wrapper for interactive UI
├── constants.ts            # module-local enums / keys
├── types.ts                # module-local types
├── utils/                  # module-local helpers (one file per concern)
└── components/
    ├── <name>-table.tsx
    ├── <name>-form.tsx
    └── <name>-<thing>.tsx
```

- `page.tsx` is **always** a server component. It fetches data (via server actions in `@/actions/`), declares `generateMetadata`, and renders inside `<SubLayout>`. See `module/rating/page.tsx`, `module/certificates/page.tsx`, `module/facultycertificate/page.tsx`.
- Heavy interactive logic goes into a client component imported from `./components/`. Use `page.content.tsx` only when you need a thin client wrapper around the whole page (see `facultycertificate/page.content.tsx`).
- File names are **kebab-case**. Suffix-based naming: `*-table.tsx`, `*-form.tsx`, `*-dialog.tsx`, `*-card.tsx`, `*-filters.tsx`.
- Module-local helpers live in `<module>/utils/<concern>.ts` (one helper per file — see `facultycertificate/utils/print-certificate.ts`, `button-state-controller.ts`). Do not create a single grab-bag `utils.ts` unless the file genuinely covers a single concern (e.g. `certificates/utils.ts` only has badge styling helpers).

## 2. Tables

Use a **single** `<Table>` rendered identically across breakpoints. **Never add a parallel `md:hidden` mobile card view** — no other table in this codebase does that, and reviewers will push back.

Reference: `module/facultycertificate/components/all-docs-table.tsx`, `module/certificates/components/history-table.tsx`, `module/studysheet/[id]/components/journal-table.tsx`.

Standard wiring for a paginated, sortable table:

```tsx
import { memo } from 'react';
import { useTranslations } from 'next-intl';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PaginationWithLinks } from '@/components/ui/pagination-with-links';
import { Show } from '@/components/utils/show';
import { usePagination } from '@/hooks/use-pagination';
import { useTableSort } from '@/hooks/use-table-sort';
import { PAGE_SIZE_DEFAULT } from '@/lib/constants/page-size';

export const ThingsTable = memo(function ThingsTable({ items, totalCount }: Props) {
  const t = useTranslations('private.things.table');
  const { sortedRows, sortHandlers, getSortDirection } = useTableSort(items, undefined, ['created']);
  const { paginatedItems } = usePagination(PAGE_SIZE_DEFAULT, sortedRows);

  if (items.length === 0) {
    return <p className="text-muted-foreground py-12 text-center text-sm">{t('empty')}</p>;
  }

  return (
    <>
      <Table>{/* ... */}</Table>
      <Show when={!!totalCount}>
        <PaginationWithLinks page={1} pageSize={PAGE_SIZE_DEFAULT} totalCount={totalCount ?? 0} />
      </Show>
    </>
  );
});
```

- Empty state: inline early return with a translated `<p>`.
- Pagination is conditional via `<Show when={...}>` — don't show it when there's only one page worth of rows.
- Use `PAGE_SIZE_DEFAULT` from `@/lib/constants/page-size` (or `PAGE_SIZE_SMALL` for compact lists). Don't hardcode page sizes.

## 3. Server actions

- File location: `src/actions/<domain>.actions.ts`. The `.actions.ts` suffix is required.
- First line: `'use server';`.
- HTTP via `campusFetch<T>(url, init?)` from `@/lib/client` — it injects JWT and base path. Do not write `fetch()` directly.
- After mutations, call `revalidatePath('/module/<name>')` (or `'layout'` granularity when shared layout data changes). See `certificates.actions.ts` and `announcement.actions.ts`.
- Error handling has two flavors in the codebase:
  - **Throw** on non-OK (`certificates.actions.ts`) — caller wraps in try/catch with `useServerErrorToast`.
  - **Return a safe default** like `{ items: [], total: 0 }` (`announcement.actions.ts`) when the page can render an empty state.
  Pick one consistently per action and document the contract via the return type.

## 4. Forms (React Hook Form + Zod)

- Schema: define inline above `useForm` via `z.object({...})`. Co-locating in a separate `schema.ts` is acceptable only when the schema is large or shared between create/edit flows — most forms keep it inline (see `module/msg/components/broadcast.tsx`, `facultycertificate/components/reject-dialog.tsx`).
- Type: `type FormValues = z.infer<typeof formSchema>`.
- Validation messages: use translated strings, e.g. `z.string().min(1, { message: t('validation.title-required') })`.
- Submit button: prefer `<Button loading={form.formState.isSubmitting}>` over `disabled={...}` — the `Button` component auto-disables while loading and shows a spinner. Mirrors the login form.
- Errors from server actions: `try { await action(...) } catch { errorToast(); }` using `useServerErrorToast()`.
- For create vs. edit, pass an optional `id` / `initialValues` to one form component rather than duplicating the form. See `announcement-form.tsx`.
- **Inline forms over modal dialogs** for primary CRUD. Use `<Dialog>` only for confirmations (delete) or secondary actions (reject with reason).

## 5. Imports

- `'use client'` is line 1, no blank lines above it.
- Use `@/` path aliases everywhere except true sibling imports (`./schema`, `./components/x`).
- Import sorting is enforced by `eslint-plugin-simple-import-sort` — let `npm run lint -- --fix` do it. Don't hand-order.
- SVG icons: import from the central index at `@/app/images` (e.g. `import { PencilRegular, EyeBold } from '@/app/images'`). Lucide icons (`lucide-react`) are also used directly when no in-house icon exists.

## 6. Component declaration style

The codebase has two coexisting styles:

```tsx
// Older modules (rating, studysheet, msg, certificates) — function declaration
export function ThingsTable({ items }: Props) { ... }

// Newer / Izvarin-authored components (auth, validate-certificate, account-selector,
// announcements-card, announcementseditor) — arrow + const
export const ThingsTable = ({ items }: Props) => { ... };
```

**For new code, prefer the arrow form** (`export const X = (props) => {}`) — this is the recent direction set in commit `6c3ee36` ("Switch new components to Izvarin's arrow-export convention"). When editing an existing file, match what's already there — don't mix styles within a module.

Memoization: only wrap in `memo(function Name() {})` when the component is rendered in a hot list or accepts stable props that benefit from referential equality. `AllDocsTable` is the only current example; don't add `memo` reflexively.

## 7. Translations

- Define `const INTL_NAMESPACE = 'private.<modulename>'` at the top of each `page.tsx`.
- Server: `getTranslations({ locale, namespace: INTL_NAMESPACE })` in `generateMetadata`, `getTranslations(INTL_NAMESPACE)` in the page body.
- Client: `useTranslations('private.<modulename>.<section>')` — scope per section (`.table`, `.form`, `.actions`, `.status`, `.validation`).
- Add new keys to **both** `src/messages/uk.json` and `src/messages/en.json`. Ukrainian is the source of truth.
- Shared/global keys live under `global.*` (e.g. `global.server-error`, `global.enums.<name>`).

## 8. Hooks (use these instead of reinventing)

In `src/hooks/`:

| Hook | Purpose |
|------|---------|
| `usePagination(pageSize, items)` | Slices items + reads/writes `?page=` URL param |
| `useTableSort(rows, getSortValue?, sortableKeys?)` | Client-side column sorting, returns `{ sortedRows, sortHandlers, getSortDirection }` |
| `useServerErrorToast()` | `errorToast()` showing the standard `'global.server-error'` message |
| `useToast()` | Manual toasts: `toast({ title, description, variant: 'destructive' })` |
| `useLocalStorage(key, default)` | Persist client state |
| `useIsMobile()` | Viewport check (use sparingly — Tailwind breakpoints are usually enough) |

If you need a hook only inside one module, put it in `<module>/hooks.ts` (see `module/rating/hooks.ts`).

## 9. UI components (`src/components/ui/`)

Pick from the existing set before creating new primitives. Available: `accordion`, `alert`, `alert-dialog`, `aspect-ratio`, `avatar`, `badge`, `breadcrumb`, `button`, `card`, `carousel`, `checkbox`, `collapsible`, `command`, `dialog`, `dropdown-menu`, `form`, `input`, `label`, `locale-switch`, `multi-select`, `pagination`, `pagination-with-links`, `password-input`, `popover`, `profile-picture`, `radio-group`, `scroll-area`, `select`, `separator`, `sheet`, `sidebar`, `skeleton`, `sort-icon`, `switch`, `table`, `tabs`, `text-button`, `text-divider`, `textarea`, `toast`, `toaster`, `tooltip`.

Notable variants:

- `<Button variant="primary|secondary|tertiary" size="small|medium|big" loading={...}>`
- `<Badge variant="neutral|success|error|red|blue|orange|purple|yellow|default">`

Conditional rendering helper: `<Show when={cond} fallback={null}>` from `@/components/utils/show`.

## 10. Types

- Domain models: `src/types/models/<domain>/<thing>.ts` (e.g. `types/models/certificate/certificate.ts`, `types/models/announcement.ts`).
- Module-local types: `<module>/types.ts`.
- Component props: `interface Props { ... }` declared just above the component in the same file.
- `interface` for object/prop shapes; `type` for unions, mapped types, and `z.infer` aliases.

## 11. Constants

- Shared: `src/lib/constants/<domain>.ts` (`page-size.ts`, `cookies.ts`, `cache-tags.ts`, `modules.ts`, ...).
- Module-local: `<module>/constants.ts` — exports `enum` for keyed sets (`DeanCeritificateKey`, `EmploymentType`).
- Never hardcode page sizes, cookie names, or module URL keys in components.

## 12. Dates

`dayjs` everywhere. Standard display format: `dayjs(date).format('DD.MM.YYYY')`. Use `isOutdated` from `@/lib/date.utils` for "is this in the past" checks. No moment.js, no manual `Date.toLocaleString` for UI.

## 13. Error handling pattern

```tsx
const { errorToast } = useServerErrorToast();
const { toast } = useToast();

const handleSomething = async () => {
  try {
    await someServerAction();
    toast({ title: t('success.title'), description: t('success.description') });
  } catch {
    errorToast();
  }
};
```

Don't surface raw error messages from the API to users — `errorToast()` shows the localized `'global.server-error'` message. If you need a specific error UX, add a translation key under `global.*` rather than concatenating strings.

---

## Pre-PR checklist

Before opening the PR, run:

```bash
npm run lint     # eslint + import-sort
npm run tsc      # type check
npx prettier --check $(git diff --name-only main..HEAD)
```

(Or wrap each in the Docker invocation per [CLAUDE.md](./CLAUDE.md).)

Quick self-review pass:
- [ ] Did I match the file layout, naming, and component style of a sibling module?
- [ ] Am I introducing any new abstraction that no other module uses? If yes, why?
- [ ] Did I add translation keys to **both** `uk.json` and `en.json`?
- [ ] Did I call `revalidatePath` after a mutating server action?
- [ ] Are inputs controlled? (Recent review feedback: `MultipleSelector` was switched from uncontrolled to controlled — uncontrolled defaults are a code smell here.)
- [ ] Did I run `prettier --write` so the diff isn't a wall of reformatting?
