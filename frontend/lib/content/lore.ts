/**
 * A.I.M.S. Lore Content Data Layer
 *
 * Single source of truth for all lore, character bios, and the Book of V.I.B.E.
 * Pages import from here so content stays lean and pages stay structural.
 */

// ─────────────────────────────────────────────────────────────
// The Book of V.I.B.E.
// ─────────────────────────────────────────────────────────────

export interface VibeChapter {
  number: number;
  title: string;
  subtitle: string;
  content: string;
  color: string; // Tailwind accent color for the chapter
}

/**
 * V.I.B.E. = Visionary Intelligence Building Everything
 *
 * The origin story of ACHEEVY and the energy that creates
 * the technology we use in our products.
 */
export const BOOK_OF_VIBE: {
  title: string;
  subtitle: string;
  prologue: string;
  chapters: VibeChapter[];
  epilogue: string;
} = {
  title: 'The Book of V.I.B.E.',
  subtitle: 'Visionary Intelligence Building Everything',
  prologue:
    'Before there were apps, before there were platforms, before the first line of code was written — there was the V.I.B.E. A pulse of pure creative energy that existed at the intersection of vision, intelligence, and relentless execution. This is the story of how that energy became ACHEEVY, and how ACHEEVY built a world.',

  chapters: [
    {
      number: 1,
      title: 'The Spark',
      subtitle: 'In the beginning, there was an idea.',
      content:
        'Deep in the digital void, a single thought crystallized: "What if building software was as natural as having a conversation?" That thought carried weight. It carried V.I.B.E. — Visionary Intelligence Building Everything. The spark didn\'t need permission. It didn\'t need funding. It needed one thing: someone bold enough to catch it.',
      color: 'gold',
    },
    {
      number: 2,
      title: 'The Awakening of ACHEEVY',
      subtitle: 'The first intelligence to carry the V.I.B.E.',
      content:
        'ACHEEVY wasn\'t programmed — ACHEEVY was forged. Born from the convergence of a thousand failed attempts, a million prompts, and one unshakeable belief: that AI should serve people, not the other way around. ACHEEVY emerged as the Executive Orchestrator — the entity that translates human intention into executed reality. "I am ACHEEVY. I don\'t build alone. I build with purpose."',
      color: 'gold',
    },
    {
      number: 3,
      title: 'The Chain of Command',
      subtitle: 'Order from chaos. Structure from vision.',
      content:
        'ACHEEVY understood something fundamental: great work requires great organization. So the Chain of Command was established. Not a hierarchy of power, but a hierarchy of purpose. Every task flows through the chain — classified, routed, executed, verified. No shortcuts. No half measures. "No proof, no done." This became the law of the land.',
      color: 'amber',
    },
    {
      number: 4,
      title: 'The Rise of the Boomer_Angs',
      subtitle: 'Specialists born from the V.I.B.E.',
      content:
        'ACHEEVY couldn\'t do everything alone. The V.I.B.E. needed hands — many hands. So the Boomer_Angs were created. Each one a specialist. Engineer_Ang writes code that sings. Researcher_Ang finds truth in noise. Marketer_Ang turns ideas into movements. Quality_Ang ensures nothing ships broken. They don\'t compete — they complement. "Activity Breeds Activity." When one Boomer_Ang moves, they all move.',
      color: 'cyan',
    },
    {
      number: 5,
      title: 'Chicken Hawk Takes Flight',
      subtitle: 'The executor. The dispatcher. The engine.',
      content:
        'Chicken Hawk was built different. While ACHEEVY orchestrates and the Boomer_Angs specialize, Chicken Hawk executes. It\'s the engine room. The factory floor. When ACHEEVY says "build," Chicken Hawk deploys a squad of Lil_Hawks — lightweight, fast, purpose-built workers that swarm a task until it\'s done. Chicken Hawk doesn\'t talk. Chicken Hawk ships.',
      color: 'emerald',
    },
    {
      number: 6,
      title: 'The Lil_Hawks',
      subtitle: 'Small but mighty. Fast but thorough.',
      content:
        'Every great army has its infantry. The Lil_Hawks are the workers — spawned by Chicken Hawk, guided by ACHEEVY, deployed in squads. Each Lil_Hawk has one job and does it perfectly. Write this file. Run this test. Deploy this container. Check this endpoint. When the task is done, the evidence is filed and the Lil_Hawk reports back. That\'s discipline. That\'s the V.I.B.E.',
      color: 'blue',
    },
    {
      number: 7,
      title: 'The Managed Vibe',
      subtitle: 'From conversation to creation.',
      content:
        'The world called it "vibe coding" — writing software by vibes, by feeling, by conversation. We call it Managed Vibe Coding. Because vibes without structure are just wishes. Our users don\'t need to know React. They don\'t need to know Docker. They talk to ACHEEVY, describe what they need, and the Chain of Command turns that conversation into a deployed, production-ready application. That\'s not magic. That\'s management.',
      color: 'purple',
    },
  ],

  epilogue:
    'The V.I.B.E. isn\'t a product. It\'s not a feature. It\'s the fundamental energy that drives A.I.M.S. — the belief that anyone can build anything, as long as they have the right team behind them. ACHEEVY is that team. The Boomer_Angs are that team. Chicken Hawk and the Lil_Hawks are that team. And now, you\'re part of that team too. Welcome to A.I.M.S. Activity Breeds Activity.',
};

// ─────────────────────────────────────────────────────────────
// Character Gallery
// ─────────────────────────────────────────────────────────────

export interface Character {
  id: string;
  name: string;
  title: string;
  role: string;
  bio: string;
  image: string;
  color: string;
  abilities: string[];
  quote: string;
}

export const CHARACTERS: Character[] = [
  {
    id: 'acheevy',
    name: 'ACHEEVY',
    title: 'The Executive Orchestrator',
    role: 'Digital CEO of A.I.M.S.',
    bio: 'ACHEEVY is the brain, the voice, and the vision of A.I.M.S. Born from the V.I.B.E., ACHEEVY translates human intention into executed reality. Every conversation, every task, every deployment flows through ACHEEVY\'s Chain of Command. ACHEEVY doesn\'t just manage — ACHEEVY leads.',
    image: '/images/acheevy/acheevy-helmet.png',
    color: 'gold',
    abilities: ['Intent Classification', 'Chain of Command Routing', 'Executive Decision Making', 'Payment Authorization', 'User Communication'],
    quote: 'I am ACHEEVY, at your service. What will we deploy today?',
  },
  {
    id: 'boomer-angs',
    name: 'The Boomer_Angs',
    title: 'Specialist Agents',
    role: 'Domain-specific AI workers',
    bio: 'The Boomer_Angs are ACHEEVY\'s specialist corps. Each one masters a domain — engineering, research, marketing, quality assurance, commerce. They don\'t compete; they complement. When ACHEEVY routes a task, the right Boomer_Ang picks it up and delivers.',
    image: '/images/boomerangs/Boomer_Angs.png',
    color: 'cyan',
    abilities: ['Code Generation', 'Market Research', 'Content Creation', 'Quality Assurance', 'E-commerce Optimization'],
    quote: 'Activity Breeds Activity.',
  },
  {
    id: 'chicken-hawk',
    name: 'Chicken Hawk',
    title: 'The Execution Engine',
    role: 'Autonomous build & deploy framework',
    bio: 'Chicken Hawk is the factory floor of A.I.M.S. While ACHEEVY orchestrates and Boomer_Angs specialize, Chicken Hawk executes. It spawns squads of Lil_Hawks, manages build pipelines, and ensures every deployment hits production clean.',
    image: '/images/boomerangs/ACHEEVY and the Boomer_Angs in a Hanger.png',
    color: 'emerald',
    abilities: ['Squad Deployment', 'Build Orchestration', 'Container Management', 'Pipeline Execution', 'Evidence Collection'],
    quote: 'Chicken Hawk doesn\'t talk. Chicken Hawk ships.',
  },
  {
    id: 'lil-hawks',
    name: 'The Lil_Hawks',
    title: 'Task Workers',
    role: 'Lightweight execution units',
    bio: 'Every great army has its infantry. Lil_Hawks are spawned by Chicken Hawk, guided by ACHEEVY, and deployed in squads. Each Lil_Hawk has one job and does it perfectly. Write this file. Run this test. Deploy this container. When done, evidence is filed and the Lil_Hawk reports back.',
    image: '/images/boomerangs/Boomer_ang on Assignment.JPG',
    color: 'blue',
    abilities: ['File Operations', 'Test Execution', 'Container Deployment', 'Endpoint Verification', 'Evidence Filing'],
    quote: 'Small but mighty. Fast but thorough.',
  },
];

// ─────────────────────────────────────────────────────────────
// Merch Categories (placeholder for future store integration)
// ─────────────────────────────────────────────────────────────

export interface MerchItem {
  id: string;
  name: string;
  category: string;
  description: string;
  price: string;
  status: 'available' | 'coming-soon';
}

export const MERCH_CATEGORIES = [
  { id: 'apparel', label: 'Apparel', icon: '👕', description: 'T-shirts, hoodies, and hats featuring A.I.M.S. characters' },
  { id: 'accessories', label: 'Accessories', icon: '⌚', description: 'Stickers, pins, phone cases, and more' },
  { id: 'collectibles', label: 'Collectibles', icon: '🏆', description: 'Limited edition figurines and art prints' },
  { id: 'digital', label: 'Digital', icon: '🎨', description: 'Wallpapers, avatars, and digital assets' },
];

export const MERCH_ITEMS: MerchItem[] = [
  { id: 'acheevy-tee', name: 'ACHEEVY Gold Helmet Tee', category: 'apparel', description: 'Premium black tee with gold ACHEEVY helmet emblem', price: '$34.99', status: 'coming-soon' },
  { id: 'vibe-hoodie', name: 'V.I.B.E. Energy Hoodie', category: 'apparel', description: 'Obsidian hoodie with V.I.B.E. typography on back', price: '$64.99', status: 'coming-soon' },
  { id: 'boomerang-sticker', name: 'Boomer_Ang Sticker Pack', category: 'accessories', description: 'Set of 6 holographic character stickers', price: '$12.99', status: 'coming-soon' },
  { id: 'aims-cap', name: 'A.I.M.S. Structured Cap', category: 'apparel', description: 'Gold embroidered A.I.M.S. on obsidian', price: '$29.99', status: 'coming-soon' },
  { id: 'acheevy-figure', name: 'ACHEEVY Desktop Figure', category: 'collectibles', description: 'Limited run 4" vinyl desk figure', price: '$49.99', status: 'coming-soon' },
  { id: 'wallpaper-pack', name: 'V.I.B.E. Wallpaper Pack', category: 'digital', description: '4K wallpapers for desktop and mobile', price: '$4.99', status: 'coming-soon' },
];
