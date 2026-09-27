import { collection, getDocs, doc, setDoc, writeBatch } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { PortfolioProject, ServiceItem } from '../types';

export const INITIAL_SERVICES: ServiceItem[] = [
  {
    id: 'poster-design',
    title: 'Poster Design',
    category: 'Print & Digital',
    shortDesc: 'Art-direction grade promotional, event, and exhibition posters designed with bold typographic hierarchy.',
    fullDesc: 'We craft iconic posters that command physical walls and digital feeds. From underground electronic festivals and modern art exhibitions to cinema premieres, each piece is engineered with bespoke typography, measured grid architecture, and visceral color dynamics.',
    deliverables: ['Print-ready CMYK Vector PDF (up to 300 DPI)', 'Digital 4K Social Editions', 'Animated Motion Poster (MP4/GIF)', 'Source Vector File (.AI / .FIG)'],
    turnaroundTime: '3 – 5 Business Days',
    startingPrice: '$450',
    iconName: 'Layout',
    sampleImage: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1000&q=80',
    featured: true,
    active: true,
    accentGradient: 'from-orange-500 via-pink-500 to-rose-500',
  },
  {
    id: 'invitation-design',
    title: 'Invitation Design',
    category: 'Luxury & Events',
    shortDesc: 'Bespoke invitations and stationery suites for galas, architectural launches, and intimate celebrations.',
    fullDesc: 'Elevate your gathering with bespoke editorial invitations. We curate tactile foil-stamp recommendations, custom monogram geometry, interactive digital landing page invitations, and coordinated RSVP ecosystems.',
    deliverables: ['Custom Foil/Die-Cut Print Suites', 'Interactive Digital RSVP Cards', 'Monogram & Crest Assets', 'Envelope Liner & Wax Seal Spec'],
    turnaroundTime: '4 – 7 Business Days',
    startingPrice: '$550',
    iconName: 'Mail',
    sampleImage: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1000&q=80',
    featured: true,
    active: true,
    accentGradient: 'from-amber-400 via-orange-500 to-pink-500',
  },
  {
    id: 'advertisement-design',
    title: 'Advertisement Design',
    category: 'Commercial & Media',
    shortDesc: 'High-conversion advertising campaigns, digital out-of-home (OOH) billboards, and editorial ad spreads.',
    fullDesc: 'Cut through banner blindness with hyper-crafted advertising visuals. We blend strategic cognitive hooks with pristine studio art direction to deliver commercial campaigns across Times Square screens, print publications, and high-CTR social placements.',
    deliverables: ['Billboard & Transit OOH Specs', 'Multi-variant Digital Display Kits (15+ sizes)', 'Print Magazine Spread Layouts', 'A/B Testing Creative Variants'],
    turnaroundTime: '5 – 8 Business Days',
    startingPrice: '$850',
    iconName: 'Tv',
    sampleImage: 'https://images.unsplash.com/photo-1542744094-3a31f272c490?auto=format&fit=crop&w=1000&q=80',
    featured: true,
    active: true,
    accentGradient: 'from-cyan-500 via-blue-500 to-indigo-600',
  },
  {
    id: 'logo-design',
    title: 'Logo & Brand Identity',
    category: 'Identity & Systems',
    shortDesc: 'Enduring logomarks, dynamic identity systems, and rigorous brand guideline bibles.',
    fullDesc: 'A world-class brand begins with a symbol that burns into memory. We develop monolithic logos, responsive mark systems, color psychology palettes, typographic rules, and comprehensive 50-page brand guidelines for ventures poised for scale.',
    deliverables: ['Primary & Secondary Logomarks', 'Dynamic Responsive Favicon Kits', 'Comprehensive Brand Guidelines PDF', 'Full Vector Package (SVG, EPS, PDF, PNG)'],
    turnaroundTime: '7 – 12 Business Days',
    startingPrice: '$1,200',
    iconName: 'Shapes',
    sampleImage: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=1000&q=80',
    featured: true,
    active: true,
    accentGradient: 'from-violet-500 via-fuchsia-500 to-pink-500',
  },
  {
    id: 'social-media-design',
    title: 'Social Media Design',
    category: 'Digital Content',
    shortDesc: 'Curated feed systems, editorial carousels, and modular Figma component kits that build authority.',
    fullDesc: 'Transform your brand channels from generic noise into an editorial publication. We design bespoke visual templates, seamless panoramic swipe carousels, typographic story kits, and thumbnail frameworks optimized for engagement.',
    deliverables: ['Modular Figma Social Design System', '12 Custom Story & Post Templates', 'High-Impact Carousel Frameworks', 'Reel & Short Thumbnail Suite'],
    turnaroundTime: '4 – 6 Business Days',
    startingPrice: '$650',
    iconName: 'Share2',
    sampleImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1000&q=80',
    featured: true,
    active: true,
    accentGradient: 'from-pink-500 via-rose-500 to-amber-500',
  },
  {
    id: 'video-editing',
    title: 'Video Editing & Motion',
    category: 'Motion & Sound',
    shortDesc: 'Cinematic brand reels, motion graphic title sequences, sound design, and color grading.',
    fullDesc: 'Breathe life into static brand worlds through calculated kinetic energy. Our motion suite delivers rhythmic cuts, 3D kinetic typography, analog textures, and broadcast-level color grading for launch trailers and product films.',
    deliverables: ['4K Master Export (ProRes 422 & H.265)', 'Vertical 9:16 Cutdowns with Captions', 'Custom Sound Design & Mixed Audio', 'Project Archive / Premiere / AfterEffects'],
    turnaroundTime: '6 – 10 Business Days',
    startingPrice: '$950',
    iconName: 'Film',
    sampleImage: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1000&q=80',
    featured: true,
    active: true,
    accentGradient: 'from-emerald-400 via-teal-500 to-cyan-500',
  },
  {
    id: 'custom-design',
    title: 'Custom Studio Commission',
    category: 'Bespoke Creative',
    shortDesc: 'Tailored 3D environments, generative art installations, physical packaging, and multi-disciplinary systems.',
    fullDesc: 'For visionaries whose projects defy ordinary classification. We collaborate on immersive spatial interfaces, generative visual identities, limited-edition vinyl packaging, and physical retail activations.',
    deliverables: ['Custom Scope Architecture', 'Direct Creative Director Partnership', 'Unlimited High-Fidelity Deliverables', 'Turnkey Production Specifications'],
    turnaroundTime: 'Custom Timeline',
    startingPrice: '$2,500',
    iconName: 'Sparkles',
    sampleImage: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=1000&q=80',
    featured: true,
    active: true,
    accentGradient: 'from-cyan-400 via-purple-500 to-pink-500',
  },
];

export const INITIAL_PORTFOLIO: PortfolioProject[] = [
  {
    id: 'lumina-sound-poster',
    slug: 'lumina-sound-festival',
    title: 'LUMINA Synthetics: Sonic Biennial',
    category: 'Posters',
    shortDesc: 'A typographic poster series exploring granular sonic frequencies through kinetic vector dispersion.',
    fullDesc: 'Commissioned by the Tokyo Sound Biennial, this suite of five silkscreen posters translates spatial ambient acoustics into rhythmic typographic fields. Using custom monospace typography and spectral gradient halftones, the series captured the tension between physical acoustics and synthetic synthesis.',
    client: 'Lumina Arts Foundation',
    year: '2026',
    coverImage: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=1200&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=85',
    ],
    deliverables: ['5 B1 Silkscreen Prints', 'Kinetic Social Motion Suite', 'Digital OOH Video Billboards', 'Exhibition Program Booklet'],
    creativeProcess: 'We captured real-time frequency waveforms from the festival musicians, converting harmonic overtones into vector grid coordinates before manual typographic arrangement.',
    featured: true,
    tags: ['Typography', 'Silkscreen', 'Kinetic', 'Editorial'],
    accentColor: '#00d2ff',
    order: 1,
  },
  {
    id: 'aether-luxury-identity',
    slug: 'aether-spatial-identity',
    title: 'Aether Spatial: Architectural Brand Suite',
    category: 'Logos',
    shortDesc: 'Monolithic identity and precision stationery for a Zurich-based micro-architecture studio.',
    fullDesc: 'Aether constructs glass pavilions suspended in Alpine cliffs. We built their identity around mathematical negative space—a reductive geometric glyph flanked by custom-kerned grotesque typography stamped in matte black foil on 600gsm raw cotton board.',
    client: 'Aether Atelier Zurich',
    year: '2025',
    coverImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=85',
    ],
    deliverables: ['Core Logomark & Typographic Engine', 'Stationery & Blind Deboss Spec', 'Architectural Signage Guidelines', 'Private Client Portal Theme'],
    creativeProcess: 'We sampled golden ratio proportions from Swiss modernist blueprints, carving out a responsive mark that functions cleanly etched into concrete or scaled to 16px.',
    featured: true,
    tags: ['Identity', 'Minimalism', 'Architecture', 'Branding'],
    accentColor: '#f97316',
    order: 2,
  },
  {
    id: 'solstice-gala-invitation',
    slug: 'solstice-observatory-gala',
    title: 'Solstice Observatory Gala Invitation',
    category: 'Invitations',
    shortDesc: 'A celestial accordion invitation with iridescent holographic foil and celestial chart cartography.',
    fullDesc: 'For the annual vernal equinox celebration at Atacama Desert Observatory, we designed a multi-layered invitation enclosure that unfurls into a star coordinate map, accompanied by a cryptographically personalized QR access token.',
    client: 'Atacama Horizon Initiative',
    year: '2026',
    coverImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1200&q=85',
    ],
    deliverables: ['Custom Accordion Die-Cut Print', 'Holographic Stamping Plates', 'Digital Invitation Web Experience', 'VIP Credential Badges'],
    creativeProcess: 'Infused real star transit logs into fine silver-line foil paths, making each print an authentic celestial instrument.',
    featured: true,
    tags: ['Luxury Print', 'Foil Stamping', 'Events', 'Typography'],
    accentColor: '#ec4899',
    order: 3,
  },
  {
    id: 'prism-electric-campaign',
    slug: 'prism-velocity-ad-campaign',
    title: 'PRISM 01: Hypercar Global Launch Campaign',
    category: 'Advertisements',
    shortDesc: 'International billboard and cinematic digital campaign highlighting aerodynamic light physics.',
    fullDesc: 'To introduce the world’s first solid-state battery electric hypercar, PRISM needed campaign visuals that radiated speed without cliché combustion imagery. We deployed volumetric chromatic streaks, laser-measured wind tunnel renders, and editorial headlines across 42 capital cities.',
    client: 'Prism Mobility Corporation',
    year: '2026',
    coverImage: 'https://images.unsplash.com/photo-1542744094-3a31f272c490?auto=format&fit=crop&w=1200&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1542744094-3a31f272c490?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=85',
    ],
    deliverables: ['Global OOH Megabillboards (NYC, Tokyo, London)', 'Editorial Print Double-Page Spreads', 'Programmatic Motion Ad Matrix', 'Launch Event Stage Visuals'],
    creativeProcess: 'Collaborated directly with aerodynamic engineers to render true computational fluid dynamics into aesthetic light ribbons.',
    featured: true,
    tags: ['Campaign', 'Advertising', 'Motion', 'Commercial'],
    accentColor: '#8b5cf6',
    order: 4,
  },
  {
    id: 'mono-social-system',
    slug: 'mono-magazine-social-redesign',
    title: 'MONO Journal: Editorial Social Redesign',
    category: 'Social Media',
    shortDesc: 'A rigorous modular social publishing framework yielding a 340% increase in editorial saves.',
    fullDesc: 'MONO Journal required a design language that brought the intellectual weight of print magazines to Instagram, LinkedIn, and Threads. We engineered an 8-column layout grid, custom quotation glyphs, and high-contrast typographic carousels that users treat as digital artifacts.',
    client: 'MONO Publications Ltd.',
    year: '2025',
    coverImage: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=85',
    ],
    deliverables: ['36 Modular Figma Carousel Templates', 'Typography Spec & Scale Rules', 'Social Video Reel Caption Graphics', 'Creator Training Manual'],
    creativeProcess: 'Extracted grid math from classic 1960s Swiss graphic design journals and adapted line-heights for OLED mobile screens.',
    featured: false,
    tags: ['Social Design', 'Editorial', 'Figma System', 'Content'],
    accentColor: '#10b981',
    order: 5,
  },
  {
    id: 'chronos-film-title',
    slug: 'chronos-sci-fi-motion-film',
    title: 'CHRONOS: Film Title & Motion Sequence',
    category: 'Video',
    shortDesc: 'Main title sequence and cinematic trailer grading for an independent time-dilation thriller.',
    fullDesc: 'For director Elena Rostova’s cinematic release CHRONOS, our motion studio built a 3-minute title sequence capturing microscopic crystalline breakdown, synchronized with an analog synthesizer score. Selected at SXSW Title Design Awards.',
    client: 'Vanguard Pictures Independent',
    year: '2026',
    coverImage: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=1200&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1200&q=85',
    ],
    deliverables: ['Cinema 4K DCI Title Sequence Master', 'International Teaser Trailers (16:9 & 9:16)', 'Film Poster Key Visual Integration', 'Original Audio Foley & Stems'],
    creativeProcess: 'We shot high-speed macro 1000fps footage of melting bismuth crystals, digitally composite-tracked with 3D typography.',
    featured: true,
    tags: ['Film', 'Motion Graphics', 'Sound Design', 'Color Grading'],
    accentColor: '#ec4899',
    order: 6,
  },
];

/**
 * Initializes Firestore collections with rich studio seed data if not yet seeded
 */
export async function initializeFirestoreSeedData(): Promise<void> {
  try {
    // Check if services collection has data
    const servicesSnap = await getDocs(collection(db, 'services'));
    if (servicesSnap.empty) {
      console.log('Seeding initial Pixel Design House services...');
      const batch = writeBatch(db);
      for (const service of INITIAL_SERVICES) {
        const ref = doc(db, 'services', service.id);
        batch.set(ref, service);
      }
      await batch.commit();
    }

    // Check if portfolio collection has data
    const portfolioSnap = await getDocs(collection(db, 'portfolio'));
    if (portfolioSnap.empty) {
      console.log('Seeding initial Pixel Design House portfolio...');
      const batch = writeBatch(db);
      for (const project of INITIAL_PORTFOLIO) {
        const ref = doc(db, 'portfolio', project.id);
        batch.set(ref, project);
      }
      await batch.commit();
    }
  } catch (error) {
    console.warn('Seed data check skipped or completed:', error);
  }
}
