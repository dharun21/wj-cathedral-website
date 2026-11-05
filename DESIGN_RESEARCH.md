# Church website design research

Research date: 4 November 2026. The implementation is original; no source code, branding or imagery was copied.

## Sites reviewed

1. [St Mary’s JSO Cathedral — Live TV](https://bsmc.nuvie.in/live-tv/)  
   Strong pattern: tells visitors immediately whether a stream is live, then shows the normal schedule and past recordings. WJ adaptation: no unreliable live indicator; click-to-load recordings plus honest availability language.

2. [Maranatha Church, Chennai](https://maranathachurch.in/)  
   Strong pattern: service timings are prominent and grouped by day/language, followed closely by online worship. WJ adaptation: large, high-contrast timing cards positioned early on the page.

3. [Annai Vailankanni Shrine Basilica, Chennai](https://annaivailankannibasilicachennai.com/)  
   Strong pattern: worship schedules, Tamil/English access, gallery and current videos coexist without hiding core visitor information. WJ adaptation: persistent EN/தமிழ் control, readable Tamil sizing and visitor-first navigation.

4. [Christ Chapel Chennai](https://www.christchapel.in/)  
   Strong pattern: concise “join us this Sunday” entry, plan-your-visit action, directions and service times. WJ adaptation: focused hero actions and a complete visit section with address, call and map routes.

5. [Peniel Tabernacle, Vellore](https://penieltabernacle.in/peniel/)  
   Strong pattern: a welcoming opening and clear path to full-service recordings. WJ adaptation: warm, non-denominational welcome copy that avoids inventing history or doctrine.

6. [Full Life Assembly of God — Online Church](https://www.flagchurch.org/online-church/)  
   Strong pattern: mobile-friendly platform choices and grouped service times. WJ adaptation: YouTube-first cards with an external fallback and no heavy API integration.

## Design decisions

- **Information order:** welcome → first visit → timings → announcements → videos → gallery → verified activities → directions. This follows a first-time visitor’s likely questions.
- **Visual identity:** deep navy conveys calm and trust; muted gold adds warmth; ivory improves long-form readability. The identity is intentionally original and should be replaced/adjusted if official brand guidelines arrive.
- **Typography:** Georgia is used sparingly for English display headings; system sans-serif handles body copy. Tamil uses Noto Sans Tamil/Nirmala UI for reliable glyphs and generous line height.
- **Navigation:** sticky, familiar labels and section-aware active states; a single-column mobile menu and 44 px+ touch targets.
- **Media:** click-to-load YouTube reduces initial network cost. Hero/gallery placeholders are visibly marked, avoiding false representation.
- **Motion:** short reveal/menu transitions only, with reduced-motion support and no animation dependency for content visibility.
- **Accessibility:** semantic sections, one H1, strong focus rings, keyboard carousel/lightbox controls, descriptive labels, readable contrast and document language updates.

