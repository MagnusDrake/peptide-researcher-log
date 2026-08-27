# The Aura Aesthetic & UX Philosophy

You are developing **Aura**, a premium, elite-level local PWA. You must adhere to the following design constraints and behavioral guidelines:

## 1. Cinematic Transitions
- **No jarring jumps:** Never instantly swap full-screen components or tabs. 
- **Transitions:** Always use Tailwind transition classes (e.g., `transition-all duration-[400ms] ease-out`) combined with opacity, subtle scale shifts (`scale-[0.98]`), and blur effects (`blur-[2px]`) to create fluid, cinematic crossfades.

## 2. Luxury Typography
- **Headings & Navigation:** Avoid thick, chunky, oversized fonts.
- **Style:** Use small, highly-tracked uppercase text (e.g., `text-[0.65rem] font-semibold uppercase tracking-widest text-slate-400`).
- **Contrast:** Pair muted structural text with bright, glowing cyan/emerald highlights for data points.

## 3. Flashy yet Efficient
- **Proactive Ideation:** The user values "flashy and elegant" design that actually works. If you are building a new UI component, proactively propose cinematic or elite-feeling UX enhancements (e.g., glassmorphism, glowing borders, smooth entrance animations) instead of defaulting to standard, boring layouts.
