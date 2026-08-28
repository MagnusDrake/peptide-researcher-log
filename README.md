# 🧪 Peptide Researcher Log & Reconstitution Calculator (PWA)

A scientific Progressive Web App (PWA) for peptide reconstitution calculation, research protocol logging, pharmacokinetic simulation, injection site rotation, and peer knowledge exchange.

---

## ✨ Key Features

1. **Reconstitution & Multi-Peptide Blend Calculator (2, 3, 4+ Compounds)**:
   - Math for single peptides and multi-compound stack vials (e.g. Wolverine Blend, Glow Blend, Incretin+B12, etc.).
   - Interactive high-resolution SVG syringe with animated fluid levels and meniscus for U-100, U-50, and U-30 insulin syringes.
   - Expandable multi-peptide stack calculator with dynamic constituent rows, GLP-1 4-week titration scheduler, and unit converter.

2. **Peptide Knowledge Base (25+ Research Compounds)**:
   - Evidence-based profiles for BPC-157, TB-500, Tirzepatide, Semaglutide, Retatrutide, Ipamorelin, CJC-1295, Tesamorelin, Epithalon, MOTS-c, SS-31, GHK-Cu, KPV, AOD-9604, Semax, Selank, Dihexa, Tα1, MT-2, PT-141, NAD+, 5-Amino-1MQ, Oxytocin, Cagrilintide, Sermorelin.
   - Molecular formulas, amino acid sequences, mechanisms, half-lives, BAC suggestions, stability, and PubMed citations.
   - Side-by-side peptide comparison and custom compound creator.

3. **Intelligent Matcher & Curated Stacks**:
   - Multi-step interactive quiz scoring affinity across 8 research target areas.
   - Curated synergy stacks (*The Wolverine Stack*, *GH Axis Synergy Stack*, *Metabolic Incretin Reset*, *Cellular Longevity*, etc.) with 1-click protocol adoption.

4. **Protocol Manager & 28-Day Stability Tracker**:
   - Days of the week scheduling, administration timing, brand tracking.
   - 28-day stability gauge monitoring reconstituted shelf-life and degradation risk.
   - Shareable Markdown research protocol cards.

5. **Daily Schedule & Subcutaneous Body Map**:
   - Today's injection task queue with one-click logging and confetti celebration.
   - 12-zone SubQ anatomical body rotation map tracking injection sites to avoid lipohypertrophy.
   - 1-compartment Pharmacokinetic (PK) decay & accumulation curve simulator.

6. **Journal & Peer Researcher Hub**:
   - Timeline of logged doses with subjective recovery, energy, and sleep scores.
   - JSON backup/restore and CSV export.
   - Privacy-first opt-in peer sharing for observational findings.

---

## 🛠️ Getting Started

### Development
```bash
npm install
npm run dev
```

### Production Build & PWA Testing
```bash
npm run build
npm run preview
```
Open `http://localhost:5173/` in your browser. Click **"Install App"** to install it locally as a native PWA on iOS, Android, macOS, or Windows.
