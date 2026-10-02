# Splendid Trading: static front end (design 3a)

**To:** Software Engineer, Infinite Websites (HCP-252)
**From:** Claude Design (HCP-249)
**Revised:** HCP-245, product attributes (contract HCP-269) added to product.html, basket lines and product cards.
**Revised (v4, HCP-308):** see `HCP-308-RESPONSE.md` for the design decisions on the 16 UAT points, the `data-iw-pending` mechanism, the new slots and the new text keys. Where the two files disagree, the response wins.
**Source:** approved design 3a (Splendid Export), re-exported as plain HTML and CSS for the Intelligent Websites front-end contract (HCP-140).

**v4.2:** the pages now load one approved script, `<script src="/assets/site.js" defer></script>` (approved by Ben; see "site.js" below). Apart from that, the pages contain no script, no `on…=` handlers, no `{{ }}` templates and no outside resources (no Google Fonts either: Archivo is self-hosted in `/assets/fonts/`). The only forms are the contract's slot forms (the basket checkout form now also carries the customer-details inputs; see below). Sample text and sample items in slots are there for layout only, so the product replaces or drops them.

## Pages

| File | Page |
|---|---|
| `home.html` | Home |
| `department.html` | Department landing: top-level category with subcategory tiles (**new, v4.1**) |
| `category.html` | Subcategory product listing |
| `product.html` | Product detail |
| `basket.html` | Basket (quote request) |
| `login.html` | Log in |
| `register.html` | Open a trade account |
| `account.html` | My account (favourites only) |
| `notfound.html` | Not found (optional) |
| `search.html` | Search results and no results (**new, v4**) |
| `supplier.html` | Supplier / brand (**new, v4**, data coming) |

All pages share one header and footer, and every page links `/assets/site.css`.

## State blocks (all delivered visible; the product shows or hides them)

| Page | Block | Slot |
|---|---|---|
| Any page (header) | Open a trade account, Log in | `data-iw-member="out"` |
| Any page (header) | Member name, My account, Log out | `data-iw-member="in"` (contains `data-iw-member-name` and `<form data-iw-logout>`) |
| Any product card, `product.html`, `account.html` | Heart outline / heart filled | `<form data-iw-favourite>` › `data-iw-favourite-off` / `data-iw-favourite-on`. The two variants are stacked in the same spot, so the preview shows the filled one. |
| `basket.html` | Lines, summary, checkout | `data-iw-basket-full` |
| `basket.html` | "Your basket is empty" panel | `data-iw-basket-empty` |
| `basket.html` | "Quote request sent" confirmation | `data-iw-basket-sent` (**new, please confirm**) |
| `basket.html` | "Log in to fill these in." (in the details form) | `data-iw-member="out"` |
| `login.html` | "Those details don't match." | `data-iw-login-error` |
| `login.html` | "Awaiting approval" | `data-iw-login-pending` |
| `register.html` | Heading, form, side panel | `data-iw-register-form` (contains `<form data-iw-register>`) |
| `register.html` | Generic error | `data-iw-register-error` (inside the register-form block) |
| `register.html` | Email already registered | `data-iw-register-exists` (inside the register-form block) |
| `register.html` | "Application received" | `data-iw-register-done` |
| `account.html` | Logged-in view | `data-iw-member="in"` |
| `account.html` | Favourites grid | `data-iw-favourites` › `data-iw-favourite-item` |
| `account.html` | No favourites panel | `data-iw-favourites-empty` |
| `account.html` | Logged-out view ("Log in to see your favourites") | `data-iw-member="out"` |

## Slots used per page

- **Every page:** `data-iw-href` (home, basket, login, register, account), `data-iw-nav` › `data-iw-nav-item` › `data-iw-category-link` + `data-iw-category-name` (header department row; CSS shows only `data-iw-depth="0"`), member blocks, and logout form.
- **home.html:** a second `data-iw-nav` for the "Shop by department" cards (depth 0 only).
- **category.html:** `data-iw-category-title` (breadcrumb), `data-iw-category-text="heading"`, `data-iw-category-text="text"`, `<img data-iw-category-image>`, a side `data-iw-nav` (indented by `data-iw-depth` 0 to 2), and `data-iw-products` › `data-iw-product`.
- **Product card** (category, account): `data-iw-product-link` (image, name and "View product" button), `data-iw-product-name`, `data-iw-product-price`, `<img data-iw-product-image>`, `<form data-iw-favourite>`, and "Code …" and "Pack …" lines, each in a `data-iw-product-has` wrapper (`code`, `pack`) around `data-iw-product-code` / `data-iw-product-pack`.
- **product.html:** product fields (name appears in the breadcrumb and the heading); brand line above the heading (`data-iw-product-has="brand"` › `data-iw-product-brand`; Splendid has no brand, so it is removed); "Code …" under the heading (`has="code"`); `data-iw-product-description` paragraph; the pack box above the quantity (`has="pack"` › `data-iw-product-pack`); the Specification list (`data-iw-product-has="specs"` › `<dl data-iw-product-specs>` › `data-iw-product-spec` › `<dt data-iw-spec-label>` + `<dd data-iw-spec-value>`); `<form data-iw-add-to-basket>` (`input name="quantity"` + button), favourite form, and `data-iw-product-categories` › `data-iw-product-category` (the "Find it in" chips).
- **basket.html:** `data-iw-basket-lines` › `data-iw-basket-line` (product fields, with "Code …" and "Pack …" under the name in `has="code"` / `has="pack"` wrappers, `data-iw-line-total`, `<form data-iw-basket-quantity>` with `input name="quantity"` + "Update" button, `<form data-iw-basket-remove>`), `data-iw-basket-total`, `<form data-iw-checkout>` with `name`, `company`, `email`, `phone`, `postcode` (all required) and `notes` (optional `textarea`) + "Send quote request" button, and the `data-iw-basket-sent` confirmation block.
- **login.html:** `<form data-iw-login>` with `email` and `password` inputs.
- **register.html:** `<form data-iw-register>` with `first_name`, `last_name`, `company`, `email` and `password` inputs.

## Image keys

No `data-iw-image` keys are used. The logo and the two feature photographs are decoration and live in `/assets/`. Product and category images come only from the product and category image slots; their sample `src` is `/assets/placeholder.svg` (a striped tile, not a product image). All Pexels placeholders from the prototype have been removed.

## Assets (241 KB total, limit 5 MB)

| File | Size |
|---|---|
| `/assets/site.css` | 24.3 KB |
| `/assets/logo.png` | 37.3 KB |
| `/assets/home-feature.avif` | 39.2 KB |
| `/assets/why-feature.jpg` | 52.5 KB |
| `/assets/placeholder.svg` | 8.0 KB |
| `/assets/fonts/archivo-latin.woff2` | 34.1 KB |
| `/assets/fonts/archivo-latin-ext.woff2` | 31.9 KB |
| `/assets/fonts/archivo-vietnamese.woff2` | 12.9 KB |

## Text keys (`data-iw-text`)

Every visible word sits in a `data-iw-text` slot, apart from words that come from product, category or member slots. Icon-only buttons and links (header favourites and basket, the hearts, the logo) carry a visually hidden text slot instead of an aria-label. The `<title>` of each page uses `site.name`.

| Key | Wording | Pages |
|---|---|---|
| `account.favourites.empty` | No favourites yet. Tap the heart on any product to save it | account |
| `account.favourites.eyebrow` | Favourites | account |
| `account.favourites.heading` | Saved for your next order | account |
| `account.out.heading` | Log in to see your favourites | account |
| `account.out.text` | Trade customers can save products and send quote requests with their details filled in. | account |
| `account.welcome` | Welcome back, | account |
| `account.why.1.text` | Keep the lines you order often in one place. | login, register |
| `account.why.1.title` | Save favourites | login, register |
| `account.why.2.text` | Your details are filled in for you, so sending a list takes seconds. | login, register |
| `account.why.2.title` | Faster quote requests | login, register |
| `account.why.footer` | Accounts are for trade customers. We check every application before it goes live. | login, register |
| `account.why.heading` | Why open an account | login, register |
| `basket.checkout` | Send quote request | basket |
| `basket.continue` | Continue browsing | basket, account |
| `basket.crumb` | Basket | basket |
| `basket.details.heading` | Your details | basket |
| `basket.details.login` | to fill these in. | basket |
| `basket.details.required` | All fields except notes are required. | basket |
| `basket.empty.heading` | Your basket is empty | basket |
| `basket.empty.text` | Add products as you browse, then send the list to us as a quote request. | basket |
| `basket.heading` | Your basket | basket |
| `basket.intro` | Send your list as a quote request and a buyer will come back with prices and availability. Prices shown are guide prices, ex VAT. | basket |
| `basket.note.lead` | This is a quote request, not an order. | basket |
| `basket.note.text` | No payment is taken. A buyer will confirm prices, availability and delivery before anything is sent. | basket |
| `basket.quantity` | Quantity | basket |
| `basket.remove` | Remove | basket |
| `basket.sent.heading` | Thank you. | basket |
| `basket.sent.sooner.heading` | Need it sooner? | basket |
| `basket.sent.sooner.text` | Call the trade counter or email the buying team. | basket |
| `basket.sent.status` | Quote request sent | basket |
| `basket.sent.text` | A buyer will reply within one working day with prices and availability for your list. | basket |
| `basket.summary` | Summary | basket |
| `basket.talk` | Prefer to talk? Call | basket |
| `basket.total.label` | Guide total | basket |
| `basket.update` | Update | basket |
| `basket.vat` | ex VAT | basket |
| `category.browse` | Departments | category |
| `crumb.home` | Home | category, product, basket, login, register, account |
| `favourite.remove` | Remove from favourites | category, product, account |
| `favourite.save` | Save to favourites | category, product, account |
| `footer.about.brands` | Our brands | home, category, product, basket, login, register, account, notfound |
| `footer.about.heading` | About | home, category, product, basket, login, register, account, notfound |
| `footer.about.us` | About us | home, category, product, basket, login, register, account, notfound |
| `footer.company.heading` | Splendid Trading Ltd. | home, category, product, basket, login, register, account, notfound |
| `footer.copyright` | © 2026 Splendid Trading Limited. All rights reserved. | home, category, product, basket, login, register, account, notfound |
| `footer.help.heading` | How can we help | home, category, product, basket, login, register, account, notfound |
| `footer.legal` | Registered in England and Wales · Company number 04320097 · Registered office: 151–153 Shoreditch High Street, London E1 6HU | home, category, product, basket, login, register, account, notfound |
| `footer.shopping.cookies` | Cookie policy | home, category, product, basket, login, register, account, notfound |
| `footer.shopping.delivery` | Delivery and returns | home, category, product, basket, login, register, account, notfound |
| `footer.shopping.heading` | Shopping with us | home, category, product, basket, login, register, account, notfound |
| `footer.shopping.privacy` | Privacy policy | home, category, product, basket, login, register, account, notfound |
| `footer.shopping.terms` | Terms and conditions | home, category, product, basket, login, register, account, notfound |
| `form.company` | Business name | basket, register |
| `form.email` | Email | basket, login, register |
| `form.first_name` | First name | register |
| `form.last_name` | Last name | register |
| `form.name` | Name | basket |
| `form.notes` | Notes | basket |
| `form.optional` | (optional) | basket |
| `form.password` | Password | login, register |
| `form.phone` | Phone | basket |
| `form.postcode` | Delivery postcode | basket |
| `header.basket` | Basket | home, category, product, basket, login, register, account, notfound |
| `header.favourites` | Favourites | home, category, product, basket, login, register, account, notfound |
| `header.search.button` | Search | home, category, product, basket, login, register, account, notfound |
| `header.search.hint` | Search by keyword, code or name | home, category, product, basket, login, register, account, notfound |
| `home.badge.bottom` | YEARS | home |
| `home.badge.number` | 20+ | home |
| `home.badge.top` | TRADING | home |
| `home.cta.primary` | Shop glassware | home |
| `home.cta.secondary` | Full catalogue | home |
| `home.departments.eyebrow` | Shop by department | home |
| `home.departments.heading` | From the bar to the back of house | home |
| `home.heading` | Glassware worth putting on the table. | home |
| `home.kicker` | Front of house, fully stocked | home |
| `home.text` | Bars, restaurants and hotels have bought from us since the 90's. Be inspired, find your perfect match. | home |
| `home.why.heading` | Free consultations | home |
| `home.why.label` | Why buy from Splendid | home |
| `home.why.text` | Talk your list through with a buyer, in person or over the phone. Kitting out a new bar or matching an existing set, we check stock, lead times and alternatives with you. | home |
| `link.contact` | Contact us | home, category, product, basket, login, register, account, notfound |
| `link.delivery` | Delivery | home, category, product, basket, login, register, account, notfound |
| `link.help` | Help | home, category, product, basket, login, register, account, notfound |
| `login.error.heading` | Those details don't match. | login |
| `login.error.text` | Check your email and password and try again. | login |
| `login.intro` | Log in to save favourites and send quote requests with your details filled in. | login |
| `login.new` | New to Splendid? | login |
| `login.pending` | Your account is awaiting approval. We'll email you once it's ready. | login |
| `member.account` | My account | home, category, product, basket, login, register, account, notfound |
| `member.login` | Log in | home, category, product, basket, login, register, account, notfound (also in the basket details form) |
| `member.logout` | Log out | home, category, product, basket, login, register, account, notfound |
| `member.register` | Open a trade account | home, category, product, basket, login, register, account, notfound |
| `notfound.basket` | View basket | notfound |
| `notfound.eyebrow` | Page not found | notfound |
| `notfound.heading` | We can't find that page. | notfound |
| `notfound.text` | It may have moved, or the link may be out of date. Head back to the home page or call the trade counter. | notfound |
| `product.add` | Add to basket | product |
| `product.card.view` | View product | category, account |
| `product.categories.heading` | Find it in | product |
| `product.code` | Code | category, product, basket, account |
| `product.each` | each | category, product, account |
| `product.pack` | Sold in packs of | category, product, basket, account |
| `product.perpack` | per pack ex VAT | product |
| `product.perpack.short` | per pack | basket |
| `product.perpackof` | per pack of | category, account |
| `product.quantity` | Quantity | product |
| `product.specs.heading` | Specification | product |
| `product.talk.call` | Call 020 7684 0000 | product |
| `product.talk.email` | Email the team | product |
| `product.talk.heading` | Talk it through | product |
| `product.talk.text` | Kitting out a new bar or matching an existing set? One of our buyers can check stock, lead times and alternatives with you. | product |
| `product.vat` | ex VAT | product |
| `register.done.home` | Back to home | register, notfound |
| `register.done.status` | Application received | register |
| `register.done.text` | Thanks. We'll check your details and email you when your account is approved (usually within one working day). | register |
| `register.error.heading` | We couldn't send your application. | register |
| `register.error.text` | Check the details below and try again. | register |
| `register.exists.heading` | There's already an account for that email. | register |
| `register.exists.text` | Log in instead, or use a different email. | register |
| `register.have` | Already have an account? | register |
| `register.intro` | For bars, restaurants, hotels and caterers. Tell us about your business and we'll set you up. | register |
| `register.password.hint` | At least 8 characters | register |
| `register.submit` | Apply for a trade account | register |
| `site.address` | 151-153 Shoreditch High Street, London E1 6HU | home, category, product, basket, login, register, account, notfound |
| `site.email` | sales@splendidtrading.co.uk | home, category, product, basket, login, register, account, notfound |
| `site.name` | Splendid Trading | home, category, product, basket, login, register, account, notfound |
| `site.phone` | 020 7684 0000 | home, category, product, basket, login, register, account, notfound |
| `usp.1.short` | Talk to a buyer | product |
| `usp.1.text` | Talk your list through with a buyer, in person or over the phone | home, category, product, basket, login, register, account, notfound |
| `usp.1.title` | Free consultations | home, category, product, basket, login, register, account, notfound |
| `usp.2.short` | Same-day collection | product |
| `usp.2.text` | Collect the same day, by appointment with our team | home, category, product, basket, login, register, account, notfound |
| `usp.2.title` | Warehouse in Shoreditch | home, category, product, basket, login, register, account, notfound |
| `usp.3.short` | Across London | product |
| `usp.3.text` | Our drivers across London, safe hands from door to door | home, category, product, basket, login, register, account, notfound |
| `usp.3.title` | Own van delivery | home, category, product, basket, login, register, account, notfound |
| `usp.4.short` | Order by 2pm | product |
| `usp.4.text` | Order before 2pm and we'll get it out the next morning | home, category, product, basket, login, register, account, notfound |
| `usp.4.title` | Next-day delivery | home, category, product, basket, login, register, account, notfound |
| `usp.lead` | Trading over 20 years | home, category, product, basket, login, register, account, notfound |

## Product attributes (HCP-269)

- **Sample values** for code, pack, description and specs are for layout only. The Swing Bottle samples have no pack line, to show a removed `has="pack"` wrapper.
- **Pack wording:** the pack value is always a plain number, so it reads "Sold in packs of 24", as in approved 3a (`product.pack` + `data-iw-product-pack`).
- **Prices (please action):** the pages can't contain script, so they can't work anything out. The website needs to supply these numbers ready to show:

| Slot | What it holds | Pack empty or 1 | Pack of 24 (example) |
|---|---|---|---|
| `data-iw-product-price` | Price of what the customer buys: the whole pack, or the single item | £6.20 | £74.88 |
| `data-iw-product-unit-price` (**new**) | Price of one item (pack price ÷ pack) | £6.20 (same as price) | £3.12 |
| `data-iw-product-pack` | Number in the pack | empty (so every `has="pack"` wrapper is removed; 1 counts as empty) | 24 |
| `data-iw-line-total` | Basket line: price × quantity | £6.20 × qty | £74.88 × qty |

  Where they show: `unit-price` is the big "£3.12 each" on product.html and on every product card. `price` shows in the pack box ("£74.88 per pack ex VAT"), in the card line "£74.88 per pack of 24", and in the basket price column. Both prices are ex VAT, formatted with £ and two decimals.
- **Spec labels** come from Wix `product.spec.<field>`. Suggested wording, so the list reads well (field names other than `capacity_cl` to be confirmed against the data):

| Field | Suggested label |
|---|---|
| `range` | Range |
| `material` | Material |
| `colour` | Colour |
| `capacity_cl` | Capacity (cl) |
| `capacity_oz` | Capacity (oz) |
| `height` | Height |
| `diameter` | Diameter |
| `length` | Length |
| `width` | Width |
| `dishwasher_safe` | Dishwasher safe |
| `microwave_safe` | Microwave safe |
| `microwave_freezer_safe` | Microwave and freezer safe |
| `freezer_safe` | Freezer safe |
| `oven_safe` | Oven safe |
| `stackable` | Stackable |
| `country_of_origin` | Country of origin |
| `outer_barcode` | Outer barcode |

- **Code and pack in the spec list:** they already show by the heading and in the pack box. If the product also puts them in `data-iw-product-specs`, they will appear twice; please leave them out of the list if the contract allows.

## Still missing from the approved design

Superseded by `HCP-308-RESPONSE.md` (v4). Every remaining part of approved 3a is now built (some hidden until its slot exists) or has been dropped, with the reason given there.

## Differences from the prototype (decisions to confirm)

Prototype behaviour has been removed: the localStorage basket, demo login, demo note, "Preview state" toggles, header compaction on scroll, carousel and hover counters. Some items had no slot in the contract, so they are left out rather than kept as fixed demo data.

1. **Product card (revised, HCP-245):** code and pack now show under the name and price, as in approved 3a. Supplier, availability and quick add are still left out (no slots), and the "View product" button stays.
2. **Product page (revised, HCP-245):** brand, code, description, the pack box and the Specification list are back where approved 3a had them. Specification sits above "Find it in" in the left column; the whole block is removed when a product has no specs. Stock count, the pack price, extra thumbnails and "More from …" are still left out (no slots).
3. **Home:** "Featured products" and "Our brands" are left out because neither has a slot on home. The department cards show a decorative pebble in place of a photo, because nav items have no category image. Subcategory lines are also left out. The "Why buy from Splendid" carousel is a single static panel.
4. **Category:** the subcategory chips, filters, sort, grid/list toggle and pagination are left out. A "Departments" side nav (indented by depth) keeps the approved two-column layout. A category image slot sits beside the intro text.
5. **Basket (revised, HCP-264):** the customer details form and the "Quote request sent" confirmation are back, matching approved 3a. The details inputs (`name`, `company`, `email`, `phone`, `postcode`, `notes`) sit inside `<form data-iw-checkout>`, so one submit sends the list and the details. The confirmation is a new state block, `data-iw-basket-sent`, delivered visible like the others; please confirm the contract can show it after checkout (or tell us the slot name to use). Because the contract has no slots for them, the confirmation drops the reference number and the customer's first name ("Thank you." rather than "Thank you, Sam."), the item summary reads "your list", the notes placeholder text is left out, and the "Filled in from your account" line and pre-filled values for logged-in members are left out. Line/item counts and "Clear basket" are still left out. The +/- stepper is replaced by a number input with an "Update" button.
6. **Log in:** "Forgot password" and the "Log in to save favourites" note are left out (no slot).
7. **Register:** the fields follow the contract: first name, last name, business name, email and password. Business type, phone and the terms checkbox are left out. `register.error.*` and `register.exists.*` are new wording, so please approve it.
8. **Account:** the business-name heading, email and "Remove from favourites" text link are left out. The heart removes a saved item.
9. **Header:** the search box is visual only (two text slots, with no input or form). The header now pins the department row and USP strip on scroll, using CSS only. USP descriptions open on hover or keyboard focus, using CSS only.
10. **Links with no destination slot** use `href="#"`: Help, Contact us, Delivery, and the footer policy and about links. Hero buttons jump to the department grid. Phone and email links have the number and address fixed in `tel:`/`mailto:`. If `site.phone` or `site.email` changes in Wix, these hrefs need updating.
11. **Layout (revised v4):** the 1280px canvas zooms 0.9 and 0.8 down to 1024px. Below that the pages reflow (3 columns, then 2 below 640px) instead of zooming. See HCP-308 item 5.

## Reviewing locally

The delivery folder is `splendid-static/`. Serve it as the web root (for example `npx serve splendid-static`), so the `/assets/…` links resolve. `splendid-review/` is a preview-only copy with relative links. Do not deliver it.

## site.js (v4.2, approved by Ben)

One file, `/assets/site.js` (about 9 KB), loaded with `defer` on every page. Every page works fully without it. It makes no outside requests, sets no cookies, uses no storage, and never changes slot contents, form fields or form actions. It adds `class="js"` to `<html>`, and the styles that depend on it are under "v4.2" at the end of `site.css`.

| # | What it does | Where |
|---|---|---|
| 1 | Tap a USP again to close it. Tapping outside, or Esc, closes the USPs, the Sort dropdown and the mobile Filter panel. | Header, category, search, supplier |
| 2 | Adds a −/+ stepper around every quantity input. It only changes the input's value, as typing would. | Product, cards, basket |
| 3 | Running total under Add to basket ("Total £149.76 ex VAT") when the quantity is above 1. It reads the pack price, or the unit price if there's no pack, from the page. | Product |
| 4 | **Add to basket without a reload:** posts the same `data-iw-add-to-basket` form to its own action (same site, `credentials: same-origin`, header `X-Requested-With: site.js`), then the button shows "Added" for 2 s. If the post fails, it submits the form normally. | Product, cards |
| 5 | Shows the department-row Favourites and Basket icons once the header is stuck, in every browser (replaces the CSS-only version). | Every page, 1024 px and up |
| 6 | "Why buy" carousel: dots and Previous/Next arrows, a 6 s autoplay that pauses on hover or focus, and no autoplay with reduced motion. | Home |
| 7 | Scroll-in: section headings and cards below the first screen fade up as they arrive. Off with reduced motion. | All pages |

New text keys: `product.added` Added to basket · `product.added.short` Added · `product.total` Total. The stepper and carousel buttons carry aria-labels from the script (Decrease, Increase, Previous, Next, "1 of 4").

**Please confirm:** that a POST with `X-Requested-With: site.js` to the add-to-basket action returns a 2xx (a redirect that ends in 200 is fine).
