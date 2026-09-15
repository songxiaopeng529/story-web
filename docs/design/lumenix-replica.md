> 2026-09-14 正式化：唯一实现已迁入 `apps/web/src/app`，正式入口为 `/`；品牌为 Story，素材目录为 `apps/web/public/images/story` 与 `apps/web/public/videos/story`。下文为这一版的设计与验证记录，旧试验路由及旧素材已删除。

# Lumenix reference and implementation

Reference: https://sceneai.art/landing-pages?asset=6a67913e0cd891fdf74d7145

The public preview is a 4.67-second, 1468 × 1080 screen recording. It shows a warm red, full-viewport portrait turning from left profile toward frontal view, with the page content scrolling independently. It is not an exposed interactive source site. No source model, underlying animation, original font or code is available in the public preview.

## Visual plan

- Ember background #a63225; dark red #281414; action orange #ff4b13; light text #fffdfb; pale translucent lines #ffffff35.
- Heavy, tightly spaced sans-serif LUMENIX wordmark; small sans-serif navigation and services; bold, centered statement.
- Full-bleed pinned portrait, upper-left service list, lower-right hero copy, viewport-width wordmark. Translucent collaborators row, centered introduction, offset floating image cards.
- Match the reference's red cinematic aesthetic instead of interpreting “clean” as a white generic template.

## Implementation

The production Next.js homepage in `apps/web/src/app` uses actual HTML for all text and interactive elements. A sticky, paused HTML video behind the content follows normalized scroll progress over 2.65 viewport heights. A passive scroll handler updates the target time; requestAnimationFrame and serialized seek events ease toward it. Reverse scrolling reverses the same sequence. The effect does not hijack wheel or touch gestures.

The current portrait uses a user-supplied Seedance video received on 2026-09-14. The original is HEVC, 1920 × 1080, 24 fps, 6.041667 seconds. It was converted to H.264, yuv420p, CRF 20, all-intra frames (`-g 1 -keyint_min 1`) and faststart for browser compatibility and seeking. The shipped file is `apps/web/public/videos/story/model-turn.mp4` (9,758,118 bytes); the original is unchanged. A fixed generator badge in the lower-right background was removed from the shipped video and poster with a bounded background interpolation that does not touch the subject. No audio, autoplay, or synthetic frame interpolation is used. This custom model replaces the previous reconstructed 101-JPEG sequence; those legacy assets are no longer requested by the production page.

A priority-loaded first-frame poster remains visible while the video loads or if it fails. The video and poster share cover sizing. Reduced-motion preferences hold the first frame. Asset URLs respect the existing deployment basePath. No new runtime dependencies.

Three project thumbnails are cropped from unobstructed portions of the public preview, for this requested reference study. The original preview recording is not shipped as the website. Additional footer, project descriptions, journal notes, and local brief dialog are implemented extensions beyond what the short reference exposes. The custom portrait follows the user's later direction; this is not a claim of pixel-identical original media.

Navigation scrolls to sections, project cards open accessible native dialogs, and the contact dialog exports a local text brief. It does not pretend to submit data to a nonexistent backend. Escape closes dialogs. Mobile has an expandable menu and touch-friendly controls.

## Browser verification — 2026-09-13

- Opened `/lumenix/` in the local development server on port 3100.
- Inspected desktop 1280 × 720: found and fixed wordmark width and CTA overlap; portrait remains pinned while content scrolls and the face changes angle.
- Inspected mobile 390 × 844: document width and viewport width both 390 (no horizontal overflow). Mobile navigation opens, Projects link navigates and closes menu, Afterlight opens its detail, and Escape dismisses it.
- Contact dialog opens with labeled fields; Escape restores the page. Back-to-top navigates to the top anchor.
- Fixed Next Image's warning about a fill image inside a sticky parent by using explicit intrinsic dimensions and absolute CSS sizing.
- Production build and ESLint passed. No claim of pixel-identical source fidelity: original high-resolution media remains required. Contact download and reduced-motion switching were not exercised in the browser in this pass.

## Video integration verification — 2026-09-14

- Browser at 1481 × 931: video loaded at readyState 4, duration 6.041667, paused at time 0.
- Forward scrolling reached time 6.0. Reverse scrolling to scrollY 1054.5 reached time 2.583333; returning to the top restored time 0. Video remains paused while scroll controls its position.
- Mobile 390 × 844: inspected the new portrait and UI, document width 390 with no horizontal overflow.
- Typecheck, ESLint and production static build passed. The temporary mobile viewport override was reset after inspection.
- Reduced-motion switching and real mobile-device decoder performance were not exercised in this pass.
