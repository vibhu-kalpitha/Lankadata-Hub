import React, { useState, useMemo, useRef } from 'react';
import { Search, ZoomIn, ZoomOut, RotateCcw, Maximize2, Minimize2, Info, MapPin } from 'lucide-react';

export interface RouteMeta {
  code: string;
  name: string;
  color: string;
  lightColor: string;
  terminusA: string;
  terminusB: string;
}

export const METRO_ROUTES: Record<string, RouteMeta> = {
  CM01: {
    code: 'CM01',
    name: 'Makumbura ↔ Pettah',
    color: '#0099D8',
    lightColor: '#38bdf8',
    terminusA: 'Makumbura',
    terminusB: 'Pettah',
  },
  CM02: {
    code: 'CM02',
    name: 'Millennium City ↔ Colombo Fort',
    color: '#F3C300',
    lightColor: '#facc15',
    terminusA: 'Millennium City',
    terminusB: 'Colombo Fort',
  },
  CM03: {
    code: 'CM03',
    name: 'Kadawatha ↔ Makumbura',
    color: '#8A0030',
    lightColor: '#f43f5e',
    terminusA: 'Kadawatha',
    terminusB: 'Makumbura',
  },
  CM04: {
    code: 'CM04',
    name: 'Dematagoda ↔ Panadura',
    color: '#F58220',
    lightColor: '#fb923c',
    terminusA: 'Dematagoda',
    terminusB: 'Panadura',
  },
  CM05: {
    code: 'CM05',
    name: 'Battaramulla ↔ Ekala',
    color: '#6F2C91',
    lightColor: '#c084fc',
    terminusA: 'Battaramulla',
    terminusB: 'Ekala',
  },
  CM06: {
    code: 'CM06',
    name: 'Kollupitiya Circular Route',
    color: '#78BE20',
    lightColor: '#4ade80',
    terminusA: 'Kollupitiya',
    terminusB: 'Town Hall Loop',
  },
  CM08: {
    code: 'CM08',
    name: 'Kesbewa ↔ Pettah',
    color: '#007A3D',
    lightColor: '#34d399',
    terminusA: 'Kesbewa',
    terminusB: 'Pettah',
  },
};

export interface StationNode {
  id: string;
  name: string;
  x: number;
  y: number;
  routes: string[];
  isInterchange?: boolean;
  isTerminus?: boolean;
  labelPos?: 'top' | 'bottom' | 'left' | 'right' | 'top-right' | 'bottom-right' | 'top-left' | 'bottom-left';
}

export const STATIONS: StationNode[] = [
  // ==================== CM05 NORTH EKALA BRANCH ====================
  { id: 'ekala', name: 'Ekala', x: 860, y: 80, routes: ['CM05'], isTerminus: true, labelPos: 'top' },
  { id: 'ctb_junc', name: 'CTB Junc.', x: 800, y: 80, routes: ['CM05'], labelPos: 'top' },
  { id: 'ja_ela', name: 'Jā-Ela', x: 740, y: 80, routes: ['CM05'], labelPos: 'top' },
  { id: 'weligampitiya', name: 'Weligampitiya', x: 670, y: 80, routes: ['CM05'], labelPos: 'top' },
  { id: 'kandana', name: 'Kandana', x: 610, y: 80, routes: ['CM05'], labelPos: 'top' },
  { id: 'mahabage', name: 'Mahabage', x: 550, y: 80, routes: ['CM05'], labelPos: 'top' },
  { id: 'mabola', name: 'Mabola', x: 490, y: 80, routes: ['CM05'], labelPos: 'top' },
  { id: 'wattala', name: 'Wattala', x: 430, y: 80, routes: ['CM05'], labelPos: 'top' },
  { id: 'hekitta', name: 'Hekitta Junc.', x: 370, y: 80, routes: ['CM05'], labelPos: 'top' },
  { id: 'peliyagoda', name: 'Peliyagoda', x: 330, y: 120, routes: ['CM05'], labelPos: 'left' },

  // ==================== CM03 KADAWATHA BRANCH ====================
  { id: 'kadawatha', name: 'Kadawatha', x: 520, y: 160, routes: ['CM03'], isTerminus: true, labelPos: 'top' },
  { id: 'mahara', name: 'Mahara Junc.', x: 460, y: 160, routes: ['CM03'], labelPos: 'top' },
  { id: 'kiribathgoda', name: 'Kiribathgoda', x: 410, y: 160, routes: ['CM03'], labelPos: 'top' },
  { id: 'kelaniya_campus', name: 'Kelaniya Campus', x: 360, y: 160, routes: ['CM03'], labelPos: 'top' },

  // ==================== KELANI TRUNK ====================
  { id: 'thorana', name: 'Thorana Junc.', x: 300, y: 150, routes: ['CM03', 'CM05'], isInterchange: true, labelPos: 'right' },
  { id: 'new_kelani_br', name: 'New Kelani Br.', x: 280, y: 180, routes: ['CM03', 'CM05'], labelPos: 'left' },
  { id: 'orugodawatta', name: 'Orugodawatta', x: 280, y: 230, routes: ['CM03', 'CM05'], labelPos: 'left' },

  // ==================== CENTRAL TRUNK (DEMATAGODA - BORELLA) ====================
  { id: 'dematagoda', name: 'Dematagoda', x: 280, y: 280, routes: ['CM03', 'CM04', 'CM05'], isInterchange: true, isTerminus: true, labelPos: 'right' },
  { id: 'campbell_park', name: 'Campbell Park', x: 280, y: 325, routes: ['CM03', 'CM04', 'CM05'], labelPos: 'right' },
  { id: 'borella', name: 'Borella', x: 280, y: 380, routes: ['CM01', 'CM02', 'CM03', 'CM04', 'CM05'], isInterchange: true, labelPos: 'right' },

  // ==================== EAST CORRIDOR (BORELLA -> BATTARAMULLA) ====================
  { id: 'castle_hosp', name: 'Castle Hosp.', x: 330, y: 380, routes: ['CM01', 'CM02', 'CM05'], labelPos: 'top' },
  { id: 'singer_mega', name: 'Singer Mega', x: 380, y: 380, routes: ['CM01', 'CM02', 'CM03', 'CM04', 'CM05'], labelPos: 'top' },
  { id: 'rajagiriya', name: 'Rajagiriya', x: 420, y: 380, routes: ['CM01', 'CM02', 'CM05'], labelPos: 'top' },
  { id: 'naita', name: 'NAITA', x: 450, y: 380, routes: ['CM01', 'CM02', 'CM05'], labelPos: 'top' },
  { id: 'sethsiripaya', name: 'Sethsiripaya', x: 490, y: 380, routes: ['CM01', 'CM02', 'CM05'], labelPos: 'top' },
  { id: 'battaramulla_junc', name: 'Battaramulla Junc.', x: 530, y: 380, routes: ['CM01', 'CM02', 'CM05'], isInterchange: true, isTerminus: true, labelPos: 'bottom' },
  { id: 'thalangama_depot', name: 'Thalangama Depot', x: 580, y: 330, routes: ['CM05'], isTerminus: true, labelPos: 'right' },

  { id: 'koswaththa', name: 'Koswaththa', x: 530, y: 425, routes: ['CM01', 'CM02'], labelPos: 'left' },
  { id: 'palam_thuna', name: 'Palam Thuna Junc.', x: 530, y: 460, routes: ['CM01', 'CM02'], labelPos: 'left' },
  { id: 'thalangama_junc', name: 'Thalangama Junc.', x: 560, y: 490, routes: ['CM01', 'CM02'], isInterchange: true, labelPos: 'bottom' },
  { id: 'thalahena_junc', name: 'Thalahena Junc.', x: 590, y: 520, routes: ['CM01', 'CM02'], labelPos: 'bottom' },

  // ==================== CM02 MILLENNIUM CITY BRANCH ====================
  { id: 'isurupaya', name: 'Isurupaya', x: 620, y: 500, routes: ['CM02'], isInterchange: true, labelPos: 'top' },
  { id: 'malabe', name: 'Malabe', x: 670, y: 500, routes: ['CM02'], labelPos: 'top' },
  { id: 'arangala', name: 'Arangala Junc.', x: 720, y: 500, routes: ['CM02'], labelPos: 'top' },
  { id: 'hokandara', name: 'Hokandara Junc.', x: 765, y: 500, routes: ['CM02'], labelPos: 'top' },
  { id: 'nisaco', name: 'Nisaco Mall', x: 810, y: 500, routes: ['CM02'], labelPos: 'top' },
  { id: 'athurugiriya_town', name: 'Athurugiriya Town', x: 865, y: 500, routes: ['CM02'], labelPos: 'top' },
  { id: 'athurugiriya_hosp', name: 'Athurugiriya Hosp.', x: 895, y: 460, routes: ['CM02'], labelPos: 'right' },
  { id: 'millennium_city', name: 'Millennium City', x: 895, y: 415, routes: ['CM02'], isTerminus: true, labelPos: 'right' },

  // ==================== CM01 MAKUMBURA BRANCH ====================
  { id: 'thalawathugoda', name: 'Thalawathugoda', x: 620, y: 550, routes: ['CM01'], labelPos: 'right' },
  { id: 'kalalgoda', name: 'Kalalgoda Junc.', x: 650, y: 580, routes: ['CM01'], labelPos: 'right' },
  { id: 'kottawa', name: 'Kottawa', x: 650, y: 640, routes: ['CM01', 'CM03'], isInterchange: true, labelPos: 'top' },
  { id: 'makumbura', name: 'Makumbura', x: 740, y: 640, routes: ['CM01', 'CM03'], isInterchange: true, isTerminus: true, labelPos: 'right' },

  // ==================== CM03 INLAND LINE (BORELLA -> NUGEGODA -> MAHARAGAMA -> MAKUMBURA) ====================
  { id: 'army_hosp', name: 'Army Hosp. Borella', x: 280, y: 430, routes: ['CM03', 'CM04'], labelPos: 'right' },
  { id: 'vta_aat', name: 'VTA / AAT', x: 280, y: 475, routes: ['CM03', 'CM04', 'CM06', 'CM08'], labelPos: 'right' },
  { id: 'narahenpita', name: 'Narahenpita', x: 280, y: 520, routes: ['CM03', 'CM04', 'CM06', 'CM08'], isInterchange: true, labelPos: 'right' },
  { id: 'kirulapone', name: 'Kirulapone', x: 280, y: 565, routes: ['CM03', 'CM04', 'CM08'], labelPos: 'right' },
  { id: 'royal_inst', name: 'Royal Institute', x: 310, y: 595, routes: ['CM03', 'CM08'], labelPos: 'bottom' },
  { id: 'nugegoda', name: 'Nugegoda', x: 350, y: 595, routes: ['CM03', 'CM08'], isInterchange: true, labelPos: 'bottom' },

  { id: 'delkanda', name: 'Delkanda Junc.', x: 395, y: 595, routes: ['CM03'], labelPos: 'bottom' },
  { id: 'wijerama_junc', name: 'Wijerama Junc.', x: 440, y: 595, routes: ['CM03'], labelPos: 'bottom' },
  { id: 'nawinna', name: 'Nawinna', x: 485, y: 595, routes: ['CM03'], labelPos: 'bottom' },
  { id: 'maharagama', name: 'Maharagama', x: 535, y: 595, routes: ['CM03'], labelPos: 'bottom' },
  { id: 'maharagama_rail', name: 'Maharagama Railway', x: 575, y: 595, routes: ['CM03'], labelPos: 'top' },
  { id: 'cargills_city', name: 'Cargills Food City', x: 575, y: 625, routes: ['CM08'], labelPos: 'right' },
  { id: 'cancer_hosp', name: 'Cancer Hosp. 01', x: 575, y: 655, routes: ['CM03'], labelPos: 'left' },
  { id: 'pannipitiya', name: 'Pannipitiya', x: 610, y: 640, routes: ['CM03'], labelPos: 'bottom' },

  // ==================== CM08 KESBEWA & KALUBOWILA LINE ====================
  { id: 'kesbewa', name: 'Kesbewa', x: 680, y: 700, routes: ['CM08'], isTerminus: true, labelPos: 'right' },
  { id: 'piliyandala', name: 'Piliyandala', x: 620, y: 700, routes: ['CM08'], labelPos: 'top' },
  { id: 'lanka_fiber', name: 'Lanka Fiber', x: 550, y: 700, routes: ['CM08'], labelPos: 'top' },
  { id: 'weerasinghe', name: 'Weerasinghe Mw.', x: 500, y: 700, routes: ['CM08'], labelPos: 'top' },
  { id: 'boralesgamuwa', name: 'Boralesgamuwa Werahera', x: 440, y: 700, routes: ['CM08'], isInterchange: true, labelPos: 'top' },
  { id: 'raththanapitiya', name: 'Raththanapitiya', x: 390, y: 700, routes: ['CM08'], labelPos: 'top' },
  { id: 'pepiliyana', name: 'Pepiliyana', x: 340, y: 700, routes: ['CM08'], labelPos: 'top' },
  { id: 'kalubowila', name: 'Kalubowila Hosp.', x: 310, y: 660, routes: ['CM08'], labelPos: 'left' },

  // ==================== CM04 COAST LINE (DEMATAGODA -> THIMBIRIGASYAYA -> DEHIWALA -> MORATUWA -> PANADURA) ====================
  // Note: Straight horizontal line along the bottom coast from Rathmalana Tech to Mahanama Junc.
  { id: 'rathmalana_tech', name: 'Rathmalana Tech', x: 280, y: 775, routes: ['CM04'], labelPos: 'bottom' },
  { id: 'golumadama', name: 'Golumadama Junc.', x: 330, y: 775, routes: ['CM04'], labelPos: 'bottom' },
  { id: 'german_tech', name: 'German Tech Angulana Junc.', x: 380, y: 775, routes: ['CM04'], labelPos: 'bottom' },
  { id: 'katubedda', name: 'Katubedda Junc.', x: 430, y: 775, routes: ['CM04'], labelPos: 'bottom' },
  { id: 'mendis_ln', name: 'Mendis Ln. Rawathawatta', x: 480, y: 775, routes: ['CM04'], labelPos: 'bottom' },
  { id: 'moratuwa', name: 'Moratuwa', x: 530, y: 775, routes: ['CM04'], labelPos: 'bottom' },
  { id: 'koralawella', name: 'Koralawella', x: 580, y: 775, routes: ['CM04'], labelPos: 'bottom' },
  { id: 'egoda_uyana', name: 'Egoda Uyana', x: 630, y: 775, routes: ['CM04'], labelPos: 'bottom' },
  { id: 'jayanthi_mw', name: 'Jayanthi Mw.', x: 680, y: 775, routes: ['CM04'], labelPos: 'bottom' },
  { id: 'palam_junc', name: 'Palam Junc.', x: 730, y: 775, routes: ['CM04'], labelPos: 'bottom' },
  { id: 'mahanama', name: 'Mahanama Junc.', x: 780, y: 775, routes: ['CM04'], labelPos: 'bottom' },
  { id: 'panadura', name: 'Panadura', x: 830, y: 725, routes: ['CM04'], labelPos: 'right' },
  { id: 'panadura_hosp', name: 'Panadura Base Hosp.', x: 830, y: 685, routes: ['CM04'], isTerminus: true, labelPos: 'right' },

  // ==================== WEST COLOMBO (FORT, PETTAH, KOLLUPITIYA, MARADANA, TOWN HALL) ====================
  { id: 'fort', name: 'Colombo Fort', x: 80, y: 260, routes: ['CM02', 'CM08'], isTerminus: true, labelPos: 'left' },
  { id: 'pettah', name: 'Pettah', x: 130, y: 260, routes: ['CM01', 'CM08'], isTerminus: true, labelPos: 'top' },
  { id: 'regal_cinema', name: 'Regal Cinema', x: 155, y: 280, routes: ['CM01', 'CM08'], labelPos: 'right' },
  { id: 'gamin_hall', name: 'Gamin Hall', x: 195, y: 280, routes: ['CM01', 'CM08'], labelPos: 'right' },
  { id: 'maradana', name: 'Maradana Railway', x: 195, y: 250, routes: ['CM01', 'CM08'], isInterchange: true, labelPos: 'right' },
  { id: 'hedges_ct', name: 'Hedges Ct.', x: 235, y: 310, routes: ['CM01', 'CM08'], labelPos: 'right' },
  { id: 'town_hall', name: 'Town Hall', x: 195, y: 350, routes: ['CM02', 'CM06', 'CM08'], isInterchange: true, labelPos: 'right' },
  { id: 'nelum_pokuna', name: 'Nelum Pokuna', x: 155, y: 350, routes: ['CM06', 'CM08'], labelPos: 'bottom' },
  { id: 'union_place', name: 'Union Place', x: 135, y: 315, routes: ['CM02'], labelPos: 'left' },
  { id: 'nawaloka', name: 'Nawaloka', x: 95, y: 335, routes: ['CM02'], labelPos: 'left' },
  { id: 'public_library', name: 'Public Library', x: 80, y: 360, routes: ['CM02', 'CM06'], labelPos: 'left' },
  { id: 'lake_house', name: 'Lake House', x: 80, y: 300, routes: ['CM02'], labelPos: 'left' },

  { id: 'liberty', name: 'Liberty', x: 80, y: 400, routes: ['CM06'], labelPos: 'left' },
  { id: 'kollupitiya', name: 'Kollupitiya', x: 80, y: 440, routes: ['CM06', 'CM08'], isInterchange: true, isTerminus: true, labelPos: 'left' },
  { id: 'bambalapitiya', name: 'Bambalapitiya', x: 80, y: 480, routes: ['CM04', 'CM06', 'CM08'], isInterchange: true, labelPos: 'left' },
  { id: 'wellawatta', name: 'Wellawatta', x: 80, y: 530, routes: ['CM04', 'CM08'], labelPos: 'left' },
  { id: 'wa_silva', name: 'W.A. Silva Mw.', x: 130, y: 530, routes: ['CM04'], labelPos: 'bottom' },
  { id: 'williams_junc', name: 'Williams Junc.', x: 130, y: 575, routes: ['CM04'], labelPos: 'bottom' },
  { id: 'dehiwala', name: 'Dehiwala', x: 80, y: 575, routes: ['CM04', 'CM08'], isInterchange: true, labelPos: 'left' },
  { id: 'mount_lavinia', name: 'Mount Lavinia', x: 135, y: 625, routes: ['CM04'], labelPos: 'bottom' },
  { id: 'lalanka', name: 'Lalanka Ratmalana', x: 180, y: 665, routes: ['CM04'], labelPos: 'bottom' },
  { id: 'maliban_junc', name: 'Maliban Junc.', x: 235, y: 705, routes: ['CM04'], labelPos: 'bottom' },

  { id: 'thimbirigasyaya', name: 'Thimbirigasyaya', x: 140, y: 440, routes: ['CM04', 'CM06', 'CM08'], labelPos: 'right' },
  { id: 'brc_junc', name: 'BRC Junc.', x: 140, y: 480, routes: ['CM06'], labelPos: 'right' },
  { id: 'anderson_flats', name: 'Anderson Flats', x: 180, y: 480, routes: ['CM06'], labelPos: 'bottom' },
  { id: 'havelock', name: 'Havelock', x: 215, y: 480, routes: ['CM06'], labelPos: 'bottom' },
  { id: 'jawatta_rd', name: 'Jawatta Rd.', x: 215, y: 440, routes: ['CM06', 'CM08'], labelPos: 'right' },
  { id: 'independence_arcade', name: 'Independence Arcade', x: 175, y: 415, routes: ['CM04', 'CM06', 'CM08'], labelPos: 'bottom' },
  { id: 'thummulla', name: 'Thummulla', x: 140, y: 415, routes: ['CM06', 'CM08'], labelPos: 'top' },
];

export interface TrackSegment {
  id: string;
  from: string;
  to: string;
  routes: string[];
}

export const SEGMENTS: TrackSegment[] = [
  // ==================== CM05 NORTH EKALA LINE ====================
  { id: 's_ekala_ctb', from: 'ekala', to: 'ctb_junc', routes: ['CM05'] },
  { id: 's_ctb_jaela', from: 'ctb_junc', to: 'ja_ela', routes: ['CM05'] },
  { id: 's_jaela_weligam', from: 'ja_ela', to: 'weligampitiya', routes: ['CM05'] },
  { id: 's_weligam_kandana', from: 'weligampitiya', to: 'kandana', routes: ['CM05'] },
  { id: 's_kandana_mahabage', from: 'kandana', to: 'mahabage', routes: ['CM05'] },
  { id: 's_mahabage_mabola', from: 'mahabage', to: 'mabola', routes: ['CM05'] },
  { id: 's_mabola_wattala', from: 'mabola', to: 'wattala', routes: ['CM05'] },
  { id: 's_wattala_hekitta', from: 'wattala', to: 'hekitta', routes: ['CM05'] },
  { id: 's_hekitta_peliyagoda', from: 'hekitta', to: 'peliyagoda', routes: ['CM05'] },
  { id: 's_peliyagoda_thorana', from: 'peliyagoda', to: 'thorana', routes: ['CM05'] },

  // ==================== CM03 KADAWATHA LINE ====================
  { id: 's_kadawatha_mahara', from: 'kadawatha', to: 'mahara', routes: ['CM03'] },
  { id: 's_mahara_kiri', from: 'mahara', to: 'kiribathgoda', routes: ['CM03'] },
  { id: 's_kiri_kelaniya', from: 'kiribathgoda', to: 'kelaniya_campus', routes: ['CM03'] },
  { id: 's_kelaniya_thorana', from: 'kelaniya_campus', to: 'thorana', routes: ['CM03'] },

  // ==================== KELANI RIVER SHARED TRUNK (CM03 + CM05) ====================
  { id: 's_thorana_newkelani', from: 'thorana', to: 'new_kelani_br', routes: ['CM03', 'CM05'] },
  { id: 's_newkelani_orugoda', from: 'new_kelani_br', to: 'orugodawatta', routes: ['CM03', 'CM05'] },
  { id: 's_orugoda_dematagoda', from: 'orugodawatta', to: 'dematagoda', routes: ['CM03', 'CM05'] },

  // ==================== CENTRAL VERTICAL TRUNK (DEMATAGODA -> BORELLA) [CM03, CM04, CM05] ====================
  { id: 's_demata_campbell', from: 'dematagoda', to: 'campbell_park', routes: ['CM03', 'CM04', 'CM05'] },
  { id: 's_campbell_borella', from: 'campbell_park', to: 'borella', routes: ['CM03', 'CM04', 'CM05'] },

  // ==================== EAST SHARED CORRIDOR (BORELLA -> BATTARAMULLA) [CM01, CM02, CM05] ====================
  { id: 's_borella_castle', from: 'borella', to: 'castle_hosp', routes: ['CM01', 'CM02', 'CM05'] },
  { id: 's_castle_singer', from: 'castle_hosp', to: 'singer_mega', routes: ['CM01', 'CM02', 'CM03', 'CM04', 'CM05'] },
  { id: 's_singer_raja', from: 'singer_mega', to: 'rajagiriya', routes: ['CM01', 'CM02', 'CM05'] },
  { id: 's_raja_naita', from: 'rajagiriya', to: 'naita', routes: ['CM01', 'CM02', 'CM05'] },
  { id: 's_naita_seth', from: 'naita', to: 'sethsiripaya', routes: ['CM01', 'CM02', 'CM05'] },
  { id: 's_seth_batta', from: 'sethsiripaya', to: 'battaramulla_junc', routes: ['CM01', 'CM02', 'CM05'] },
  { id: 's_batta_depot', from: 'battaramulla_junc', to: 'thalangama_depot', routes: ['CM05'] },

  // ==================== CM01 & CM02 EAST BRANCH ====================
  { id: 's_batta_koswath', from: 'battaramulla_junc', to: 'koswaththa', routes: ['CM01', 'CM02'] },
  { id: 's_koswath_palam', from: 'koswaththa', to: 'palam_thuna', routes: ['CM01', 'CM02'] },
  { id: 's_palam_thalangama', from: 'palam_thuna', to: 'thalangama_junc', routes: ['CM01', 'CM02'] },
  { id: 's_thalangama_thalahena', from: 'thalangama_junc', to: 'thalahena_junc', routes: ['CM01', 'CM02'] },

  // ==================== CM02 MILLENNIUM CITY BRANCH ====================
  { id: 's_thalahena_isurupaya', from: 'thalahena_junc', to: 'isurupaya', routes: ['CM02'] },
  { id: 's_isurupaya_malabe', from: 'isurupaya', to: 'malabe', routes: ['CM02'] },
  { id: 's_malabe_arangala', from: 'malabe', to: 'arangala', routes: ['CM02'] },
  { id: 's_arangala_hokandara', from: 'arangala', to: 'hokandara', routes: ['CM02'] },
  { id: 's_hokandara_nisaco', from: 'hokandara', to: 'nisaco', routes: ['CM02'] },
  { id: 's_nisaco_athurugiriya', from: 'nisaco', to: 'athurugiriya_town', routes: ['CM02'] },
  { id: 's_athurugiriya_hosp', from: 'athurugiriya_town', to: 'athurugiriya_hosp', routes: ['CM02'] },
  { id: 's_athuru_mcity', from: 'athurugiriya_hosp', to: 'millennium_city', routes: ['CM02'] },

  // ==================== CM01 MAKUMBURA BRANCH ====================
  { id: 's_thalahena_thalawa', from: 'thalahena_junc', to: 'thalawathugoda', routes: ['CM01'] },
  { id: 's_thalawa_kalalgoda', from: 'thalawathugoda', to: 'kalalgoda', routes: ['CM01'] },
  { id: 's_kalalgoda_kottawa', from: 'kalalgoda', to: 'kottawa', routes: ['CM01'] },
  { id: 's_kottawa_makumbura', from: 'kottawa', to: 'makumbura', routes: ['CM01', 'CM03'] },

  // ==================== CM03 INLAND TRUNK (BORELLA -> NUGEGODA -> MAHARAGAMA -> MAKUMBURA) ====================
  { id: 's_singer_army', from: 'singer_mega', to: 'army_hosp', routes: ['CM03', 'CM04'] },
  { id: 's_army_vta', from: 'army_hosp', to: 'vta_aat', routes: ['CM03', 'CM04', 'CM06', 'CM08'] },
  { id: 's_vta_narahen', from: 'vta_aat', to: 'narahenpita', routes: ['CM03', 'CM04', 'CM06', 'CM08'] },
  { id: 's_narahen_kirula', from: 'narahenpita', to: 'kirulapone', routes: ['CM03', 'CM04', 'CM08'] },
  { id: 's_kirula_royal', from: 'kirulapone', to: 'royal_inst', routes: ['CM03', 'CM08'] },
  { id: 's_royal_nugegoda', from: 'royal_inst', to: 'nugegoda', routes: ['CM03', 'CM08'] },

  { id: 's_nugegoda_delkanda', from: 'nugegoda', to: 'delkanda', routes: ['CM03'] },
  { id: 's_delkanda_wijerama', from: 'delkanda', to: 'wijerama_junc', routes: ['CM03'] },
  { id: 's_wijerama_nawinna', from: 'wijerama_junc', to: 'nawinna', routes: ['CM03'] },
  { id: 's_nawinna_maharagama', from: 'nawinna', to: 'maharagama', routes: ['CM03'] },
  { id: 's_mahara_rail', from: 'maharagama', to: 'maharagama_rail', routes: ['CM03'] },
  { id: 's_rail_cancer', from: 'maharagama_rail', to: 'cancer_hosp', routes: ['CM03'] },
  { id: 's_cancer_panni', from: 'cancer_hosp', to: 'pannipitiya', routes: ['CM03'] },
  { id: 's_panni_kottawa', from: 'pannipitiya', to: 'kottawa', routes: ['CM03'] },

  // ==================== CM08 KESBEWA LINE ====================
  { id: 's_nugegoda_kalubowila', from: 'nugegoda', to: 'kalubowila', routes: ['CM08'] },
  { id: 's_kalubowila_pepili', from: 'kalubowila', to: 'pepiliyana', routes: ['CM08'] },
  { id: 's_pepili_raththana', from: 'pepiliyana', to: 'raththanapitiya', routes: ['CM08'] },
  { id: 's_raththana_borales', from: 'raththanapitiya', to: 'boralesgamuwa', routes: ['CM08'] },
  { id: 's_borales_weera', from: 'boralesgamuwa', to: 'weerasinghe', routes: ['CM08'] },
  { id: 's_weera_lanka', from: 'weerasinghe', to: 'lanka_fiber', routes: ['CM08'] },
  { id: 's_lanka_piliyan', from: 'lanka_fiber', to: 'piliyandala', routes: ['CM08'] },
  { id: 's_piliyan_kesbewa', from: 'piliyandala', to: 'kesbewa', routes: ['CM08'] },

  // ==================== CM04 COAST LINE (DEMATAGODA -> THIMBIRIGASYAYA -> DEHIWALA -> MORATUWA -> PANADURA) ====================
  { id: 's_vta_inde', from: 'vta_aat', to: 'independence_arcade', routes: ['CM04', 'CM06', 'CM08'] },
  { id: 's_inde_thimbirigasyaya', from: 'independence_arcade', to: 'thimbirigasyaya', routes: ['CM04', 'CM06', 'CM08'] },
  { id: 's_thimbirigasyaya_bamba', from: 'thimbirigasyaya', to: 'bambalapitiya', routes: ['CM04', 'CM06', 'CM08'] },
  { id: 's_bamba_wellawatta', from: 'bambalapitiya', to: 'wellawatta', routes: ['CM04', 'CM08'] },
  { id: 's_wella_williams', from: 'wellawatta', to: 'williams_junc', routes: ['CM04'] },
  { id: 's_williams_dehiwala', from: 'williams_junc', to: 'dehiwala', routes: ['CM04', 'CM08'] },
  { id: 's_dehiwala_mount', from: 'dehiwala', to: 'mount_lavinia', routes: ['CM04'] },
  { id: 's_mount_lalanka', from: 'mount_lavinia', to: 'lalanka', routes: ['CM04'] },
  { id: 's_lalanka_maliban', from: 'lalanka', to: 'maliban_junc', routes: ['CM04'] },
  { id: 's_maliban_rathmalana', from: 'maliban_junc', to: 'rathmalana_tech', routes: ['CM04'] },

  // Perfect straight horizontal line along the bottom coast:
  { id: 's_rathmalana_golumadama', from: 'rathmalana_tech', to: 'golumadama', routes: ['CM04'] },
  { id: 's_golumadama_german', from: 'golumadama', to: 'german_tech', routes: ['CM04'] },
  { id: 's_german_katubedda', from: 'german_tech', to: 'katubedda', routes: ['CM04'] },
  { id: 's_katu_mendis', from: 'katubedda', to: 'mendis_ln', routes: ['CM04'] },
  { id: 's_mendis_moratuwa', from: 'mendis_ln', to: 'moratuwa', routes: ['CM04'] },
  { id: 's_moratuwa_koralawella', from: 'moratuwa', to: 'koralawella', routes: ['CM04'] },
  { id: 's_koralawella_egoda', from: 'koralawella', to: 'egoda_uyana', routes: ['CM04'] },
  { id: 's_egoda_jayanthi', from: 'egoda_uyana', to: 'jayanthi_mw', routes: ['CM04'] },
  { id: 's_jayanthi_palam', from: 'jayanthi_mw', to: 'palam_junc', routes: ['CM04'] },
  { id: 's_palam_mahanama', from: 'palam_junc', to: 'mahanama', routes: ['CM04'] },
  { id: 's_mahanama_panadura', from: 'mahanama', to: 'panadura', routes: ['CM04'] },
  { id: 's_panadura_hosp', from: 'panadura', to: 'panadura_hosp', routes: ['CM04'] },

  // ==================== WEST COLOMBO (PETTAH, FORT, MARADANA, TOWN HALL) ====================
  { id: 's_borella_hedges', from: 'borella', to: 'hedges_ct', routes: ['CM01', 'CM08'] },
  { id: 's_hedges_maradana', from: 'hedges_ct', to: 'maradana', routes: ['CM01', 'CM08'] },
  { id: 's_maradana_gamin', from: 'maradana', to: 'gamin_hall', routes: ['CM01', 'CM08'] },
  { id: 's_gamin_regal', from: 'gamin_hall', to: 'regal_cinema', routes: ['CM01', 'CM08'] },
  { id: 's_regal_pettah', from: 'regal_cinema', to: 'pettah', routes: ['CM01', 'CM08'] },
  { id: 's_pettah_fort', from: 'pettah', to: 'fort', routes: ['CM08'] },

  { id: 's_borella_townhall', from: 'borella', to: 'town_hall', routes: ['CM02'] },
  { id: 's_townhall_union', from: 'town_hall', to: 'union_place', routes: ['CM02'] },
  { id: 's_union_nawaloka', from: 'union_place', to: 'nawaloka', routes: ['CM02'] },
  { id: 's_nawaloka_publib', from: 'nawaloka', to: 'public_library', routes: ['CM02'] },
  { id: 's_publib_lake', from: 'public_library', to: 'lake_house', routes: ['CM02'] },
  { id: 's_lake_fort', from: 'lake_house', to: 'fort', routes: ['CM02'] },

  // ==================== CM06 CIRCULAR ROUTE ====================
  { id: 's_publib_liberty', from: 'public_library', to: 'liberty', routes: ['CM06'] },
  { id: 's_liberty_kollupitiya', from: 'liberty', to: 'kollupitiya', routes: ['CM06'] },
  { id: 's_kollupitiya_bamba', from: 'kollupitiya', to: 'bambalapitiya', routes: ['CM06', 'CM08'] },
  { id: 's_bamba_brc', from: 'bambalapitiya', to: 'brc_junc', routes: ['CM06'] },
  { id: 's_brc_anderson', from: 'brc_junc', to: 'anderson_flats', routes: ['CM06'] },
  { id: 's_anderson_havelock', from: 'anderson_flats', to: 'havelock', routes: ['CM06'] },
  { id: 's_havelock_jawatta', from: 'havelock', to: 'jawatta_rd', routes: ['CM06'] },
  { id: 's_jawatta_thummulla', from: 'jawatta_rd', to: 'thummulla', routes: ['CM06', 'CM08'] },
  { id: 's_thummulla_nelum', from: 'thummulla', to: 'nelum_pokuna', routes: ['CM06', 'CM08'] },
  { id: 's_nelum_townhall', from: 'nelum_pokuna', to: 'town_hall', routes: ['CM06', 'CM08'] },
];

export const LankaMetroMap: React.FC = () => {
  const [selectedRoute, setSelectedRoute] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [hoveredStation, setHoveredStation] = useState<StationNode | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);

  // Map station lookup for quick reference
  const stationMap = useMemo(() => {
    const map = new Map<string, StationNode>();
    STATIONS.forEach((s) => map.set(s.id, s));
    return map;
  }, []);

  // Filtered stations based on search query
  const searchMatches = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return STATIONS.filter((s) => s.name.toLowerCase().includes(q));
  }, [searchQuery]);

  // Handle Drag / Pan
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPanOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Zoom helpers
  const zoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.25, 2.5));
  const zoomOut = () => setZoomLevel((prev) => Math.max(prev - 0.25, 0.75));
  const resetView = () => {
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
    setSelectedRoute(null);
    setSearchQuery('');
  };

  // Calculate multi-line parallel offsets for shared segments
  const renderSegmentLines = (seg: TrackSegment) => {
    const fromNode = stationMap.get(seg.from);
    const toNode = stationMap.get(seg.to);
    if (!fromNode || !toNode) return null;

    // Filter active routes on segment
    const activeSegRoutes = seg.routes.filter(
      (r) => selectedRoute === null || selectedRoute === r
    );

    if (activeSegRoutes.length === 0) return null;

    const dx = toNode.x - fromNode.x;
    const dy = toNode.y - fromNode.y;
    const len = Math.sqrt(dx * dx + dy * dy);
    if (len === 0) return null;

    // Normal vector perpendicular to line direction
    const nx = -dy / len;
    const ny = dx / len;

    const strokeWidth = 4;
    const spacing = 5.5;
    const count = seg.routes.length;

    return seg.routes.map((routeCode) => {
      const routeMeta = METRO_ROUTES[routeCode];
      if (!routeMeta) return null;

      const routeIndex = seg.routes.indexOf(routeCode);
      const isDimmed = selectedRoute !== null && selectedRoute !== routeCode;
      const offset = (routeIndex - (count - 1) / 2) * spacing;

      const x1 = fromNode.x + nx * offset;
      const y1 = fromNode.y + ny * offset;
      const x2 = toNode.x + nx * offset;
      const y2 = toNode.y + ny * offset;

      return (
        <line
          key={`${seg.id}-${routeCode}`}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke={routeMeta.color}
          strokeWidth={strokeWidth}
          strokeLinecap="square"
          strokeLinejoin="miter"
          opacity={isDimmed ? 0.12 : 1}
          style={{
            transition: 'all 0.3s ease',
            filter: selectedRoute === routeCode ? `drop-shadow(0 0 4px ${routeMeta.color})` : 'none',
          }}
        />
      );
    });
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full rounded-2xl bg-[#090d16] border border-cyan-500/30 overflow-hidden shadow-2xl flex flex-col transition-all ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none h-screen' : 'h-[620px] md:h-[680px]'
      }`}
    >
      {/* MAP CONTROL BAR TOP */}
      <div className="bg-[#0f172a]/95 border-b border-cyan-500/20 p-3 flex flex-wrap items-center justify-between gap-2 z-20 backdrop-blur-md">
        
        {/* Left: Brand Title & Route Selector Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2 mr-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
            <span className="text-xs font-black tracking-widest text-cyan-400 uppercase">
              LANKA METRO TRANSIT
            </span>
          </div>

          {/* Route filter pills */}
          <div className="flex flex-wrap items-center gap-1">
            <button
              onClick={() => setSelectedRoute(null)}
              className={`px-2.5 py-1 text-[10px] font-bold uppercase rounded-md transition-all ${
                selectedRoute === null
                  ? 'bg-cyan-500 text-slate-950 font-black shadow-[0_0_12px_rgba(0,210,255,0.5)]'
                  : 'bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700'
              }`}
            >
              ALL ROUTES
            </button>

            {Object.values(METRO_ROUTES).map((route) => {
              const isActive = selectedRoute === route.code;
              return (
                <button
                  key={route.code}
                  onClick={() => setSelectedRoute(isActive ? null : route.code)}
                  className={`px-2 py-1 text-[10px] font-bold rounded-md flex items-center gap-1 transition-all ${
                    isActive
                      ? 'text-white shadow-md ring-1 ring-white/40'
                      : 'opacity-70 hover:opacity-100 bg-slate-900/60 text-slate-300'
                  }`}
                  style={{
                    backgroundColor: isActive ? route.color : undefined,
                    borderColor: route.color,
                  }}
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: route.color }}
                  />
                  <span>{route.code}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Search & View Controls */}
        <div className="flex items-center gap-2">
          {/* Station Search Input */}
          <div className="relative">
            <Search className="absolute left-2.5 top-2 w-3.5 h-3.5 text-cyan-400" />
            <input
              type="text"
              placeholder="Search station (e.g. Borella)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-36 md:w-48 bg-slate-900/90 border border-slate-700 text-slate-200 text-xs rounded-lg pl-8 pr-3 py-1 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all placeholder:text-slate-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1.5 text-xs text-slate-400 hover:text-white"
              >
                ✕
              </button>
            )}
          </div>

          {/* Map Controls */}
          <div className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-lg border border-slate-800">
            <button
              onClick={zoomIn}
              title="Zoom In"
              className="p-1 text-slate-300 hover:text-cyan-400 hover:bg-slate-800 rounded"
            >
              <ZoomIn size={14} />
            </button>
            <button
              onClick={zoomOut}
              title="Zoom Out"
              className="p-1 text-slate-300 hover:text-cyan-400 hover:bg-slate-800 rounded"
            >
              <ZoomOut size={14} />
            </button>
            <button
              onClick={resetView}
              title="Reset Map View"
              className="p-1 text-slate-300 hover:text-cyan-400 hover:bg-slate-800 rounded"
            >
              <RotateCcw size={14} />
            </button>
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
              className="p-1 text-slate-300 hover:text-cyan-400 hover:bg-slate-800 rounded"
            >
              {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
            </button>
          </div>
        </div>

      </div>

      {/* SVG INTERACTIVE MAP VIEWPORT */}
      <div
        className="relative flex-1 w-full h-full bg-[#060a12] cursor-grab active:cursor-grabbing overflow-hidden select-none"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <svg
          viewBox="0 0 1020 850"
          className="w-full h-full transition-transform duration-75 ease-out"
          style={{
            transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoomLevel})`,
            transformOrigin: 'center center',
          }}
        >
          <defs>
            {/* Background Grid Pattern */}
            <pattern id="grid-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1e293b" strokeWidth="0.5" opacity="0.4" />
            </pattern>

            {/* Glowing Drop Shadows */}
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Grid Background */}
          <rect width="1020" height="850" fill="#060a12" />
          <rect width="1020" height="850" fill="url(#grid-pattern)" />

          {/* Water Features (Kelani River & Sea Coast) */}
          {/* Kelani River Diagonal Band */}
          <path
            d="M 230 200 Q 400 320 750 420 L 780 380 Q 420 280 260 160 Z"
            fill="#0284c7"
            fillOpacity="0.18"
            stroke="#38bdf8"
            strokeWidth="1"
            strokeDasharray="4 4"
            opacity="0.6"
          />
          <text x="540" y="340" fill="#38bdf8" fontSize="10" fontWeight="bold" letterSpacing="2" opacity="0.5" transform="rotate(16 540 340)">
            KELANI RIVER
          </text>

          {/* West Coast / Sea Background Band */}
          <path
            d="M 0 0 L 60 0 L 60 850 L 0 850 Z"
            fill="#0f172a"
            fillOpacity="0.8"
            stroke="#1e293b"
            strokeWidth="1"
          />
          <text x="25" y="450" fill="#334155" fontSize="12" fontWeight="black" letterSpacing="4" transform="rotate(-90 25 450)">
            INDIAN OCEAN
          </text>

          {/* TRACK SEGMENTS (Rendered with offset parallel strokes) */}
          <g className="segments-layer">
            {SEGMENTS.map(renderSegmentLines)}
          </g>

          {/* STATIONS (Nodes, Ticks & Rings) */}
          <g className="stations-layer">
            {STATIONS.map((station) => {
              const isMatch = searchMatches.some((s) => s.id === station.id);
              const isHovered = hoveredStation?.id === station.id;
              const hasSelectedRoute =
                selectedRoute === null || station.routes.includes(selectedRoute);

              const isDimmed = !hasSelectedRoute;

              return (
                <g
                  key={station.id}
                  className="cursor-pointer group"
                  onClick={() => setHoveredStation(station)}
                  onMouseEnter={() => setHoveredStation(station)}
                  style={{ opacity: isDimmed ? 0.2 : 1, transition: 'opacity 0.3s' }}
                >
                  {/* Pulsing highlight ring for search matches */}
                  {isMatch && (
                    <circle
                      cx={station.x}
                      cy={station.y}
                      r="14"
                      fill="none"
                      stroke="#00d2ff"
                      strokeWidth="2"
                      className="animate-ping"
                    />
                  )}

                  {/* Interchange Node (Double ring) */}
                  {station.isInterchange ? (
                    <g>
                      <circle
                        cx={station.x}
                        cy={station.y}
                        r={isHovered ? '9' : '6.5'}
                        fill="#ffffff"
                        stroke="#0f172a"
                        strokeWidth="2.5"
                        className="transition-all duration-200"
                        filter="url(#glow)"
                      />
                      <circle
                        cx={station.x}
                        cy={station.y}
                        r={isHovered ? '4.5' : '3'}
                        fill="#0f172a"
                      />
                    </g>
                  ) : station.isTerminus ? (
                    /* Terminus Node (Square Cap) */
                    <rect
                      x={station.x - (isHovered ? 6 : 4.5)}
                      y={station.y - (isHovered ? 6 : 4.5)}
                      width={isHovered ? 12 : 9}
                      height={isHovered ? 12 : 9}
                      rx="2"
                      fill="#ffffff"
                      stroke="#0f172a"
                      strokeWidth="2"
                      className="transition-all duration-200"
                    />
                  ) : (
                    /* Standard Intermediate Station Dot */
                    <circle
                      cx={station.x}
                      cy={station.y}
                      r={isHovered ? '5' : '3'}
                      fill="#ffffff"
                      stroke="#0f172a"
                      strokeWidth="1.2"
                      className="transition-all duration-200"
                    />
                  )}

                  {/* Station Label */}
                  <text
                    x={
                      station.labelPos?.includes('left')
                        ? station.x - 10
                        : station.labelPos?.includes('right')
                        ? station.x + 10
                        : station.x
                    }
                    y={
                      station.labelPos?.includes('top')
                        ? station.y - 10
                        : station.labelPos?.includes('bottom')
                        ? station.y + 14
                        : station.y + 3
                    }
                    textAnchor={
                      station.labelPos?.includes('left')
                        ? 'end'
                        : station.labelPos?.includes('right')
                        ? 'start'
                        : 'middle'
                    }
                    fontSize={station.isInterchange || station.isTerminus ? '10' : '8.5'}
                    fontWeight={station.isInterchange || station.isTerminus ? 'bold' : '500'}
                    fill={isMatch || isHovered ? '#00d2ff' : station.isInterchange ? '#f8fafc' : '#94a3b8'}
                    className="transition-colors duration-200 select-none pointer-events-none"
                    style={{
                      textShadow: '0 1px 3px rgba(0,0,0,0.9), 0 0 6px rgba(15,23,42,0.9)',
                    }}
                  >
                    {station.name}
                  </text>
                </g>
              );
            })}
          </g>

          {/* Map Title / Beck Homage Inset Box */}
          <g transform="translate(730, 20)">
            <rect width="270" height="90" rx="8" fill="#0f172a" fillOpacity="0.85" stroke="#334155" strokeWidth="1" />
            <text x="15" y="25" fill="#f8fafc" fontSize="11" fontWeight="bold" letterSpacing="1">
              LANKA METRO TRANSIT
            </text>
            <text x="15" y="42" fill="#38bdf8" fontSize="8" fontStyle="italic">
              Official Diagrammatic Metro Bus Network Map
            </text>
            <text x="15" y="60" fill="#64748b" fontSize="7">
              Inspired by Harry Beck’s London Underground Map (1933).
            </text>
            <text x="15" y="75" fill="#64748b" fontSize="7">
              Data: lankametro.lk • Design: Lankadata Hub
            </text>
          </g>

        </svg>

        {/* HOVER TOOLTIP CARD */}
        {hoveredStation && (
          <div className="absolute bottom-4 left-4 max-w-sm bg-[#0f172a]/95 border border-cyan-500/40 backdrop-blur-xl p-3.5 rounded-xl shadow-2xl z-30 pointer-events-auto space-y-2">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-cyan-400" />
                <h4 className="text-sm font-black text-white">{hoveredStation.name}</h4>
              </div>
              <button
                onClick={() => setHoveredStation(null)}
                className="text-xs text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="text-xs text-slate-300">
              <span className="text-slate-400">Station Type: </span>
              <strong className="text-cyan-400 font-mono">
                {hoveredStation.isTerminus
                  ? 'Terminal Interchange Hub'
                  : hoveredStation.isInterchange
                  ? 'Multi-Route Interchange'
                  : 'Intermediate Stop'}
              </strong>
            </div>

            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Serving Metro Routes ({hoveredStation.routes.length})
              </span>
              <div className="flex flex-wrap gap-1.5">
                {hoveredStation.routes.map((rCode) => {
                  const r = METRO_ROUTES[rCode];
                  return (
                    <span
                      key={rCode}
                      className="px-2 py-0.5 text-[9.5px] font-bold rounded flex items-center gap-1 text-white shadow-sm"
                      style={{ backgroundColor: r?.color || '#38bdf8' }}
                    >
                      <span>{rCode}</span>
                      <span className="opacity-80 text-[8.5px] font-normal">({r?.name})</span>
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
        )}

      </div>

      {/* MAP FOOTER INFO STRIP */}
      <div className="bg-[#0f172a] border-t border-slate-800 p-2.5 px-4 flex flex-wrap items-center justify-between text-[11px] text-slate-400 z-20">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1 text-cyan-400 font-bold">
            <Info size={13} /> Interchanges: <span className="text-white font-normal">White Double Rings</span>
          </span>
          <span className="flex items-center gap-1">
            Termini: <span className="text-white font-normal">White Squares</span>
          </span>
          <span className="flex items-center gap-1">
            Parallel Tracks: <span className="text-cyan-400 font-mono">Up to 4 Lines</span>
          </span>
        </div>

        <div className="text-slate-500 font-mono text-[10px]">
          Pan: Drag Map • Zoom: Control Bar Buttons • Search: Top Bar
        </div>
      </div>
    </div>
  );
};

export default LankaMetroMap;
