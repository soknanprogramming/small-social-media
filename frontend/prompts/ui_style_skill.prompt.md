---
name: my-app-style
description: >
  Design system and style guide for this React + Tailwind CSS web application.
  Use this skill whenever creating or editing any UI component, page, form, layout,
  or interactive element in this codebase — even if the user just says "make a new page",
  "add a component", "create a form", or "build a [feature] page". This skill ensures
  every new piece of UI matches the established visual language: clean minimal aesthetic,
  gray-based palette, Heroicons SVG icons, consistent spacing, and shared component patterns.
---

# My App — Style Guide

## Design Philosophy

**Clean, minimal, and functional.** The UI uses a restrained gray-based palette with no loud accent colors. Everything feels lightweight: thin borders, subtle shadows, soft hover states. White cards on a light gray background. No decorative flourishes.

---

## Color Palette

All colors come from Tailwind's default gray scale. There are no custom colors.

| Role                  | Class(es)                          |
|-----------------------|------------------------------------|
| Page background       | `bg-gray-50`                       |
| Card / panel bg       | `bg-white`                         |
| Primary text          | `text-gray-900`                    |
| Secondary text        | `text-gray-600`, `text-gray-500`   |
| Muted / hint text     | `text-gray-400`                    |
| Border (strong)       | `border-gray-200`                  |
| Border (subtle)       | `border-gray-100`                  |
| Hover bg              | `hover:bg-gray-100`                |
| Hover bg (light)      | `hover:bg-gray-50`                 |
| Primary button bg     | `bg-gray-900` → `hover:bg-gray-700`|
| Toggle ON             | `bg-gray-800`                      |
| Toggle OFF            | `bg-gray-200`                      |
| Danger / destructive  | `text-red-500`, `hover:bg-red-50`  |
| Error banner bg       | `bg-red-50 border-red-100 text-red-600` |

---

## Typography

- **Base size**: `text-sm` (0.875rem) for most UI text
- **Page heading**: `text-xl font-semibold text-gray-900`
- **Subheading / description**: `text-sm text-gray-500 mt-1`
- **Section label**: `text-sm font-medium text-gray-700`
- **Brand / logo**: `text-base font-semibold text-gray-900`
- **Muted helper text**: `text-xs text-gray-400`
- **No custom fonts** — uses Tailwind's default system font stack

---

## Spacing & Layout

- **Page wrapper**: `flex-1 min-h-screen bg-gray-50 py-10 px-6`
- **Content max-width**: `max-w-2xl mx-auto`
- **Page header margin**: `mb-8`
- **Card padding**: `p-6`
- **Form gap between fields**: `gap-6` (flex column)
- **Label-to-input gap**: `gap-1.5`
- **Sidebar width**: `w-56`
- **Sidebar padding**: `px-3 py-5`
- **Nav item gap**: `gap-1` between items, `gap-3` inside item (icon + label)

---

## Cards & Panels

```jsx
<div className="bg-white border border-gray-100 rounded-xl shadow-sm p-6">
  {/* content */}
</div>
```

- `rounded-xl` for cards/panels
- `rounded-lg` for inputs, buttons, nav items, smaller elements
- `shadow-sm` only on cards — nothing heavier

---

## Form Inputs

### Text input
```jsx
<input
  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-900
             placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300
             focus:border-transparent transition"
/>
```

### Textarea
```jsx
<textarea
  rows={5}
  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-900
             placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300
             focus:border-transparent transition resize-none"
/>
```

### Field wrapper pattern
```jsx
<div className="flex flex-col gap-1.5">
  <label className="text-sm font-medium text-gray-700">
    Label <span className="text-red-400">*</span>
    {/* optional: */}
    <span className="text-gray-400 font-normal">(optional)</span>
  </label>
  {/* input here */}
</div>
```

---

## Buttons

### Primary (submit / CTA)
```jsx
<button className="flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium
                   bg-gray-900 text-white hover:bg-gray-700
                   disabled:opacity-60 disabled:cursor-not-allowed transition-colors duration-150">
  {isLoading && <SpinnerIcon />}
  {isLoading ? "Saving…" : "Save"}
</button>
```

### Secondary / cancel
```jsx
<button className="px-4 py-2 rounded-lg text-sm text-gray-600
                   hover:bg-gray-100 hover:text-gray-900 transition-colors duration-150">
  Cancel
</button>
```

### Danger (e.g. logout)
```jsx
<button className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm
                   text-red-500 hover:bg-red-50 transition-colors duration-150">
  <LogoutIcon />
  Logout
</button>
```

### Action row (end of form)
```jsx
<div className="flex items-center justify-end gap-3 pt-2">
  {/* Cancel, then primary */}
</div>
```

---

## Toggle Switch

```jsx
<div className="flex items-center justify-between py-3 px-4 rounded-lg bg-gray-50 border border-gray-100">
  <div>
    <p className="text-sm font-medium text-gray-700">Label</p>
    <p className="text-xs text-gray-400 mt-0.5">Helper text</p>
  </div>
  <button
    type="button"
    role="switch"
    aria-checked={value}
    onClick={toggle}
    className={`relative inline-flex h-5 w-9 shrink-0 rounded-full border-2 border-transparent
      transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-gray-300
      ${value ? "bg-gray-800" : "bg-gray-200"}`}
  >
    <span className={`pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow
      transform transition-transform duration-200 ease-in-out
      ${value ? "translate-x-4" : "translate-x-0"}`}
    />
  </button>
</div>
```

---

## Error Banner

```jsx
{error && (
  <div className="flex items-start gap-2 px-4 py-3 rounded-lg bg-red-50 border border-red-100 text-red-600 text-sm">
    <WarningIcon className="w-4 h-4 shrink-0 mt-0.5" />
    <span>{error}</span>
  </div>
)}
```

---

## Drag-and-Drop Image Upload

```jsx
<div
  onDrop={handleDrop}
  onDragOver={handleDragOver}
  onDragLeave={handleDragLeave}
  onClick={() => fileInputRef.current?.click()}
  className={`flex flex-col items-center justify-center gap-3 px-6 py-10
    rounded-lg border-2 border-dashed cursor-pointer transition-colors duration-150
    ${isDragging
      ? "border-gray-400 bg-gray-50"
      : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"}`}
>
  <UploadIcon className="text-gray-300" />
  <div className="text-center">
    <p className="text-sm text-gray-600">
      <span className="font-medium text-gray-800">Click to upload</span> or drag and drop
    </p>
    <p className="text-xs text-gray-400 mt-0.5">PNG, JPG, GIF, WEBP</p>
  </div>
</div>
```

After image selected, show preview with overlay + remove button:
```jsx
<div className="relative rounded-lg overflow-hidden border border-gray-200 group">
  <img src={preview} className="w-full max-h-64 object-cover" />
  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-150" />
  <button
    onClick={removePhoto}
    className="absolute top-2 right-2 flex items-center justify-center w-7 h-7 rounded-full
               bg-white/90 text-gray-600 hover:bg-white hover:text-red-500 shadow-sm transition-colors duration-150"
  >
    <XIcon />
  </button>
  <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded text-xs bg-black/40 text-white backdrop-blur-sm">
    {photo?.name}
  </span>
</div>
```

---

## Sidebar Navigation

### Structure
```jsx
<aside className="w-56 bg-white border-r border-gray-100 h-screen sticky left-0 top-0
                  flex flex-col px-3 py-5">
  <div className="px-3 mb-6">
    <span className="text-base font-semibold text-gray-900">My App</span>
  </div>
  <nav className="flex-1">
    <ul className="flex flex-col gap-1">
      {/* NavLink items */}
    </ul>
  </nav>
  {/* Logout at bottom, inside border-t */}
</aside>
```

### NavLink component
```jsx
const NavLink = ({ to, icon, children }) => (
  <li>
    <Link
      to={to}
      className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-600
                 hover:bg-gray-100 hover:text-gray-900 transition-colors duration-150"
    >
      {icon}
      {children}
    </Link>
  </li>
);
```

### Visibility rules
- **Always visible**: Home, Posts
- **Logged in only**: My Posts, Profile, Logout button
- **Logged out only**: Register, Login

---

## Icons

All icons are **inline SVG** using Heroicons outline style. Never use an icon library import.

### Icon pattern
```jsx
const SomeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="w-4 h-4"          // nav icons: w-4 h-4 | upload zone: w-8 h-8
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}             // 1.5–2 depending on icon
    viewBox="0 0 24 24"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="..." />
  </svg>
);
```

### Spinner (loading state)
```jsx
const SpinnerIcon = () => (
  <svg className="w-4 h-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
  </svg>
);
```

---

## API & Error Handling Convention

Backend returns errors as `{ error: "..." }` (400/500) — not `message`.

```ts
try {
  await api.post("/api/...", payload);
  navigate("/target_route");
} catch (err: any) {
  const data = err?.response?.data;
  setError(data?.error ?? data?.message ?? "Something went wrong. Please try again.");
} finally {
  setIsSubmitting(false);
}
```

For `multipart/form-data` requests:
```ts
const formData = new FormData();
formData.append("field", value);
await api.post("/api/route", formData, {
  headers: { "Content-Type": "multipart/form-data" },
});
```

---

## Page Template

```jsx
const SomePage: React.FC = () => {
  return (
    <div className="flex-1 min-h-screen bg-gray-50 py-10 px-6">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-xl font-semibold text-gray-900">Page Title</h1>
          <p className="text-sm text-gray-500 mt-1">Short description.</p>
        </div>

        {/* Card */}
        <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-6">
          {/* content */}
        </div>

      </div>
    </div>
  );
};
```

---

## Transitions

All interactive elements use:
- `transition-colors duration-150` — color/background changes
- `transition-transform duration-200 ease-in-out` — toggle thumb movement
- Never use heavy animations or motion libraries

---

## What NOT to Do

- ❌ No accent colors (blue, purple, green, etc.) unless it's an error/danger context
- ❌ No `shadow-md`, `shadow-lg`, or heavier shadows
- ❌ No `rounded-2xl` or larger border radii
- ❌ No icon library imports (lucide-react, heroicons npm, etc.) — always inline SVG
- ❌ No `font-bold` on body text — use `font-medium` or `font-semibold` at most
- ❌ No gradient backgrounds
- ❌ No `<form>` HTML elements — use `<div>` with `onSubmit` on a wrapping element or handle via button `onClick`