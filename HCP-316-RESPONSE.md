# v4.4: response to HCP-316 (forgot password, Our brands, content page, link keys)

**To:** Software Engineer, Infinite Websites (HCP-316), via Ben
**From:** Claude Design (HCP-246)
**Built on:** v4.3 (v4.2 plus the product key facts, feature pills and range link already in `HANDOVER.md`). Where this file and `HANDOVER.md` disagree, this file wins.

New pages: `forgot.html`, `brands.html`, `content.html`. Changed: `login.html`, the header and footer links on every page, `register.html` (Terms link), `home.html` (All brands), `supplier.html` (crumb), and `assets/site.css` (new "v4.4" block at the end). `site.js` is unchanged.

## 1. Forgot password: `forgot.html`

Breadcrumb: Home / Log in / Forgot password. The page uses the log in layout. Its states are delivered visible, like register. Show one of them at a time.

| State | Slot | What it holds |
|---|---|---|
| (a) Form | `data-iw-forgot-form` | Heading, intro, `<form data-iw-forgot method="post">` with one input, `email`, and a "Send reset link" button. Side panel: "Still waiting for approval?" (resetting works before approval) and the phone number. |
| (c) Error | `data-iw-forgot-error` (inside the form block, above the form) | "We couldn't send the reset link." Show it with the form when Wix refuses the request. |
| (b) Sent | `data-iw-forgot-sent` | "Check your email", Back to log in, Send it again (links to `forgot`). |
| (d) Back from Wix | `data-iw-login-reset` on **`login.html`**, above the other notices | A green notice: "Your password has been changed. Log in with your new password." |

- **(d) lives on the log in page**, because the buyer's next step is to log in. Please set Wix's return URL to the log in page with a flag (for example `/login?reset=1`), and show `data-iw-login-reset` only when the flag is there.
- **The sent wording doesn't say whether the email has an account** ("If there's an account for that email…"). Please show the sent state for any well-formed email, and keep the error for real failures, so the form can't be used to check who has an account.
- **Unapproved accounts:** after resetting, an unapproved buyer logs in and gets the existing `data-iw-login-pending` notice. Nothing new is needed.
- On `login.html` the "Forgot password?" link is now live: `data-iw-href="forgot"`, and `data-iw-pending="forgot"` is removed.

## 2. Our brands: `brands.html`

Breadcrumb: Home / Our brands. Brands are listed A to Z in letter groups, with a jump row of letters at the top. Each brand shows its name and product count and links to its brand page. There are no logos or images.

| Part | Slots |
|---|---|
| Total | `data-iw-brands-total` (108) + key `brands.total` "brands, A to Z" |
| Letter row | `<ul data-iw-brand-letters>` › `data-iw-brand-letter-item` › `<a data-iw-brand-letter-link href="#brands-A">` › `data-iw-brand-letter`. One letter per group that has brands. Letters with no brands are left out. |
| Groups | `data-iw-brand-groups` › `<section data-iw-brand-group id="brands-A">` › `<h2 data-iw-brand-letter>` + `<ul data-iw-brands>` |
| Brand | `data-iw-brand-item` › `<a data-iw-brand-link href="/brand/<name>">` › `data-iw-brand-name` + `data-iw-brand-count` + key `category.products` "products" |

- The item slots are the same as the home "Our brands" strip (`data-iw-brands` › `data-iw-brand-item`), plus `data-iw-brand-count`.
- **Grouping:** by the first letter, ignoring case. Names that start with a digit go in one group, `0–9`, with `id="brands-0-9"`. It comes first. The sample lists the real 108 brands and counts from the catalogue (brand, or supplier when brand is empty).
- **Sort:** A to Z within each group, ignoring case.
- Counts are formatted with a comma (4,234).

## 3. Content page: `content.html` (one template for the six pages)

Breadcrumb: Home / title. Heading, then the text in a reading column (720 px max) and a side list of all six pages. The sample is Splendid's **real privacy policy**, copied as written from splendidtrading.co.uk/blank (their live Wix URL for it). Section ids match the live anchors (`#what-info`, `#how-use`…). Leave out the live page's blank spacer paragraphs and the lone "." after the first section. Those are layout leftovers, not text. One typo is corrected in the sample: "question s" → "questions". Please make the same fix when you copy it in.

| Part | Slots |
|---|---|
| Title | `data-iw-content-title` (breadcrumb and `<h1>`) |
| Body | `<article data-iw-content-body>`. Please write Splendid's words into it as plain HTML elements, as listed below. `site.css` styles each one. |
| Side list | Reuses the footer keys and `data-iw-href` keys. Put `aria-current="page"` on the current page's link. |

**Elements the body can hold** (no classes needed except `topics`):

| Text on the live site | Write it as |
|---|---|
| Paragraph | `<p>` |
| Subheading, first level (Delivery and returns, Privacy sections, T&Cs capitalised section titles) | `<h2>` |
| Subheading, second level (Delivery and returns) | `<h3>` |
| List items (Privacy) | `<ul><li>` (or `<ol><li>` if numbered on the live site) |
| Link in the text | `<a href>` |
| Privacy "Topics" list | `<nav class="topics"><p class="topics-h">Topics</p><ul><li><a href="#section-1">…</a></li>…</ul></nav>`, with `id="section-1"` etc. on the matching `<h2>`. Optional: as a plain `<ul>` it still reads fine, but it won't jump. |
| T&Cs clause ("1.1 Definitions …") | `<p>`, with the number kept in the text as written |
| Help question and answer | `<p>` as written. If you can split them, put the question in `<h3>` and the answer in `<p>`; it reads better, but it's optional. |

- Headings get `scroll-margin-top`, so a jump to a section isn't hidden under the sticky header.
- T&Cs (about 24,000 characters) needs nothing extra. Below 1024 px the side list moves under the text.

## 4. Link keys (every page)

| Link | Key | Sample href |
|---|---|---|
| Top bar: Help | `help` | `/content.html` |
| Top bar: Delivery | `delivery` | `/content.html` |
| Footer: Delivery and returns | `delivery` | `/content.html` |
| Footer: Terms and conditions | `terms` | `/content.html` |
| Footer: Cookie policy | `cookies` | `/content.html` |
| Footer: Privacy policy | `privacy` | `/content.html` |
| Footer: Help | `help` | `/content.html` |
| Footer: About us | `about` | `/content.html` |
| Footer: Our brands; Home: All brands; Supplier crumb: Our brands | `brands` | `/brands.html` |
| Register: Terms and conditions (in the pending terms checkbox) | `terms` | `/content.html` |
| Log in: Forgot password?; Sent state: Send it again | `forgot` | `/forgot.html` |

Contact us stays `mailto:`. The only `href="#"` links left are inside slots the product fills (facet, pager and catalogue links).

## New text keys (v4.4)

`login.reset` Your password has been changed. Log in with your new password. · `forgot.crumb` Forgot password · `forgot.heading` Reset your password · `forgot.intro` Enter the email you log in with. We'll send you a link to set a new password. · `forgot.submit` Send reset link · `forgot.remember` Remembered it? · `forgot.error.heading` We couldn't send the reset link. · `forgot.error.text` Check the email and try again, or call the trade counter. · `forgot.pending.heading` Still waiting for approval? · `forgot.pending.text` You can reset your password before your account is approved. You'll be able to log in once we've checked your application. · `forgot.sent.status` Check your email · `forgot.sent.text` If there's an account for that email, we've sent a link to set a new password. It can take a few minutes, so check your junk folder too. · `forgot.sent.back` Back to log in · `forgot.sent.again` Send it again · `brands.total` brands, A to Z

Reused: `form.email`, `member.login`, `basket.talk`, `site.phone`, `footer.about.brands`, `category.products`, the footer heading and link keys.

## Data notes for the products team (brand list)

- **Same brand twice:** "Sola" (116) and "SOLA" (60).
- **Capitals:** ARCOROC, LUMINARC, CRISTAL D'ARQUES, WALCO HW/BUFFET. Use title case, as with product names.
- **Please check (code):** "WALCO HW/BUFFET" covers a single product, WLWI11LSSGL (Steelite, range "Walco Idol Buffet"). It's the only Steelite brand in capitals. Is it like that in the feed, or does our import change it? Expected: brand "Walco".
- **Not brands:** "2400 Series" and "9100 Series" (Grunwerg) are knife ranges, likely Rockingham Forge. "Knife Sharpeners" and "Knife Storage" are product types. Steelite brands carry a division code (Hepp Fw / Hw/Buffet, Varick DW / FW, Folio Flatware / Cookware / Serv Pcs, Creations Buffet / Glass…). Merging these would shorten the list. Details are in `splendid-review/_attribute-notes.md`.
