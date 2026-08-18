import React, { useState, useEffect, useMemo } from 'react';
import { MapPin, ExternalLink, RefreshCw, Filter, AlertCircle } from 'lucide-react';
import { apiService, type RegionalNewsData, type NewsFeedItem } from '../services/apiService';
import { srilankaDistricts, type DistrictMapFeature } from '../assets/srilankaDistrictsMapData';

const REAL_NEWS_SOURCE_LOGOS: Record<string, string> = {
  'hiru news': 'https://www.hirunews.lk/assets/images/hirunews-logo.png',
  'hiru': 'https://www.hirunews.lk/assets/images/hirunews-logo.png',
  'ada derana': 'https://logo.clearbit.com/adaderana.lk',
  'derana': 'https://logo.clearbit.com/adaderana.lk',
  'daily mirror': 'https://logo.clearbit.com/dailymirror.lk',
  'central bank of sri lanka': 'https://logo.clearbit.com/cbsl.gov.lk',
  'cbsl': 'https://logo.clearbit.com/cbsl.gov.lk',
  'news first': 'https://logo.clearbit.com/newsfirst.lk',
  'sirasa': 'https://logo.clearbit.com/newsfirst.lk',
  'the morning': 'https://logo.clearbit.com/themorning.lk',
  'lankadeepa': 'https://logo.clearbit.com/lankadeepa.lk',
  'ports authority sri lanka': 'https://logo.clearbit.com/slpa.lk',
  'sri lanka ports authority': 'https://logo.clearbit.com/slpa.lk',
  'road development authority': 'https://logo.clearbit.com/rda.gov.lk',
  'department of fisheries': 'https://logo.clearbit.com/fisheries.gov.lk'
};

const getSourceLogoUrl = (sourceName: string, articleUrl: string): string => {
  if (!sourceName) return 'https://www.google.com/s2/favicons?domain=lankadatahub.lk&sz=64';
  const nameLower = sourceName.toLowerCase().trim();
  
  for (const [key, logo] of Object.entries(REAL_NEWS_SOURCE_LOGOS)) {
    if (nameLower.includes(key)) return logo;
  }

  if (articleUrl) {
    try {
      const domain = new URL(articleUrl).hostname;
      return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
    } catch {
      // fallback
    }
  }

  return `https://www.google.com/s2/favicons?domain=${nameLower.replace(/\s+/g, '')}.lk&sz=64`;
};

const FALLBACK_MAP_DATA: RegionalNewsData[] = [
  { province: 'Western', total_articles: 14, economy_count: 5, politics_count: 4, crime_count: 2, general_count: 3 },
  { province: 'Central', total_articles: 8, economy_count: 2, politics_count: 3, crime_count: 1, general_count: 2 },
  { province: 'Southern', total_articles: 7, economy_count: 3, politics_count: 1, crime_count: 1, general_count: 2 },
  { province: 'Northern', total_articles: 6, economy_count: 2, politics_count: 2, crime_count: 0, general_count: 2 },
  { province: 'Eastern', total_articles: 5, economy_count: 1, politics_count: 2, crime_count: 1, general_count: 1 },
  { province: 'North Western', total_articles: 4, economy_count: 2, politics_count: 1, crime_count: 0, general_count: 1 },
  { province: 'North Central', total_articles: 3, economy_count: 1, politics_count: 1, crime_count: 0, general_count: 1 },
  { province: 'Uva', total_articles: 3, economy_count: 1, politics_count: 1, crime_count: 0, general_count: 1 },
  { province: 'Sabaragamuwa', total_articles: 4, economy_count: 1, politics_count: 1, crime_count: 1, general_count: 1 }
];

const FALLBACK_LIVE_FEED: NewsFeedItem[] = [
  {
    id: 1,
    title: 'Central Bank of Sri Lanka Holds Key Policy Interest Rates Constant in August Review',
    source: 'Central Bank of Sri Lanka',
    category: 'Economy',
    province: 'Western',
    summary: 'The Monetary Board of the Central Bank maintained policy rates to preserve single-digit inflation targets and foster macro financial stability.',
    keywords: ['CBSL', 'Economy', 'Monetary Policy', 'Inflation'],
    url: 'https://www.cbsl.gov.lk',
    created_at: new Date(Date.now() - 1000 * 60 * 25).toISOString()
  },
  {
    id: 2,
    title: 'Hiru News Alert: Cabinet Approves National Digital Infrastructure Telemetry Framework',
    source: 'Hiru News',
    category: 'Politics',
    province: 'Western',
    summary: 'Government cabinet approves national open data governance framework to modernize public service telemetry infrastructure.',
    keywords: ['Hiru News', 'Cabinet', 'Digital Infrastructure', 'Governance'],
    url: 'https://www.hirunews.lk',
    created_at: new Date(Date.now() - 1000 * 60 * 65).toISOString()
  },
  {
    id: 3,
    title: 'Ada Derana: Treasury Yields Decline Following High Investor Demand in Bond Auction',
    source: 'Ada Derana',
    category: 'Economy',
    province: 'Western',
    summary: 'Strong investor demand pushes treasury bill yield rates lower across primary debt market auctions.',
    keywords: ['Ada Derana', 'Treasury', 'Bonds', 'Economy'],
    url: 'https://www.adaderana.lk',
    created_at: new Date(Date.now() - 1000 * 60 * 140).toISOString()
  },
  {
    id: 4,
    title: 'Daily Mirror: Colombo West International Terminal Expansion Crosses 85% Milestone',
    source: 'Daily Mirror',
    category: 'General',
    province: 'Western',
    summary: 'Deep-water terminal expansion in Colombo harbor advances ahead of scheduled commercial operations.',
    keywords: ['Daily Mirror', 'Colombo Port', 'Infrastructure', 'Maritime'],
    url: 'https://www.dailymirror.lk',
    created_at: new Date(Date.now() - 1000 * 60 * 210).toISOString()
  },
  {
    id: 5,
    title: 'News First: Northern Coastal Fisheries Cooperatives Launch Real-time Telemetry',
    source: 'News First',
    category: 'Economy',
    province: 'Northern',
    summary: 'Marine cooperatives across Jaffna coastal harbors integrate solar cold-storage telemetry to elevate seafood exports.',
    keywords: ['News First', 'Jaffna', 'Northern Province', 'Fisheries'],
    url: 'https://www.newsfirst.lk',
    created_at: new Date(Date.now() - 1000 * 60 * 380).toISOString()
  }
];

export const SriLankaNewsPortal: React.FC = () => {
  const [mapData, setMapData] = useState<RegionalNewsData[]>(FALLBACK_MAP_DATA);
  const [liveFeed, setLiveFeed] = useState<NewsFeedItem[]>(FALLBACK_LIVE_FEED);
  const [selectedProvinceFilter, setSelectedProvinceFilter] = useState<string | null>(null);
  const [hoveredDistrict, setHoveredDistrict] = useState<DistrictMapFeature | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const loadPortalData = async () => {
    setLoading(true);
    try {
      const [mRes, fRes] = await Promise.all([
        apiService.getRegionalNewsMapData(),
        apiService.getLiveNewsFeed()
      ]);
      if (mRes && mRes.length > 0) setMapData(mRes);
      if (fRes && fRes.length > 0) setLiveFeed(fRes);
    } catch (e) {
      console.warn('Using fallback news portal data:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPortalData();
  }, []);

  const mapDataByProvince = useMemo(() => {
    const map: Record<string, RegionalNewsData> = {};
    mapData.forEach(item => {
      if (item.province) {
        map[item.province.toLowerCase()] = item;
      }
    });
    return map;
  }, [mapData]);

  const maxArticles = useMemo(() => {
    return Math.max(...mapData.map(d => Number(d.total_articles || 0)), 1);
  }, [mapData]);

  const getProvinceFill = (provName: string, isHovered: boolean, isSelected: boolean) => {
    if (isHovered) return '#00E5FF';
    if (isSelected) return '#38bdf8';

    const pData = mapDataByProvince[provName.toLowerCase()];
    const count = pData ? Number(pData.total_articles || 0) : 0;
    if (count === 0) return 'rgba(10, 30, 56, 0.6)';

    const ratio = count / maxArticles;
    if (ratio > 0.7) return 'rgba(0, 229, 255, 0.55)';
    if (ratio > 0.4) return 'rgba(14, 165, 233, 0.45)';
    if (ratio > 0.1) return 'rgba(56, 189, 248, 0.3)';
    return 'rgba(56, 189, 248, 0.18)';
  };

  const filteredFeed = useMemo(() => {
    if (!selectedProvinceFilter) return liveFeed;
    const filterLower = selectedProvinceFilter.toLowerCase();
    return liveFeed.filter(item => (item.province || '').toLowerCase() === filterLower);
  }, [liveFeed, selectedProvinceFilter]);

  const hoveredProvinceData = useMemo(() => {
    if (!hoveredDistrict) return null;
    const provName = hoveredDistrict.province;
    return {
      provinceName: provName,
      data: mapDataByProvince[provName.toLowerCase()] || {
        province: provName,
        total_articles: 0,
        economy_count: 0,
        politics_count: 0,
        crime_count: 0,
        general_count: 0
      }
    };
  }, [hoveredDistrict, mapDataByProvince]);

  const handleMouseEnterDistrict = (d: DistrictMapFeature, e: React.MouseEvent) => {
    setHoveredDistrict(d);
    setTooltipPos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMoveDistrict = (e: React.MouseEvent) => {
    setTooltipPos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseLeaveDistrict = () => {
    setHoveredDistrict(null);
    setTooltipPos(null);
  };

  const handleClickDistrict = (d: DistrictMapFeature) => {
    const provName = d.province;
    if (selectedProvinceFilter && selectedProvinceFilter.toLowerCase() === provName.toLowerCase()) {
      setSelectedProvinceFilter(null);
    } else {
      setSelectedProvinceFilter(provName);
    }
  };

  const formatRelativeTime = (isoString: string) => {
    if (!isoString) return 'Just now';
    const diffMs = Date.now() - new Date(isoString).getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    if (diffMins < 60) return `${Math.max(1, diffMins)}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  return (
    <div className="w-full relative">

      {/* Suitable Section Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-4 bg-gradient-to-b from-[#00E5FF] to-cyan-500 rounded-full" />
          <h3 className="text-sm font-black text-white tracking-wider uppercase flex items-center gap-2">
            SRI LANKA REGIONAL NEWS INTELLIGENCE
            <span className="text-[9px] font-mono font-bold bg-[#00E5FF]/15 text-[#00E5FF] border border-[#00E5FF]/30 px-2 py-0.5 rounded-full tracking-widest uppercase">
              LIVE STREAM
            </span>
          </h3>
        </div>

        <div className="flex items-center gap-2">
          {selectedProvinceFilter && (
            <button
              onClick={() => setSelectedProvinceFilter(null)}
              className="text-[10px] font-bold text-cyan-400 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 px-2.5 py-0.5 rounded-full flex items-center gap-1 transition-all"
            >
              <Filter size={11} />
              {selectedProvinceFilter} (Clear)
            </button>
          )}

          <button
            onClick={loadPortalData}
            disabled={loading}
            className="p-1.5 text-slate-400 hover:text-white bg-[#07182b]/60 border border-slate-800 rounded-lg hover:border-cyan-500/40 transition-all"
            title="Refresh news telemetry"
          >
            <RefreshCw size={13} className={loading ? 'animate-spin text-[#00E5FF]' : ''} />
          </button>
        </div>
      </div>

      {/* 2/3 Width News Portal Grid (Map 65% | Live Feed 35%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">

        {/* ── MAP COMPONENT (65% Width / lg:col-span-7) ── */}
        <div className="lg:col-span-7 bg-[#051326]/40 backdrop-blur-md border border-slate-800/70 rounded-2xl p-3 relative h-[365px] flex flex-col justify-between overflow-hidden shadow-lg hover:border-cyan-500/30 transition-all">
          
          <div className="flex justify-between items-center z-10 relative mb-1">
            <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold text-slate-400">
              <MapPin size={13} className="text-[#00E5FF]" />
              <span>REGIONAL HEATMAP (PROVINCE ACTIVITY)</span>
            </div>
            <span className="text-[9px] text-slate-500 font-mono">Hover details • Click filter</span>
          </div>

          {/* SVG Map Container */}
          <div className="relative w-full flex justify-center items-center py-1 my-auto">
            <svg
              viewBox="0 0 450 650"
              className="w-full max-h-[250px] transition-transform duration-300 drop-shadow-[0_0_20px_rgba(0,229,255,0.2)]"
            >
              <g className="cursor-pointer">
                {srilankaDistricts.map(d => {
                  const isHovered = hoveredDistrict?.id === d.id;
                  const isSelected = selectedProvinceFilter?.toLowerCase() === d.province.toLowerCase();
                  const fillStyle = getProvinceFill(d.province, isHovered, isSelected);

                  return (
                    <path
                      key={d.id}
                      d={d.d}
                      fill={fillStyle}
                      stroke={isHovered ? '#FFFFFF' : isSelected ? '#00E5FF' : 'rgba(0, 229, 255, 0.35)'}
                      strokeWidth={isHovered ? 2.2 : isSelected ? 1.8 : 1.2}
                      className="transition-all duration-200 outline-none hover:opacity-90"
                      onMouseEnter={e => handleMouseEnterDistrict(d, e)}
                      onMouseMove={handleMouseMoveDistrict}
                      onMouseLeave={handleMouseLeaveDistrict}
                      onClick={() => handleClickDistrict(d)}
                    />
                  );
                })}
              </g>

              {/* Pulsing Hotspot Marker Pins for Provinces with Active News */}
              <g className="pointer-events-none">
                {mapData.filter(m => m.total_articles > 0).map((m, idx) => {
                  const centroids: Record<string, { x: number; y: number }> = {
                    'western': { x: 190, y: 390 },
                    'central': { x: 235, y: 330 },
                    'southern': { x: 235, y: 460 },
                    'northern': { x: 200, y: 150 },
                    'eastern': { x: 300, y: 280 },
                    'north western': { x: 175, y: 280 },
                    'north central': { x: 235, y: 230 },
                    'uva': { x: 275, y: 380 },
                    'sabaragamuwa': { x: 215, y: 400 }
                  };
                  const pos = centroids[m.province.toLowerCase()];
                  if (!pos) return null;

                  return (
                    <g key={`pin-${idx}`} transform={`translate(${pos.x}, ${pos.y})`}>
                      <circle r="8" fill="#00E5FF" opacity="0.35" className="animate-ping" />
                      <circle r="4" fill="#00E5FF" stroke="#FFFFFF" strokeWidth="1.2" />
                    </g>
                  );
                })}
              </g>
            </svg>
          </div>

          {/* Heatmap Legend */}
          <div className="relative z-10 flex items-center justify-between bg-[#030a16]/90 border border-slate-800/80 rounded-xl p-2 text-[9px] text-slate-400">
            <span className="font-mono font-bold uppercase text-slate-300">Activity Level:</span>
            <div className="flex items-center gap-2.5">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-sm bg-[rgba(10,30,56,0.8)] border border-slate-700" /> 0
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-sm bg-[rgba(56,189,248,0.3)]" /> Low
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-sm bg-[rgba(14,165,233,0.6)]" /> Med
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-sm bg-[#00E5FF]" /> High
              </span>
            </div>
          </div>
        </div>


        {/* ── LIVE NEWS FEED LIST (35% Width / lg:col-span-5) ── */}
        <div className="lg:col-span-5 bg-[#051326]/40 backdrop-blur-md border border-slate-800/70 rounded-2xl p-3 flex flex-col h-[365px] shadow-lg">
          
          {/* Feed Header */}
          <div className="flex items-center justify-between pb-2.5 mb-2 border-b border-slate-800/80">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              <span className="text-xs font-black text-white tracking-wider uppercase">
                {selectedProvinceFilter ? `${selectedProvinceFilter} News` : 'Live News Stream'}
              </span>
            </div>
            <span className="text-[10px] font-mono text-slate-400 font-bold bg-slate-800/60 px-2 py-0.5 rounded-md">
              {filteredFeed.length} Articles
            </span>
          </div>

          {/* Scrollable Feed List */}
          <div className="flex-1 overflow-y-auto space-y-2.5 pr-1.5 custom-scrollbar">
            {filteredFeed.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
                <AlertCircle size={28} className="text-slate-600 mb-2" />
                <p className="text-xs font-medium">No live news articles for {selectedProvinceFilter || 'this filter'}.</p>
                <button
                  onClick={() => setSelectedProvinceFilter(null)}
                  className="mt-3 text-[11px] text-cyan-400 underline font-bold"
                >
                  View All News
                </button>
              </div>
            ) : (
              filteredFeed.map((item, idx) => (
                <div
                  key={item.id || idx}
                  className="bg-slate-900/35 backdrop-blur-sm border border-slate-800/60 hover:border-cyan-500/40 hover:bg-slate-900/50 rounded-xl p-3 space-y-2 transition-all duration-200 group shadow-sm"
                >
                  {/* TOP BAR: News Source Logo & Name (LEFT) | Category Badge & Time (RIGHT) */}
                  <div className="flex items-center justify-between gap-2 pb-1.5 border-b border-slate-800/40">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <img
                        src={getSourceLogoUrl(item.source, item.url)}
                        alt={item.source}
                        className="w-4 h-4 rounded-full object-cover bg-white/10 p-0.5 border border-slate-700/80 flex-shrink-0"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://www.google.com/s2/favicons?domain=lankadatahub.lk&sz=64';
                        }}
                      />
                      <span className="text-[10px] font-black text-slate-200 truncate font-mono uppercase tracking-wider">
                        {item.source || 'Verified Source'}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 flex-shrink-0 text-[9px] font-mono font-bold">
                      <span className={`px-1.5 py-0.5 rounded uppercase tracking-wider ${
                        item.category.toLowerCase().includes('economy')
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                          : item.category.toLowerCase().includes('politi')
                          ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                          : item.category.toLowerCase().includes('crime')
                          ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                          : 'bg-sky-500/15 text-sky-400 border border-sky-500/30'
                      }`}>
                        {item.category}
                      </span>
                      <span className="text-slate-500">{formatRelativeTime(item.created_at)}</span>
                    </div>
                  </div>

                  {/* Title & Link */}
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-extrabold text-slate-100 group-hover:text-[#00E5FF] leading-snug line-clamp-2 transition-colors flex items-start justify-between gap-2"
                  >
                    <span>{item.title}</span>
                    <ExternalLink size={12} className="flex-shrink-0 text-slate-500 group-hover:text-[#00E5FF] mt-0.5" />
                  </a>

                  {/* Summary */}
                  {item.summary && (
                    <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-2">
                      {item.summary}
                    </p>
                  )}

                  {/* Keywords & Province Tag */}
                  <div className="pt-1 flex flex-wrap items-center justify-between gap-1 text-[9px]">
                    <span className="text-slate-400 bg-slate-800/80 border border-slate-700/60 px-1.5 py-0.5 rounded font-mono font-bold">
                      📍 {item.province || 'National'}
                    </span>

                    {item.keywords && item.keywords.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {item.keywords.slice(0, 3).map((kw, i) => (
                          <span key={i} className="text-slate-400 bg-slate-900/80 border border-slate-800 px-1.5 py-0.5 rounded text-[8px]">
                            #{kw}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* ── PROVINCE HOVER TOOLTIP CARD (STRICT SPEC) ── */}
      {tooltipPos && hoveredProvinceData && (
        <div
          className="fixed z-50 pointer-events-none transition-all duration-75 shadow-2xl"
          style={{
            left: `${tooltipPos.x + 15}px`,
            top: `${tooltipPos.y + 15}px`
          }}
        >
          <div style={{ background: '#111827', border: '1px solid #1E293B', padding: '10px', borderRadius: '8px' }}>
            <strong style={{ color: '#F8FAFC' }}>{hoveredProvinceData.provinceName} Province</strong><br />
            <span style={{ color: '#94A3B8' }}>Total News Articles: {hoveredProvinceData.data.total_articles || 0}</span>
            <hr style={{ borderColor: '#334155', margin: '6px 0' }} />
            <div style={{ fontSize: '12px', color: '#CBD5E1' }}>
              <div>Politics: {hoveredProvinceData.data.politics_count || 0}</div>
              <div>Economy: {hoveredProvinceData.data.economy_count || 0}</div>
              <div>Crime & Law: {hoveredProvinceData.data.crime_count || 0}</div>
              <div>General: {hoveredProvinceData.data.general_count || 0}</div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
