import { CuratedStack } from '../types';

export const CURATED_STACKS: CuratedStack[] = [
  {
    id: 'wolverine-stack',
    name: 'The Wolverine Healing Stack',
    tagline: 'Dual Angiogenesis & Cellular Migration for Maximum Connective Tissue Repair',
    description: 'The golden standard research combination for severe tendon, ligament, cartilage, and muscle recovery. Combines the localized angiogenesis and collagen-promoting actions of BPC-157 with the systemic cellular actin remodeling of TB-500.',
    goals: ['Joint / Tendon Repair', 'Muscle Recovery', 'Inflammation Reduction', 'Gut Permeability'],
    experienceLevel: 'Beginner',
    peptides: [
      {
        peptideId: 'bpc-157',
        peptideName: 'BPC-157',
        typicalDose: '250 - 500 mcg',
        frequency: '1-2x daily',
        timing: 'Morning and evening near injury or abdominal SubQ',
        synergyReason: 'Locally stimulates VEGF receptor expression, promotes early granulation tissue formation, and recruits fibroblasts to the lesion.'
      },
      {
        peptideId: 'tb-500',
        peptideName: 'TB-500',
        typicalDose: '2.0 - 2.5 mg',
        frequency: '2x weekly (e.g. Mon / Thu)',
        timing: 'Any time of day; systemic SubQ',
        synergyReason: 'Upregulates actin polymerization and cell motility across the body, preventing dysfunctional fibrosis and scar tissue.'
      }
    ],
    warnings: [
      'Ensure proper hydration and active physical therapy rehabilitation alongside research protocol.'
    ]
  },
  {
    id: 'gh-axis-stack',
    name: 'The GH Axis Synergy Stack',
    tagline: 'Pulsatile GHRH + Ghrelin Receptor Agonism for Natural Somatotropin Amplification',
    description: 'Combining a GHRH analogue (CJC-1295 No DAC) with a selective GH secretagogue (Ipamorelin) produces a synergistic, supra-additive growth hormone pulse 3x to 5x stronger than either peptide administered alone, while respecting pituitary negative feedback.',
    goals: ['Muscle Mass & Tone', 'Deep Sleep (Stage 3/4)', 'Collagen Density', 'Body Composition'],
    experienceLevel: 'Intermediate',
    peptides: [
      {
        peptideId: 'cjc-1295-no-dac',
        peptideName: 'CJC-1295 (No DAC / Mod GRF 1-29)',
        typicalDose: '100 mcg',
        frequency: '1-2x daily (5 days on / 2 days off)',
        timing: 'Fasted before bedtime or upon waking',
        synergyReason: 'Binds to pituitary GHRH receptors, priming somatotroph cAMP pathways for endogenous GH production.'
      },
      {
        peptideId: 'ipamorelin',
        peptideName: 'Ipamorelin',
        typicalDose: '100 - 200 mcg',
        frequency: '1-2x daily (5 days on / 2 days off)',
        timing: 'Fasted before bedtime or upon waking',
        synergyReason: 'Triggers calcium ion influx via GHS-R1a receptors, prompting instantaneous somatotropin release without cortisol/prolactin spike.'
      }
    ],
    warnings: [
      'Must be administered in a strictly fasted state (at least 90-120 minutes post-meal) as circulating carbohydrates and insulin blunt GH release via somatostatin.'
    ]
  },
  {
    id: 'glow-stack',
    name: 'The Ultimate Glow & Matrix Remodeling Stack',
    tagline: 'Copper Peptide Gene Rejuvenation + Collagen Angiogenesis',
    description: 'A premium aesthetic and matrix remodeling stack designed to upregulate type I/III collagen synthesis, thicken the dermis, enhance skin elasticity, and support follicular hair vitality.',
    goals: ['Skin Elasticity & Glow', 'Collagen Synthesis', 'Scar Remodeling', 'Hair Vitality'],
    experienceLevel: 'Beginner',
    peptides: [
      {
        peptideId: 'ghk-cu',
        peptideName: 'GHK-Cu (Copper Tripeptide-1)',
        typicalDose: '1.5 - 2.0 mg',
        frequency: 'Once daily SubQ',
        timing: 'Morning or evening SubQ (diluted)',
        synergyReason: 'Resets gene expression in dermal fibroblasts, stimulates decorin, collagen, and matrix metalloproteinases for tissue remodeling.'
      },
      {
        peptideId: 'bpc-157',
        peptideName: 'BPC-157',
        typicalDose: '250 - 500 mcg',
        frequency: 'Once daily SubQ',
        timing: 'Morning SubQ',
        synergyReason: 'Accelerates microvascular capillary networks in the skin and neutralizes local post-injection inflammation from GHK-Cu.'
      }
    ],
    warnings: [
      'GHK-Cu can cause localized soreness if reconstituted too concentrated. Dilute adequately or draw BPC-157 into the same syringe.'
    ]
  },
  {
    id: 'metabolic-reset-stack',
    name: 'The Metabolic Incretin & Mitochondrial Reset Stack',
    tagline: 'Dual Incretin Agonism + AMPK Activation & Muscle Sparing',
    description: 'Designed for intensive cardiometabolic research, combining weekly GLP-1/GIP receptor agonism with mitochondrial AMPK activation and NNMT inhibition to maximize lipid oxidation while sparing skeletal lean muscle.',
    goals: ['Weight Loss & Satiety', 'Visceral Fat Reduction', 'Mitochondrial Energy', 'Insulin Sensitivity'],
    experienceLevel: 'Intermediate',
    peptides: [
      {
        peptideId: 'tirzepatide',
        peptideName: 'Tirzepatide',
        typicalDose: '2.5 - 7.5 mg',
        frequency: 'Once weekly',
        timing: 'Consistent day each week',
        synergyReason: 'Suppresses appetite, delays gastric emptying, and improves adipose insulin sensitivity via dual GLP-1 and GIP agonism.'
      },
      {
        peptideId: 'mots-c',
        peptideName: 'MOTS-c',
        typicalDose: '5.0 mg',
        frequency: '2-3x weekly',
        timing: 'Morning or pre-workout',
        synergyReason: 'Activates skeletal muscle AMPK and GLUT4, burning lipids and preventing metabolic rate slowdown during caloric deficit.'
      },
      {
        peptideId: '5-amino-1mq',
        peptideName: '5-Amino-1MQ',
        typicalDose: '50 mg',
        frequency: 'Daily (Oral/SubQ)',
        timing: 'Morning with first meal',
        synergyReason: 'Inhibits NNMT, elevates cellular NAD+, and prevents muscle protein catabolism.'
      }
    ],
    warnings: [
      'Follow conservative 4-week titration curves for Tirzepatide to minimize GI side effects.'
    ]
  },
  {
    id: 'cellular-longevity-stack',
    name: 'The Cellular Longevity & Telomere Protocol',
    tagline: 'Telomerase Induction, Epigenetic Resets & Mitochondrial Redox',
    description: 'An advanced longevity research stack focusing on cellular rejuvenation hallmarks: telomerase gene activation, mitochondrial electron chain restoration, and sirtuin longevity enzyme replenishment.',
    goals: ['Telomere Maintenance', 'Mitochondrial ATP', 'Circadian Regulation', 'Epigenetic Rejuvenation'],
    experienceLevel: 'Advanced',
    peptides: [
      {
        peptideId: 'epithalon',
        peptideName: 'Epithalon',
        typicalDose: '5.0 - 10.0 mg',
        frequency: 'Daily for 10-20 days (1-2x yearly cycle)',
        timing: 'Morning upon waking',
        synergyReason: 'Epigenetically induces telomerase reverse transcriptase (TERT) and normalizes pineal melatonin secretion.'
      },
      {
        peptideId: 'nad-plus',
        peptideName: 'NAD+',
        typicalDose: '50 mg',
        frequency: '2-3x weekly',
        timing: 'Morning fasted',
        synergyReason: 'Provides essential substrate for SIRT1-7 sirtuins and PARP1 DNA repair enzymes.'
      },
      {
        peptideId: 'ss-31',
        peptideName: 'SS-31 (Elamipretide)',
        typicalDose: '2.0 mg',
        frequency: 'Daily (4-6 weeks)',
        timing: 'Morning SubQ',
        synergyReason: 'Binds cardiolipin on the inner mitochondrial membrane, eliminating ROS leakage and boosting cellular ATP synthesis.'
      }
    ]
  },
  {
    id: 'neuro-clarity-stack',
    name: 'The Neuro-Clarity & BDNF Plasticity Stack',
    tagline: 'Dual Neuropeptide Synergism for Focus, Memory & Emotional Resilience',
    description: 'A nootropic stack combining the cognitive-boosting BDNF/NGF upregulation of Semax with the non-sedating, anxiolytic and enkephalin-preserving actions of Selank.',
    goals: ['Focus & Working Memory', 'Stress & Anxiety Relief', 'Neuroplasticity', 'Mental Stamina'],
    experienceLevel: 'Beginner',
    peptides: [
      {
        peptideId: 'semax',
        peptideName: 'Semax',
        typicalDose: '300 - 500 mcg',
        frequency: '1-2x daily',
        timing: 'Morning and early afternoon (SubQ or Intranasal)',
        synergyReason: 'Upregulates BDNF and TrkB receptors in the hippocampus, boosting executive function and focus.'
      },
      {
        peptideId: 'selank',
        peptideName: 'Selank',
        typicalDose: '250 - 300 mcg',
        frequency: '1-2x daily',
        timing: 'Morning and mid-day (SubQ or Intranasal)',
        synergyReason: 'Modulates GABAergic tone, stabilizes dopamine/serotonin, and prevents burnout under high cognitive load.'
      }
    ]
  },
  {
    id: 'klow-quad-stack',
    name: 'The KLOW Quad-Synergy Recovery Stack',
    tagline: 'GHK-Cu + BPC-157 + TB-500 + KPV for Total Matrix Rebuilding & Deep Anti-Inflammatory Defense',
    description: 'An elite 4-peptide regenerative powerhouse. Combines the collagen and gene-resetting power of GHK-Cu, the localized microvascular angiogenesis of BPC-157, the cellular motility of TB-500, and the potent NF-κB anti-inflammatory modulation of KPV.',
    goals: ['Full-Body Connective Tissue Repair', 'Skin Matrix & Collagen Synthesis', 'NF-κB Inflammation Defense', 'Gut-Skin Barrier Protection'],
    experienceLevel: 'Intermediate',
    peptides: [
      {
        peptideId: 'klow-blend',
        peptideName: 'KLOW Blend (GHK-Cu / BPC-157 / TB-500 / KPV)',
        typicalDose: '1.5 - 2.0 mg',
        frequency: 'Daily (5 days on / 2 days off)',
        timing: 'Morning SubQ in abdominal tissue',
        synergyReason: 'Four-way multi-targeted pathway: GHK-Cu for collagen remodeling, BPC-157 for VEGF angiogenesis, TB-500 for actin cell mobility, and KPV for down-regulating mucosal & dermal inflammatory cytokines.'
      }
    ],
    warnings: [
      'Solution exhibits a deep blue hue from copper peptide. Dilute with at least 3-4 mL of bacteriostatic water to prevent localized stinging.'
    ]
  },
  {
    id: 'cagrisema-metabolic-stack',
    name: 'The CagriSema Incretin-Amylin Synergy Stack',
    tagline: 'Dual Hypothalamic & Area Postrema Pathway for Maximal Satiety & Metabolic Optimization',
    description: 'Pairs long-acting GLP-1 receptor agonism (Semaglutide) with a long-acting amylin analogue (Cagrilintide). Activates non-overlapping neurochemical satiety circuits to provide superior appetite suppression and sustained metabolic momentum.',
    goals: ['Dual-Pathway Satiety', 'Visceral Fat Reduction', 'Delayed Gastric Emptying', 'Metabolic Homeostasis'],
    experienceLevel: 'Intermediate',
    peptides: [
      {
        peptideId: 'cagrisema-blend',
        peptideName: 'CagriSema Blend (Semaglutide + Cagrilintide)',
        typicalDose: '0.25 - 1.0 mg',
        frequency: 'Once weekly',
        timing: 'Consistent day each week SubQ',
        synergyReason: 'GLP-1 stimulates insulin and hindbrain fullness; amylin analogue slows gastric transit and curtails hedonistic food cravings via the area postrema.'
      }
    ],
    warnings: [
      'Begin at the lowest research dose (0.25mg) and titrate in 4-week steps to allow gastrointestinal accommodation.'
    ]
  }
];
