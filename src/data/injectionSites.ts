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
    x: 42,
    y: 37
  },
  {
    id: 'ab-left-lower',
    name: 'Abdomen - Lower Left',
    region: 'abdomen',
    side: 'left',
    subLocation: 'lower',
    view: 'front',
    x: 42,
    y: 44
  },
  {
    id: 'ab-right-upper',
    name: 'Abdomen - Upper Right',
    region: 'abdomen',
    side: 'right',
    subLocation: 'upper',
    view: 'front',
    x: 58,
    y: 37
  },
  {
    id: 'ab-right-lower',
    name: 'Abdomen - Lower Right',
    region: 'abdomen',
    side: 'right',
    subLocation: 'lower',
    view: 'front',
    x: 58,
    y: 44
  },
  {
    id: 'thigh-left-anterior',
    name: 'Thigh - Left Front (Anterior)',
    region: 'thigh',
    side: 'left',
    subLocation: 'anterior',
    view: 'front',
    x: 42,
    y: 65
  },
  {
    id: 'thigh-left-outer',
    name: 'Thigh - Left Outer (Lateral)',
    region: 'thigh',
    side: 'left',
    subLocation: 'outer',
    view: 'front',
    x: 36,
    y: 65
  },
  {
    id: 'thigh-right-anterior',
    name: 'Thigh - Right Front (Anterior)',
    region: 'thigh',
    side: 'right',
    subLocation: 'anterior',
    view: 'front',
    x: 58,
    y: 65
  },
  {
    id: 'thigh-right-outer',
    name: 'Thigh - Right Outer (Lateral)',
    region: 'thigh',
    side: 'right',
    subLocation: 'outer',
    view: 'front',
    x: 64,
    y: 65
  },
  {
    id: 'deltoid-left-front',
    name: 'Deltoid - Left Shoulder',
    region: 'deltoid',
    side: 'left',
    subLocation: 'outer',
    view: 'front',
    x: 26,
    y: 27
  },
  {
    id: 'deltoid-right-front',
    name: 'Deltoid - Right Shoulder',
    region: 'deltoid',
    side: 'right',
    subLocation: 'outer',
    view: 'front',
    x: 74,
    y: 27
  },

  // -------------------------------------------------------------
  // POSTERIOR / BACK SITES (Glutes / Ventrogluteal, Flanks, Rear Deltoids)
  // -------------------------------------------------------------
  {
    id: 'glute-left-ventral',
    name: 'Glute - Left Ventrogluteal (Upper Outer Hip)',
    region: 'glute',
    side: 'left',
    subLocation: 'outer',
    view: 'back',
    x: 35,
    y: 51
  },
  {
    id: 'glute-right-ventral',
    name: 'Glute - Right Ventrogluteal (Upper Outer Hip)',
    region: 'glute',
    side: 'right',
    subLocation: 'outer',
    view: 'back',
    x: 65,
    y: 51
  },
  {
    id: 'glute-left-max',
    name: 'Glute - Left Gluteus Maximus (Upper Cheek)',
    region: 'glute',
    side: 'left',
    subLocation: 'upper',
    view: 'back',
    x: 43,
    y: 56
  },
  {
    id: 'glute-right-max',
    name: 'Glute - Right Gluteus Maximus (Upper Cheek)',
    region: 'glute',
    side: 'right',
    subLocation: 'upper',
    view: 'back',
    x: 57,
    y: 56
  },
  {
    id: 'flank-left',
    name: 'Flank / Love Handle (Left Posterior)',
    region: 'flank',
    side: 'left',
    subLocation: 'lateral',
    view: 'back',
    x: 36,
    y: 44
  },
  {
    id: 'flank-right',
    name: 'Flank / Love Handle (Right Posterior)',
    region: 'flank',
    side: 'right',
    subLocation: 'lateral',
    view: 'back',
    x: 64,
    y: 44
  },
  {
    id: 'deltoid-left-rear',
    name: 'Deltoid - Left Posterior Shoulder',
    region: 'deltoid',
    side: 'left',
    subLocation: 'posterior',
    view: 'back',
    x: 26,
    y: 27
  },
  {
    id: 'deltoid-right-rear',
    name: 'Deltoid - Right Posterior Shoulder',
    region: 'deltoid',
    side: 'right',
    subLocation: 'posterior',
    view: 'back',
    x: 74,
    y: 27
  }
];
