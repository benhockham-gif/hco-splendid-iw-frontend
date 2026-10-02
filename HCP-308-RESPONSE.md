# HCP-308: design decisions and v4 export

**To:** Software Engineer, Infinite Websites (HCP-308)
**From:** Claude Design (HCP-269)
**Date:** Fri 2 Oct 2026

Where this file and HANDOVER.md disagree, this file wins.

## How v4 is delivered

- **Works today, no contract change:** items 2, 3, 4, 5, 11 (pack badge, "Sold individually", brand line), 12 ("each"), 15 (Contact us) and 16.
- **Needs a new slot:** the markup is in the pages already, carrying `data-iw-pending="<name>"`. `site.css` hides every `[data-iw-pending]` element, so UAT looks the same as v3 until you wire it up. When a slot works, remove its `data-iw-pending` attribute. Where something shows in its place for now, that element carries `data-iw-pending-fallback="<name>"`: delete it at the same time.
- **Review copies** (`splendid-review/`, `<html class="review">`) show every pending block with a dashed rust outline, and hide the fallbacks.
- **Pending inputs have no `required`** (a hidden required field would block the form). Add `required` when you wire up `register-extra`.
- **New pages:** `search.html`, `supplier.html`.

## Decisions, item by item

**1. Paging.** **24 products per page (confirmed v4.1).** It fills whole rows at 4, 3 and 2 across. Card, basket and gallery images carry `loading="lazy"`, so only the first screen of images loads up front (about 8 on desktop, 4 on mobile). Please keep that attribute on the image elements you render. The toolbar above the grid reads "2,680 products · Page 4 of 112". Under the grid: Previous, first page, …, current −1, current, current +1, …, last page, Next. Show the first and last pages, the current page and one either side, and a gap (…) wherever pages are skipped.
Slots (pending `paging`): `data-iw-category-count` (also `data-iw-search-total`, `data-iw-brand-count`), `data-iw-paging-page`, `data-iw-paging-pages`, `<nav data-iw-paging>` (remove it when there is only 1 page), `<a data-iw-page-prev>` (remove it on page 1), `<a data-iw-page-next>` (remove it on the last page), `<ol data-iw-pages>` › `data-iw-page-item` › `<a data-iw-page-link>` › `data-iw-page-number` with `aria-current="page"` on the current page, and `data-iw-page-gap` items.

**2. Side nav: removed (v4.1).** The departments are already in the sticky header row, so the left-hand list is gone from category, search and supplier pages. The left column now holds only Filters. While `facets` is still pending, the column collapses and the grid goes to 4 across. Subcategories are the chip row (item 8). Optional: put `aria-current="page"` on the current department in the header row and it will show in rust.

**3. Empty categories.** There's a new panel inside `.results`: "Nothing in this category yet", with Call and Back to home buttons. It uses CSS only (`:has()`): when the grid has no `data-iw-product`, the panel shows and the toolbar, grid and pager hide. No slot needed. Recommendation: also leave categories with 0 products out of every nav, if the Publisher can do that.

**4. Photo shapes.** Every image box (card, product page, basket thumbnail, gallery) is now white with `object-fit: contain`, so photos are never cropped. Portrait photos show white space at the sides, which blends into their white backgrounds.

**5. Mobile.** CSS zoom is gone below 1024 px and the layout reflows instead. At 1024 px and above the 1280 canvas zooms 0.8–0.9, as before.
- 640–1023 px: 3-column grids; filters and departments move below the results; one-column product page, basket and forms.
- Below 640 px: 2-column grids; the top links and the header phone number are hidden (the phone number is still on the product page and in the footer); the department row scrolls sideways; USPs show as a 2 × 2 grid.

Body text stays at its 1280 size (11.5–16 px). Please re-test at 390 px.

**6. Search.** The header search is a GET form, `<form data-iw-search action="/search.html">` with `input name="q"` (pending `search`; fallback: the old visual-only box). Change `action` to your search URL. On the search page, put the query in the input's `value`.
`search.html`: `data-iw-search-results` block (heading "Results for “q”" with `data-iw-search-query`; toolbar, grid and pager use the same slots as the category page) and a `data-iw-search-empty` block (tips, call band, popular departments from `data-iw-nav` depth 0). Both are state blocks, delivered visible like the others.

**7. Supplier page (revised v4.2: a landing page, like a department).** `supplier.html` [data coming]. It has:
- Breadcrumb: Home / Our brands / name.
- Heading: `data-iw-brand-name`, `data-iw-brand-text`, and `<img data-iw-brand-image>` (a logo, shown contained on white).
- **Ranges** (pending `brand-ranges`): pebble tiles, `data-iw-brand-ranges` › `data-iw-range-item` › `<a data-iw-range-link>` › `<img data-iw-range-image>` + `data-iw-range-name`. Remove the whole section (`data-iw-brand-has="ranges"`) when the brand has no ranges. Each link opens that range's products (a filtered listing).
- **By department** (pending `brand-categories`): pebble tiles for the departments where this brand has products, `data-iw-brand-categories` › `data-iw-nav-item` › `data-iw-category-link` + name + image. Each link opens that department's listing filtered to the brand.
- **Popular in [brand]** (pending `brand-products`): `data-iw-brand-products` › `data-iw-product`, 8 cards, in Featured order.

- **Catalogue PDF** (pending `catalogue`): a box under the description reading "Catalogue · PDF · 12 MB", with **View** (opens the PDF in a new tab) and **Download** (`download` attribute). Slots: `data-iw-brand-has="catalogue"` (remove it when the brand has no catalogue), two `<a data-iw-brand-catalogue>` links (both set to the PDF URL), and `data-iw-brand-catalogue-size`. New keys: `brand.catalogue` Catalogue · `brand.catalogue.type` PDF · `brand.catalogue.view` View · `brand.catalogue.download` Download. **Question:** where are the PDFs hosted? The current site has a Catalogues page; can we reuse those files?

- **Promo banner** (optional; pending `brand-promo`): a full-width image under the heading with text over it, on a dark gradient so the text stays readable. Slots: `data-iw-brand-has="promo"` (remove the whole banner when the brand has no promo), `<img data-iw-promo-image>` (landscape, at least 2560 × 760, with the subject on the right because the text sits on the left), `data-iw-promo-eyebrow`, `data-iw-promo-title`, `data-iw-promo-text`, `<a data-iw-promo-link>` + `data-iw-promo-cta`. Below 1024 px the text moves to the bottom. **Question:** who enters promos (Splendid in Wix?), and can they have start and end dates?

There's no paging or filters on this page itself. **Questions:** where do ranges live in the data (field name)? And does a range belong to one brand only?
New text keys: `brand.ranges.eyebrow` Collections · `brand.ranges.heading` ranges · `brand.departments.eyebrow` Shop by department · `brand.departments.heading` by department.

**8. Category extras.**
- **Subcategory chips** (pending `subcategories`): `<ul data-iw-subcategories>` › `data-iw-nav-item` › `data-iw-category-link` + name. These are the children of the current category. Remove the block when there are none.
- **Filters** (pending `facets`): link-based, so no script is needed. Each option is a link that adds or removes that filter, with `aria-current="true"` when it's selected. Slots: `data-iw-facets`, `data-iw-facets-clear`, `data-iw-facet` › `data-iw-facet-name`, then `data-iw-facet-option` › `<a data-iw-facet-link>` › `data-iw-facet-label` + `data-iw-facet-count`. Groups: Glass style (from a spec field such as `range` or a style field; please tell us which), Availability [stock], Supplier [brand].
- **Filters on screens under 1024 px (v4.1):** a "Filter" button in the toolbar, next to Sort, opens the filter groups under the toolbar. It uses a checkbox (`#filter-toggle`) placed before the side column, so no script is needed. The button also has a count of filters in use, `data-iw-facets-active`; remove that count when no filters are on.
- **"Featured" sort order (v4.1, please action):** Featured is the default. When a logged-in customer views a list, their favourited (hearted) products come first, then everything else in the normal Featured order. Logged-out customers just get the normal Featured order. This applies wherever Featured is used: category, search, supplier and home Featured products.
- **Sort** (pending `sort`): a `<details>` dropdown of links: `data-iw-sort` › `<a data-iw-sort-link="featured|price-asc|price-desc|name">`, with `aria-current` on the current one and `data-iw-sort-current` holding its label.
- **Grid/list switch: dropped.** It would need script or a view parameter, and it adds little for the cost.

**9. Home.**
- Featured products (pending `featured`): `data-iw-featured-products` › `data-iw-product`, 4 cards.
- Our brands (pending `brands`): `data-iw-brands` › `data-iw-brand-item` › `data-iw-brand-link` + `data-iw-brand-name` [data coming].
- Department photos (pending `nav-image`): `<img data-iw-category-image>` inside each department card's pebble, if nav items can carry the category image. Until then the pebble pattern stays.
- Subcategory lines: **dropped**, because the nav is a flat list.
- "Why buy" carousel: **built in CSS, no slot.** The 4 panels (the existing `home.why.*` and `usp.2–4.*` keys) fade in turn every 6 s and pause on hover. With reduced motion only the first panel shows.

**10. Product page.**
- Brand line: unchanged (it appears when data arrives).
- Stock (pending `stock`): on the price line, aligned right (moved from the code row in v4.2, at Ben's request). The product sets `data-iw-product-stock="in|back|ask"`; the words come from `stock.in`, `stock.back` and `stock.ask` (green, amber or grey dot). The stock count ("1,240 available") is **dropped**: it goes out of date and buyers confirm availability anyway.
- Thumbnails (pending `images`; fallback: the single image): two lists of the same images, `<ul class="g-main" data-iw-product-images>` and `<ul class="g-thumbs" data-iw-product-images>` › `data-iw-product-image-item` › `<img data-iw-product-image-src>`. Thumbnails are radio labels, so clicking one swaps the main image using CSS only (up to 9 images, in a column of 84 px squares to the left of the main photo, as in approved 3a; a row under it below 1024 px). Please confirm inputs outside a form are allowed.
- −/+ stepper: **dropped**. The number input stays (no script).
- "Added to basket" and running total: one block replaces both, `data-iw-product-in-basket` (pending `in-basket`), shown whenever this product is already in the basket: "In your basket · Quantity 2 · £149.76 ex VAT · View basket". Slots: `data-iw-basket-product-quantity`, `data-iw-basket-product-total`.
- "More from …" (pending `related`) [data coming]: `data-iw-related-products` › `data-iw-product`, 4 cards, plus `data-iw-brand-link`.

**11. Product card.**
- Brand line, using the existing `has="brand"` slot: **works now.**
- "Sold in packs of N" badge on the image, inside `has="pack"`: **works now.**
- "Sold individually" shows when the pack wrapper is removed: **works now.**
- Stock dot (pending `stock`).
- Quantity + Add to basket (pending `card-add`; fallback: "View product"): a `<form data-iw-add-to-basket>` inside the card. Please confirm the form works per card.

**12. Basket.**
- "each" for single items: **works now** (shows when the pack wrapper is removed).
- Lines / Items counts (pending `basket-counts`): `data-iw-basket-line-count`, `data-iw-basket-item-count`.
- Clear basket (pending `basket-clear`): `<form data-iw-basket-clear>`.
- On the sent block: `data-iw-quote-ref` (pending `quote-ref`) and `data-iw-member-first-name` (pending `sent-name`). The key `basket.sent.heading.named` reads "Thank you," and the template adds the name and the full stop.

**13. Log in / Register.**
- Forgot password (pending `forgot`): link `data-iw-href="forgot"`. The flow is yours to define. Our proposal: an email form, then a "Check your email" state, then a page to set a new password, reusing the login layout.
- Register (pending `register-extra`): `business_type` select (bar, restaurant, hotel, caterer, other), `phone`, and a `terms` checkbox linking to `data-iw-href="terms"`.

**14. My account** (pending `member-company`, `member-email`, `favourite-link`). The heading becomes the business name, `data-iw-member-company` (fallback: "My account"). `data-iw-member-email` sits next to Log out. There's a "Remove from favourites" text link: a second `<form data-iw-favourite>` in each card.

**15. Links with no destination.**
- Contact us now goes to `mailto:` (works now).
- Please add `data-iw-href` keys for `help`, `delivery`, `terms`, `cookies`, `privacy`, `about`, `brands` and `forgot`.
- Help, Delivery, the policies and About need a plain content page (heading + text). Please add one content-page type to the contract.
- **Splendid must supply the privacy and cookie policy text before go-live.**

**16. "Find it in".** One subcategory is right. The sample now shows one chip.

## New text keys (v4)

`product.single` Sold individually · `stock.in` In stock · `stock.back` On backorder · `stock.ask` Availability on request · `product.inbasket` In your basket · `product.related.eyebrow` From the same range · `product.related.heading` More from · `product.related.all` All · `category.products` products · `category.filter` Filter · `category.filter.clear` Clear all · `category.empty.heading` Nothing in this category yet · `category.empty.text` New lines arrive every week. Call the trade counter and a buyer will find what you need, or pick another department. · `brand.empty.heading` No lines from this brand yet · `brand.empty.text` (as category) · `paging.page` Page · `paging.of` of · `paging.prev` Previous · `paging.next` Next · `sort.label` Sort by · `sort.featured` Featured · `sort.price_asc` Price, low to high · `sort.price_desc` Price, high to low · `sort.name` Name, A to Z · `search.label` Search products · `search.crumb` Search · `search.heading` Results for · `search.empty.heading` No matches for · `search.tips.heading` Try this · `search.tips.1` Check the spelling, or use fewer words · `search.tips.2` Search by product code, like 52-11-120 · `search.tips.3` Use a broader term: “flute” rather than “champagne flute 17cl” · `search.call` Call the trade counter on · `search.popular` Popular departments · `home.featured.eyebrow` Featured products · `home.featured.heading` In stock, ready to go · `home.brands.eyebrow` Hand-picked for the trade · `home.brands.all` All brands · `basket.lines` Lines · `basket.items` Items · `basket.clear` Clear basket · `basket.sent.ref` Reference · `basket.sent.heading.named` Thank you, · `login.forgot` Forgot password? · `form.business_type` Business type · `form.choose` Choose one · `form.business_type.bar|restaurant|hotel|caterer|other` · `register.terms` I agree to the

## Pending names (search the pages for `data-iw-pending="…"`)

`paging`, `subcategories`, `facets`, `sort`, `search`, `stock`, `card-add`, `images`, `in-basket`, `related`, `featured`, `brands`, `nav-image`, `basket-counts`, `basket-clear`, `quote-ref`, `sent-name`, `forgot`, `register-extra`, `member-company`, `member-email`, `favourite-link`.

## v4.1 follow-up: box + pack products (please answer)

Example: Wooden Coffee Stirrers, 250 per box and 12 boxes per pack. The card is first in `category.html`, so the template carries the new parts. The prices and the missing code in that sample are placeholders. Please send:

1. Product code, and the pack price and box price ex VAT, for the stirrers.
2. How box quantity arrives in the data (field name). Proposed slot: `data-iw-product-has="box"` › `data-iw-product-box` (250), pending `box`.
3. What `data-iw-product-unit-price` holds for these products. Proposed: the price of one box, shown as "£2.95 per box" (new key `product.perbox`). The card line then reads "£35.40 per pack of 12 boxes of 250" (new key `product.boxesof`), and the badge reads "Sold in packs of 12 × 250".
4. Can a customer buy a single box, or only whole packs?
5. Roughly how many products are box + pack?

## v4.1: two-tier categories (please action)

This follows how splendidtrading.co.uk works today.

- **Departments (top level, e.g. Glassware) use a new template, `department.html`.** It holds the heading, intro and image (existing slots), then a grid of subcategory tiles, then "Popular in Glassware" (8 products).
  - Tiles: `<ul data-iw-subcategories>` › `data-iw-nav-item` › `data-iw-category-link` + `data-iw-category-name`, with `<img data-iw-category-image>` (pending `nav-image`; until then the tile shows a striped placeholder).
  - Products: `data-iw-department-products` › `data-iw-product`, 8 items in Featured order, so favourites come first.
  - Department pages have no paging, filters or full product list. Customers go into a subcategory, or search.
- **Subcategories (e.g. Cocktails) use `category.html`**, which keeps the full listing: paging, filters and sort.
  - The chip row now shows the **sibling** subcategories, i.e. the other subcategories in the same department, with `aria-current="page"` on the current one. This replaces "children" in item 8.
  - The breadcrumb gains the department (pending `parent-crumb`): `<a data-iw-category-parent>` › `data-iw-category-parent-name`.
- **Links:** the header department row and the Home department cards link to department pages. Subcategory links (chips, tiles, "Find it in") go to category pages.
- **Question:** does any subcategory have its own children (a third level)? If so, tell us and we'll treat it like a department.
- New text keys: `department.popular.eyebrow` Popular right now · `department.popular.heading` Popular in

## v4.1: header icons on scroll

As in approved 3a, the Favourites and Basket icons appear at the right of the department row once the logo row has scrolled away. It's CSS only, using scroll-driven animation: Chrome and Edge 115+, and Safari 26. Other browsers simply don't show them, and the logo-row icons are one scroll up. The new `.cat-icons` block in the department row uses the same `data-iw-href` and text keys as the logo-row icons. Not used below 1024 px, where the header doesn't stick.

## v4.2: header icon states (replaces the favourites count; please action)

Ben's decision: no count badge. Both header hearts (the logo row, and the department row when stuck) turn **red (filled, rust)** when the customer has 1 or more favourites. Both basket icons turn **green (filled)** when the basket has 1 or more items.

Each icon holds two state blocks, delivered visible, like the favourite on/off pair:
- `data-iw-favourites-none` / `data-iw-favourites-some`
- `data-iw-basket-none` / `data-iw-basket-some`

Show the right one in each pair. The "some" blocks are pending `icon-state`; when that's live, remove the attribute, and remove `data-iw-pending-fallback` from the "none" blocks. Logged-out customers always get "none" for favourites. The basket follows the session.

## v4.1: footer credit

"Powered by The Infinite Web" (`footer.powered`) sits in the footer bottom bar on every page, next to the company line, matching Sam I Am's build. It is plain markup that links to https://hockhamandco.co.uk/the-infinite-web (that page is not live yet) and opens in the same tab. Still open (per HCP-210): whether the link takes UTMs, and whether there is a platform spec (ask the 4YP Delivery Manager).

## v4.1: query on the "no script" rule (answered: approved by Ben; see HANDOVER.md, "site.js")

**From Ben (Hockham & Co), via Claude Design**

The contract's no-script rule (HCP-140) is now stopping us doing basic things the approved 3a design needs. For example, a USP dropdown on mobile opens on tap but can't be closed by tapping it again. We're also struggling to animate and to give simple feedback, and it's hurting the look and feel of the site.

**What we can't do without script**
- Close an open panel by tapping it again (USP dropdowns, Sort, Filter).
- The −/+ quantity stepper, and the button changing to "Added ✓" after Add to basket.
- A running total as the quantity changes.
- Carousel arrows and dots, and a carousel that resumes where it left off.
- Header compaction on scroll, in every browser (the CSS version doesn't work in Firefox).
- Filters and sort that apply without a full page reload.
- Scroll-in animation on sections and cards.

**Questions**
1. Why is the rule in place: security, slot rendering, caching, or something else?
2. Can it be relaxed for **one approved file**, `/assets/site.js`, loaded with `defer`, with no inline script and no `on…=` handlers?
3. If so, what do you need to sign it off (review, size limit, no outside requests)?

**What we'd commit to**
- Every page keeps working fully without the script. It only adds behaviour on top, and never writes to slots or data.
- It's one file, the same on every page, and you review it before it goes live.

Until we hear back we'll keep building CSS only. Please reply to Ben.
