import { Peptide } from '../types';

export const PEPTIDES_DATABASE: Peptide[] = [
  {
    id: 'bpc-157',
    name: 'BPC-157',
    aliases: ['Body Protection Compound 157', 'PL-10', 'Bepecin', 'Pentadecapeptide BPC 157'],
    category: 'healing',
    categoryLabel: 'Tissue & Gut Repair',
    subCategory: 'Gastrointestinal & Musculoskeletal',
    summary: 'A 15-amino acid synthetic pentadecapeptide derived from human gastric juice with profound angiogenesis and collagen repair properties.',
    mechanism: 'Up-regulates growth hormone receptor expression on tendon fibroblasts, promotes FAK-paxillin pathway phosphorylation, increases nitric oxide synthesis, and stimulates VEGF-driven angiogenesis in injured tissues.',
    molecularFormula: 'C62H98N16O22',
    sequence: 'Gly-Glu-Pro-Pro-Pro-Gly-Lys-Pro-Ala-Asp-Asp-Ala-Gly-Leu-Val',
    commonVialSizesMg: [5, 10],
    typicalBacWaterMl: [2, 2.5, 3],
    reconstitutionTips: [
      'BPC-157 is relatively stable compared to GH secretagogues, but should still be handled gently.',
      'Slowly stream bacteriostatic water down the inside glass wall to minimize agitation.',
      'Allow the powder to dissolve on its own without aggressive shaking.'
    ],
    storageGuidance: {
      lyophilized: 'Store dry powder at -20°C for long term (up to 2 years) or 2-8°C refrigerated for up to 6 months.',
      reconstituted: 'Store refrigerated at 2-8°C (36-46°F). Protect from direct light.',
      shelfLifeReconstitutedDays: 30,
      lightSensitive: true
    },
    standardDosing: {
      minDose: 250,
      maxDose: 750,
      typicalDose: 500,
      unit: 'mcg',
      frequency: '1-2x daily (e.g. 250mcg twice daily)',
      timing: 'Morning and evening; subQ near site of injury or systemically in abdominal fat.',
      cycleLengthWeeks: '4 - 8 weeks'
    },
    halfLifeHours: 4,
    halfLifeLabel: '~4 hours (biological tissue repair cascade lasts much longer)',
    researchIndications: [
      'Tendon & Ligament Healing',
      'Gastric Ulcer & Gut Permeability (Leaky Gut)',
      'Angiogenesis & Blood Vessel Repair',
      'Muscle Strain Recovery',
      'Anti-inflammatory Joint Support'
    ],
    synergisticWith: ['tb-500', 'ghk-cu', 'kpv'],
    sideEffectWarnings: [
      'Generally well-tolerated in preclinical models.',
      'Mild injection site redness, transient lightheadedness or nausea at higher doses.'
    ],
    literatureReferences: [
      {
        title: 'Pentadecapeptide BPC 157 and its role in accelerating musculoskeletal soft tissue healing',
        journal: 'Current Pharmaceutical Design',
        year: 2010,
        pmid: '21039474'
      },
      {
        title: 'BPC 157 accelerates healing of transected rat Achilles tendon and improves tensile strength',
        journal: 'Journal of Orthopaedic Research',
        year: 2003,
        pmid: '14559132'
      }
    ]
  },
  {
    id: 'tb-500',
    name: 'TB-500 (Thymosin Beta-4)',
    aliases: ['Tβ4', 'Thymosin β4 Active Fragment 17-23', 'Ac-LKKTETQ'],
    category: 'healing',
    categoryLabel: 'Tissue & Systemic Recovery',
    subCategory: 'Cellular Migration & Actin Regulation',
    summary: 'A synthetic version of the naturally occurring 43-amino acid peptide Thymosin Beta-4, known for regulating actin polymerization and systemic tissue regeneration.',
    mechanism: 'Binds to G-actin, sequestering actin monomers and orchestrating cellular motility, tissue remodeling, angiogenesis, and inhibition of pathological fibrosis/scar tissue formation.',
    molecularFormula: 'C212H350N56O78S',
    sequence: 'Ac-Ser-Asp-Lys-Pro-Asp-Met-Ala-Glu-Ile-Glu-Lys-Phe-Asp-Lys-Ser-Lys-Leu-Lys-Lys-Thr-Glu-Thr-Gln-Glu-Lys-Asn-Pro-Leu-Pro-Ser-Lys-Glu-Thr-Ile-Glu-Gln-Glu-Lys-Gln-Ala-Gly-Glu-Ser',
    commonVialSizesMg: [5, 10],
    typicalBacWaterMl: [2, 2.5],
    reconstitutionTips: [
      'Reconstitute with 2.0 mL BAC water for straightforward 2.5mg/mL or 5mg/mL calculations.',
      'Do not vortex. Gently swirl vial until completely dissolved.'
    ],
    storageGuidance: {
      lyophilized: 'Store at -20°C for up to 24 months. Stable at room temp during shipping for 2-3 weeks.',
      reconstituted: 'Refrigerate at 2-8°C. Best utilized within 28 days.',
      shelfLifeReconstitutedDays: 28,
      lightSensitive: true
    },
    standardDosing: {
      minDose: 2.0,
      maxDose: 5.0,
      typicalDose: 2.5,
      unit: 'mg',
      frequency: '2x weekly during loading phase (weeks 1-4); 1x every 1-2 weeks during maintenance',
      timing: 'Any time of day; systemic SubQ or IM.',
      cycleLengthWeeks: '4 - 8 weeks'
    },
    halfLifeHours: 24,
    halfLifeLabel: '~24 hours (systemic migration effects persist for days)',
    researchIndications: [
      'Cardiovascular Tissue Remodeling',
      'Corneal & Dermal Wound Repair',
      'Systemic Muscle & Connective Tissue Recovery',
      'Fibrosis & Scar Reduction',
      'Flexibility & Joint Mobility'
    ],
    synergisticWith: ['bpc-157', 'ghk-cu'],
    sideEffectWarnings: [
      'Mild temporary head rush or warmth post-injection in some subjects.',
      'Local subcutaneous tissue redness.'
    ],
    literatureReferences: [
      {
        title: 'Thymosin beta4 accelerates wound healing and promotes angiogenesis',
        journal: 'Annals of the New York Academy of Sciences',
        year: 2007,
        pmid: '17978280'
      }
    ]
  },
  {
    id: 'tirzepatide',
    name: 'Tirzepatide',
    aliases: ['LY3298176', 'Dual GIP/GLP-1 RA', 'Twincretin'],
    category: 'metabolic',
    categoryLabel: 'Incretin & Weight Management',
    subCategory: 'Dual GIP / GLP-1 Receptor Agonist',
    summary: 'A 39-amino acid synthetic peptide with dual agonist activity at both GIP and GLP-1 receptors, featuring a C20 fatty diacid moiety that extends half-life for weekly administration.',
    mechanism: 'Potentiates glucose-dependent insulin secretion, suppresses glucagon release, delays gastric emptying, enhances central satiety in the hypothalamus, and improves insulin sensitivity in adipose tissue via GIP receptor agonism.',
    molecularFormula: 'C225H348N48O68',
    commonVialSizesMg: [5, 10, 15, 30],
    typicalBacWaterMl: [1, 2, 3],
    reconstitutionTips: [
      'Concentration planning is crucial for accurate micro-dosing.',
      'Adding 1.0 mL to a 10mg vial yields 1.0mg per 10 units (U-100 syringe).',
      'Reconstitute with cold BAC water and refrigerate immediately.'
    ],
    storageGuidance: {
      lyophilized: 'Store at -20°C for long term preservation. Stable at 2-8°C for up to 12 months.',
      reconstituted: 'Refrigerate at 2-8°C (36-46°F). Do not freeze reconstituted solution. Use within 28-35 days.',
      shelfLifeReconstitutedDays: 30,
      lightSensitive: true
    },
    standardDosing: {
      minDose: 2.5,
      maxDose: 15.0,
      typicalDose: 5.0,
      unit: 'mg',
      frequency: 'Once weekly (every 7 days)',
      timing: 'Same day each week, any time of day, with or without food. Rotate subQ sites (abdomen, thigh, upper arm).',
      cycleLengthWeeks: '12 - 24+ weeks with 4-week titration increments'
    },
    halfLifeHours: 120,
    halfLifeLabel: '~5 days (117-120 hours) — supports steady 7-day dosing',
    researchIndications: [
      'Metabolic Glycemic Homeostasis',
      'Substantial Adipose Tissue Loss & Lean Mass Preservation',
      'Cardiometabolic Risk Reduction',
      'Hepatic Steatosis / Liver Fat Reduction',
      'Central Appetite Satiety Modulation'
    ],
    synergisticWith: ['cagrilintide', 'bpc-157', 'mots-c', 'nad-plus'],
    sideEffectWarnings: [
      'Gastrointestinal symptoms (nausea, constipation, diarrhea, reflux) predominantly during dose titration.',
      'Risk of hypoglycemia when combined with insulin secretagogues.',
      'Boxed warning in FDA label regarding medullary thyroid carcinoma in rodent models.'
    ],
    literatureReferences: [
      {
        title: 'Tirzepatide Once Weekly for the Treatment of Obesity (SURMOUNT-1)',
        journal: 'New England Journal of Medicine',
        year: 2022,
        pmid: '35658024'
      }
    ]
  },
  {
    id: 'semaglutide',
    name: 'Semaglutide',
    aliases: ['GLP-1 RA', 'NN9535'],
    category: 'metabolic',
    categoryLabel: 'Incretin & Weight Management',
    subCategory: 'Selective GLP-1 Receptor Agonist',
    summary: 'A 31-amino acid GLP-1 receptor agonist modified with an Aib8 substitution and a C18 fatty acid chain enabling strong albumin binding and once-weekly kinetics.',
    mechanism: 'Selectively binds and activates the GLP-1 receptor, stimulating glucose-dependent insulin secretion, reducing postprandial glucagon, and slowing gastric emptying to suppress appetite.',
    molecularFormula: 'C187H291N45O59',
    commonVialSizesMg: [3, 5, 10],
    typicalBacWaterMl: [1, 2, 2.5],
    reconstitutionTips: [
      'Due to small starting research doses (0.25mg / 250mcg), using 2.0 mL BAC water in a 5mg vial allows easy drawing (10 units = 0.25mg).'
    ],
    storageGuidance: {
      lyophilized: 'Store dry at -20°C (up to 2 years).',
      reconstituted: 'Refrigerate at 2-8°C. Do not freeze. Discard after 30 days.',
      shelfLifeReconstitutedDays: 30,
      lightSensitive: true
    },
    standardDosing: {
      minDose: 0.25,
      maxDose: 2.4,
      typicalDose: 1.0,
      unit: 'mg',
      frequency: 'Once weekly (every 7 days)',
      timing: 'Consistent day each week; SubQ in abdomen, thigh, or upper arm.',
      cycleLengthWeeks: '16 - 24+ weeks (titrating: 0.25mg x 4wks -> 0.5mg x 4wks -> 1.0mg x 4wks -> 1.7mg -> 2.4mg)'
    },
    halfLifeHours: 168,
    halfLifeLabel: '~7 days (165-168 hours)',
    researchIndications: [
      'Glucoregulatory Control',
      'Weight Management & Caloric Reduction',
      'Cardiovascular Event Risk Reduction',
      'Renal Protective Effects'
    ],
    synergisticWith: ['cagrilintide', 'bpc-157'],
    sideEffectWarnings: [
      'Nausea, vomiting, diarrhea, constipation, reduced appetite, fatigue during initial weeks.'
    ],
    literatureReferences: [
      {
        title: 'Once-Weekly Semaglutide in Adults with Overweight or Obesity (STEP 1)',
        journal: 'New England Journal of Medicine',
        year: 2021,
        pmid: '33567185'
      }
    ]
  },
  {
    id: 'retatrutide',
    name: 'Retatrutide',
    aliases: ['LY3437943', 'Triple G / GGG Agonist', 'GLP-1/GIP/Glucagon Tri-Agonist'],
    category: 'metabolic',
    categoryLabel: 'Incretin & Weight Management',
    subCategory: 'Triple Hormone Receptor Agonist',
    summary: 'A 39-amino acid peptide with potent triple agonism at GLP-1, GIP, and Glucagon receptors, leading to unprecedented metabolic expenditure and hepatic lipid clearing in clinical trials.',
    mechanism: 'Combines the appetite suppression and insulinotropic effects of GLP-1/GIP with the direct energy expenditure, thermogenesis, and hepatic fat clearance mediated by glucagon receptor activation.',
    molecularFormula: 'C221H342N48O68',
    commonVialSizesMg: [5, 10, 15],
    typicalBacWaterMl: [1.5, 2, 3],
    reconstitutionTips: [
      'Gently reconstitute without foaming. Maintain strict cold chain storage.'
    ],
    storageGuidance: {
      lyophilized: 'Store at -20°C for up to 2 years.',
      reconstituted: 'Refrigerate at 2-8°C. Protect from light. Use within 28 days.',
      shelfLifeReconstitutedDays: 28,
      lightSensitive: true
    },
    standardDosing: {
      minDose: 1.0,
      maxDose: 12.0,
      typicalDose: 4.0,
      unit: 'mg',
      frequency: 'Once weekly (every 7 days)',
      timing: 'Same day weekly; SubQ.',
      cycleLengthWeeks: '16 - 24+ weeks (ramp: 1-2mg -> 4mg -> 8mg -> 12mg)'
    },
    halfLifeHours: 144,
    halfLifeLabel: '~6 days (140-145 hours)',
    researchIndications: [
      'Massive Adipose Mass Reduction',
      'Metabolic Rate & Energy Expenditure Elevation',
      'Non-Alcoholic Fatty Liver Disease (MASLD / MASH) Resolution',
      'Insulin Sensitivity Restoration'
    ],
    synergisticWith: ['mots-c', 'bpc-157'],
    sideEffectWarnings: [
      'Transient elevated resting heart rate in early weeks (glucagon receptor mediated).',
      'Gastrointestinal disturbances, cutaneous hyperesthesia / skin sensitivity.'
    ],
    literatureReferences: [
      {
        title: 'Triple-Hormone-Receptor Agonist Retatrutide for Obesity — A Phase 2 Trial',
        journal: 'New England Journal of Medicine',
        year: 2023,
        pmid: '37366315'
      }
    ]
  },
  {
    id: 'ipamorelin',
    name: 'Ipamorelin',
    aliases: ['NNC 26-0161', 'Selective GH Secretagogue'],
    category: 'gh_secretagogue',
    categoryLabel: 'Growth Hormone & Anabolism',
    subCategory: 'Pentapeptide Ghrelin Receptor Agonist',
    summary: 'A highly selective growth hormone secretagogue pentapeptide that stimulates pituitary pulsatile GH release without elevating cortisol, prolactin, or ACTH.',
    mechanism: 'Mimics ghrelin at the GHS-R1a receptor, triggering calcium influx and signal transduction in the pituitary gland to release endogenous somatotropin pulses.',
    molecularFormula: 'C38H49N9O5',
    sequence: 'Aib-His-D-2-Nal-D-Phe-Lys-NH2',
    commonVialSizesMg: [2, 5, 10],
    typicalBacWaterMl: [2, 2.5],
    reconstitutionTips: [
      'Sensitive peptide. Avoid shaking. Draw with gentle vacuum.',
      'Often co-reconstituted with CJC-1295 (No DAC) in combined research protocols.'
    ],
    storageGuidance: {
      lyophilized: 'Store at -20°C for up to 2 years.',
      reconstituted: 'Refrigerate at 2-8°C. Best within 21-28 days.',
      shelfLifeReconstitutedDays: 28,
      lightSensitive: true
    },
    standardDosing: {
      minDose: 100,
      maxDose: 300,
      typicalDose: 200,
      unit: 'mcg',
      frequency: '1-3x daily (e.g. morning fasted and/or before bed), often 5 days on / 2 days off',
      timing: 'Fasted state (at least 90-120 min post-meal); 30 min before bed or upon waking.',
      cycleLengthWeeks: '8 - 16 weeks'
    },
    halfLifeHours: 2,
    halfLifeLabel: '~2 hours (rapid pituitary stimulation with peak GH at 30-45 mins)',
    researchIndications: [
      'Endogenous Growth Hormone Pulsatility',
      'Deep Wave Slow-Sleep (Stage 3/4) Enhancement',
      'Connective Tissue Recovery & Collagen Density',
      'Body Composition Optimization'
    ],
    synergisticWith: ['cjc-1295-no-dac', 'bpc-157', 'tesamorelin'],
    sideEffectWarnings: [
      'Mild water retention, temporary head flush, tingling in extremities, slight transient hunger.'
    ],
    literatureReferences: [
      {
        title: 'Ipamorelin, the first selective growth hormone secretagogue',
        journal: 'European Journal of Endocrinology',
        year: 1998,
        pmid: '9849822'
      }
    ]
  },
  {
    id: 'cjc-1295-no-dac',
    name: 'CJC-1295 (No DAC / Mod GRF 1-29)',
    aliases: ['Modified GRF (1-29)', 'Mod GRF', 'Tetrasubstituted GHRH'],
    category: 'gh_secretagogue',
    categoryLabel: 'Growth Hormone & Anabolism',
    subCategory: 'GHRH Analogue',
    summary: 'A 29-amino acid modified Growth Hormone Releasing Hormone analogue engineered with 4 amino acid substitutions for resistance to DPP-4 cleavage.',
    mechanism: 'Binds to GHRH receptors on somatotrophs, activating adenylate cyclase and cAMP signaling to amplify physiological, pulsatile growth hormone synthesis.',
    molecularFormula: 'C152H252N44O42',
    commonVialSizesMg: [2, 5],
    typicalBacWaterMl: [2, 2.5],
    reconstitutionTips: [
      'Very delicate molecular structure. Never shake or drop vial. Store strictly at 2-8°C once reconstituted.'
    ],
    storageGuidance: {
      lyophilized: 'Store at -20°C for up to 2 years.',
      reconstituted: 'Refrigerate at 2-8°C. Use within 21 days for maximum potency.',
      shelfLifeReconstitutedDays: 21,
      lightSensitive: true
    },
    standardDosing: {
      minDose: 100,
      maxDose: 200,
      typicalDose: 100,
      unit: 'mcg',
      frequency: '1-3x daily (commonly stacked 1:1 with Ipamorelin 100mcg/100mcg)',
      timing: 'Fasted (morning or before sleep). 5 days on / 2 days off protocol.',
      cycleLengthWeeks: '8 - 12 weeks'
    },
    halfLifeHours: 0.5,
    halfLifeLabel: '~30 minutes (rapid trigger for physiological GH pulse)',
    researchIndications: [
      'Amplification of Natural GH Secretion',
      'Muscle Protein Synthesis & Recovery',
      'Cellular Rejuvenation & Skin Density',
      'Fat Metabolism'
    ],
    synergisticWith: ['ipamorelin', 'ghrp-2', 'bpc-157'],
    sideEffectWarnings: [
      'Transient facial flushing, euphoric rush, slight injection site irritation.'
    ],
    literatureReferences: [
      {
        title: 'Structure-activity relationship of growth hormone-releasing hormone analogs',
        journal: 'Peptides',
        year: 2005,
        pmid: '15967540'
      }
    ]
  },
  {
    id: 'tesamorelin',
    name: 'Tesamorelin',
    aliases: ['TH9507', 'Egrifta', 'Hexenoyl-GHRH (1-44)'],
    category: 'gh_secretagogue',
    categoryLabel: 'Growth Hormone & Anabolism',
    subCategory: 'Stabilized GHRH Analogue',
    summary: 'A synthetic 44-amino acid form of GHRH modified with a trans-3-hexenoic acid group, specifically researched and approved for reducing deep visceral adipose tissue.',
    mechanism: 'Stimulates pituitary synthesis and secretion of endogenous GH with subsequent IGF-1 production, preferentially mobilizing visceral fat deposits and improving hepatic lipid profiles.',
    molecularFormula: 'C221H366N72O67S',
    commonVialSizesMg: [2, 5, 10],
    typicalBacWaterMl: [1, 2],
    reconstitutionTips: [
      'Sensitive peptide. Use sterile BAC water or sterile water for injection as directed. Keep cold.'
    ],
    storageGuidance: {
      lyophilized: 'Store at -20°C or refrigerated dry powder at 2-8°C.',
      reconstituted: 'Refrigerate at 2-8°C. Utilize within 14-21 days.',
      shelfLifeReconstitutedDays: 21,
      lightSensitive: true
    },
    standardDosing: {
      minDose: 1.0,
      maxDose: 2.0,
      typicalDose: 1.0,
      unit: 'mg',
      frequency: 'Once daily (5-7 days per week)',
      timing: 'Administer SubQ at bedtime or early morning fasted.',
      cycleLengthWeeks: '8 - 16 weeks'
    },
    halfLifeHours: 0.5,
    halfLifeLabel: '~30-45 minutes',
    researchIndications: [
      'Visceral Adipose Tissue (VAT / Deep Belly Fat) Reduction',
      'Cognitive Function & Executive Processing',
      'Hepatic Triglyceride Reduction',
      'IGF-1 Optimization'
    ],
    synergisticWith: ['ipamorelin', 'bpc-157'],
    sideEffectWarnings: [
      'Peripheral edema, arthralgia (joint tightness), injection site erythema, transient glucose elevation.'
    ],
    literatureReferences: [
      {
        title: 'Effects of tesamorelin on visceral fat and carotids in HIV-associated lipodystrophy',
        journal: 'Lancet',
        year: 2010,
        pmid: '20153890'
      }
    ]
  },
  {
    id: 'epithalon',
    name: 'Epithalon (Epitalon)',
    aliases: ['Epithalone', 'Ala-Glu-Asp-Gly', 'AGAG', 'Khavinson Pineal Peptide'],
    category: 'longevity',
    categoryLabel: 'Longevity & Anti-Aging',
    subCategory: 'Pineal Bioregulator Tetrapeptide',
    summary: 'A synthetic tetrapeptide identified by Dr. Vladimir Khavinson that up-regulates telomerase activity, normalizes pineal melatonin secretion, and extends cellular lifespan in models.',
    mechanism: 'Interacts directly with histone proteins and chromatin to activate telomerase gene expression (TERT), restoring telomere length and stabilizing circadian endocrine rhythms.',
    molecularFormula: 'C14H22N4O9',
    sequence: 'Ala-Glu-Asp-Gly',
    commonVialSizesMg: [10, 50, 100],
    typicalBacWaterMl: [2, 3, 5],
    reconstitutionTips: [
      'Very stable tetrapeptide. Dissolves rapidly and cleanly in BAC water.'
    ],
    storageGuidance: {
      lyophilized: 'Store dry at -20°C for up to 3 years.',
      reconstituted: 'Refrigerate at 2-8°C. Stable for 30-45 days.',
      shelfLifeReconstitutedDays: 30,
      lightSensitive: false
    },
    standardDosing: {
      minDose: 5.0,
      maxDose: 10.0,
      typicalDose: 10.0,
      unit: 'mg',
      frequency: 'Daily for 10-20 consecutive days, repeated 1-2 times per year',
      timing: 'Morning upon waking; SubQ.',
      cycleLengthWeeks: '10 - 20 days course (1-2x yearly)'
    },
    halfLifeHours: 3,
    halfLifeLabel: '~3 hours (epigenetic telomerase activation lasts for months)',
    researchIndications: [
      'Telomerase Activation & Telomere Maintenance',
      'Pineal Gland Rejuvenation & Melatonin Rhythm',
      'Immune Bioregulation & T-Cell Senescence',
      'All-Cause Longevity Biometrics'
    ],
    synergisticWith: ['mots-c', 'thymosin-alpha-1', 'nad-plus'],
    sideEffectWarnings: [
      'Virtually absent side effects in clinical Russian aging trials; very rare mild injection site warmth.'
    ],
    literatureReferences: [
      {
        title: 'Peptides of pineal gland and thymus prolong lifespan and suppress carcinogenesis in mice',
        journal: 'Biogerontology',
        year: 2003,
        pmid: '12888942'
      }
    ]
  },
  {
    id: 'mots-c',
    name: 'MOTS-c',
    aliases: ['Mitochondrial Open Reading Frame of the 12S rRNA Type-c', 'Exercise-in-a-Bottle'],
    category: 'longevity',
    categoryLabel: 'Mitochondrial & Energy',
    subCategory: 'Mitochondria-Derived Peptide (MDP)',
    summary: 'A 16-amino acid peptide encoded within the mitochondrial genome that acts as an endocrine metabolic signal, activating AMPK and promoting cellular energy homeostasis.',
    mechanism: 'Inhibits the folate-methionine cycle to elevate AICAR, selectively activating AMPK and GLUT4 glucose transporters in skeletal muscle to accelerate lipid oxidation and metabolic flexibility.',
    molecularFormula: 'C101H152N28O22S2',
    sequence: 'Met-Arg-Trp-Gln-Glu-Met-Gly-Tyr-Ile-Phe-Tyr-Pro-Arg-Lys-Leu-Arg',
    commonVialSizesMg: [5, 10, 20],
    typicalBacWaterMl: [2, 2.5],
    reconstitutionTips: [
      'Reconstitute with cold BAC water. Some researchers observe slight opalescence which clarifies upon gentle rolling.'
    ],
    storageGuidance: {
      lyophilized: 'Store at -20°C.',
      reconstituted: 'Refrigerate at 2-8°C. Best used within 21 days.',
      shelfLifeReconstitutedDays: 21,
      lightSensitive: true
    },
    standardDosing: {
      minDose: 5.0,
      maxDose: 10.0,
      typicalDose: 5.0,
      unit: 'mg',
      frequency: '2-3x weekly (or 5mg 3x/week for 4 weeks)',
      timing: 'Morning or 45-60 minutes pre-exercise; SubQ.',
      cycleLengthWeeks: '4 - 6 weeks'
    },
    halfLifeHours: 4,
    halfLifeLabel: '~4 hours (metabolic AMPK shift persists 24-48 hours)',
    researchIndications: [
      'Mitochondrial Biogenesis & ATP Production',
      'AMPK Pathway Activation & Insulin Sensitivity',
      'Physical Endurance & Muscle Resistance to Fatigue',
      'Metabolic Flexibility & Fat Oxidation'
    ],
    synergisticWith: ['ss-31', 'nad-plus', 'tirzepatide'],
    sideEffectWarnings: [
      'Subcutaneous injection site stinging or burning if injected cold or rapidly; warm vial to room temperature before draw.'
    ],
    literatureReferences: [
      {
        title: 'The mitochondrial-derived peptide MOTS-c promotes metabolic homeostasis and prevents obesity',
        journal: 'Cell Metabolism',
        year: 2015,
        pmid: '25738459'
      }
    ]
  },
  {
    id: 'ss-31',
    name: 'SS-31 (Elamipretide)',
    aliases: ['Bendavia', 'MTP-131', 'Szeto-Schiller 31', 'D-Arg-Dmt-Lys-Phe-NH2'],
    category: 'longevity',
    categoryLabel: 'Mitochondrial & Energy',
    subCategory: 'Cardiolipin-Targeting Tetrapeptide',
    summary: 'A cell-permeable tetrapeptide that selectively targets and binds cardiolipin in the inner mitochondrial membrane, optimizing electron transport chain efficiency.',
    mechanism: 'Penetrates inner mitochondrial membrane, anchors to cardiolipin, prevents cytochrome c detachment, reduces reactive oxygen species (ROS) leakage, and restores ATP generation in aged or ischemic tissues.',
    molecularFormula: 'C32H49N9O5',
    commonVialSizesMg: [10, 50],
    typicalBacWaterMl: [2, 3],
    reconstitutionTips: [
      'Easily reconstituted in sterile BAC water. Handle with standard aseptic technique.'
    ],
    storageGuidance: {
      lyophilized: 'Store at -20°C for up to 2 years.',
      reconstituted: 'Refrigerate at 2-8°C. Use within 28 days.',
      shelfLifeReconstitutedDays: 28,
      lightSensitive: true
    },
    standardDosing: {
      minDose: 1.0,
      maxDose: 5.0,
      typicalDose: 2.0,
      unit: 'mg',
      frequency: 'Daily or 5 days on / 2 days off',
      timing: 'Morning; SubQ.',
      cycleLengthWeeks: '4 - 8 weeks'
    },
    halfLifeHours: 2,
    halfLifeLabel: '~2 hours',
    researchIndications: [
      'Mitochondrial Bioenergetics & Cardiolipin Protection',
      'Cardioprotective Function & Heart Failure Models',
      'Skeletal Muscle Fatigue Reversal in Aged Subjects',
      'Reduction of Oxidative Stress'
    ],
    synergisticWith: ['mots-c', 'nad-plus'],
    sideEffectWarnings: [
      'Mild injection site reactions.'
    ],
    literatureReferences: [
      {
        title: 'Mitochondria-targeted peptide SS-31 rescues cardiac dysfunction and reverses aging biomarkers',
        journal: 'Aging Cell',
        year: 2020,
        pmid: '32573981'
      }
    ]
  },
  {
    id: 'ghk-cu',
    name: 'GHK-Cu (Copper Peptide)',
    aliases: ['Copper Tripeptide-1', 'Gly-His-Lys Copper', 'Skin Remodeling Peptide'],
    category: 'cosmetic',
    categoryLabel: 'Skin, Hair & Aesthetics',
    subCategory: 'Copper Chelated Tripeptide',
    summary: 'A naturally occurring tripeptide complex with copper (II) ions that remodels skin extracellular matrix, stimulates collagen/elastin, and supports hair follicle growth.',
    mechanism: 'Modulates over 4,000 human genes toward a youthful state, promotes synthesis of decorin, collagen type I & III, stimulates angiogenesis, and neutralizes free radicals.',
    molecularFormula: 'C14H24CuN6O4',
    commonVialSizesMg: [50, 100],
    typicalBacWaterMl: [2.5, 3, 5],
    reconstitutionTips: [
      'Characterized by a vibrant royal blue color once dissolved in BAC water.',
      'Can cause localized sting/soreness if injected too concentrated; dilute to 20-25mg/mL or combine with 1-2mg BPC-157 to mitigate PIP (post-injection pain).'
    ],
    storageGuidance: {
      lyophilized: 'Store dry at 2-8°C or -20°C for extended storage.',
      reconstituted: 'Refrigerate at 2-8°C. Stable for 30-60 days.',
      shelfLifeReconstitutedDays: 45,
      lightSensitive: true
    },
    standardDosing: {
      minDose: 1.0,
      maxDose: 5.0,
      typicalDose: 2.0,
      unit: 'mg',
      frequency: 'Once daily SubQ (or topical cosmetic formulation)',
      timing: 'Morning or evening; SubQ into fatty tissue.',
      cycleLengthWeeks: '4 - 6 weeks on, followed by 4 weeks off'
    },
    halfLifeHours: 1,
    halfLifeLabel: '~1-2 hours (copper delivery and gene activation cascade is sustained)',
    researchIndications: [
      'Collagen & Elastin Extracellular Matrix Synthesis',
      'Dermal Elasticity, Fine Line Reduction & Skin Glow',
      'Hair Follicle Enlargement & Growth Phase Support',
      'Wound Healing & Scar Tissue Remodeling'
    ],
    synergisticWith: ['bpc-157', 'tb-500'],
    sideEffectWarnings: [
      'Localized post-injection pain (PIP) or tender lump if injected too concentrated. Dilution is strongly recommended.'
    ],
    literatureReferences: [
      {
        title: 'Regenerative and Protective Actions of the GHK-Cu Peptide in the Light of the New Gene Data',
        journal: 'International Journal of Molecular Sciences',
        year: 2018,
        pmid: '29986520'
      }
    ]
  },
  {
    id: 'kpv',
    name: 'KPV',
    aliases: ['Lys-Pro-Val', 'alpha-MSH (11-13)', 'C-terminal α-MSH'],
    category: 'healing',
    categoryLabel: 'Tissue & Gut Repair',
    subCategory: 'Anti-Inflammatory Tripeptide',
    summary: 'A potent anti-inflammatory tripeptide derived from alpha-Melanocyte Stimulating Hormone that suppresses inflammatory cascades without pigmentary tanning effects.',
    mechanism: 'Inactivates NF-κB nuclear translocation, downregulates proinflammatory cytokines (TNF-α, IL-1β, IL-6), and exhibits direct antifungal and antimicrobial activity in mucosal tissues.',
    molecularFormula: 'C16H31N5O4',
    sequence: 'Lys-Pro-Val',
    commonVialSizesMg: [5, 10],
    typicalBacWaterMl: [2, 2.5],
    reconstitutionTips: [
      'Very water soluble. Reconstitute gently in BAC water.'
    ],
    storageGuidance: {
      lyophilized: 'Store dry at -20°C for up to 2 years.',
      reconstituted: 'Refrigerate at 2-8°C. Best within 30 days.',
      shelfLifeReconstitutedDays: 30,
      lightSensitive: false
    },
    standardDosing: {
      minDose: 200,
      maxDose: 500,
      typicalDose: 300,
      unit: 'mcg',
      frequency: '1-2x daily',
      timing: 'Morning and evening; SubQ or oral gastro-resistant capsule for gut-specific research.',
      cycleLengthWeeks: '4 - 8 weeks'
    },
    halfLifeHours: 2,
    halfLifeLabel: '~2 hours',
    researchIndications: [
      'Inflammatory Bowel Disease (IBD / Crohn\'s / Colitis) Healing',
      'Systemic Inflammatory NF-κB Suppression',
      'Dermatitis, Eczema & Psoriasis Relief',
      'Microbial & Fungal Biofilm Regulation'
    ],
    synergisticWith: ['bpc-157', 'thymosin-alpha-1'],
    sideEffectWarnings: [
      'Very favorable safety profile in preclinical literature.'
    ],
    literatureReferences: [
      {
        title: 'The anti-inflammatory tripeptide KPV inhibits NF-kappaB and reduces colitis severity',
        journal: 'Gastroenterology',
        year: 2007,
        pmid: '17698579'
      }
    ]
  },
  {
    id: 'aod-9604',
    name: 'AOD-9604',
    aliases: ['Advanced Obesity Drug 9604', 'hGH Fragment 177-191 with Tyr', 'Tyr-hGH (177-191)'],
    category: 'metabolic',
    categoryLabel: 'Incretin & Weight Management',
    subCategory: 'Lipolytic GH Fragment',
    summary: 'A modified 16-amino acid C-terminal fragment of human Growth Hormone that stimulates lipolysis (fat breakdown) and inhibits lipogenesis without affecting blood glucose or IGF-1.',
    mechanism: 'Binds to adipocyte beta-3 adrenergic pathways, triggering hormone-sensitive lipase (HSL) to release fatty acids from adipose tissue without inducing insulin resistance.',
    molecularFormula: 'C78H123N23O23S2',
    commonVialSizesMg: [2, 5],
    typicalBacWaterMl: [2, 2.5],
    reconstitutionTips: [
      'Add BAC water slowly. Solution may appear cloudy initially but clears upon equilibration in refrigerator.'
    ],
    storageGuidance: {
      lyophilized: 'Store dry at -20°C.',
      reconstituted: 'Refrigerate at 2-8°C. Use within 21-28 days.',
      shelfLifeReconstitutedDays: 28,
      lightSensitive: true
    },
    standardDosing: {
      minDose: 300,
      maxDose: 1000,
      typicalDose: 500,
      unit: 'mcg',
      frequency: 'Once daily in the morning in a strictly fasted state',
      timing: 'Fasted morning, 45 min before physical activity or breakfast.',
      cycleLengthWeeks: '8 - 12 weeks'
    },
    halfLifeHours: 0.5,
    halfLifeLabel: '~30 minutes',
    researchIndications: [
      'Localized & Systemic Lipolysis (Adipose Mobilization)',
      'Cartilage Repair & Chondrocyte Regeneration',
      'Non-Glycemic Fat Metabolism (Zero effect on blood glucose/IGF-1)'
    ],
    synergisticWith: ['bpc-157', 'semaglutide', 'tirzepatide'],
    sideEffectWarnings: [
      'Mild injection site redness, headache in rare cases.'
    ],
    literatureReferences: [
      {
        title: 'Metabolic studies of the C-terminal fragment of human growth hormone, AOD9604',
        journal: 'Obesity Research',
        year: 2004,
        pmid: '15601968'
      }
    ]
  },
  {
    id: 'semax',
    name: 'Semax (Heptapeptide)',
    aliases: ['ACTH (4-10) Pro-Gly-Pro', 'Semaks', 'Nootropic ACTH Fragment'],
    category: 'nootropic',
    categoryLabel: 'Cognitive & Neuroprotective',
    subCategory: 'Neurogenic Neuropeptide',
    summary: 'A synthetic heptapeptide derived from adrenocorticotropic hormone (ACTH 4-10) that stimulates BDNF and TrkB receptor expression, enhancing memory, focus, and neuroplasticity.',
    mechanism: 'Triggers Brain-Derived Neurotrophic Factor (BDNF) and Nerve Growth Factor (NGF) synthesis in the hippocampus, regulates dopamine and serotonin turnover, and exerts potent antioxidant neuroprotection.',
    molecularFormula: 'C37H51N9O10S',
    sequence: 'Met-Glu-His-Phe-Pro-Gly-Pro',
    commonVialSizesMg: [10, 30, 60],
    typicalBacWaterMl: [2, 3],
    reconstitutionTips: [
      'Available for SubQ or intranasal spray research. Use sterile bacteriostatic water for subQ or sterile deionized saline for nasal preparation.'
    ],
    storageGuidance: {
      lyophilized: 'Store at -20°C (up to 2 years).',
      reconstituted: 'Refrigerate at 2-8°C. Must stay refrigerated; use within 30 days.',
      shelfLifeReconstitutedDays: 30,
      lightSensitive: true
    },
    standardDosing: {
      minDose: 200,
      maxDose: 1000,
      typicalDose: 500,
      unit: 'mcg',
      frequency: '1-2x daily in morning/afternoon',
      timing: 'Morning or before cognitive tasks; Intranasal or SubQ.',
      cycleLengthWeeks: '2 - 4 weeks on, 2 weeks off'
    },
    halfLifeHours: 0.5,
    halfLifeLabel: '~30 minutes in plasma (BDNF downstream signaling lasts 20-24 hours)',
    researchIndications: [
      'Neuroplasticity & BDNF / NGF Upregulation',
      'Mental Clarity, Attention & Working Memory',
      'Neuroprotection Post-Ischemia or Stroke',
      'Optic Nerve Regeneration'
    ],
    synergisticWith: ['selank', 'dihexa', 'nad-plus'],
    sideEffectWarnings: [
      'Mild overstimulation or insomnia if taken late in evening, occasional nasal dryness.'
    ],
    literatureReferences: [
      {
        title: 'Semax, an ACTH(4-10) analogue with nootropic properties, stimulates BDNF expression in the rat brain',
        journal: 'Molecular Genetics, Microbiology and Virology',
        year: 2006,
        pmid: '16995437'
      }
    ]
  },
  {
    id: 'selank',
    name: 'Selank',
    aliases: ['Tuftsin Analogue TP-7', 'Thr-Lys-Pro-Arg-Pro-Gly-Pro'],
    category: 'nootropic',
    categoryLabel: 'Cognitive & Neuroprotective',
    subCategory: 'Anxiolytic Neuropeptide',
    summary: 'A synthetic regulatory peptide based on the endogenous immune peptide Tuftsin with potent anxiolytic, mood-stabilizing, and cognitive-enhancing properties without sedation.',
    mechanism: 'Modulates GABA-A receptor allosteric binding, inhibits enkephalin-degrading enzymes, stabilizes brain serotonin/dopamine metabolism, and elevates BDNF in the hippocampus.',
    molecularFormula: 'C33H57N11O9',
    sequence: 'Thr-Lys-Pro-Arg-Pro-Gly-Pro',
    commonVialSizesMg: [5, 10],
    typicalBacWaterMl: [2, 3],
    reconstitutionTips: [
      'Dissolves easily. Refrigerate immediately upon reconstitution.'
    ],
    storageGuidance: {
      lyophilized: 'Store dry at -20°C.',
      reconstituted: 'Refrigerate at 2-8°C. Stable for 30 days.',
      shelfLifeReconstitutedDays: 30,
      lightSensitive: true
    },
    standardDosing: {
      minDose: 250,
      maxDose: 750,
      typicalDose: 300,
      unit: 'mcg',
      frequency: '1-2x daily',
      timing: 'Morning and mid-day; Intranasal or SubQ.',
      cycleLengthWeeks: '2 - 4 weeks'
    },
    halfLifeHours: 1,
    halfLifeLabel: '~1 hour',
    researchIndications: [
      'Non-Sedating Anxiolysis & Stress Reduction',
      'Emotional Resilience & Focus Under Pressure',
      'Immune Modulatory Tuftsin Synergy',
      'Memory Retention & Neuroprotection'
    ],
    synergisticWith: ['semax', 'bpc-157'],
    sideEffectWarnings: [
      'Exceptionally mild profile; rarely fatigue if taken at excessive doses.'
    ],
    literatureReferences: [
      {
        title: 'Selank is anxiolytic and modulates the expression of genes involved in GABAergic neurotransmission',
        journal: 'Neurochemical Journal',
        year: 2014,
        pmid: '25482312'
      }
    ]
  },
  {
    id: 'dihexa',
    name: 'Dihexa',
    aliases: ['PNB-0408', 'N-hexanoic-Tyr-Ile-(6) aminohexanoic amide', 'HGF / c-Met Activator'],
    category: 'nootropic',
    categoryLabel: 'Cognitive & Neuroprotective',
    subCategory: 'Potent Synaptogenic Oligopeptide',
    summary: 'An orally active, blood-brain barrier permeable oligopeptide that binds Hepatocyte Growth Factor (HGF) with high affinity to induce profound dendritic arborization and synaptogenesis.',
    mechanism: 'Potentiates HGF dimerization and c-Met receptor tyrosine kinase signaling, accelerating new synaptic spine creation at potencies orders of magnitude greater than BDNF.',
    molecularFormula: 'C27H44N4O5',
    commonVialSizesMg: [10, 50, 100],
    typicalBacWaterMl: [2, 5],
    reconstitutionTips: [
      'Hydrophobic in nature. If using for subQ research, ensure complete dissolution. Often formulated in DMSO/ethanol for laboratory transdermal/oral preparations.'
    ],
    storageGuidance: {
      lyophilized: 'Store at -20°C in darkness.',
      reconstituted: 'Refrigerate at 2-8°C. Best within 30 days.',
      shelfLifeReconstitutedDays: 30,
      lightSensitive: true
    },
    standardDosing: {
      minDose: 5.0,
      maxDose: 20.0,
      typicalDose: 10.0,
      unit: 'mg',
      frequency: '1-2x weekly (microdosing due to prolonged synaptogenic cascade)',
      timing: 'Morning on an empty stomach; SubQ, Oral, or Transdermal.',
      cycleLengthWeeks: '4 - 6 weeks'
    },
    halfLifeHours: 12,
    halfLifeLabel: '~12 days synaptogenesis downstream effect',
    researchIndications: [
      'Intense Synaptogenesis & New Neural Pathway Formation',
      'Neurodegenerative Repair Models (Alzheimer\'s / Parkinson\'s)',
      'Traumatic Brain Injury (TBI) Recovery Models',
      'Long-Term Memory Potentiation'
    ],
    synergisticWith: ['semax', 'nad-plus'],
    sideEffectWarnings: [
      'High potency compound: Theoretical risk of proliferative c-Met signaling in pre-existing malignancies. Conservative dosing recommended in research.'
    ],
    literatureReferences: [
      {
        title: 'The small molecule Dihexa stimulates synaptogenesis and improves cognitive function in models of neurodegeneration',
        journal: 'Journal of Pharmacology and Experimental Therapeutics',
        year: 2012,
        pmid: '23051679'
      }
    ]
  },
  {
    id: 'thymosin-alpha-1',
    name: 'Thymosin Alpha-1 (Tα1)',
    aliases: ['Zadaxin', 'Thymalfasin', 'Immune Modulator Peptide'],
    category: 'immune',
    categoryLabel: 'Immune & Cellular Defense',
    subCategory: 'Thymic Peptide Hormone',
    summary: 'A 28-amino acid polypeptide naturally produced by the thymus gland that modulates and balances the innate and adaptive immune response, stimulating T-cells, NK cells, and dendritic cells.',
    mechanism: 'Acts via Toll-like receptors (TLR9, TLR2) in dendritic cells to stimulate T-helper 1 (Th1) cytokine production (IFN-γ, IL-2), promote MHC-I expression, and inhibit viral replication.',
    molecularFormula: 'C129H215N33O45',
    sequence: 'Ac-Ser-Asp-Ala-Ala-Val-Asp-Thr-Ser-Ser-Glu-Ile-Thr-Thr-Lys-Asp-Leu-Lys-Glu-Lys-Lys-Glu-Val-Val-Glu-Glu-Ala-Glu-Asn',
    commonVialSizesMg: [5, 10],
    typicalBacWaterMl: [2, 2.5],
    reconstitutionTips: [
      'Reconstitute with sterile BAC water. Swirl gently; do not vortex.'
    ],
    storageGuidance: {
      lyophilized: 'Store dry at -20°C.',
      reconstituted: 'Refrigerate at 2-8°C. Use within 28 days.',
      shelfLifeReconstitutedDays: 28,
      lightSensitive: true
    },
    standardDosing: {
      minDose: 0.75,
      maxDose: 1.6,
      typicalDose: 1.5,
      unit: 'mg',
      frequency: '2x weekly (e.g. Monday and Thursday) or daily during acute immune challenge',
      timing: 'Morning; SubQ.',
      cycleLengthWeeks: '4 - 8 weeks'
    },
    halfLifeHours: 2,
    halfLifeLabel: '~2 hours (immune upregulation cascades continue for days)',
    researchIndications: [
      'T-Cell & Natural Killer (NK) Cell Augmentation',
      'Viral Defense & Chronic Infection Management',
      'Immune Balance in Autoimmunity / Immune Senescence',
      'Adjuvant Support in Oncology Research'
    ],
    synergisticWith: ['bpc-157', 'kpv', 'epithalon'],
    sideEffectWarnings: [
      'Excellent clinical safety profile across global trials; rare mild injection site erythema.'
    ],
    literatureReferences: [
      {
        title: 'Thymosin alpha 1: a comprehensive review of its biological properties and clinical applications',
        journal: 'Expert Opinion on Biological Therapy',
        year: 2015,
        pmid: '26077309'
      }
    ]
  },
  {
    id: 'melanotan-2',
    name: 'Melanotan II (MT-2)',
    aliases: ['MT-II', 'Melanotan 2', 'Ac-cyclo[Nle4, Asp5, D-Phe7, Lys10]alpha-MSH4-10-NH2'],
    category: 'cosmetic',
    categoryLabel: 'Skin, Hair & Aesthetics',
    subCategory: 'Melanocortin Receptor Agonist',
    summary: 'A synthetic cyclic heptapeptide analogue of alpha-MSH that stimulates melanin production in the skin and activates central melanocortin receptors modulating sexual arousal.',
    mechanism: 'Non-selectively activates melanocortin receptors (MC1R, MC3R, MC4R, MC5R), triggering eumelanin synthesis in melanocytes for photoprotective tanning while inducing central libido.',
    molecularFormula: 'C50H69N15O9',
    commonVialSizesMg: [10],
    typicalBacWaterMl: [2, 2.5],
    reconstitutionTips: [
      'Adding 2.0 mL BAC water to a 10mg vial gives 500mcg per 10 units on a U-100 syringe.',
      'Start with a low introductory test dose (100-250mcg) to assess nausea tolerance.'
    ],
    storageGuidance: {
      lyophilized: 'Store at -20°C for up to 2 years.',
      reconstituted: 'Refrigerate at 2-8°C. Protect strictly from UV light.',
      shelfLifeReconstitutedDays: 30,
      lightSensitive: true
    },
    standardDosing: {
      minDose: 100,
      maxDose: 500,
      typicalDose: 250,
      unit: 'mcg',
      frequency: 'Every other day or prior to moderate UV light exposure until desired shade, then 1x/wk maintenance',
      timing: 'Evening before bed (to sleep through mild initial nausea); SubQ.',
      cycleLengthWeeks: '2 - 4 weeks loading, then maintenance'
    },
    halfLifeHours: 2,
    halfLifeLabel: '~2 hours (melanocyte stimulation lasts days)',
    researchIndications: [
      'Photoprotective Eumelanin Synthesis (Sunless/Low-UV Tanning)',
      'UV-Induced Skin Damage Reduction',
      'Libido & Erectile Enhancement',
      'Appetite Suppression (via MC4R)'
    ],
    synergisticWith: ['pt-141'],
    sideEffectWarnings: [
      'Facial flushing, initial nausea (diminishes after first few doses), spontaneous erections, darkening of preexisting freckles/moles, elevated blood pressure.'
    ],
    literatureReferences: [
      {
        title: 'Melanotan II: a review of the chemistry, pharmacology, and clinical applications',
        journal: 'Dermatologic Therapy',
        year: 2007,
        pmid: '17961129'
      }
    ]
  },
  {
    id: 'pt-141',
    name: 'PT-141 (Bremelanotide)',
    aliases: ['Vyleesi', 'Cyclo-[Nle4, Asp5, D-Phe7, Lys10]-α-MSH-(4-10) carboxylic acid'],
    category: 'cosmetic',
    categoryLabel: 'Skin, Hair & Aesthetics',
    subCategory: 'Selective Central MC4R/MC3R Agonist',
    summary: 'A synthetic cyclic heptapeptide developed from Melanotan II that acts centrally in the hypothalamus to stimulate sexual desire and arousal without vascular nitric oxide mechanisms.',
    mechanism: 'Activates hypothalamic melanocortin 4 receptors (MC4R), triggering central neurochemical pathways involving dopamine that regulate sexual desire and physiological arousal in males and females.',
    molecularFormula: 'C50H68N14O10',
    commonVialSizesMg: [10],
    typicalBacWaterMl: [2, 2.5],
    reconstitutionTips: [
      'Dissolve smoothly in sterile BAC water. Keep refrigerated.'
    ],
    storageGuidance: {
      lyophilized: 'Store dry at -20°C.',
      reconstituted: 'Refrigerate at 2-8°C. Best within 30 days.',
      shelfLifeReconstitutedDays: 30,
      lightSensitive: true
    },
    standardDosing: {
      minDose: 0.5,
      maxDose: 2.0,
      typicalDose: 1.0,
      unit: 'mg',
      frequency: 'As needed (acute protocol), at least 45 minutes to 2 hours prior to intended activity; max 1x per 24-48 hrs',
      timing: '45-90 minutes prior to activity; SubQ.',
      cycleLengthWeeks: 'As needed / acute protocol'
    },
    halfLifeHours: 2.7,
    halfLifeLabel: '~2.7 hours (central arousal effects peak around 2-4 hours, persisting up to 10 hours)',
    researchIndications: [
      'Hypoactive Sexual Desire Disorder (HSDD)',
      'Erectile Function Refractory to PDE-5 Inhibitors',
      'Central Dopaminergic Libido Stimulation'
    ],
    synergisticWith: ['oxytocin'],
    sideEffectWarnings: [
      'Transient nausea, facial flushing, transient mild blood pressure elevation for 2-4 hours, headache.'
    ],
    literatureReferences: [
      {
        title: 'Bremelanotide for female sexual dysfunctions: evaluation of safety and efficacy',
        journal: 'Journal of Sexual Medicine',
        year: 2019,
        pmid: '31054949'
      }
    ]
  },
  {
    id: 'nad-plus',
    name: 'NAD+ (Nicotinamide Adenine Dinucleotide)',
    aliases: ['beta-NAD+', 'Coenzyme I', 'DPN', 'Cellular Redox Coenzyme'],
    category: 'longevity',
    categoryLabel: 'Longevity & Anti-Aging',
    subCategory: 'Vital Metabolic Coenzyme',
    summary: 'An essential coenzyme found in all living cells, critical for mitochondrial ATP generation, sirtuin longevity enzyme activation, and PARP-mediated DNA repair.',
    mechanism: 'Acts as electron carrier in cellular respiration and vital substrate for SIRT1-7 and PARP enzymes, declining by ~50% in human tissue between age 20 and 50.',
    molecularFormula: 'C21H27N7O14P2',
    commonVialSizesMg: [500, 1000],
    typicalBacWaterMl: [5, 10],
    reconstitutionTips: [
      'High mass compound (e.g. 500mg or 1000mg vials). Reconstitute with 5.0 mL or 10.0 mL BAC water to achieve 100mg/mL concentration.',
      'Inject very slowly subcutaneously or intramuscularly to prevent localized chest tightness or cramping.'
    ],
    storageGuidance: {
      lyophilized: 'Store dry at -20°C.',
      reconstituted: 'Refrigerate at 2-8°C. Highly light and temperature sensitive. Use within 28-30 days.',
      shelfLifeReconstitutedDays: 30,
      lightSensitive: true
    },
    standardDosing: {
      minDose: 25,
      maxDose: 100,
      typicalDose: 50,
      unit: 'mg',
      frequency: '2-3x weekly or daily during loading phases',
      timing: 'Morning on an empty stomach; SubQ or slow IM.',
      cycleLengthWeeks: '4 - 8 weeks'
    },
    halfLifeHours: 1,
    halfLifeLabel: '~1 hour (intracellular pool elevation lasts 24-48 hours)',
    researchIndications: [
      'Mitochondrial ATP Synthesis & Vitality',
      'Sirtuin (SIRT1/SIRT3) Epigenetic Activation',
      'PARP1 DNA Damage Repair',
      'Cognitive Stamina & Brain Fog Relief',
      'Cellular Age Reversal Markers'
    ],
    synergisticWith: ['mots-c', 'ss-31', 'epithalon', '5-amino-1mq'],
    sideEffectWarnings: [
      'Subcutaneous injection sting / chest tightness / shortness of breath if injected too rapidly. Always inject slowly.'
    ],
    literatureReferences: [
      {
        title: 'NAD+ in aging, metabolism, and neurodegeneration',
        journal: 'Science',
        year: 2015,
        pmid: '26639912'
      }
    ]
  },
  {
    id: '5-amino-1mq',
    name: '5-Amino-1MQ',
    aliases: ['5-Amino-1-methylquinolinium', 'NNMT Inhibitor'],
    category: 'metabolic',
    categoryLabel: 'Incretin & Weight Management',
    subCategory: 'Small Molecule NNMT Inhibitor',
    summary: 'A small molecule membrane-permeable inhibitor of nicotinamide N-methyltransferase (NNMT) that boosts cellular NAD+ levels and promotes fat loss without muscle catabolism.',
    mechanism: 'Blocks NNMT enzyme in white adipose tissue, preventing the degradation of nicotinamide and stimulating the futile S-adenosylmethionine (SAM) cycle to burn energy and increase GLUT4 expression.',
    molecularFormula: 'C10H11N2+',
    commonVialSizesMg: [50, 100],
    typicalBacWaterMl: [2, 5],
    reconstitutionTips: [
      'Also commonly researched in oral capsule form (50mg-100mg daily).'
    ],
    storageGuidance: {
      lyophilized: 'Store dry at -20°C.',
      reconstituted: 'Refrigerate at 2-8°C. Use within 30 days.',
      shelfLifeReconstitutedDays: 30,
      lightSensitive: false
    },
    standardDosing: {
      minDose: 50,
      maxDose: 150,
      typicalDose: 50,
      unit: 'mg',
      frequency: 'Daily (morning with meal)',
      timing: 'Morning; Oral or SubQ.',
      cycleLengthWeeks: '8 - 12 weeks'
    },
    halfLifeHours: 6,
    halfLifeLabel: '~6 hours',
    researchIndications: [
      'NNMT Inhibition & Adipocyte Energy Expenditure',
      'Intracellular NAD+ Salvage Upregulation',
      'Lean Muscle Mass Sparing During Caloric Deficit',
      'Insulin Sensitivity'
    ],
    synergisticWith: ['tirzepatide', 'nad-plus', 'mots-c'],
    sideEffectWarnings: [
      'Mild stomach upset if taken orally on empty stomach.'
    ],
    literatureReferences: [
      {
        title: 'Selective small molecule NNMT inhibitors enhance energy expenditure in obese mice',
        journal: 'Biochemical Pharmacology',
        year: 2018,
        pmid: '29277341'
      }
    ]
  },
  {
    id: 'oxytocin',
    name: 'Oxytocin',
    aliases: ['Pitocin', 'Neuropeptide of Affiliation', 'Alpha-Hypophamine'],
    category: 'nootropic',
    categoryLabel: 'Cognitive & Neuroprotective',
    subCategory: 'Neurohypophysial Nonapeptide',
    summary: 'An endogenous nine-amino acid neurohormone produced in the hypothalamus that regulates social connection, stress modulation, vagal tone, and muscle stem cell rejuvenation.',
    mechanism: 'Binds oxytocin receptors in the amygdala, reducing cortisol release and fear reactivity while signaling satellite stem cell renewal in skeletal muscle via the MAPK/ERK pathway.',
    molecularFormula: 'C43H66N12O12S2',
    sequence: 'Cys-Tyr-Ile-Gln-Asn-Cys-Pro-Leu-Gly-NH2',
    commonVialSizesMg: [2, 5],
    typicalBacWaterMl: [2, 2.5],
    reconstitutionTips: [
      'Reconstitute for subQ or intranasal research. Avoid warm storage.'
    ],
    storageGuidance: {
      lyophilized: 'Store dry at -20°C.',
      reconstituted: 'Refrigerate at 2-8°C. Use within 21 days.',
      shelfLifeReconstitutedDays: 21,
      lightSensitive: true
    },
    standardDosing: {
      minDose: 20,
      maxDose: 100,
      typicalDose: 50,
      unit: 'mcg',
      frequency: '1x daily or as needed (e.g. 10-30 IU equivalent)',
      timing: 'Morning or evening; Intranasal or SubQ.',
      cycleLengthWeeks: '2 - 6 weeks'
    },
    halfLifeHours: 0.1,
    halfLifeLabel: '~5-10 minutes in plasma (central neurobehavioral effects persist for hours)',
    researchIndications: [
      'Social Connection, Empathy & Anxiety Attenuation',
      'Muscle Satellite Stem Cell Regeneration in Aging',
      'Cortisol Downregulation & Parasympathetic Activation',
      'Metabolic Appetite Moderation'
    ],
    synergisticWith: ['pt-141', 'selank'],
    sideEffectWarnings: [
      'Transient warmth, uterine contractions in pregnant subjects (contraindicated in pregnancy).'
    ],
    literatureReferences: [
      {
        title: 'Oxytocin is an age-specific circulating hormone necessary for muscle tissue regeneration',
        journal: 'Nature Communications',
        year: 2014,
        pmid: '24915299'
      }
    ]
  },
  {
    id: 'cagrilintide',
    name: 'Cagrilintide',
    aliases: ['NN9838', 'Long-Acting Amylin Analogue'],
    category: 'metabolic',
    categoryLabel: 'Incretin & Weight Management',
    subCategory: 'Amylin Receptor Agonist',
    summary: 'A long-acting, acylated synthetic analogue of amylin that acts on the area postrema and central satiety centers to slow gastric motility and reduce caloric intake.',
    mechanism: 'Acts as dual amylin and calcitonin receptor agonist, complementing GLP-1 receptor agonists with non-overlapping central satiety mechanisms.',
    molecularFormula: 'C200H312N46O57',
    commonVialSizesMg: [5, 10],
    typicalBacWaterMl: [2, 2.5],
    reconstitutionTips: [
      'Often researched in combination with Semaglutide (the "CagriSema" investigational stack).'
    ],
    storageGuidance: {
      lyophilized: 'Store dry at -20°C.',
      reconstituted: 'Refrigerate at 2-8°C. Best within 28 days.',
      shelfLifeReconstitutedDays: 28,
      lightSensitive: true
    },
    standardDosing: {
      minDose: 0.15,
      maxDose: 2.4,
      typicalDose: 0.6,
      unit: 'mg',
      frequency: 'Once weekly (every 7 days)',
      timing: 'Same day weekly; SubQ.',
      cycleLengthWeeks: '16 - 24+ weeks'
    },
    halfLifeHours: 160,
    halfLifeLabel: '~7 days (160-170 hours)',
    researchIndications: [
      'Enhanced Appetite Satiety Synergy with GLP-1s',
      'Non-GLP-1 Central Satiety Induction (Amylin Pathway)',
      'Glucose Excursion Smoothing'
    ],
    synergisticWith: ['semaglutide', 'tirzepatide'],
    sideEffectWarnings: [
      'Nausea, early satiety, mild constipation.'
    ],
    literatureReferences: [
      {
        title: 'Efficacy and safety of cagrilintide with semaglutide in adults with overweight or obesity: a phase 2 trial',
        journal: 'Lancet',
        year: 2023,
        pmid: '37385280'
      }
    ]
  },
  {
    id: 'sermorelin',
    name: 'Sermorelin',
    aliases: ['GHRH (1-29) Acetate', 'Geref'],
    category: 'gh_secretagogue',
    categoryLabel: 'Growth Hormone & Anabolism',
    subCategory: 'Bio-Identical GHRH Fragment',
    summary: 'The 29-amino acid active catalytic fragment of natural Growth Hormone Releasing Hormone, stimulating pituitary production and release of human GH.',
    mechanism: 'Binds somatotroph GHRH receptors, encouraging natural somatotropic pulses while maintaining intact feedback loop inhibition via somatostatin.',
    molecularFormula: 'C149H246N44O42S',
    commonVialSizesMg: [2, 5, 9, 15],
    typicalBacWaterMl: [2, 3, 5],
    reconstitutionTips: [
      'Keep refrigerated and protect from light after reconstitution.'
    ],
    storageGuidance: {
      lyophilized: 'Store dry at -20°C.',
      reconstituted: 'Refrigerate at 2-8°C. Best within 21 days.',
      shelfLifeReconstitutedDays: 21,
      lightSensitive: true
    },
    standardDosing: {
      minDose: 200,
      maxDose: 500,
      typicalDose: 300,
      unit: 'mcg',
      frequency: 'Daily (5-7 days per week) at bedtime',
      timing: 'Immediately prior to sleep on an empty stomach; SubQ.',
      cycleLengthWeeks: '12 - 24 weeks'
    },
    halfLifeHours: 0.2,
    halfLifeLabel: '~12-15 minutes',
    researchIndications: [
      'Natural GH Secretion Stimulation',
      'Stage 4 Deep Sleep Architecture Optimization',
      'Cellular Repair & Body Composition Support'
    ],
    synergisticWith: ['ipamorelin', 'ghrp-2'],
    sideEffectWarnings: [
      'Transient injection site redness, mild dizziness, head rush.'
    ],
    literatureReferences: [
      {
        title: 'Sermorelin: a review of its use in the diagnosis and treatment of children with growth hormone deficiency',
        journal: 'BioDrugs',
        year: 1999,
        pmid: '18031128'
      }
    ]
  }
];
