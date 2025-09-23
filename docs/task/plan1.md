So today we'll be designing a to-do portfolio for the course using Windsurf IDE using only the free model. So we'll be using some version of GPT, SWE1, and grok for documentation. The main idea is just to have a one page. It will be based with jQuery. Everything will be done with one file of jQuery and it shouldn't be too long. So we will have, let's say, a sort of data table. I would like to use datatable.net and we will be using it to create test cards. Each test card will have a created time and a deadline with an hour, a date picker, and a title, short description. It has to be very UI friendly, UX simple. You can use bootstrap and the whole thing will be a CRUD without a database. You can use local storage or something else. It's a really simple project where you can add cards, delete cards, delete tasks, and even group them in categories and colors. So something very simple. Let's create the craft. Let's create the prompt for Windsurf IDE.
ChatGPT Plus
Pensó durante 18s

Perfect—here’s a copy-paste Windsurf prompt that will scaffold exactly what you described: a single-page jQuery + Bootstrap + DataTables to-do app with one JS file, localStorage CRUD, datetime picker, categories with colors, and super simple UX.

🔧 Windsurf IDE Prompt (copy everything below)

Goal: Build a single-page to-do portfolio app using jQuery, Bootstrap 5, and DataTables.net. Keep the code small and readable. Use one JS file for all behavior. Store data in localStorage (no backend). Extremely simple, friendly UI.

Hard constraints

Single page app: index.html

One JavaScript file only: assets/app.js (contains all jQuery logic)

Optional tiny CSS file: assets/styles.css (only for small tweaks)

Use CDNs only (no build step)

Libraries:

jQuery 3.x

Bootstrap 5.x (CSS + JS bundle)

DataTables.net (core) + RowGroup extension (for optional grouping)

Use native HTML5 datetime-local input for deadlines (no extra picker lib)

Keep app.js preferably ≤ 300–400 lines

Features (MVP)

Task model

Fields: id (uuid), title, description, category, color, createdAt (auto), deadline (datetime-local), status (open / done)

Create / Read / Update / Delete

Add task (modal form)

Edit task (modal form prefilled)

Delete task (confirm)

Toggle status (checkbox in table; strike-through when done)

Data table

Columns: Status (✓), Title, Category (color dot + name), Deadline, Created, Actions (Edit/Delete)

Search, sort, pagination

Optional: RowGroup by Category (toggle in UI)

LocalStorage

Key: todo_portfolio_tasks_v1

On first run, seed with 4–5 demo tasks

CRUD ops persist to localStorage

UX details

Top toolbar: “Add Task”, Category filter (All + categories), “Group by Category” toggle

Minimal, clean Bootstrap styles; responsive on mobile

Datetime inputs validate; show friendly toasts (or alerts) on save/delete

Deadline shown in local timezone, formatted nicely

File structure to create
/ (project root)
  index.html
  /assets
    app.js
    styles.css

index.html (requirements)

Include CDN links (in this order):

Bootstrap 5 CSS

DataTables CSS + RowGroup CSS

(optional) styles.css

jQuery

Bootstrap 5 bundle

DataTables JS + RowGroup JS

app.js (last)

Page layout:

Navbar/title: “To-Do Portfolio”

Container:

Toolbar row:

“Add Task” button (opens modal)

Category <select> filter (All + dynamic from data)

“Group by Category” checkbox

<table id="tasksTable" class="table table-striped table-hover w-100"> with the 6 columns

Modal: #taskModal with form inputs:

Title (required)

Short description (textarea)

Category (text or select)

Color (input type=color)

Deadline (input type=datetime-local) — optional but validate if set

Hidden: id

Submit/Cancel

Small footer (credits)

assets/app.js (behavior spec)

State helpers

loadTasks(): returns array from localStorage (or seeds)

saveTasks(tasks): persists array to localStorage

uuid() simple generator

Seed data (only if key not found): 4 demo tasks across two categories with different colors/deadlines

Formatting utils

formatDate(dtString) → human readable

badge(category, color) → colored dot + name

DOM init

Build category filter options from current tasks (unique list)

Initialize DataTable with:

columnDefs for status checkbox and action buttons

default sort by deadline ascending

RowGroup based on Category (but enabled only if toggle checked)

Wire toolbar events:

Category filter → table column search on “Category”

“Group by Category” → enable/disable RowGroup and redraw

Wire modal:

On open for add → clear form, set createdAt internally on save

On open for edit → load by id and populate

On submit → validate title, handle create/update, refresh table, close modal

Table row actions:

Edit: open modal with row’s task

Delete: confirm, remove from array, save, redraw

Status checkbox: toggle done/open; visually strike title if done

Rendering

Rebuild DataTable rows after any mutation (use table.clear().rows.add(mappedData).draw() style)

“Created” is read-only; “Deadline” is sortable

Grouping

RowGroup data source = Category column (use the text value)

When toggle on: enable RowGroup; off: disable (redraw)

Filters

Category filter selects rows with matching Category; “All” clears filter

Accessibility & UX

Focus first input when modal opens

Keyboard Esc to close modal

Add aria-labels to action buttons

Keep messages simple (Bootstrap alerts or alert() if you prefer)

assets/styles.css (tiny tweaks)

Strike-through title when status is done (e.g., .is-done)

Small colored dot before category text

Make RowGroup headers sticky-ish on mobile if trivial

Acceptance criteria

Add, edit, delete, toggle done → all persist to localStorage

DataTables search/sort/paginate works smoothly

Category filter + Group by Category toggle both work

First load shows seeded tasks; subsequent loads reuse saved data

Code is under ~300–400 lines in app.js, well-commented

No ESLint screams in browser console; no runtime errors

Nice-to-haves (optional if time)

Quick “Overdue” highlight if deadline < now and status=open

Export/Import JSON (two buttons below table)

Snackbar/toast instead of alert()

Deliverables: a runnable project with index.html, assets/app.js, assets/styles.css. No build tools needed—open index.html in a browser and it works.

If you want, I can follow up with a ready-made index.html skeleton and a starter app.js you can paste in, but this prompt should be enough for Windsurf to generate the project exactly as specified.

Tú dijiste:
simplify the task

create a detailed phased plan
ChatGPT Plus

Absolutely—let’s strip this to the essentials and give you a clean phased plan you can execute in Windsurf with the free model. Each phase has: goal, tasks, files to touch, and acceptance checks. No fluff.

Project: Single-Page jQuery Todo (Bootstrap + DataTables + localStorage)

One page, one JS file, simple CRUD.
Columns: Status, Title, Category (with color), Deadline, Created, Actions.

Phase 0 — Scope & Skeleton (Foundation)

Goal: Minimal runnable page with CDNs and empty table.

Tasks

Create files:

index.html

assets/app.js

assets/styles.css (tiny)

Add CDNs in this order:

Bootstrap 5 CSS

DataTables CSS (+ RowGroup CSS if used)

assets/styles.css

jQuery 3.x

Bootstrap 5 bundle JS

DataTables JS (+ RowGroup JS)

assets/app.js

Build basic layout:

Navbar: “To-Do Portfolio” + “Add Task” button

Toolbar: Category filter <select>, “Group by Category” <input type="checkbox">

<table id="tasksTable" class="table table-striped table-hover w-100">

Columns: Status | Title | Category | Deadline | Created | Actions

Modal #taskModal with a form (Title*, Description, Category, Color, Deadline, hidden id)

Accept

Page loads without errors.

Table renders headers only.

Phase 1 — Data Model & Storage

Goal: Define item schema, storage helpers, and seed data.

Tasks

In assets/app.js:

Define schema:

// item = { id, title, desc, category, color, createdAt, deadline, status }


Implement helpers:

uuid()

loadTasks() → from localStorage key todo_portfolio_tasks_v1

saveTasks(tasks) → write-through

Seed 4–5 demo items if storage empty.

Accept

loadTasks() returns array; on first load, demo tasks appear in console when logged.

localStorage shows key todo_portfolio_tasks_v1.

Phase 2 — DataTables Initialization (Read)

Goal: Display tasks in DataTables with basic formatting.

Tasks

Initialize DataTable on #tasksTable with data from loadTasks().

Column renderers:

Status: checkbox (checked when status==='done')

Title: text; apply .is-done strike-through if done

Category: color dot + category text

Deadline: format as local, add data-sort with epoch for correct sorting

Created: format as local, add data-sort with epoch

Actions: Edit / Delete buttons

Default sort: Deadline ascending.

Accept

Rows display correctly.

Sorting by Deadline/Created works in chronological order.

Phase 3 — Create & Update (Modal CRUD)

Goal: Add and edit items via modal, persist to storage, refresh table.

Tasks

“Add Task” opens modal; on submit:

Validate Title (required).

Create item (set createdAt=Date.now(), status='open').

Push to in-mem array → saveTasks() → DataTable redraw.

Edit flow:

Actions → Edit button loads item into modal.

On submit, update fields; redraw table.

Focus first input on modal open; clear form on “Add”.

Accept

Can add and edit tasks; data persists after refresh.

Validation prevents empty title.

Phase 4 — Delete & Status Toggle

Goal: Delete tasks and mark as done/open.

Tasks

Actions → Delete with confirm → remove → save → redraw.

Status checkbox toggle updates status, adds/removes .is-done styling, and persists.

Accept

Delete removes row and survives refresh.

Toggling done persists and updates styling instantly.

Phase 5 — Filters & (Optional) Grouping

Goal: Filter by category; optional row grouping by category.

Tasks

Build category <select> options from unique categories in data.

Hook DataTables custom filter:

If filter = “All”, show all.

Else, match category column.

Grouping (optional):

Add RowGroup extension.

Checkbox toggles grouping on/off; redraw.

Keep search & sort working with filters/grouping.

Accept

Category filter includes all current categories.

Filter + search + sort all play nicely together.

(If used) Grouping correctly groups rows by category text.

Phase 6 — UX Polish & Overdue

Goal: Improve clarity; highlight overdue.

Tasks

Overdue: if status==='open' && deadline < now → color Deadline cell red and add tooltip “Overdue”.

Description tooltip: show full desc on hover.

Toasts/alerts for save/delete success (Bootstrap).

Empty state: show a friendly row when list is empty.

Accept

Overdue works and is visually clear.

Basic toasts/alerts appear on actions.

Empty state displayed when no tasks.

Phase 7 — Nice-to-Have Utilities (Optional)

Goal: Lightweight import/export.

Tasks

“Export JSON” → download current list as file.

“Import JSON” → paste JSON, confirm replace, save, redraw.

Accept

Exported file re-imports cleanly and reproduces table.

Definitions (for consistency)

Field validation

Title: required (1–120 chars)

Deadline: optional; if provided, must parse to a valid Date

Category: optional

Color: defaults to #888888 if not provided

Formatting

Dates: YYYY-MM-DD HH:mm (local)

Category cell: colored dot + text (dot via inline style)

Minimal Prompts (per phase) for Windsurf

Phase 0 prompt

Create index.html, assets/app.js, and assets/styles.css. Add CDNs for Bootstrap 5, DataTables.net (CSS/JS), jQuery, and Bootstrap bundle. Build a navbar, a toolbar with “Add Task”, category select, grouping checkbox, and an empty table with columns: Status, Title, Category, Deadline, Created, Actions. Add a Bootstrap modal #taskModal with inputs: title*, description, category, color, deadline (datetime-local), and a hidden id. Link app.js last.

Phase 1 prompt

In assets/app.js, add helpers: uuid(), loadTasks(), saveTasks(tasks). Use localStorage key todo_portfolio_tasks_v1. If empty, seed 4–5 tasks. Log loaded tasks to console.

Phase 2 prompt

Initialize DataTable on #tasksTable using tasks from loadTasks(). Implement renderers for each column as specified, including data-sort attributes for dates and strike-through when done. Default sort by deadline asc.

Phase 3 prompt

Wire “Add Task” and “Edit” to a single modal. On submit, validate title, set createdAt for new items, write-through to localStorage, and redraw the table. Focus first input on open; clear form for “Add”.

Phase 4 prompt

Implement Delete (confirm → remove → save → redraw) and Status checkbox toggle (open/done). Persist status toggles and update styling immediately.

Phase 5 prompt

Build category <select> from unique categories in data and attach a DataTables custom filter to match category. Add optional RowGroup extension and toggle via checkbox. Ensure search/sort/filter all work together.

Phase 6 prompt

Add overdue highlight for open tasks whose deadline < now (red text + title tooltip). Add description tooltips, Bootstrap toasts for actions, and an empty-state message when no tasks exist.

Phase 7 prompt (optional)

Add Export (download JSON) and Import (paste JSON → replace storage) utilities; confirm before replacing.

“Definition of Done” (whole project)

One HTML page, one JS file, tiny CSS.

CRUD works, persists in localStorage.

DataTables search/sort/paginate + category filter (and optional grouping).

Overdue highlighting + basic toasts.

No console errors; quick to load; readable code.

When you’re ready, start with Phase 0 in Windsurf, verify acceptance, then proceed phase by phase.