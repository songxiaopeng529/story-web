# Lumenix reference and implementation

Reference: https://sceneai.art/landing-pages?asset=6a67913e0cd891fdf74d7145

The public preview is a 4.67-second, 1468 × 1080 screen recording. It shows a warm red, full-viewport portrait turning from left profile toward frontal view, with the page content scrolling independently. It is not an exposed interactive source site. No source model, underlying animation, original font or code is available in the public preview.

## Visual plan

- Ember background #a63225; dark red #281414; action orange #ff4b13; light text #fffdfb; pale translucent lines #ffffff35.
- Heavy, tightly spaced sans-serif LUMENIX wordmark; small sans-serif navigation and services; bold, centered statement.
- Full-bleed pinned portrait, upper-left service list, lower-right hero copy, viewport-width wordmark. Translucent collaborators row, centered introduction, offset floating image cards.
- Match the reference's red cinematic aesthetic instead of interpreting “clean” as a white generic template.

## Implementation

The isolated Next.js route /lumenix/ keeps the existing homepage intact. All text and interactive elements are actual HTML. A sticky canvas behind the content draws a scroll-selected portrait frame. A passive scroll handler calculates normalized progress over 2.65 viewport heights. requestAnimationFrame smooths the target; rendering stops when settled. Reverse scrolling reverses the same sequence. The effect does not hijack wheel or touch gestures.

The six portrait keyframes were reconstructed from the public reference with image generation, removing baked-in UI. FFmpeg optical-flow interpolation creates 101 JPEG frames (600 × 440). These are an approximation: reconstructed imagery and interpolated frames are not the original high-resolution animation or true 3D geometry. Original licensed source frames can replace them without changing the interaction design. Full pixel and motion parity requires the original licensed source media, typefaces, and complete page reference.

Three project thumbnails are cropped from unobstructed portions of the public preview, for this requested reference study. The original preview recording is not shipped as the website. Additional footer, project descriptions, journal notes, and local brief dialog are implemented extensions beyond what the short reference exposes.

The first frame is a priority-loaded poster. Six anchor frames load first, then four parallel loaders fetch intermediates. Canvas respects device pixel ratio (capped at 2), viewport resize, mobile framing, and reduced-motion preferences. Images and URLs respect the existing deployment basePath. No new runtime dependencies.

Navigation scrolls to sections, project cards open accessible native dialogs, and the contact dialog exports a local text brief. It does not pretend to submit data to a nonexistent backend. Escape closes dialogs. Mobile has an expandable menu and touch-friendly controls.

## Browser verification — 2026-09-13

- Opened `/lumenix/` in the local development server on port 3100.
- Inspected desktop 1280 × 720: found and fixed wordmark width and CTA overlap; portrait remains pinned while content scrolls and the face changes angle.
- Inspected mobile 390 × 844: document width and viewport width both 390 (no horizontal overflow). Mobile navigation opens, Projects link navigates and closes menu, Afterlight opens its detail, and Escape dismisses it.
- Contact dialog opens with labeled fields; Escape restores the page. Back-to-top navigates to the top anchor.
- Fixed Next Image's warning about a fill image inside a sticky parent by using explicit intrinsic dimensions and absolute CSS sizing.
- Production build and ESLint passed. No claim of pixel-identical source fidelity: original high-resolution media remains required. Contact download and reduced-motion switching were not exercised in the browser in this pass.
