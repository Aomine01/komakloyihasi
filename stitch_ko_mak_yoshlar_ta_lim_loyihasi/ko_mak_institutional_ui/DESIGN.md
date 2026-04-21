# Design System Specification

## 1. Overview & Creative North Star: "The Institutional Luminary"
This design system moves beyond the rigid, "grid-locked" nature of traditional government platforms. Our Creative North Star is **The Institutional Luminary**: a digital experience that feels authoritative yet remarkably light, transparent, and human-centric. 

We reject the "boxed-in" template look. Instead, we embrace high-end editorial layouts characterized by intentional asymmetry, generous white space, and a sophisticated layering of surfaces. By utilizing tonal depth rather than structural lines, we create a sanctuary for educational and financial data—making complex information feel approachable and premium.

---

## 2. Colors: Tonal Architecture
The palette is rooted in the "Ko‘mak" teal and green gradients, balanced by a vast, airy neutral foundation.

### Palette Strategy
*   **Primary (#00685f) & Secondary (#006e2d):** These represent institutional trust. They are reserved for high-impact moments: primary actions, brand accents, and meaningful data visualization.
*   **Surface Hierarchy:** We utilize the `surface-container` tiers to organize information without visual clutter.
*   **The "No-Line" Rule:** To maintain a premium, editorial feel, **1px solid borders are prohibited for sectioning.** Boundaries must be defined solely through background color shifts. For example, a `surface-container-low` section should sit atop a `surface` background to denote a change in context.

### Signature Textures
*   **The Signature Gradient:** For hero sections and primary CTAs, use a linear gradient from `primary` (#00685f) to `primary_container` (#008378) at a 135° angle. This adds "visual soul" and depth.
*   **Glassmorphism:** For floating navigation or modal overlays, use `surface` at 80% opacity with a `24px` backdrop-blur. This ensures the layout feels integrated and multi-dimensional.

---

## 3. Typography: The Editorial Voice
The typography system uses a dual-font strategy to balance character with extreme legibility.

*   **Display & Headline (Public Sans):** Chosen for its clean, geometric authority. We use a high-contrast scale (e.g., `display-lg` at 3.5rem) to create an editorial rhythm. Use `headline-lg` for section starts to command attention.
*   **Title & Body (Inter):** The workhorse of the system. Inter’s high x-height ensures that complex financial and educational text remains legible at smaller sizes. 
*   **Hierarchy as Identity:** Use `title-lg` for card headers and `body-md` for general prose. Ensure a minimum of 1.5x line-height for all body text to maintain the "Institutional Luminary" sense of air and space.

---

## 4. Elevation & Depth: Tonal Layering
We achieve hierarchy through physical layering principles rather than traditional drop shadows.

*   **The Layering Principle:** Depth is created by "stacking" surface-container tiers. 
    *   *Base:* `surface` (#faf8ff)
    *   *Section:* `surface-container-low` (#f2f3ff)
    *   *Card:* `surface-container-lowest` (#ffffff)
*   **Ambient Shadows:** When a component must "float" (e.g., a primary action card), use an extra-diffused shadow: `box-shadow: 0 12px 32px -4px rgba(19, 27, 46, 0.06)`. Note the low opacity and large blur; it should mimic natural ambient light.
*   **The "Ghost Border" Fallback:** If a border is required for accessibility (e.g., in a high-contrast state), use the `outline_variant` at 15% opacity. Never use 100% opaque borders.

---

## 5. Components: Refined Interaction

### Buttons
*   **Primary:** Gradient-filled (Primary to Primary Container) with `lg` (1rem) roundedness. Use `on_primary` white text for maximum contrast.
*   **Secondary:** `surface-container-high` background with `primary` text. No border.
*   **Tertiary:** Ghost style. No background or border. Use `primary` text with a subtle `surface-container` hover state.

### Cards & Modules
*   **Forbid Dividers:** Do not use lines to separate list items within cards. Use 16px or 24px of vertical white space from the Spacing Scale.
*   **Composition:** A standard card should use `surface-container-lowest` on a `surface-container-low` background. 

### Input Fields
*   **Style:** Minimalist. Use `surface-container-high` for the field background with a `sm` (0.25rem) bottom-only accent in `primary` when focused. 
*   **Labels:** Always use `label-md` in `on_surface_variant` positioned clearly above the input.

### Signature Component: The "Benefit Chip"
*   For social project metrics (e.g., "Financial Aid Approved"), use a selection chip with a `secondary_container` background and `on_secondary_container` text. This provides a soft, positive reinforcement.

---

## 6. Do’s and Don’ts

### Do
*   **DO** use intentional asymmetry. Offset a headline to the left while keeping the body text centered to create a sophisticated, custom feel.
*   **DO** prioritize "white space" as a functional element. Let the content breathe to reduce cognitive load on users seeking assistance.
*   **DO** use `lg` and `xl` corner radii for containers to convey a modern, friendly institutional tone.

### Don’t
*   **DON’T** use pure black (#000000) for text. Use `on_surface` (#131b2e) for a softer, premium feel.
*   **DON’T** use standard 1px dividers or "boxes inside boxes." Use background color shifts to define areas.
*   **DON’T** crowd the UI. If a screen feels busy, increase the background-color contrast between sections instead of adding borders or shadows.