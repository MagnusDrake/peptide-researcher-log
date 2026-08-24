export interface PKSimulationPoint {
  timeHours: number;
  dayLabel: string;
  hourInDay: number;
  concentration: number; // relative or absolute mcg/L
  doseAdministered?: number;
}

export interface PkSimulationParams {
  doseAmount: number; // e.g. 500 mcg or 2.5 mg
  halfLifeHours: number; // e.g. 4 for BPC-157, 120 for Tirzepatide
  dosingIntervalHours: number; // e.g. 24 for daily, 168 for weekly, 84 for 2x/wk
  totalDays: number; // e.g. 14 to 28 days
  absorptionRateMultiplier?: number;
}

export function simulatePharmacokinetics(params: PkSimulationParams): PKSimulationPoint[] {
  const { doseAmount, halfLifeHours, dosingIntervalHours, totalDays } = params;

  if (halfLifeHours <= 0 || doseAmount <= 0) return [];

  const ke = Math.LN2 / halfLifeHours; // Elimination rate constant
  const ka = Math.max(ke * 3, 0.5); // Rapid subQ absorption constant

  const totalHours = totalDays * 24;
  const timeStepHours = Math.max(1, Math.floor(totalHours / 120)); // Sample ~120 points for smooth charting

  // Generate dose times
  const doseTimes: number[] = [];
  for (let t = 0; t < totalHours; t += dosingIntervalHours) {
    doseTimes.push(t);
  }

  const dataPoints: PKSimulationPoint[] = [];

  for (let t = 0; t <= totalHours; t += timeStepHours) {
    let currentConcentration = 0;
    let doseHere: number | undefined = undefined;

    // Check if a dose was given near this time step
    if (doseTimes.some(dt => Math.abs(dt - t) < timeStepHours / 2)) {
      doseHere = doseAmount;
    }

    // Sum contribution from all past doses
    for (const dt of doseTimes) {
      if (t >= dt) {
        const deltaT = t - dt;
        // One-compartment model: C(t) = (D * ka / (ka - ke)) * (e^(-ke * t) - e^(-ka * t))
        let c = 0;
        if (Math.abs(ka - ke) > 0.0001) {
          c = (doseAmount * ka / (ka - ke)) * (Math.exp(-ke * deltaT) - Math.exp(-ka * deltaT));
        } else {
          c = doseAmount * ke * deltaT * Math.exp(-ke * deltaT);
        }
        if (c > 0) currentConcentration += c;
      }
    }

    const currentDay = Math.floor(t / 24) + 1;
    const hourOfDay = t % 24;

    dataPoints.push({
      timeHours: t,
      dayLabel: `Day ${currentDay}`,
      hourInDay: hourOfDay,
      concentration: Number(currentConcentration.toFixed(2)),
      doseAdministered: doseHere
    });
  }

  return dataPoints;
}

export function calculateSteadyStateTime(halfLifeHours: number): { hours: number; days: number; description: string } {
  // Steady state is conventionally achieved after 4.5 to 5 half-lives (~97% of steady state)
  const hoursToSteadyState = halfLifeHours * 5;
  const daysToSteadyState = Number((hoursToSteadyState / 24).toFixed(1));

  return {
    hours: Math.round(hoursToSteadyState),
    days: daysToSteadyState,
    description: `Steady-state plateau estimated in ~${daysToSteadyState} days (${Math.round(hoursToSteadyState)} hours) based on 5 elimination half-lives.`
  };
}
