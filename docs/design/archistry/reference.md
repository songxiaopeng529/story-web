# Archistry reference audit

Reference: https://video.twimg.com/amplify_video/2079827956160249856/vid/avc1/2930x2160/7Y_lDw70z1CbHo77.mp4?tag=29

Direct browser playback verified 2026-09-13. Duration 4.667 seconds. Frame 2930 × 2160. This is NOT the existing Lumenix implementation.

The reference shows one full-screen architecture hero. The glass pavilion changes from unlit to warmly illuminated, with a subtle camera move. Navigation and copy remain stationary. No lower sections or click outcomes are exposed.

Visible copy:
- Archistry (four-loop flower mark)
- About us / Properties / Agents / Services / Blogs
- Contact us (header pill)
- • Top Rated - Real Estate Agency
- A smarter way to / sell your home
- Helping real estate professionals promote listings / and sell homes with confidence.
- Contact us / What we do →

At 977 × 720 displayed video size: header brand x82 y49; header center nav begins x342 y51; header CTA x823 y51. Main text left x73; eyebrow y438; title top y459, approximately 42px line-height 46px; description y568, 13px line-height21px; CTA top629 height32. Bottom main-content inset 59px. Video fills reference frame, with no visible webpage black borders (black sidebars belong to player).

Fidelity blocker: reference recording contains baked-in text. A real HTML reconstruction requires a clean background animation (or reconstruction of that animation); embedding the screen recording alone is not an implementation of the website. Original background asset/site URL has not been identified. Exact typography source unknown.

## Current deliverable

`/archistry.html`: single self-contained HTML, embedded generated PNG, inline CSS/JS, real selectable headings/navigation, responsive menu, native dialogs, local enquiry export. No external libraries or network dependencies. The clean background was generated from the observed reference screenshots; it is an approximation, not original source media. A 4.667-second CSS brightness/scale entrance approximates the recorded lighting/camera change but does not reproduce spatial illumination.

Browser verification: 977 × 720 desktop visual comparison and typography spacing adjustment; contact modal opens and Escape dismisses. 390 × 844 mobile screenshot and menu expanded state checked. Document scrollWidth equals viewport width (390). Viewport override reset. Preview served at http://127.0.0.1:3127/archistry.html .

Still incomplete for requested exact fidelity: original background motion, exact building/furnishings details, source font and logo curves. Need original website URL or clean source animation to close those gaps. Navigation destinations and contact flow are demonstration behavior because reference contains no evidence of those pages. Do not claim exact completion.

## Source investigation follow-up

Searched the exact video ID, brand + real estate, visible sentence, and portfolio title. Found https://dribbble.com/shots/25991710-Archistry-Real-Estate-Landing-Page by Bymahdii for XOLAB. Browser screenshot confirms it is a different design: centered “Archistry — Your Partner in Real Estate Expertise” heading, blue daytime sky/white building, and Home/Search/Pricing/Blog/About/FAQ navigation. It cannot substantiate the requested twilight pavilion reference and must not be used as its source. Contra's related “Archistry Real Estate Landing Page Development” mention also does not prove a match. No verified original site or clean animation located.

Current exact-fidelity blocker remains missing source background animation. Existing standalone HTML retained; no speculative replacement from an unrelated design.
