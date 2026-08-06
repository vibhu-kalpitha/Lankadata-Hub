// Real Hydrographic & Protected Forest Vector Data for Sri Lanka
// Scaled for SVG viewBox="0 0 450 650"

export interface RiverFeature {
  id: string;
  name: string;
  length: string;
  basin: string;
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
  desc: string;
  x: number;
  y: number;
}

export const srilankaPhysicalData = {
  "rivers": [
    {
      "id": "mahaweli",
      "name": "Mahaweli Ganga",
      "length": "335 km",
      "basin": "Mahaweli River Basin (10,448 km\u00b2)",
      "desc": "Sri Lanka's longest river originating near Adam's Peak, flowing through Kandy, Polonnaruwa into Koddiyar Bay, Trincomalee.",
      "color": "#38bdf8",
      "d": "M 151.8 491.6 L 159.7 469.7 L 170.6 443.2 L 172.2 416.6 L 190.9 407.3 L 214.3 386.9 L 233.1 333.8 L 248.7 282.3 L 265.9 221.4"
    },
    {
      "id": "malwathu",
      "name": "Malwathu Oya (Aruvi Aru)",
      "length": "164 km",
      "basin": "Malwathu Oya Basin (3,284 km\u00b2)",
      "desc": "Second longest river in Sri Lanka, flowing from Ritual Hill near Anuradhapura to the Gulf of Mannar.",
      "color": "#0ea5e9",
      "d": "M 155.0 282.3 L 134.7 251.1 L 112.8 224.5 L 81.6 193.3 L 61.3 168.3"
    },
    {
      "id": "kelani",
      "name": "Kelani Ganga",
      "length": "145 km",
      "basin": "Kelani River Basin (2,292 km\u00b2)",
      "desc": "Flows from Adam's Peak through Kitulgala and Gampaha, discharging into the Indian Ocean at Colombo.",
      "color": "#06b6d4",
      "d": "M 151.8 491.6 L 128.4 476.0 L 92.5 472.8 L 70.6 471.3 L 51.9 468.2"
    },
    {
      "id": "yan_oya",
      "name": "Yan Oya",
      "length": "142 km",
      "basin": "Yan Oya Basin (1,538 km\u00b2)",
      "desc": "Flows from North Central hills north-east through Huruluwewa to Pulmoddai north of Trincomalee.",
      "color": "#0284c7",
      "d": "M 180.0 329.2 L 201.8 287.0 L 222.1 240.1 L 233.1 168.3"
    },
    {
      "id": "deduru",
      "name": "Deduru Oya",
      "length": "142 km",
      "basin": "Deduru Oya Basin (2,616 km\u00b2)",
      "desc": "Originates in Kurunegala central hills and discharges into the Indian Ocean near Chilaw.",
      "color": "#38bdf8",
      "d": "M 155.0 407.3 L 122.2 380.7 L 76.9 371.3 L 41.0 372.9"
    },
    {
      "id": "walawe",
      "name": "Walawe Ganga",
      "length": "138 km",
      "basin": "Walawe River Basin (2,471 km\u00b2)",
      "desc": "Originates in Haputale / Horton Plains, feeding Udawalawe Reservoir and emptying at Ambalantota.",
      "color": "#0ea5e9",
      "d": "M 197.1 496.3 L 204.9 532.2 L 217.4 568.1 L 231.5 599.3"
    },
    {
      "id": "maduru_oya",
      "name": "Maduru Oya",
      "length": "135 km",
      "basin": "Maduru Oya Basin (1,541 km\u00b2)",
      "desc": "Flows through Maduru Oya National Park in Eastern Province to the Bay of Bengal.",
      "color": "#06b6d4",
      "d": "M 242.4 411.9 L 264.3 366.6 L 300.2 324.5"
    },
    {
      "id": "maha_oya",
      "name": "Maha Oya",
      "length": "134 km",
      "basin": "Maha Oya Basin (1,528 km\u00b2)",
      "desc": "Flows from Nawalapitiya through Kegalle and Giriulla to Kochchikade near Negombo.",
      "color": "#0284c7",
      "d": "M 148.7 454.1 L 112.8 427.6 L 70.6 418.2 L 48.8 421.3"
    },
    {
      "id": "kalu",
      "name": "Kalu Ganga",
      "length": "129 km",
      "basin": "Kalu River Basin (2,719 km\u00b2)",
      "desc": "Flows from Sri Pada peak through Ratnapura with second largest water volume in Sri Lanka, entering ocean at Kalutara.",
      "color": "#38bdf8",
      "d": "M 145.6 491.6 L 134.7 511.9 L 92.5 521.3 L 67.5 527.5"
    },
    {
      "id": "gin_ganga",
      "name": "Gin Ganga",
      "length": "113 km",
      "basin": "Gin River Basin (935 km\u00b2)",
      "desc": "Flows from Gongala hills near Sinharaja rainforest through Neluwa and Baddegama into the ocean at Gintota, Galle.",
      "color": "#0ea5e9",
      "d": "M 139.4 558.7 L 122.2 583.7 L 101.9 600.9 L 100.3 607.2"
    },
    {
      "id": "gal_oya",
      "name": "Gal Oya",
      "length": "108 km",
      "basin": "Gal Oya Basin (1,792 km\u00b2)",
      "desc": "Feeds Senanayake Samudraya (largest reservoir in Sri Lanka) and flows to Kalmunai, Ampara.",
      "color": "#06b6d4",
      "d": "M 237.7 449.4 L 284.6 429.1 L 358.0 405.7"
    },
    {
      "id": "nilwala",
      "name": "Nilwala Ganga",
      "length": "72 km",
      "basin": "Nilwala River Basin (960 km\u00b2)",
      "desc": "Flows from Deniyaya hills in Southern Province through Akuressa into the ocean at Matara.",
      "color": "#0284c7",
      "d": "M 161.2 568.1 L 148.7 599.3 L 158.1 627.5"
    }
  ],
  "forests": [
    {
      "id": "sinharaja",
      "name": "Sinharaja Forest Reserve",
      "type": "UNESCO World Heritage Tropical Rainforest",
      "area": "111.9 km\u00b2",
      "desc": "Sri Lanka's last viable area of primary tropical rainforest with high endemic biodiversity.",
      "d": "M 128.4 547.8 L 155.0 546.2 L 159.7 558.7 L 133.1 566.6 Z"
    },
    {
      "id": "yala",
      "name": "Yala National Park (Ruhuna)",
      "type": "Wild Elephant & Leopard Sanctuary",
      "area": "979 km\u00b2",
      "desc": "Premier national park world-famous for highest wild leopard population density.",
      "d": "M 276.8 552.5 L 336.1 532.2 L 342.4 574.4 L 289.3 583.7 Z"
    },
    {
      "id": "wilpattu",
      "name": "Wilpattu National Park",
      "type": "Lakes & Coastal Wilderness Reserve",
      "area": "1,317 km\u00b2",
      "desc": "Largest national park in Sri Lanka characterized by natural sand-rimmed water basins (Willus).",
      "d": "M 55.0 224.5 L 108.1 219.8 L 112.8 271.4 L 61.3 277.6 Z"
    },
    {
      "id": "knuckles",
      "name": "Knuckles Conservation Forest",
      "type": "UNESCO Montane Cloud Forest",
      "area": "210 km\u00b2",
      "desc": "Rugged mountain range with high montane cloud forests and rare endemic species.",
      "d": "M 186.2 396.3 L 217.4 374.5 L 223.7 397.9 L 192.5 410.4 Z"
    },
    {
      "id": "horton",
      "name": "Horton Plains National Park",
      "type": "UNESCO High Altitude Cloud Forest",
      "area": "31.6 km\u00b2",
      "desc": "High plateau at 2,100m elevation featuring World's End precipice & Baker's Falls.",
      "d": "M 192.5 490.0 L 204.9 488.5 L 203.4 496.3 L 194.0 497.8 Z"
    },
    {
      "id": "minneriya",
      "name": "Minneriya National Park",
      "type": "Dry Season Elephant Gathering Reserve",
      "area": "88.9 km\u00b2",
      "desc": "Famous for 'The Gathering' of hundreds of Asian elephants surrounding Minneriya Tank.",
      "d": "M 206.5 297.9 L 222.1 293.2 L 226.8 313.5 L 211.2 316.7 Z"
    }
  ],
  "peaks": [
    {
      "id": "pidurutalagala",
      "name": "Pidurutalagala (Mount Pedro)",
      "elevation": "2,524 m (Highest Peak)",
      "desc": "Highest point in Sri Lanka located in Nuwara Eliya, Central Highlands.",
      "x": 194.0,
      "y": 461.9
    },
    {
      "id": "adamsspeak",
      "name": "Adam's Peak (Sri Pada)",
      "elevation": "2,243 m (Sacred Summit)",
      "desc": "Conical mountain revered sacred by all major religions, source of 4 main rivers.",
      "x": 151.8,
      "y": 491.6
    },
    {
      "id": "kirigalpoththa",
      "name": "Kirigalpoththa",
      "elevation": "2,388 m (2nd Highest Peak)",
      "desc": "Second highest peak in Sri Lanka, situated near Horton Plains.",
      "x": 198.7,
      "y": 493.1
    }
  ]
};
