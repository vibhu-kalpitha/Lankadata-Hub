export interface MetroStation {
  id: string;
  name: string;
  x: number;
  y: number;
  routes: string[];
  interchange?: boolean;
  labelPosition?: 'top' | 'bottom' | 'left' | 'right' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  labelOffsetX?: number;
  labelOffsetY?: number;
}

export const metroStations: MetroStation[] = [
  // ==================== WEST / COLOMBO CITY ====================
  {
    id: "fort",
    name: "Colombo Fort",
    x: 170,
    y: 610,
    routes: ["CM02", "CM08"],
    interchange: true,
    labelPosition: "left",
    labelOffsetX: -22,
    labelOffsetY: 6
  },
  {
    id: "pettah",
    name: "Pettah",
    x: 170,
    y: 710,
    routes: ["CM01", "CM02", "CM08"],
    interchange: true,
    labelPosition: "left",
    labelOffsetX: -22,
    labelOffsetY: 6
  },
  {
    id: "regal_cinema",
    name: "Regal Cinema",
    x: 280,
    y: 850,
    routes: ["CM01", "CM08"],
    interchange: false,
    labelPosition: "bottom",
    labelOffsetX: 0,
    labelOffsetY: 28
  },
  {
    id: "gamin_hall",
    name: "Gamini Hall",
    x: 420,
    y: 850,
    routes: ["CM01", "CM08"],
    interchange: false,
    labelPosition: "right",
    labelOffsetX: 22,
    labelOffsetY: 6
  },
  {
    id: "maradana",
    name: "Maradana R.way",
    x: 220,
    y: 710,
    routes: ["CM01"],
    interchange: false,
    labelPosition: "top",
    labelOffsetX: 0,
    labelOffsetY: -22
  },
  {
    id: "hedges_ct",
    name: "Hedges Ct.",
    x: 280,
    y: 710,
    routes: ["CM01"],
    interchange: false,
    labelPosition: "top",
    labelOffsetX: 0,
    labelOffsetY: -22
  },
  {
    id: "town_hall",
    name: "Town Hall",
    x: 420,
    y: 1050,
    routes: ["CM01", "CM02", "CM06", "CM08"],
    interchange: true,
    labelPosition: "right",
    labelOffsetX: 24,
    labelOffsetY: 6
  },
  {
    id: "union_place",
    name: "Union Pl.",
    x: 350,
    y: 1050,
    routes: ["CM02", "CM06"],
    interchange: false,
    labelPosition: "top",
    labelOffsetX: 0,
    labelOffsetY: -22
  },
  {
    id: "nawaloka",
    name: "Nawaloka",
    x: 220,
    y: 1050,
    routes: ["CM02"],
    interchange: false,
    labelPosition: "bottom",
    labelOffsetX: 0,
    labelOffsetY: 28
  },
  {
    id: "public_library",
    name: "Public Library",
    x: 300,
    y: 1050,
    routes: ["CM02", "CM06"],
    interchange: false,
    labelPosition: "bottom",
    labelOffsetX: 0,
    labelOffsetY: 28
  },
  {
    id: "lake_house",
    name: "Lake House",
    x: 170,
    y: 980,
    routes: ["CM02"],
    interchange: false,
    labelPosition: "left",
    labelOffsetX: -22,
    labelOffsetY: 6
  },
  {
    id: "nelum_pokuna",
    name: "Nelum Pokuna",
    x: 530,
    y: 1050,
    routes: ["CM01", "CM06", "CM08"],
    interchange: false,
    labelPosition: "top",
    labelOffsetX: 0,
    labelOffsetY: -22
  },
  {
    id: "independence_square",
    name: "Independence Square",
    x: 600,
    y: 1050,
    routes: ["CM01", "CM02", "CM06"],
    interchange: false,
    labelPosition: "top",
    labelOffsetX: 0,
    labelOffsetY: -22
  },
  {
    id: "wijerama",
    name: "Wijerama",
    x: 700,
    y: 1050,
    routes: ["CM01", "CM02", "CM06"],
    interchange: false,
    labelPosition: "top",
    labelOffsetX: 0,
    labelOffsetY: -22
  },

  // ==================== WEST COAST CORRIDOR ====================
  {
    id: "liberty",
    name: "Liberty",
    x: 450,
    y: 1180,
    routes: ["CM06"],
    interchange: false,
    labelPosition: "left",
    labelOffsetX: -22,
    labelOffsetY: 6
  },
  {
    id: "kollupitiya",
    name: "Kollupitiya",
    x: 450,
    y: 1280,
    routes: ["CM06", "CM08"],
    interchange: true,
    labelPosition: "left",
    labelOffsetX: -22,
    labelOffsetY: 6
  },
  {
    id: "bambalapitiya",
    name: "Bambalapitiya",
    x: 450,
    y: 1460,
    routes: ["CM04", "CM06"],
    interchange: true,
    labelPosition: "left",
    labelOffsetX: -22,
    labelOffsetY: 6
  },
  {
    id: "wellawatta",
    name: "Wellawatta",
    x: 450,
    y: 1400,
    routes: ["CM04", "CM06"],
    interchange: false,
    labelPosition: "left",
    labelOffsetX: -22,
    labelOffsetY: 6
  },
  {
    id: "wa_silva",
    name: "WA Silva Mw.",
    x: 450,
    y: 1530,
    routes: ["CM04"],
    interchange: false,
    labelPosition: "left",
    labelOffsetX: -22,
    labelOffsetY: 6
  },
  {
    id: "williams_junc",
    name: "Williams Junc.",
    x: 450,
    y: 1590,
    routes: ["CM04"],
    interchange: false,
    labelPosition: "left",
    labelOffsetX: -22,
    labelOffsetY: 6
  },
  {
    id: "dehiwala",
    name: "Dehiwala",
    x: 450,
    y: 1660,
    routes: ["CM04", "CM08"],
    interchange: true,
    labelPosition: "left",
    labelOffsetX: -22,
    labelOffsetY: 6
  },
  {
    id: "mount_lavinia",
    name: "Mount Lavinia",
    x: 580,
    y: 1790,
    routes: ["CM04"],
    interchange: false,
    labelPosition: "bottom-left",
    labelOffsetX: -14,
    labelOffsetY: 26
  },

  // ==================== CM04 SOUTHERN COAST (ALTERNATING TOP/BOTTOM) ====================
  {
    id: "ratmalana",
    name: "Ratmalana",
    x: 700,
    y: 1910,
    routes: ["CM04"],
    interchange: false,
    labelPosition: "top",
    labelOffsetX: 0,
    labelOffsetY: -22
  },
  {
    id: "maliban_junc",
    name: "Maliban Junc.",
    x: 780,
    y: 1910,
    routes: ["CM04"],
    interchange: false,
    labelPosition: "bottom",
    labelOffsetX: 0,
    labelOffsetY: 28
  },
  {
    id: "rathmalana_tech",
    name: "Rathmalana Tech",
    x: 860,
    y: 1910,
    routes: ["CM04"],
    interchange: false,
    labelPosition: "top",
    labelOffsetX: 0,
    labelOffsetY: -22
  },
  {
    id: "golumadama",
    name: "Golumadama Junc.",
    x: 950,
    y: 1910,
    routes: ["CM04"],
    interchange: false,
    labelPosition: "bottom",
    labelOffsetX: 0,
    labelOffsetY: 28
  },
  {
    id: "german_tech",
    name: "German Tech",
    x: 1050,
    y: 1910,
    routes: ["CM04"],
    interchange: false,
    labelPosition: "top",
    labelOffsetX: 0,
    labelOffsetY: -22
  },
  {
    id: "katubedda",
    name: "Katubedda Junc.",
    x: 1180,
    y: 1910,
    routes: ["CM04"],
    interchange: false,
    labelPosition: "bottom",
    labelOffsetX: 0,
    labelOffsetY: 28
  },
  {
    id: "mendis_ln",
    name: "Mendis Ln.",
    x: 1280,
    y: 1910,
    routes: ["CM04"],
    interchange: false,
    labelPosition: "top",
    labelOffsetX: 0,
    labelOffsetY: -22
  },
  {
    id: "moratuwa",
    name: "Moratuwa",
    x: 1380,
    y: 1910,
    routes: ["CM04"],
    interchange: false,
    labelPosition: "bottom",
    labelOffsetX: 0,
    labelOffsetY: 28
  },
  {
    id: "koralawella",
    name: "Koralawella",
    x: 1480,
    y: 1910,
    routes: ["CM04"],
    interchange: false,
    labelPosition: "top",
    labelOffsetX: 0,
    labelOffsetY: -22
  },
  {
    id: "egoda_uyana",
    name: "Egoda Uyana",
    x: 1580,
    y: 1910,
    routes: ["CM04"],
    interchange: false,
    labelPosition: "bottom",
    labelOffsetX: 0,
    labelOffsetY: 28
  },
  {
    id: "jayanthi_mw",
    name: "Jayanthi Mw.",
    x: 1660,
    y: 1910,
    routes: ["CM04"],
    interchange: false,
    labelPosition: "top",
    labelOffsetX: 0,
    labelOffsetY: -22
  },
  {
    id: "palam_junc",
    name: "Palam Junc.",
    x: 1740,
    y: 1910,
    routes: ["CM04"],
    interchange: false,
    labelPosition: "bottom",
    labelOffsetX: 0,
    labelOffsetY: 28
  },
  {
    id: "mahanama",
    name: "Mahanama Junc.",
    x: 1820,
    y: 1910,
    routes: ["CM04"],
    interchange: false,
    labelPosition: "top",
    labelOffsetX: 0,
    labelOffsetY: -22
  },
  {
    id: "panadura",
    name: "Panadura",
    x: 1910,
    y: 1820,
    routes: ["CM04"],
    interchange: false,
    labelPosition: "right",
    labelOffsetX: 22,
    labelOffsetY: 6
  },
  {
    id: "panadura_hosp",
    name: "Panadura Hosp.",
    x: 1910,
    y: 1750,
    routes: ["CM04"],
    interchange: true,
    labelPosition: "right",
    labelOffsetX: 22,
    labelOffsetY: 6
  },

  // ==================== NORTH TRUNK (EKALA / KADAWATHA) ====================
  {
    id: "ekala",
    name: "Ekala",
    x: 1750,
    y: 310,
    routes: ["CM05"],
    interchange: true,
    labelPosition: "top",
    labelOffsetX: 0,
    labelOffsetY: -22
  },
  {
    id: "ctb_junc",
    name: "CTB Junc.",
    x: 1660,
    y: 310,
    routes: ["CM05"],
    interchange: false,
    labelPosition: "top",
    labelOffsetX: 0,
    labelOffsetY: -22
  },
  {
    id: "ja_ela",
    name: "Jā-Ela",
    x: 1560,
    y: 310,
    routes: ["CM05"],
    interchange: false,
    labelPosition: "top",
    labelOffsetX: 0,
    labelOffsetY: -22
  },
  {
    id: "weligampitiya",
    name: "Weligampitiya",
    x: 1440,
    y: 310,
    routes: ["CM05"],
    interchange: false,
    labelPosition: "bottom",
    labelOffsetX: 0,
    labelOffsetY: 28
  },
  {
    id: "kandana",
    name: "Kandana",
    x: 1320,
    y: 310,
    routes: ["CM05"],
    interchange: false,
    labelPosition: "top",
    labelOffsetX: 0,
    labelOffsetY: -22
  },
  {
    id: "mahabage",
    name: "Mahabage",
    x: 1200,
    y: 310,
    routes: ["CM05"],
    interchange: false,
    labelPosition: "top",
    labelOffsetX: 0,
    labelOffsetY: -22
  },
  {
    id: "mabola",
    name: "Mabola",
    x: 1080,
    y: 310,
    routes: ["CM05"],
    interchange: false,
    labelPosition: "bottom",
    labelOffsetX: 0,
    labelOffsetY: 28
  },
  {
    id: "wattala",
    name: "Wattala",
    x: 960,
    y: 310,
    routes: ["CM05"],
    interchange: false,
    labelPosition: "top",
    labelOffsetX: 0,
    labelOffsetY: -22
  },
  {
    id: "hendala",
    name: "Hendala",
    x: 900,
    y: 310,
    routes: ["CM05"],
    interchange: false,
    labelPosition: "bottom",
    labelOffsetX: 0,
    labelOffsetY: 28
  },
  {
    id: "hekitta",
    name: "Hekitta Junc.",
    x: 830,
    y: 310,
    routes: ["CM05"],
    interchange: false,
    labelPosition: "top",
    labelOffsetX: 0,
    labelOffsetY: -22
  },
  {
    id: "peliyagoda",
    name: "Peliyagoda",
    x: 750,
    y: 390,
    routes: ["CM05"],
    interchange: false,
    labelPosition: "left",
    labelOffsetX: -22,
    labelOffsetY: 6
  },
  {
    id: "kadawatha",
    name: "Kadawatha",
    x: 1380,
    y: 520,
    routes: ["CM03"],
    interchange: true,
    labelPosition: "top",
    labelOffsetX: 0,
    labelOffsetY: -22
  },
  {
    id: "mahara",
    name: "Mahara Junc.",
    x: 1280,
    y: 520,
    routes: ["CM03"],
    interchange: false,
    labelPosition: "top",
    labelOffsetX: 0,
    labelOffsetY: -22
  },
  {
    id: "kiribathgoda",
    name: "Kiribathgoda",
    x: 1180,
    y: 520,
    routes: ["CM03"],
    interchange: false,
    labelPosition: "bottom",
    labelOffsetX: 0,
    labelOffsetY: 28
  },
  {
    id: "kelaniya_campus",
    name: "Kelaniya Campus",
    x: 1080,
    y: 520,
    routes: ["CM03"],
    interchange: false,
    labelPosition: "top",
    labelOffsetX: 0,
    labelOffsetY: -22
  },
  {
    id: "thorana",
    name: "Thorana Junc.",
    x: 930,
    y: 520,
    routes: ["CM03", "CM05"],
    interchange: true,
    labelPosition: "right",
    labelOffsetX: 22,
    labelOffsetY: 6
  },
  {
    id: "new_kelani_br",
    name: "New Kelani Br.",
    x: 830,
    y: 620,
    routes: ["CM03", "CM05"],
    interchange: false,
    labelPosition: "left",
    labelOffsetX: -22,
    labelOffsetY: 6
  },
  {
    id: "orugodawatta",
    name: "Orugodawatta",
    x: 830,
    y: 710,
    routes: ["CM03", "CM05"],
    interchange: true,
    labelPosition: "left",
    labelOffsetX: -22,
    labelOffsetY: 6
  },
  {
    id: "dematagoda",
    name: "Dematagoda",
    x: 830,
    y: 800,
    routes: ["CM03", "CM04", "CM05"],
    interchange: true,
    labelPosition: "right",
    labelOffsetX: 22,
    labelOffsetY: 6
  },
  {
    id: "campbell_park",
    name: "Campbell Pk.",
    x: 830,
    y: 900,
    routes: ["CM03", "CM04", "CM05"],
    interchange: true,
    labelPosition: "right",
    labelOffsetX: 22,
    labelOffsetY: 6
  },
  {
    id: "borella",
    name: "Borella",
    x: 830,
    y: 980,
    routes: ["CM01", "CM02", "CM03", "CM04", "CM05"],
    interchange: true,
    labelPosition: "right",
    labelOffsetX: 22,
    labelOffsetY: 6
  },
  {
    id: "singer_mega",
    name: "Singer Mega",
    x: 830,
    y: 900,
    routes: ["CM01", "CM02", "CM03", "CM04", "CM05"],
    interchange: true,
    labelPosition: "left",
    labelOffsetX: -22,
    labelOffsetY: 6
  },

  // ==================== EAST SUBURBS ====================
  {
    id: "castle_hosp",
    name: "Castle Hosp.",
    x: 950,
    y: 980,
    routes: ["CM01", "CM02", "CM05"],
    interchange: true,
    labelPosition: "bottom",
    labelOffsetX: 0,
    labelOffsetY: 28
  },
  {
    id: "rajagiriya",
    name: "Rajagiriya",
    x: 1080,
    y: 980,
    routes: ["CM01", "CM02", "CM05"],
    interchange: false,
    labelPosition: "top",
    labelOffsetX: 0,
    labelOffsetY: -22
  },
  {
    id: "sethsiripaya",
    name: "Sethsiripaya",
    x: 1220,
    y: 980,
    routes: ["CM01", "CM02", "CM05"],
    interchange: false,
    labelPosition: "top",
    labelOffsetX: 0,
    labelOffsetY: -22
  },
  {
    id: "naita",
    name: "NAITA",
    x: 1320,
    y: 980,
    routes: ["CM01", "CM02", "CM05"],
    interchange: false,
    labelPosition: "bottom",
    labelOffsetX: 0,
    labelOffsetY: 28
  },
  {
    id: "battaramulla_junc",
    name: "Battaramulla Junc.",
    x: 1420,
    y: 980,
    routes: ["CM01", "CM02", "CM05"],
    interchange: true,
    labelPosition: "top",
    labelOffsetX: 0,
    labelOffsetY: -22
  },
  {
    id: "palam_thuna",
    name: "Palam Thuna Junc.",
    x: 1420,
    y: 1090,
    routes: ["CM01", "CM02"],
    interchange: false,
    labelPosition: "left",
    labelOffsetX: -22,
    labelOffsetY: 6
  },
  {
    id: "thalangama",
    name: "Thalangama",
    x: 1420,
    y: 1180,
    routes: ["CM01", "CM02"],
    interchange: false,
    labelPosition: "right",
    labelOffsetX: 22,
    labelOffsetY: 6
  },
  {
    id: "isurupaya",
    name: "Isurupaya",
    x: 1420,
    y: 1260,
    routes: ["CM01", "CM02"],
    interchange: true,
    labelPosition: "bottom-left",
    labelOffsetX: -14,
    labelOffsetY: 26
  },
  {
    id: "thalahena",
    name: "Thalahena Junc.",
    x: 1520,
    y: 1260,
    routes: ["CM01", "CM02"],
    interchange: false,
    labelPosition: "top",
    labelOffsetX: 0,
    labelOffsetY: -22
  },
  {
    id: "arangala",
    name: "Arangala Junc.",
    x: 1630,
    y: 1260,
    routes: ["CM02"],
    interchange: false,
    labelPosition: "top",
    labelOffsetX: 0,
    labelOffsetY: -22
  },
  {
    id: "malabe",
    name: "Malabe",
    x: 1700,
    y: 1260,
    routes: ["CM02"],
    interchange: false,
    labelPosition: "bottom",
    labelOffsetX: 0,
    labelOffsetY: 28
  },
  {
    id: "hokandara",
    name: "Hokandara Junc.",
    x: 1770,
    y: 1260,
    routes: ["CM02"],
    interchange: false,
    labelPosition: "bottom",
    labelOffsetX: 0,
    labelOffsetY: 28
  },
  {
    id: "nisaco",
    name: "Nisaco",
    x: 1840,
    y: 1260,
    routes: ["CM02"],
    interchange: false,
    labelPosition: "top",
    labelOffsetX: 0,
    labelOffsetY: -22
  },
  {
    id: "athurugiriya",
    name: "Athurugiriya",
    x: 1910,
    y: 1260,
    routes: ["CM02"],
    interchange: false,
    labelPosition: "bottom",
    labelOffsetX: 0,
    labelOffsetY: 28
  },
  {
    id: "athurugiriya_hosp",
    name: "Athurugiriya Hosp.",
    x: 1970,
    y: 1200,
    routes: ["CM02"],
    interchange: false,
    labelPosition: "right",
    labelOffsetX: 22,
    labelOffsetY: 6
  },
  {
    id: "millennium_city",
    name: "Millennium City",
    x: 1970,
    y: 1090,
    routes: ["CM02"],
    interchange: true,
    labelPosition: "right",
    labelOffsetX: 22,
    labelOffsetY: 6
  },
  {
    id: "thalawathugoda",
    name: "Thalawathugoda",
    x: 1570,
    y: 1410,
    routes: ["CM01"],
    interchange: false,
    labelPosition: "right",
    labelOffsetX: 22,
    labelOffsetY: 6
  },
  {
    id: "kalalgoda",
    name: "Kalalgoda Junc.",
    x: 1650,
    y: 1490,
    routes: ["CM01"],
    interchange: false,
    labelPosition: "right",
    labelOffsetX: 22,
    labelOffsetY: 6
  },

  // ==================== INLAND SOUTH & CM08 (ALTERNATING TOP/BOTTOM) ====================
  {
    id: "army_hosp",
    name: "Army Hosp.",
    x: 830,
    y: 1280,
    routes: ["CM03"],
    interchange: false,
    labelPosition: "right",
    labelOffsetX: 22,
    labelOffsetY: 6
  },
  {
    id: "arcade",
    name: "Arcade",
    x: 680,
    y: 1150,
    routes: ["CM04", "CM06"],
    interchange: false,
    labelPosition: "right",
    labelOffsetX: 22,
    labelOffsetY: 6
  },
  {
    id: "jawatta",
    name: "Jawatta",
    x: 680,
    y: 1220,
    routes: ["CM04", "CM06"],
    interchange: false,
    labelPosition: "right",
    labelOffsetX: 22,
    labelOffsetY: 6
  },
  {
    id: "jawatta_rd",
    name: "Jawatta Rd.",
    x: 680,
    y: 1290,
    routes: ["CM06"],
    interchange: false,
    labelPosition: "right",
    labelOffsetX: 22,
    labelOffsetY: 6
  },
  {
    id: "hirdaramani",
    name: "Hirdaramani",
    x: 750,
    y: 1340,
    routes: ["CM06"],
    interchange: false,
    labelPosition: "right",
    labelOffsetX: 22,
    labelOffsetY: 6
  },
  {
    id: "vta",
    name: "VTA",
    x: 830,
    y: 1370,
    routes: ["CM03", "CM06"],
    interchange: false,
    labelPosition: "right",
    labelOffsetX: 22,
    labelOffsetY: 6
  },
  {
    id: "narahenpita",
    name: "Narahenpita",
    x: 830,
    y: 1460,
    routes: ["CM03", "CM06"],
    interchange: true,
    labelPosition: "right",
    labelOffsetX: 22,
    labelOffsetY: 6
  },
  {
    id: "kirulapone",
    name: "Kirulapone",
    x: 830,
    y: 1530,
    routes: ["CM03"],
    interchange: false,
    labelPosition: "right",
    labelOffsetX: 22,
    labelOffsetY: 6
  },
  {
    id: "royal_institute",
    name: "Royal Institute",
    x: 830,
    y: 1590,
    routes: ["CM03", "CM08"],
    interchange: false,
    labelPosition: "left",
    labelOffsetX: -22,
    labelOffsetY: 6
  },
  {
    id: "nugegoda",
    name: "Nugegoda",
    x: 950,
    y: 1660,
    routes: ["CM01", "CM03"],
    interchange: true,
    labelPosition: "bottom",
    labelOffsetX: 0,
    labelOffsetY: 28
  },
  {
    id: "delkanda",
    name: "Delkanda Junc.",
    x: 1050,
    y: 1660,
    routes: ["CM03"],
    interchange: false,
    labelPosition: "bottom",
    labelOffsetX: 0,
    labelOffsetY: 28
  },
  {
    id: "wijerama_junc",
    name: "Wijerama Junc.",
    x: 1150,
    y: 1660,
    routes: ["CM03"],
    interchange: false,
    labelPosition: "bottom",
    labelOffsetX: 0,
    labelOffsetY: 28
  },
  {
    id: "nawinna",
    name: "Nawinna",
    x: 1250,
    y: 1660,
    routes: ["CM03"],
    interchange: false,
    labelPosition: "bottom",
    labelOffsetX: 0,
    labelOffsetY: 28
  },
  {
    id: "maharagama",
    name: "Maharagama",
    x: 1350,
    y: 1660,
    routes: ["CM01", "CM03"],
    interchange: false,
    labelPosition: "bottom",
    labelOffsetX: 0,
    labelOffsetY: 28
  },
  {
    id: "cancer_hosp",
    name: "Cancer Hosp.",
    x: 1460,
    y: 1660,
    routes: ["CM03"],
    interchange: false,
    labelPosition: "bottom",
    labelOffsetX: 0,
    labelOffsetY: 28
  },
  {
    id: "kottawa",
    name: "Kottawa",
    x: 1650,
    y: 1660,
    routes: ["CM01", "CM03"],
    interchange: true,
    labelPosition: "bottom",
    labelOffsetX: 0,
    labelOffsetY: 28
  },
  {
    id: "pannipitiya",
    name: "Pannipitiya R.way",
    x: 1740,
    y: 1660,
    routes: ["CM01", "CM03"],
    interchange: false,
    labelPosition: "bottom",
    labelOffsetX: 0,
    labelOffsetY: 28
  },
  {
    id: "makumbura",
    name: "Makumbura",
    x: 1850,
    y: 1660,
    routes: ["CM01", "CM03"],
    interchange: true,
    labelPosition: "top-right",
    labelOffsetX: 16,
    labelOffsetY: -16
  },
  {
    id: "kesbewa",
    name: "Kesbewa",
    x: 1550,
    y: 1600,
    routes: ["CM08"],
    interchange: true,
    labelPosition: "right",
    labelOffsetX: 22,
    labelOffsetY: 6
  },
  {
    id: "piliyandala",
    name: "Piliyandala",
    x: 1420,
    y: 1700,
    routes: ["CM08"],
    interchange: false,
    labelPosition: "top",
    labelOffsetX: 0,
    labelOffsetY: -22
  },
  {
    id: "lanka_fiber",
    name: "Lanka Fiber",
    x: 1320,
    y: 1750,
    routes: ["CM08"],
    interchange: false,
    labelPosition: "bottom",
    labelOffsetX: 0,
    labelOffsetY: 28
  },
  {
    id: "weerasinghe",
    name: "Weerasinghe Mw.",
    x: 1220,
    y: 1750,
    routes: ["CM08"],
    interchange: false,
    labelPosition: "top",
    labelOffsetX: 0,
    labelOffsetY: -22
  },
  {
    id: "werahera",
    name: "Werahera",
    x: 1050,
    y: 1750,
    routes: ["CM08"],
    interchange: true,
    labelPosition: "bottom",
    labelOffsetX: 0,
    labelOffsetY: 28
  },
  {
    id: "boralesgamuwa",
    name: "Boralesgamuwa",
    x: 1050,
    y: 1750,
    routes: ["CM08"],
    interchange: true,
    labelPosition: "bottom",
    labelOffsetX: 0,
    labelOffsetY: 28
  },
  {
    id: "raththanapitiya",
    name: "Raththanapitiya",
    x: 950,
    y: 1750,
    routes: ["CM08"],
    interchange: false,
    labelPosition: "top",
    labelOffsetX: 0,
    labelOffsetY: -22
  },
  {
    id: "pepiliyana",
    name: "Pepiliyana",
    x: 860,
    y: 1750,
    routes: ["CM08"],
    interchange: false,
    labelPosition: "bottom",
    labelOffsetX: 0,
    labelOffsetY: 28
  },
  {
    id: "kalubowila",
    name: "Kalubowila Hosp.",
    x: 750,
    y: 1660,
    routes: ["CM08"],
    interchange: false,
    labelPosition: "left",
    labelOffsetX: -22,
    labelOffsetY: 6
  },
  {
    id: "thummulla",
    name: "Thummulla",
    x: 560,
    y: 1280,
    routes: ["CM04"],
    interchange: false,
    labelPosition: "left",
    labelOffsetX: -22,
    labelOffsetY: 6
  },
  {
    id: "thimbirigasyaya",
    name: "Thimbirigasyaya",
    x: 450,
    y: 1280,
    routes: ["CM04", "CM06", "CM08"],
    interchange: false,
    labelPosition: "left",
    labelOffsetX: -22,
    labelOffsetY: 6
  },
  {
    id: "brc_junc",
    name: "BRC Junc.",
    x: 560,
    y: 1370,
    routes: ["CM06", "CM08"],
    interchange: false,
    labelPosition: "right",
    labelOffsetX: 22,
    labelOffsetY: 6
  },
  {
    id: "havelock",
    name: "Havelock",
    x: 560,
    y: 1460,
    routes: ["CM06", "CM08"],
    interchange: false,
    labelPosition: "right",
    labelOffsetX: 22,
    labelOffsetY: 6
  },
  {
    id: "anderson_fls",
    name: "Anderson Fls.",
    x: 680,
    y: 1460,
    routes: ["CM06"],
    interchange: false,
    labelPosition: "bottom",
    labelOffsetX: 0,
    labelOffsetY: 28
  }
];
