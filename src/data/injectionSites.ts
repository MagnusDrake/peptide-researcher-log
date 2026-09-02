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
    x: 46,
    y: 39
  },
  {
    id: 'ab-left-lower',
    name: 'Abdomen - Lower Left',
    region: 'abdomen',
    side: 'left',
    subLocation: 'lower',
    view: 'front',
    x: 46,
    y: 47
  },
  {
    id: 'ab-right-upper',
    name: 'Abdomen - Upper Right',
    region: 'abdomen',
    side: 'right',
    subLocation: 'upper',
    view: 'front',
    x: 54,
    y: 39
  },
  {
    id: 'ab-right-lower',
    name: 'Abdomen - Lower Right',
    region: 'abdomen',
    side: 'right',
    subLocation: 'lower',
    view: 'front',
    x: 54,
    y: 47
  },
  {
    id: 'thigh-left-anterior',
    name: 'Thigh - Left Front (Anterior)',
    region: 'thigh',
    side: 'left',
    subLocation: 'anterior',
    view: 'front',
    x: 45,
    y: 68
  },
  {
    id: 'thigh-left-outer',
    name: 'Thigh - Left Outer (Lateral)',
    region: 'thigh',
    side: 'left',
    subLocation: 'outer',
    view: 'front',
    x: 40,
    y: 68
  },
  {
    id: 'thigh-right-anterior',
    name: 'Thigh - Right Front (Anterior)',
    region: 'thigh',
    side: 'right',
    subLocation: 'anterior',
    view: 'front',
    x: 55,
    y: 68
  },
  {
    id: 'thigh-right-outer',
    name: 'Thigh - Right Outer (Lateral)',
    region: 'thigh',
    side: 'right',
    subLocation: 'outer',
    view: 'front',
    x: 60,
    y: 68
  },
  {
    id: 'deltoid-left-front',
    name: 'Deltoid - Left Shoulder',
    region: 'deltoid',
    side: 'left',
    subLocation: 'outer',
    view: 'front',
    x: 29,
    y: 27
  },
  {
    id: 'deltoid-right-front',
    name: 'Deltoid - Right Shoulder',
    region: 'deltoid',
    side: 'right',
    subLocation: 'outer',
    view: 'front',
    x: 71,
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
    x: 39,
    y: 55
  },
  {
    id: 'glute-right-ventral',
    name: 'Glute - Right Ventrogluteal (Upper Outer Hip)',
    region: 'glute',
    side: 'right',
    subLocation: 'outer',
    view: 'back',
    x: 61,
    y: 55
  },
  {
    id: 'glute-left-max',
    name: 'Glute - Left Gluteus Maximus (Upper Cheek)',
    region: 'glute',
    side: 'left',
    subLocation: 'upper',
    view: 'back',
    x: 44,
    y: 59
  },
  {
    id: 'glute-right-max',
    name: 'Glute - Right Gluteus Maximus (Upper Cheek)',
    region: 'glute',
    side: 'right',
    subLocation: 'upper',
    view: 'back',
    x: 56,
    y: 59
  },
  {
    id: 'flank-left',
    name: 'Flank / Love Handle (Left Posterior)',
    region: 'flank',
    side: 'left',
    subLocation: 'lateral',
    view: 'back',
    x: 41,
    y: 47
  },
  {
    id: 'flank-right',
    name: 'Flank / Love Handle (Right Posterior)',
    region: 'flank',
    side: 'right',
    subLocation: 'lateral',
    view: 'back',
    x: 59,
    y: 47
  },
  {
    id: 'deltoid-left-rear',
    name: 'Deltoid - Left Posterior Shoulder',
    region: 'deltoid',
    side: 'left',
    subLocation: 'posterior',
    view: 'back',
    x: 29,
    y: 27
  },
  {
    id: 'deltoid-right-rear',
    name: 'Deltoid - Right Posterior Shoulder',
    region: 'deltoid',
    side: 'right',
    subLocation: 'posterior',
    view: 'back',
    x: 71,
    y: 27
  }
];
