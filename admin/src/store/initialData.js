// Comprehensive Central CMS Schema & Seed Data for Green Pulse Energy
export const initialCMSData = {
  meta: {
    version: 'v2.6.0',
    lastSaved: '2026-08-30T18:00:00.000Z',
    lastPublished: '2026-08-30T17:30:00.000Z',
    author: 'Dr. Elena Vance',
    status: 'published'
  },

  // 1. Currency & Calculator Settings
  currency: {
    defaultCurrency: 'INR',
    symbol: '₹',
    code: 'INR',
    position: 'before', // 'before' | 'after'
    decimalPlaces: 0,
    defaultBill: 4500,
    minBill: 500,
    maxBill: 10000000,
    step: 500,
    billLabel: 'Average Monthly Electricity Bill',
    systemSizeLabel: 'Recommended Solar System Size',
    savingsLabel: 'Estimated 25-Year Net Utility Savings',
    paybackLabel: 'Estimated System Payback Period'
  },

  // 2. Granular Key-Value Element Dictionary (Exact 1-to-1 Element Targeting)
  elements: {
    // Global
    'global.branding.companyName': 'GREEN PULSE ENERGY',
    'global.branding.tagline': 'THE FUTURE OF CLEAN SOLAR TECHNOLOGY',
    'global.nav.copyright': '© 2026 Green Pulse Energy Inc. All Rights Reserved. Clean Energy Engineered for Generations.',

    // Home Page Hero
    'home.hero.badge': 'Next-Generation Photovoltaics',
    'home.hero.title': 'Powering a Greener Tomorrow.',
    'home.hero.subtitle': 'Smart solar solutions designed to help homes and businesses generate cleaner energy, reduce costs, and build a sustainable future.',
    'home.hero.cta1Text': 'Explore Our Services',
    'home.hero.cta2Text': 'Get a Free Consultation',

    // Home Page Why Solar
    'home.whySolar.tag': 'The Green Pulse Advantage',
    'home.whySolar.title': 'Clean Energy. Smart Investment. Better Future.',
    'home.whySolar.subtitle': 'Transitioning to solar is not just an ecological choice — it is an intelligent financial asset providing lifetime energy security.',
    'home.whySolar.card0Title': 'Lower Electricity Costs',
    'home.whySolar.card0Text': 'Lock in fixed, predictable energy rates while drastically reducing or completely eliminating monthly utility bills from day one.',
    'home.whySolar.card1Title': 'Clean & Renewable Energy',
    'home.whySolar.card1Text': 'Harness infinite solar photon energy without greenhouse emissions, directly neutralizing hundreds of tons of carbon footprint.',
    'home.whySolar.card2Title': 'Long-Term Savings',
    'home.whySolar.card2Text': 'With 25-30 year warranted equipment lifespans, solar systems deliver compounding returns exceeding standard market index funds.',
    'home.whySolar.card3Title': 'Energy Independence',
    'home.whySolar.card3Text': 'Protect your home or enterprise against unpredictable utility rate hikes, rolling blackouts, and grid instabilities with smart storage.',

    // Home Page Calculator
    'home.calc.tag': 'Precision Solar Modeling',
    'home.calc.title': 'Estimate Your 25-Year Solar ROI',
    'home.calc.subtitle': 'Adjust your current utility parameters to calculate real-time savings, system capacity, and carbon offsets.',
    'home.calc.btnText': 'Lock In This Estimate & Get Quote',

    // Home Page Services Preview
    'home.services.tag': 'Comprehensive Solutions',
    'home.services.title': 'Our Clean Energy Services',
    'home.services.subtitle': 'From architectural residential rooftops to megawatt commercial microgrids, we engineer sustainable power systems that perform for decades.',

    // Home Page Projects Preview
    'home.projects.tag': 'Proven Track Record',
    'home.projects.title': 'Featured Clean Energy Projects',
    'home.projects.subtitle': 'Explore our recently commissioned residential luxury estates, corporate campuses, and utility installations.',

    // Home Page CTA
    'home.cta.title': 'Ready to Switch to Solar?',
    'home.cta.subtitle': 'Join hundreds of forward-thinking homeowners and commercial enterprises who generate clean, independent energy with Green Pulse.',
    'home.cta.btnText': 'Talk to Our Experts',

    // About Us Page
    'about.hero.title': 'Pioneering Clean Energy Innovation',
    'about.hero.subtitle': 'Combining advanced photovoltaic engineering with architectural aesthetics to deliver reliable, long-lasting solar infrastructure.',

    // Services Page
    'services.hero.title': 'Turnkey Solar Engineering & Installation',
    'services.hero.subtitle': 'End-to-end solar solutions tailored for residential residences, commercial facilities, and utility microgrids.',

    // Projects Page
    'projects.hero.title': 'Clean Energy in Action: Our Projects',
    'projects.hero.subtitle': 'Discover verified case studies and high-efficiency solar installations delivered nationwide.',

    // Contact Page
    'contact.hero.title': 'Start Your Clean Energy Transition',
    'contact.hero.subtitle': 'Connect with our certified solar engineers for a free site audit, layout simulation, and customized ROI proposal.'
  },

  // 3. Section Order Per Page
  sectionOrder: {
    'page-home': [
      'hero-section',
      'sec-trusted-partners',
      'sec-why-solar',
      'sec-calculator',
      'sec-home-services',
      'sec-home-projects',
      'sec-home-cta'
    ]
  },

  // 4. Global Branding & Colors
  branding: {
    companyName: 'Green Pulse Energy',
    tagline: 'The Future of Clean Solar Technology',
    logoMain: '/favicon.svg',
    favicon: '/favicon.svg',
    colors: {
      primaryDark: '#061a11',
      primaryForest: '#0a2618',
      accentEmerald: '#10b981',
      accentEmeraldLight: '#34d399',
      accentGold: '#f59e0b',
      accentCyan: '#06b6d4',
      bgLight: '#f8faf9',
      bgSurface: '#ffffff',
      textDark: '#0c1e15',
      textMuted: '#5e776a'
    },
    typography: {
      headingFont: 'Plus Jakarta Sans',
      bodyFont: 'Inter',
      monoFont: 'Space Grotesk'
    }
  },

  // 5. Pages List
  pages: [
    {
      id: 'page-home',
      name: 'Home',
      slug: '/',
      status: 'published',
      inNavigation: true,
      order: 1,
      seo: {
        title: 'Green Pulse Energy | The Future of Clean Solar Technology',
        description: 'High-efficiency architectural solar panels and intelligent clean energy solutions.',
        keywords: 'solar energy, photovoltaic panels, clean energy',
        ogImage: '/images/project-residential.jpg',
        canonicalUrl: 'https://greenpulseenergy.com/'
      },
      sections: [
        { id: 'hero-section', name: 'Hero: 3D Solar Array & Telemetry', icon: '⚡' },
        { id: 'sec-trusted-partners', name: 'Trusted Partners & Trust Metrics', icon: '📊' },
        { id: 'sec-why-solar', name: 'Why Solar: 3D Tilt Cards', icon: '🛡️' },
        { id: 'sec-calculator', name: 'Solar Savings & ROI Calculator', icon: '🧮' },
        { id: 'sec-home-services', name: 'Turnkey Solar Services Grid', icon: '☀️' },
        { id: 'sec-home-projects', name: 'Featured Projects Showcase', icon: '🏗️' },
        { id: 'sec-home-cta', name: 'Call to Action Banner', icon: '🚀' }
      ]
    },
    {
      id: 'page-about',
      name: 'About Us',
      slug: '/about',
      status: 'published',
      inNavigation: true,
      order: 2,
      seo: {
        title: 'About Us | Green Pulse Energy',
        description: 'Pioneering clean energy innovation and sustainability.',
        keywords: 'about green pulse energy, solar leadership',
        ogImage: '/images/team-ceo.jpg',
        canonicalUrl: 'https://greenpulseenergy.com/#about'
      },
      sections: [
        { id: 'sec-about-hero', name: 'About Hero & 3D Rotating Globe', icon: '🌍' },
        { id: 'sec-about-mission', name: 'Mission & Vision Tenets', icon: '🎯' },
        { id: 'sec-about-timeline', name: 'Growth Milestones & Timeline', icon: '📈' },
        { id: 'sec-about-team', name: 'Executive Leadership Profiles', icon: '👥' }
      ]
    },
    {
      id: 'page-services',
      name: 'Services',
      slug: '/services',
      status: 'published',
      inNavigation: true,
      order: 3,
      seo: {
        title: 'Solar Engineering Services | Green Pulse Energy',
        description: 'Turnkey solar installations and commercial microgrids.',
        keywords: 'solar installation services, residential rooftop',
        ogImage: '/images/project-commercial.jpg',
        canonicalUrl: 'https://greenpulseenergy.com/#services'
      },
      sections: [
        { id: 'sec-services-hero', name: 'Services Hero Banner', icon: '⚡' },
        { id: 'sec-services-grid', name: '6 Turnkey Solar Solutions', icon: '📦' },
        { id: 'sec-how-solar-works', name: 'How Solar Works (5-Stage Pipeline)', icon: '🔄' }
      ]
    },
    {
      id: 'page-projects',
      name: 'Our Projects',
      slug: '/projects',
      status: 'published',
      inNavigation: true,
      order: 4,
      seo: {
        title: 'Verified Solar Case Studies | Green Pulse Energy',
        description: 'Verified residential and commercial case studies.',
        keywords: 'solar projects portfolio, solar case studies',
        ogImage: '/images/project-industrial.jpg',
        canonicalUrl: 'https://greenpulseenergy.com/#projects'
      },
      sections: [
        { id: 'sec-projects-hero', name: 'Projects Hero Banner', icon: '🏗️' },
        { id: 'sec-projects-gallery', name: 'Filterable Portfolio & Case Studies', icon: '🖼️' }
      ]
    },
    {
      id: 'page-contact',
      name: 'Contact Us',
      slug: '/contact',
      status: 'published',
      inNavigation: true,
      order: 5,
      seo: {
        title: 'Contact Green Pulse Energy | Get a Solar Quote',
        description: 'Request a free solar assessment.',
        keywords: 'contact solar company, get solar quote',
        ogImage: '/images/team-ceo.jpg',
        canonicalUrl: 'https://greenpulseenergy.com/#contact'
      },
      sections: [
        { id: 'sec-contact-hero', name: 'Contact Hero & 3D Refraction Prism', icon: '💎' },
        { id: 'sec-contact-form', name: 'Consultation Request Form', icon: '📝' },
        { id: 'sec-contact-desk', name: 'Telemetry Desk & Coordinates', icon: '📍' }
      ]
    }
  ],

  // 6. Services CMS Collection
  services: [
    {
      id: 'srv-1',
      title: 'Solar Installation',
      tagline: 'Residential & Commercial Turnkey',
      badge: 'Flagship',
      description: 'Complete turnkey design and installation engineered for maximum photon capture, minimal aesthetic disruption, and rapid utility interconnection.',
      features: [
        'Tier-1 N-Type TOPCon Mono Panels (22.8%+ efficiency)',
        'Precision structural load & wind engineering',
        'Concealed conduit runs & architectural flashings',
        'Rapid municipal permitting & utility approval'
      ],
      warranty: '25-Yr Full Warranty',
      efficiency: '22.8% Yield'
    },
    {
      id: 'srv-2',
      title: 'Solar Rooftop Systems',
      tagline: 'Custom Architectural Arrays',
      badge: 'Popular',
      description: 'Custom rooftop solar systems designed around your roof geometry with zero roof degradation and watertight flashing.',
      features: [
        'Non-invasive flashing and waterproof anchoring',
        'Micro-inverter per-panel MPPT tracking',
        'Tesla, Enphase & SolarEdge smart integration',
        'Sleek all-black frameless panel aesthetics'
      ],
      warranty: 'Watertight Roof Guarantee',
      efficiency: '22.4% Yield'
    },
    {
      id: 'srv-3',
      title: 'Commercial Solar Solutions',
      tagline: 'Scalable Clean Energy Enterprises',
      badge: 'High ROI',
      description: 'Large-scale solar solutions for corporate campuses, factories, logistics hubs, and commercial centers to eliminate peak demand costs.',
      features: [
        'Megawatt rooftop arrays & bi-facial carports',
        'Automated peak-shaving battery storage (BESS)',
        'ESG carbon accounting & compliance modeling',
        'Zero-down PPA and capital leasing financing'
      ],
      warranty: '30-Yr Performance Assurance',
      efficiency: '23.1% Yield'
    },
    {
      id: 'srv-4',
      title: 'Solar Consultation & Audits',
      tagline: 'Irradiance & Financial Modeling',
      badge: 'Free Audit',
      description: 'High-precision LIDAR 3D shade simulation, utility tariff analysis, and independent financial projections prior to capital investment.',
      features: [
        'Drone LIDAR 3D roof scanning & sun-path analysis',
        '15-minute utility consumption interval modeling',
        'Tax credit (ITC) & MACRS depreciation breakdown',
        'Multi-vendor hardware comparison report'
      ],
      warranty: 'Zero Obligation Feasibility',
      efficiency: 'Audit Report'
    },
    {
      id: 'srv-5',
      title: 'Solar Maintenance & Care',
      tagline: '24/7 Remote Telemetry & Washing',
      badge: 'Max Uptime',
      description: 'Proactive system inspection, automated IoT telemetry fault detection, infrared thermal scans, and eco-friendly panel washing.',
      features: [
        '24/7 AI-driven micro-inverter monitoring',
        'Drone thermal imaging detecting micro-cracks',
        'De-ionized water eco-friendly cleaning',
        'Rapid 24-hour on-site technician dispatch'
      ],
      warranty: '99.8% Uptime SLA',
      efficiency: 'Continuous Care'
    },
    {
      id: 'srv-6',
      title: 'Solar EPC Solutions',
      tagline: 'Engineering, Procurement & Construction',
      badge: 'Turnkey EPC',
      description: 'Turnkey engineering, equipment procurement, and construction delivery for utility-scale solar farms and institutional microgrids.',
      features: [
        'Certified electrical & structural PE stamped designs',
        'Direct Tier-1 manufacturer supply chain access',
        'Substation & high-voltage grid interconnection',
        'SCADA commissioning & COD grid handover'
      ],
      warranty: 'Full Performance Bonded',
      efficiency: 'Utility Grade'
    }
  ],

  // 7. Projects Portfolio CMS Collection
  projects: [
    {
      id: 'proj-1',
      title: 'Silverado Luxury Estate Solar Array',
      category: 'residential',
      categoryLabel: 'Luxury Residential',
      location: 'Napa Valley, California',
      capacity: '24.8 kW DC',
      annualGeneration: '38,500 kWh/yr',
      co2Offset: '27.2 Tons/yr',
      image: '/images/project-residential.jpg',
      description: 'Architecturally integrated all-black solar roof paired with 3 Tesla Powerwall 3 storage units, supplying 100% net-zero luxury living.',
      technicalSpecs: {
        panels: '62x Maxeon 400W All-Black Monocrystalline',
        inverters: 'Enphase IQ8A Microinverters',
        battery: '40.5 kWh LFP Storage',
        roiPayback: '4.2 Years'
      }
    },
    {
      id: 'proj-2',
      title: 'Solaris Corporate Campus Microgrid',
      category: 'commercial',
      categoryLabel: 'Corporate Campus',
      location: 'Austin, Texas',
      capacity: '480 kW DC',
      annualGeneration: '725,000 kWh/yr',
      co2Offset: '512 Tons/yr',
      image: '/images/project-commercial.jpg',
      description: 'Dual-purpose solar carports with 24 integrated Level-2 EV charging hubs, shielding fleet vehicles and reducing peak utility demand by 78%.',
      technicalSpecs: {
        panels: '1,120x Canadian Solar Bi-facial 430W',
        inverters: '4x SMA Sunny Highpower 125kW',
        battery: '500 kWh Industrial BESS',
        roiPayback: '3.6 Years'
      }
    },
    {
      id: 'proj-3',
      title: 'Apex Logistics Distribution Center',
      category: 'industrial',
      categoryLabel: 'Industrial Logistics',
      location: 'Phoenix, Arizona',
      capacity: '1.25 MW DC',
      annualGeneration: '2,100,000 kWh/yr',
      co2Offset: '1,480 Tons/yr',
      image: '/images/project-industrial.jpg',
      description: 'High-yield rooftop solar installation powering a 250,000 sq.ft cold-storage logistics facility with real-time SCADA AI balancing.',
      technicalSpecs: {
        panels: '2,800x LONGi Hi-MO 6 Explorer 450W',
        inverters: '10x SolarEdge 100kW Synergy',
        battery: 'Grid-tied with Dynamic Curtailment',
        roiPayback: '3.1 Years'
      }
    },
    {
      id: 'proj-4',
      title: 'Heritage Organic Vineyards Agrivoltaic',
      category: 'rooftop',
      categoryLabel: 'Agrivoltaic Farm',
      location: 'Willamette Valley, Oregon',
      capacity: '185 kW DC',
      annualGeneration: '265,000 kWh/yr',
      co2Offset: '187 Tons/yr',
      image: '/images/project-agrivoltaic.jpg',
      description: 'Elevated single-axis tracking solar canopies providing clean power for winery fermentation chillers while offering optimal shade for grapes.',
      technicalSpecs: {
        panels: '420x Trina Solar Vertex S+ Bi-facial',
        inverters: '2x Sungrow 100kW String Inverters',
        battery: 'Direct irrigation pump integration',
        roiPayback: '4.8 Years'
      }
    }
  ],

  // 8. Media Library
  media: [
    { id: 'med-1', name: 'project-residential.jpg', title: 'Silverado Luxury Estate Solar', url: '/images/project-residential.jpg', category: 'projects', size: '1.2 MB', dimensions: '1920x1080', uploadedAt: '2026-08-30' },
    { id: 'med-2', name: 'project-commercial.jpg', title: 'Solaris Corporate Campus Microgrid', url: '/images/project-commercial.jpg', category: 'projects', size: '1.4 MB', dimensions: '1920x1080', uploadedAt: '2026-08-30' },
    { id: 'med-3', name: 'project-industrial.jpg', title: 'Apex Logistics Cold Storage', url: '/images/project-industrial.jpg', category: 'projects', size: '1.5 MB', dimensions: '1920x1080', uploadedAt: '2026-08-30' },
    { id: 'med-4', name: 'project-agrivoltaic.jpg', title: 'Heritage Vineyards Agrivoltaic', url: '/images/project-agrivoltaic.jpg', category: 'projects', size: '1.3 MB', dimensions: '1920x1080', uploadedAt: '2026-08-30' },
    { id: 'med-5', name: 'team-ceo.jpg', title: 'Dr. Elena Vance - CEO', url: '/images/team-ceo.jpg', category: 'team', size: '420 KB', dimensions: '800x800', uploadedAt: '2026-08-30' },
    { id: 'med-6', name: 'team-cto.jpg', title: 'Marcus Sterling - CTO', url: '/images/team-cto.jpg', category: 'team', size: '410 KB', dimensions: '800x800', uploadedAt: '2026-08-30' },
    { id: 'med-7', name: 'team-vp.jpg', title: 'Sarah Jenkins - VP Ops', url: '/images/team-vp.jpg', category: 'team', size: '390 KB', dimensions: '800x800', uploadedAt: '2026-08-30' },
    { id: 'med-8', name: 'logo.svg', title: 'Green Pulse Energy Logo', url: '/favicon.svg', category: 'branding', size: '12 KB', dimensions: 'SVG Vector', uploadedAt: '2026-08-30' }
  ],

  // 9. Navigation & Footer
  navigation: {
    header: [
      { id: 'nav-1', label: 'Home', link: '#home', visible: true },
      { id: 'nav-2', label: 'About Us', link: '#about', visible: true },
      { id: 'nav-3', label: 'Services', link: '#services', visible: true },
      { id: 'nav-4', label: 'Our Projects', link: '#projects', visible: true },
      { id: 'nav-5', label: 'Contact Us', link: '#contact', visible: true }
    ],
    ctaButton: { label: 'Get a Quote', link: '#contact', visible: true },
    copyright: '© 2026 Green Pulse Energy Inc. All Rights Reserved. Clean Energy Engineered for Generations.'
  },

  // 10. Version History Snapshots
  versionHistory: [
    {
      id: 'ver-prod-current',
      versionNumber: 'v2.6.0',
      title: 'Current Production Release',
      author: 'Dr. Elena Vance (Administrator)',
      timestamp: '2026-08-30T17:30:00.000Z',
      notes: 'Production launch with full 3D anti-gravity scenes, ROI calculator, and verified case studies.'
    }
  ]
};
