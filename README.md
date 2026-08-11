# Worker's Assist — website

Static, trilingual (English / 简体中文 / 繁體中文) site for Worker's Assist, a
501(c)(3) cooperative offering free community English classes across Greater
Boston.

No build step, no framework to install, no server. Every page is plain HTML and
CSS with a little vanilla JavaScript. To work on it, open the files in a browser
or serve the folder over HTTP.

## Pages

| File | What it is |
| --- | --- |
| `index.html` | The home page. **Not plain HTML** — see "The home page is different" below. |
| `Join.html` | Class registration. Posts to a Google Form. |
| `Volunteer.html` | Volunteer sign-up via email or WeChat. No form backend. |
| `Home.dc.html` | Legacy redirect to `index.html`; kept so old links do not break. |

## Shared files

| File | What it is |
| --- | --- |
| `classes.js` | **The class schedule.** Single source of truth — see below. |
| `site.css` | Design tokens, base reset, nav, language switcher, footer. Used by `Join.html` and `Volunteer.html`. |
| `site-runtime.js` | Worker's Assist' own helpers (`window.WASite`): language persistence, copy swapping, mailto builder. Used by all three pages. |
| `support.js` | **Vendor code — do not edit.** The generated `dc-runtime` bundle that renders `index.html`. Regenerate it at source, never by hand. |

> The names `site-runtime.js` and `support.js` read backwards: the "runtime" is
> our code and the "support" file is the third-party runtime. Renaming means
> updating the `<script>` tags in all three pages; it hasn't been done to avoid
> breaking links people may already have.

## Changing the class schedule

**Edit `classes.js` and nothing else.** Both the home page's schedule table and
the registration form's checkboxes render from the same `schedule` array, so
they cannot drift apart. Adding, removing, or rescheduling a class is one edit.

Each entry needs `name`, `time`, `slot`, `mode`, `level` and `blurb` in all
three languages, plus a language-independent `value`.

`blurb` is the one-line description shown under each class on the home page.
Keep it to roughly 10–18 words: much longer and it wraps to four lines on a
phone, which unbalances the schedule card.

There is no per-class address. Every in-person class meets at the same place, so
the address appears once — on the map in the home page's schedule section —
rather than repeated on every row. If a class ever moves elsewhere, add a `loc`
field to that entry and render it in the schedule ticket.

`value` is what lands in the Google Form response. Two rules:

1. **Keep it stable across languages.** The site always submits `value`, never
   the translated label, so the responses sheet stays filterable no matter which
   language the visitor used.
2. **Never put `/` in it.** `/` joins multiple selections together; a `/` inside
   a value would make the recorded answer ambiguous.

## The Google Form coupling (read before touching `Join.html`)

`Join.html` posts directly to a Google Form. The `name` attribute of every field
is a Google Form entry ID, and they must match the live form exactly:

| Field | Entry ID | Required |
| --- | --- | --- |
| Name | `entry.1549766482` | yes |
| Phone | `entry.1033979463` | yes |
| Email | `entry.226688268` | no |
| WeChat ID | `entry.1496782574` | no |
| Preferred contact method | `entry.1897490935` | no |
| Online / in person | `entry.1730008427` | yes |
| Class times | `entry.246719977` | yes |

Two things make this fragile:

- **`entry.1730008427` is a multiple-choice question**, so its two submitted
  values must match the form's registered options character for character.
- **`entry.246719977` must be a free-text (Short answer) question.** The site
  joins the visitor's picks into one string with ` / ` and submits it as text.
  If that question is ever a Checkboxes question again, every submission will be
  rejected, because the site's values won't match the registered options.

### Known issue: submission failures are invisible

The form posts into a hidden iframe so the page doesn't navigate away, and the
success card is shown on the iframe's `load` event. That event fires for
Google's *rejection* page exactly as it does for the confirmation, and the
iframe is cross-origin so its contents cannot be read. **The page will report
success even when Google discarded the response.**

After changing anything about the form or its entry IDs, submit one real test
registration and confirm it appears in the responses sheet. Do not rely on the
success message.

## The home page is different

`index.html` is a "Design Component" authored for a design-compiler tool, not
plain HTML. It contains:

- an `<x-dc>` block holding the template, using `{{ expression }}` interpolation
  and `<sc-for>` / `<sc-if>` directives;
- a `<script type="text/x-dc" data-dc-script>` block defining
  `class Component extends DCLogic`, which holds all copy for the three
  languages in its `strings` object and exposes values via `renderVals()`.

`support.js` parses that block at load, compiles it, and mounts it with React
(fetched from a CDN). None of it renders without JavaScript.

Because it's rendered by that runtime, the home page uses its own styling
system: tokens come from the `rootStyle` object in the logic class and are named
`--font-head`, `--font-body`, `--accent`. That's why it does **not** load
`site.css` — the two token systems would collide.

## How language switching works

All three pages store the visitor's choice in `localStorage` under `wa.lang`.

`WASite.initLanguage()` in `site-runtime.js` applies the stored language,
swaps every `data-i18n` element, updates `<html lang>` and `data-lang`, and
highlights the active button.

**The preference is written only when a visitor clicks a language button**, never
on page load. This matters: a page that supports fewer languages than another
would otherwise silently overwrite a preference it can't honour. That bug used
to send English visitors who opened the registration form back to a fully
Chinese site.

All pages default to English.

## Assets

`assets/img/` holds the logo, WeChat QR code, and hero imagery. `uploads/` holds
photographs used in the home page's story sections.

The hero mural is Diego M. Rivera's *Detroit Industry* (1932–33, Detroit
Institute of Arts), public domain in the U.S., and is credited on the page.

## Contact

`admin@workers-assist.com` — hardcoded in the footer of all three pages and in
`Volunteer.html`'s mailto links.
