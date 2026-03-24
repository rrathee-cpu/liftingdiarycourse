# UI Coding Standards

## Component Library

All UI components **must** use [shadcn/ui](https://ui.shadcn.com/). No custom components are permitted.

- Use shadcn/ui components exclusively for all UI elements (buttons, inputs, dialogs, cards, tables, etc.)
- Do **not** create custom wrapper components around shadcn/ui components
- Do **not** build bespoke UI components from scratch
- If a needed component exists in shadcn/ui, it must be used

## Date Formatting

All date formatting must use [date-fns](https://date-fns.org/).

Dates must be displayed in the following format: `do MMM yyyy`

### Examples

| Date | Formatted Output |
|------|-----------------|
| 2026-03-01 | 1st Mar 2026 |
| 2026-03-23 | 23rd Mar 2026 |
| 2026-03-26 | 26th Mar 2026 |

### Usage

```ts
import { format } from "date-fns";

format(date, "do MMM yyyy"); // e.g. "1st Mar 2026"
```
