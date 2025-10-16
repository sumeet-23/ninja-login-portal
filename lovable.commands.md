# Lovable Commands Manifest
This file defines the allowed page generation structure for Lovable AI.
Lovable should only use these definitions to create or modify pages.

---

## 🧱 Available Page Modules

### 1. Filters Section
- Component name: `FiltersSection`
- Folder: `/src/components/{PageName}/FiltersSection.tsx`
- Must include: input, select, date, and clear/reset buttons.
- Connect to data via props or API (never inline constants).
- Design: use `Card` from Shadcn UI + `p-4` padding.

---

### 2. Table Section
- Component name: `DataTable`
- Folder: `/src/components/{PageName}/DataTable.tsx`
- Library: TanStack Table
- Props:
  - `columns`
  - `data`
  - `onRowClick`
- Add default pagination and sorting.
- Design: rounded-xl, shadow-md, hover:bg-muted/50.

---

### 3. Interactions
- File: `/src/components/{PageName}/ActionsSection.tsx`
- Contains buttons like "Add", "Edit", "Delete"
- Uses modal or drawer for forms (from Shadcn UI).
- Include loading state + success toast.

---

### 4. Routing Setup
- Update file: `/src/routes/index.tsx`
- Add entry:
  ```jsx
  { path: '/{PageName}', element: <{PageName}Page /> }
  ```
