export const projectsData = [
  {
    id: 'residential-vista',
    title: 'Silverado Luxury Eco-Estate',
    category: 'residential',
    categoryLabel: 'Residential Solar',
    location: 'Napa Valley, California',
    capacity: '24.8 kWp',
    storage: '40 kWh Lithium-Iron-Phosphate',
    annualGeneration: '38,500 kWh / year',
    co2Offset: '27.2 Metric Tons / year',
    image: '/images/project-residential.jpg',
    description: 'Ultra-low profile, all-black integrated architectural solar roof installation paired with smart home energy management and off-grid battery backup for a 6,500 sq ft luxury residence.',
    highlights: [
      'Zero grid reliance during peak summer heat waves',
      'Architectural flush-mount panels with concealed wiring',
      'Intelligent backup gateway with sub-second switchover',
      'Integrated EV supercharging station'
    ],
    technicalSpecs: {
      modules: '62x GreenPulse TitanBlack 400W Monocrystalline',
      inverters: 'Enphase IQ8+ Microinverters (99.2% CEC efficiency)',
      monitoring: 'GreenPulse AI Energy Hub (24/7 Cloud Telemetry)',
      roiPayback: '4.2 Years',
      lifetimeSavings: '$148,000'
    }
  },
  {
    id: 'commercial-solaris',
    title: 'Solaris Corporate Tech Campus',
    category: 'commercial',
    categoryLabel: 'Commercial Solar',
    location: 'Silicon Valley, California',
    capacity: '650 kWp',
    storage: '1.2 MWh Commercial Storage System',
    annualGeneration: '1,020,000 kWh / year',
    co2Offset: '720 Metric Tons / year',
    image: '/images/project-commercial.jpg',
    description: 'High-density aerodynamic rooftop solar array complemented by 40-bay solar carports with integrated Level-2 EV charging infrastructure for a Fortune 500 tech headquarters.',
    highlights: [
      'Powers 88% of campus annual HVAC, servers, and lighting',
      'Dual-function bi-facial solar carports with LED canopy lighting',
      'Automated peak-shaving algorithm cutting commercial demand charges by 64%',
      'Net-zero carbon corporate certification achieved'
    ],
    technicalSpecs: {
      modules: '1,440x GreenPulse UltraCell Bi-facial 450W',
      inverters: 'SMA Sunny Tripower CORE2 Commercial Inverters',
      monitoring: 'SCADA Enterprise Gateway with predictive AI maintenance',
      roiPayback: '3.6 Years',
      lifetimeSavings: '$2,850,000'
    }
  },
  {
    id: 'industrial-apex',
    title: 'Apex Logistics Super-Hub',
    category: 'industrial',
    categoryLabel: 'Industrial Solar',
    location: 'Phoenix, Arizona',
    capacity: '2.1 MWp',
    storage: '3.5 MWh Megapack Grid-Scale Storage',
    annualGeneration: '3,450,000 kWh / year',
    co2Offset: '2,440 Metric Tons / year',
    image: '/images/project-industrial.jpg',
    description: 'Utility-interconnected industrial rooftop installation covering 450,000 sq ft of logistics distribution warehouse with zero-penetration ballasted racking and high-efficiency string inverters.',
    highlights: [
      'One of the largest privately-owned rooftop solar installations in the region',
      'Self-ballasted aerodynamic wind-tunnel certified mounting system',
      'Direct grid export feed-in tariff generating recurring surplus revenue',
      'Thermal drone inspection monitoring for zero hotspot degradation'
    ],
    technicalSpecs: {
      modules: '4,660x GreenPulse ProGrid 450W N-Type TOPCon',
      inverters: 'Sungrow 250kW Multi-MPPT String Inverters',
      monitoring: 'High-speed industrial Modbus SCADA with real-time grid sync',
      roiPayback: '3.1 Years',
      lifetimeSavings: '$8,400,000'
    }
  },
  {
    id: 'agrivoltaic-heritage',
    title: 'Heritage Organic Agrivoltaics & Vineyard',
    category: 'rooftop',
    categoryLabel: 'Rooftop & Smart Agri',
    location: 'Sonoma County, California',
    capacity: '480 kWp',
    storage: '800 kWh Eco-Storage',
    annualGeneration: '760,000 kWh / year',
    co2Offset: '538 Metric Tons / year',
    image: '/images/project-agrivoltaic.jpg',
    description: 'Pioneering dual-use agrivoltaic installation with single-axis tracking solar canopies elevated above organic vineyards and vegetable crops, optimizing microclimates while harvesting clean energy.',
    highlights: [
      'Crops under panels showed 22% reduction in water evaporation',
      'Protection against extreme heat stress and summer UV scorching',
      'Full winery operations, fermentation chillers, and electric tractors solar-powered',
      'Award-winning sustainable agriculture renewable energy benchmark'
    ],
    technicalSpecs: {
      modules: '1,060x GreenPulse Semi-Transparent Glass-Glass 450W',
      inverters: 'Fronius Eco 3-Phase Inverters with Smart Metering',
      monitoring: 'Integrated soil moisture + solar irradiance telemetric sensors',
      roiPayback: '3.9 Years',
      lifetimeSavings: '$1,920,000'
    }
  }
];
