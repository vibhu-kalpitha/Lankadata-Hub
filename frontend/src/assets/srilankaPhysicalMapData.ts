// Real vector paths for Sri Lanka Physical Geography (Rivers, Forests, Mountains)
// Scaled for SVG viewBox="0 0 450 650"

export interface RiverFeature {
  id: string;
  name: string;
  length: string;
  desc: string;
  color: string;
  d: string;
}

export interface ForestFeature {
  id: string;
  name: string;
  type: string;
  area: string;
  desc: string;
  d: string;
}

export interface PeakFeature {
  id: string;
  name: string;
  elevation: string;
  x: number;
  y: number;
}

export const srilankaPhysicalData = {
  "rivers": [
    {
      "id": "mahaweli",
      "name": "Mahaweli River",
      "length": "335 km (Longest in Sri Lanka)",
      "desc": "Originates in Adam's Peak / Hatton Plateau, flows through Kandy and Polonnaruwa into Trincomalee Bay.",
      "color": "#38bdf8",
      "d": "M 151.8 493.1 L 167.5 446.3 L 172.2 416.6 L 190.9 415.1 L 222.1 383.8 L 229.9 337.0 L 245.6 290.1 L 264.3 221.4"
    },
    {
      "id": "kelani",
      "name": "Kelani River",
      "length": "145 km",
      "desc": "Originates in Sri Pada range, feeds Western Province & Colombo water supply.",
      "color": "#06b6d4",
      "d": "M 151.8 493.1 L 120.6 477.5 L 89.4 472.8 L 55.0 469.7"
    },
    {
      "id": "kalu",
      "name": "Kalu Ganga",
      "length": "129 km",
      "desc": "Flows from Sri Pada peak through Ratnapura city into the Indian Ocean at Kalutara.",
      "color": "#0284c7",
      "d": "M 144.0 493.1 L 136.2 511.9 L 97.2 524.4 L 66.0 527.5"
    },
    {
      "id": "walawe",
      "name": "Walawe Ganga",
      "length": "138 km",
      "desc": "Flows south from Central Highlands through Udawalawe National Park to Ambalantota.",
      "color": "#0ea5e9",
      "d": "M 183.1 501.0 L 198.7 540.0 L 229.9 594.7"
    }
  ],
  "forests": [
    {
      "id": "sinharaja",
      "name": "Sinharaja Forest Reserve",
      "type": "UNESCO World Heritage Rainforest",
      "area": "111.9 km\u00b2",
      "desc": "Primary virgin tropical rainforest with endemic fauna & flora.",
      "d": "M 128.4 555.6 L 151.8 552.5 L 159.7 563.4 L 133.1 568.1 Z"
    },
    {
      "id": "yala",
      "name": "Yala National Park",
      "type": "Wildlife Sanctuary",
      "area": "979 km\u00b2",
      "desc": "Highest leopard density in the world & rich Asian elephant habitat.",
      "d": "M 276.8 563.4 L 331.5 540.0 L 339.3 579.0 L 292.4 586.9 Z"
    },
    {
      "id": "wilpattu",
      "name": "Wilpattu National Park",
      "type": "National Park & Willu Lakes",
      "area": "1,317 km\u00b2",
      "desc": "Largest national park in Sri Lanka famous for natural sand-rimmed water basins.",
      "d": "M 58.1 243.3 L 112.8 227.6 L 105.0 266.7 L 66.0 274.5 Z"
    },
    {
      "id": "knuckles",
      "name": "Knuckles Mountain Range",
      "type": "UNESCO Conservation Forest",
      "area": "210 km\u00b2",
      "desc": "Montane cloud forests with unique biodiversity & rugged peaks.",
      "d": "M 183.1 399.4 L 214.3 376.0 L 222.1 399.4 L 190.9 411.9 Z"
    }
  ],
  "peaks": [
    {
      "id": "pidurutalagala",
      "name": "Pidurutalagala (Mount Pedro)",
      "elevation": "2,524 m (Highest Peak)",
      "x": 194.0,
      "y": 461.9
    },
    {
      "id": "adamsspeak",
      "name": "Adam's Peak (Sri Pada)",
      "elevation": "2,243 m (Sacred Summit)",
      "x": 151.8,
      "y": 493.1
    }
  ]
};
