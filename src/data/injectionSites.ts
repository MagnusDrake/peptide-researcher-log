import { InjectionSite } from '../types';

export const INJECTION_SITES: InjectionSite[] = [
  // -------------------------------------------------------------
  // ANTERIOR / FRONT SITES (Abdomen, Quads, Front Deltoids)
  // -------------------------------------------------------------
  {
    id: 'ab-left-upper',
    name: 'Abdomen - Upper Left',
    region: 'abdomen',
    side: 'left',
    subLocation: 'upper',
    view: 'front',
    x: 43,
    y: 43
  },
  {
    id: 'ab-left-lower',
    name: 'Abdomen - Lower Left',
    region: 'abdomen',
    side: 'left',
    subLocation: 'lower',
    view: 'front',
    x: 43,
    y: 49
  },
  {
    id: 'ab-right-upper',
    name: 'Abdomen - Upper Right',
    region: 'abdomen',
    side: 'right',
    subLocation: 'upper',
    view: 'front',
    x: 57,
    y: 43
  },
  {
    id: 'ab-right-lower',
    name: 'Abdomen - Lower Right',
    region: 'abdomen',
    side: 'right',
    subLocation: 'lower',
    view: 'front',
    x: 57,
    y: 49
  },
  {
    id: 'thigh-left-anterior',
    name: 'Thigh - Left Front (Anterior)',
    region: 'thigh',
    side: 'left',
    subLocation: 'anterior',
    view: 'front',
    x: 41,
    y: 67
  },
  {
    id: 'thigh-left-outer',
    name: 'Thigh - Left Outer (Lateral)',
    region: 'thigh',
    side: 'left',
    subLocation: 'outer',
    view: 'front',
    x: 33,
    y: 67
  },
  {
    id: 'thigh-right-anterior',
    name: 'Thigh - Right Front (Anterior)',
    region: 'thigh',
    side: 'right',
    subLocation: 'anterior',
    view: 'front',
    x: 59,
    y: 67
  },
  {
    id: 'thigh-right-outer',
    name: 'Thigh - Right Outer (Lateral)',
    region: 'thigh',
    side: 'right',
    subLocation: 'outer',
    view: 'front',
    x: 67,
    y: 67
  },
  {
    id: 'deltoid-left-front',
    name: 'Deltoid - Left Shoulder',
    region: 'deltoid',
    side: 'left',
    subLocation: 'outer',
    view: 'front',
    x: 23,
    y: 28
  },
  {
    id: 'deltoid-right-front',
    name: 'Deltoid - Right Shoulder',
    region: 'deltoid',
    side: 'right',
    subLocation: 'outer',
    view: 'front',
    x: 77,
    y: 28
  },

  // -------------------------------------------------------------
  // POSTERIOR / BACK SITES (Glutes / Ventrogluteal, Flanks, Rear Deltoids)
  // -------------------------------------------------------------
  {
    id: 'glute-left-ventral',
    name: 'Glute - Left Ventrogluteal (Upper Outer)',
    region: 'glute',
    side: 'left',
    subLocation: 'outer',
    view: 'back',
    x: 36,
    y: 52
  },
  {
    id: 'glute-right-ventral',
    name: 'Glute - Right Ventrogluteal (Upper Outer)',
    region: 'glute',
    side: 'right',
    subLocation: 'outer',
    view: 'back',
    x: 64,
    y: 52
  },
  {
    id: 'glute-left-max',
    name: 'Glute - Left Gluteus Maximus (Upper Cheek)',
    region: 'glute',
    side: 'left',
    subLocation: 'upper',
    view: 'back',
    x: 41,
    y: 57
  },
  {
    id: 'glute-right-max',
    name: 'Glute - Right Gluteus Maximus (Upper Cheek)',
    region: 'glute',
    side: 'right',
    subLocation: 'upper',
    view: 'back',
    x: 59,
    y: 57
  },
  {
    id: 'flank-left',
    name: 'Flank / Love Handle (Left Posterior)',
    region: 'flank',
    side: 'left',
    subLocation: 'lateral',
    view: 'back',
    x: 31,
    y: 44
  },
  {
    id: 'flank-right',
    name: 'Flank / Love Handle (Right Posterior)',
    region: 'flank',
    side: 'right',
    subLocation: 'lateral',
    view: 'back',
    x: 69,
    y: 44
  },
  {
    id: 'deltoid-left-rear',
    name: 'Deltoid - Left Posterior Shoulder',
    region: 'deltoid',
    side: 'left',
    subLocation: 'posterior',
    view: 'back',
    x: 23,
    y: 28
  },
  {
    id: 'deltoid-right-rear',
    name: 'Deltoid - Right Posterior Shoulder',
    region: 'deltoid',
    side: 'right',
    subLocation: 'posterior',
    view: 'back',
    x: 77,
    y: 28
  }
];
