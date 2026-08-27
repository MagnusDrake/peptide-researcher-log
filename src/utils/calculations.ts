import { SyringeType } from '../types';

export interface ReconstitutionInput {
  vialMassMg: number;
  bacWaterMl: number;
  targetDose: number;
  doseUnit: 'mcg' | 'mg';
  syringeType: SyringeType;
  vialCost?: number;
}

export interface ReconstitutionResult {
  concentrationMgMl: number;
  concentrationMcgMl: number;
  concentrationMcgPerUnit: number;
  targetDoseMcg: number;
  targetDoseMg: number;
  drawUnits: number;
  drawVolumeMl: number;
  totalDosesInVial: number;
  costPerDose?: number;
  syringeMaxUnits: number;
  isDrawExceedingSyringe: boolean;
  precisionWarning?: string;
}

export function calculateReconstitution(input: ReconstitutionInput): ReconstitutionResult {
  const { vialMassMg, bacWaterMl, targetDose, doseUnit, syringeType, vialCost } = input;

  const syringeMaxUnits = syringeType === 'U-100' ? 100 : syringeType === 'U-50' ? 50 : 30;

  if (!vialMassMg || vialMassMg <= 0 || !bacWaterMl || bacWaterMl <= 0) {
    return {
      concentrationMgMl: 0,
      concentrationMcgMl: 0,
      concentrationMcgPerUnit: 0,
      targetDoseMcg: 0,
      targetDoseMg: 0,
      drawUnits: 0,
      drawVolumeMl: 0,
      totalDosesInVial: 0,
      syringeMaxUnits,
      isDrawExceedingSyringe: false
    };
  }

  // 1 mg = 1000 mcg
  const concentrationMgMl = vialMassMg / bacWaterMl;
  const concentrationMcgMl = concentrationMgMl * 1000;

  // U-100 syringe: 100 units = 1 mL -> 1 unit = 0.01 mL
  // In all standard U-insulin syringes (U-100, U-50, U-30), 100 units always represents 1.0 mL
  const concentrationMcgPerUnit = concentrationMcgMl / 100;

  if (!targetDose || targetDose <= 0) {
    return {
      concentrationMgMl: Number(concentrationMgMl.toFixed(3)),
      concentrationMcgMl: Number(concentrationMcgMl.toFixed(1)),
      concentrationMcgPerUnit: Number(concentrationMcgPerUnit.toFixed(2)),
      targetDoseMcg: 0,
      targetDoseMg: 0,
      drawUnits: 0,
      drawVolumeMl: 0,
      totalDosesInVial: 0,
      syringeMaxUnits,
      isDrawExceedingSyringe: false
    };
  }

  const targetDoseMcg = doseUnit === 'mg' ? targetDose * 1000 : targetDose;
  const targetDoseMg = doseUnit === 'mg' ? targetDose : targetDose / 1000;

  const drawUnits = concentrationMcgPerUnit > 0 ? targetDoseMcg / concentrationMcgPerUnit : 0;
  const drawVolumeMl = drawUnits * 0.01;

  const totalDosesInVial = targetDoseMg > 0 ? vialMassMg / targetDoseMg : 0;
  const costPerDose = vialCost && totalDosesInVial > 0 ? vialCost / totalDosesInVial : undefined;

  const isDrawExceedingSyringe = drawUnits > syringeMaxUnits;

  let precisionWarning: string | undefined;
  if (drawUnits < 3) {
    precisionWarning = 'Draw amount is very small (<3 units). Consider adding more BAC water for greater drawing accuracy.';
  } else if (drawUnits > 80 && syringeType === 'U-100') {
    precisionWarning = 'Draw volume is large (>80 units). Consider reconstituting with less BAC water to reduce injection volume.';
  }

  return {
    concentrationMgMl: Number(concentrationMgMl.toFixed(3)),
    concentrationMcgMl: Number(concentrationMcgMl.toFixed(1)),
    concentrationMcgPerUnit: Number(concentrationMcgPerUnit.toFixed(2)),
    targetDoseMcg: Number(targetDoseMcg.toFixed(2)),
    targetDoseMg: Number(targetDoseMg.toFixed(3)),
    drawUnits: Number(drawUnits.toFixed(1)),
    drawVolumeMl: Number(drawVolumeMl.toFixed(3)),
    totalDosesInVial: Number(totalDosesInVial.toFixed(1)),
    costPerDose: costPerDose ? Number(costPerDose.toFixed(2)) : undefined,
    syringeMaxUnits,
    isDrawExceedingSyringe,
    precisionWarning
  };
}

export interface DualBlendInput {
  vialPeptide1Mg: number;
  vialPeptide2Mg: number;
  bacWaterMl: number;
  targetPeptide1Dose: number;
  doseUnit: 'mcg' | 'mg';
  syringeType: SyringeType;
}

export interface DualBlendResult {
  drawUnits: number;
  drawVolumeMl: number;
  resultPeptide1Dose: number;
  resultPeptide2Dose: number;
  ratio: string;
}

export function calculateDualBlend(input: DualBlendInput): DualBlendResult {
  const { vialPeptide1Mg, vialPeptide2Mg, bacWaterMl, targetPeptide1Dose, doseUnit, syringeType } = input;
  
  const p1TargetMcg = doseUnit === 'mg' ? targetPeptide1Dose * 1000 : targetPeptide1Dose;
  const p1VialMcg = vialPeptide1Mg * 1000;
  const p2VialMcg = vialPeptide2Mg * 1000;

  const concentrationP1McgPerUnit = (p1VialMcg / bacWaterMl) / 100;
  const drawUnits = concentrationP1McgPerUnit > 0 ? p1TargetMcg / concentrationP1McgPerUnit : 0;
  const drawVolumeMl = drawUnits * 0.01;

  const concentrationP2McgPerUnit = (p2VialMcg / bacWaterMl) / 100;
  const p2ReceivedMcg = drawUnits * concentrationP2McgPerUnit;

  const ratio = `${vialPeptide1Mg}:${vialPeptide2Mg}`;

  return {
    drawUnits: Number(drawUnits.toFixed(1)),
    drawVolumeMl: Number(drawVolumeMl.toFixed(3)),
    resultPeptide1Dose: targetPeptide1Dose,
    resultPeptide2Dose: doseUnit === 'mg' ? Number((p2ReceivedMcg / 1000).toFixed(2)) : Number(p2ReceivedMcg.toFixed(1)),
    ratio
  };
}

export interface MultiBlendComponentInput {
  id: string;
  peptideName: string;
  vialMassMg: number;
  targetDose?: number;
  doseUnit?: 'mcg' | 'mg';
}

export interface MultiBlendComponentResult {
  id: string;
  peptideName: string;
  vialMassMg: number;
  concentrationMgMl: number;
  concentrationMcgPerUnit: number;
  targetDose: number;
  doseUnit: 'mcg' | 'mg';
  deliveredDoseMcg: number;
  deliveredDoseFormatted: string;
}

export interface MultiBlendInput {
  components: MultiBlendComponentInput[];
  bacWaterMl: number;
  primaryComponentId: string;
  targetPrimaryDose: number;
  primaryDoseUnit: 'mcg' | 'mg';
  syringeType: SyringeType;
  vialCost?: number;
}

export interface MultiBlendResult {
  totalVialMassMg: number;
  drawUnits: number;
  drawVolumeMl: number;
  syringeMaxUnits: number;
  isDrawExceedingSyringe: boolean;
  precisionWarning?: string;
  totalDosesInVial: number;
  costPerDose?: number;
  components: MultiBlendComponentResult[];
  ratioString: string;
}

export function calculateMultiBlend(input: MultiBlendInput): MultiBlendResult {
  const { components, bacWaterMl, primaryComponentId, targetPrimaryDose, primaryDoseUnit, syringeType, vialCost } = input;
  const syringeMaxUnits = syringeType === 'U-100' ? 100 : syringeType === 'U-50' ? 50 : 30;

  const totalVialMassMg = components.reduce((sum, c) => sum + (c.vialMassMg || 0), 0);

  if (!bacWaterMl || bacWaterMl <= 0 || components.length === 0 || !targetPrimaryDose || targetPrimaryDose <= 0) {
    return {
      totalVialMassMg,
      drawUnits: 0,
      drawVolumeMl: 0,
      syringeMaxUnits,
      isDrawExceedingSyringe: false,
      totalDosesInVial: 0,
      components: components.map(c => ({
        id: c.id,
        peptideName: c.peptideName,
        vialMassMg: c.vialMassMg || 0,
        concentrationMgMl: 0,
        concentrationMcgPerUnit: 0,
        targetDose: c.targetDose || 0,
        doseUnit: c.doseUnit || 'mcg',
        deliveredDoseMcg: 0,
        deliveredDoseFormatted: '0 mcg'
      })),
      ratioString: components.map(c => `${c.vialMassMg}mg`).join(' : ')
    };
  }

  // Identify primary component to drive syringe draw calculation
  const primaryComp = components.find(c => c.id === primaryComponentId) || components[0];
  const primaryVialMg = primaryComp.vialMassMg || 0;
  const primaryTargetMcg = primaryDoseUnit === 'mg' ? targetPrimaryDose * 1000 : targetPrimaryDose;

  // Primary concentration: mg/mL -> mcg per unit (on 100u/mL insulin syringe scale)
  const primaryConcMgMl = primaryVialMg / bacWaterMl;
  const primaryConcMcgPerUnit = (primaryConcMgMl * 1000) / 100;

  const drawUnits = primaryConcMcgPerUnit > 0 ? primaryTargetMcg / primaryConcMcgPerUnit : 0;
  const drawVolumeMl = drawUnits * 0.01;
  const totalDosesInVial = drawVolumeMl > 0 ? bacWaterMl / drawVolumeMl : 0;
  const costPerDose = vialCost && totalDosesInVial > 0 ? vialCost / totalDosesInVial : undefined;
  const isDrawExceedingSyringe = drawUnits > syringeMaxUnits;

  let precisionWarning: string | undefined;
  if (drawUnits < 5) {
    precisionWarning = 'Draw level is very low (< 5 units). Consider using more BAC water or a U-30 / U-50 syringe for accurate research measurement.';
  }

  // Calculate delivered doses and concentrations for all components simultaneously
  const calculatedComponents: MultiBlendComponentResult[] = components.map(comp => {
    const massMg = comp.vialMassMg || 0;
    const concMgMl = massMg / bacWaterMl;
    const concMcgPerUnit = (concMgMl * 1000) / 100;
    const deliveredMcg = drawUnits * concMcgPerUnit;
    const isMgUnit = comp.doseUnit === 'mg' || deliveredMcg >= 1000;
    const deliveredDoseFormatted = isMgUnit 
      ? `${(deliveredMcg / 1000).toFixed(2)} mg`
      : `${Math.round(deliveredMcg)} mcg`;

    return {
      id: comp.id,
      peptideName: comp.peptideName || 'Unnamed Peptide',
      vialMassMg: massMg,
      concentrationMgMl: Number(concMgMl.toFixed(3)),
      concentrationMcgPerUnit: Number(concMcgPerUnit.toFixed(2)),
      targetDose: comp.id === primaryComp.id ? targetPrimaryDose : (comp.targetDose || (isMgUnit ? deliveredMcg / 1000 : deliveredMcg)),
      doseUnit: comp.doseUnit || (isMgUnit ? 'mg' : 'mcg'),
      deliveredDoseMcg: Number(deliveredMcg.toFixed(2)),
      deliveredDoseFormatted
    };
  });

  const ratioString = components.map(c => `${c.peptideName}: ${c.vialMassMg}mg`).join(' + ');

  return {
    totalVialMassMg: Number(totalVialMassMg.toFixed(2)),
    drawUnits: Number(drawUnits.toFixed(1)),
    drawVolumeMl: Number(drawVolumeMl.toFixed(3)),
    syringeMaxUnits,
    isDrawExceedingSyringe,
    precisionWarning,
    totalDosesInVial: Number(totalDosesInVial.toFixed(1)),
    costPerDose: costPerDose ? Number(costPerDose.toFixed(2)) : undefined,
    components: calculatedComponents,
    ratioString
  };
}

export function convertUnits(
  value: number,
  from: 'mg' | 'mcg' | 'ml' | 'units',
  to: 'mg' | 'mcg' | 'ml' | 'units',
  concentrationMgMl: number = 5
): number {
  if (from === to) return value;
  const concMcgMl = concentrationMgMl * 1000;
  const mcgPerUnit = concMcgMl / 100;

  // Convert `from` to base mcg
  let baseMcg = 0;
  if (from === 'mg') baseMcg = value * 1000;
  else if (from === 'mcg') baseMcg = value;
  else if (from === 'ml') baseMcg = value * concMcgMl;
  else if (from === 'units') baseMcg = value * mcgPerUnit;

  // Convert base mcg to `to`
  if (to === 'mg') return baseMcg / 1000;
  if (to === 'mcg') return baseMcg;
  if (to === 'ml') return concMcgMl > 0 ? baseMcg / concMcgMl : 0;
  if (to === 'units') return mcgPerUnit > 0 ? baseMcg / mcgPerUnit : 0;

  return 0;
}
