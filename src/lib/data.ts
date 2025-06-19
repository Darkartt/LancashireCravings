// Site-wide content and data management

export interface WoodType {
  id: string;
  name: string;
  price: number;
  description: string;
  image?: string;
  characteristics: string[];
  sustainability: 'high' | 'medium' | 'low';
}

export interface FinishType {
  id: string;
  name: string;
  description: string;
  durability: number; // 1-10 scale
  maintenance: 'low' | 'medium' | 'high';
  image?: string;
}

export interface ProjectType {
  id: string;
  name: string;
  examples: string;
  basePrice: number;
  timeframe: string;
  complexity: 'simple' | 'moderate' | 'complex';
}

export interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  images: string[];
  woodType: string;
  finishType: string;
  projectType: string;
  completionYear: number;
  featured: boolean;
  tags: string[];
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  slug: string;
  publishedAt: string;
  author: string;
  tags: string[];
  featured: boolean;
  image?: string;
}

// Wood types data
export const woodTypes: WoodType[] = [
  {
    id: 'walnut',
    name: 'English Walnut',
    price: 150,
    description: 'Rich, dark grain with elegant chocolate tones that develop character over time',
    characteristics: ['Dense grain', 'Excellent workability', 'Natural oils', 'Age beautifully'],
    sustainability: 'high',
    image: '/images/wood/walnut-grain.jpg',
  },
  {
    id: 'oak',
    name: 'European Oak',
    price: 120,
    description: 'Classic strength with prominent grain patterns and golden hues',
    characteristics: ['Strong and durable', 'Distinctive grain', 'Traditional choice', 'Weather resistant'],
    sustainability: 'high',
    image: '/images/wood/oak-grain.jpg',
  },
  {
    id: 'cherry',
    name: 'Wild Cherry',
    price: 130,
    description: 'Warm reddish hue that deepens with age and UV exposure',
    characteristics: ['Beautiful patina', 'Smooth texture', 'Darkens over time', 'Fine grain'],
    sustainability: 'medium',
    image: '/images/wood/cherry-grain.jpg',
  },
  {
    id: 'maple',
    name: 'Field Maple',
    price: 110,
    description: 'Light, clean grain with subtle elegance and exceptional strength',
    characteristics: ['Light color', 'Hard and dense', 'Minimal grain', 'Takes stain well'],
    sustainability: 'high',
    image: '/images/wood/maple-grain.jpg',
  },
  {
    id: 'mahogany',
    name: 'Sustainable Mahogany',
    price: 160,
    description: 'Luxurious reddish-brown with fine grain and exceptional workability',
    characteristics: ['Premium appearance', 'Stable wood', 'Fine texture', 'Easy to work'],
    sustainability: 'medium',
    image: '/images/wood/mahogany-grain.jpg',
  },
];

// Finish types data
export const finishTypes: FinishType[] = [
  {
    id: 'natural',
    name: 'Natural Oil Finish',
    description: 'Enhances natural grain while maintaining the wood\'s tactile feel',
    durability: 7,
    maintenance: 'medium',
    image: '/images/finishes/natural-oil.jpg',
  },
  {
    id: 'satin',
    name: 'Satin Lacquer',
    description: 'Smooth, low-gloss protection with subtle sheen and durability',
    durability: 9,
    maintenance: 'low',
    image: '/images/finishes/satin-lacquer.jpg',
  },
  {
    id: 'gloss',
    name: 'High Gloss Lacquer',
    description: 'Mirror-like finish for modern elegance and maximum protection',
    durability: 10,
    maintenance: 'low',
    image: '/images/finishes/high-gloss.jpg',
  },
  {
    id: 'matte',
    name: 'Matte Finish',
    description: 'No-gloss protection that preserves the raw wood appearance',
    durability: 6,
    maintenance: 'high',
    image: '/images/finishes/matte.jpg',
  },
];

// Project types data
export const projectTypes: ProjectType[] = [
  {
    id: 'furniture',
    name: 'Custom Furniture',
    examples: 'Dining tables, chairs, cabinets, desks, bedroom sets',
    basePrice: 800,
    timeframe: '4-8 weeks',
    complexity: 'moderate',
  },
  {
    id: 'sculpture',
    name: 'Artistic Sculpture',
    examples: 'Abstract forms, figurative pieces, installations, decorative art',
    basePrice: 500,
    timeframe: '2-6 weeks',
    complexity: 'complex',
  },
  {
    id: 'functional',
    name: 'Functional Art',
    examples: 'Bowls, boxes, decorative shelving, serving trays, cutting boards',
    basePrice: 150,
    timeframe: '1-3 weeks',
    complexity: 'simple',
  },
  {
    id: 'architectural',
    name: 'Architectural Elements',
    examples: 'Mantels, trim work, built-ins, staircases, doors',
    basePrice: 1200,
    timeframe: '6-12 weeks',
    complexity: 'complex',
  },
];

// Site navigation
export const navigation = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  { name: 'Portfolio', href: '/portfolio' },
  { name: 'Services', href: '/services' },
  { name: 'Commission', href: '/commission' },
  { name: 'Process', href: '/process' },
  { name: 'Blog', href: '/blog' },
  { name: 'Contact', href: '/contact' },
];

// Company information
export const companyInfo = {
  name: 'Elite Woodcraft',
  tagline: 'Master Craftsman Since 1987',
  description: 'From our Liverpool workshop to discerning collectors worldwide, we transform sustainably-sourced hardwoods into one-of-a-kind sculptural treasures that tell your story.',
  address: {
    street: 'Workshop District',
    city: 'Liverpool',
    country: 'United Kingdom',
    postcode: 'L1 8JQ',
  },
  contact: {
    phone: '+44 151 123 4567',
    email: 'hello@elitewoodcraft.co.uk',
    hours: 'Mon-Fri 9:00-17:00, Sat 10:00-16:00',
  },
  social: {
    instagram: 'https://instagram.com/elitewoodcraft',
    facebook: 'https://facebook.com/elitewoodcraft',
    pinterest: 'https://pinterest.com/elitewoodcraft',
    youtube: 'https://youtube.com/elitewoodcraft',
  },
  certifications: [
    'FSC Certified',
    'Guild of Master Craftsmen',
    'Sustainable Forestry Initiative',
  ],
};

// Utility functions
export function getWoodTypeById(id: string): WoodType | undefined {
  return woodTypes.find(wood => wood.id === id);
}

export function getFinishTypeById(id: string): FinishType | undefined {
  return finishTypes.find(finish => finish.id === id);
}

export function getProjectTypeById(id: string): ProjectType | undefined {
  return projectTypes.find(project => project.id === id);
}

export function calculateProjectPrice(
  woodId: string,
  projectId: string,
  customizations: number = 0
): number {
  const wood = getWoodTypeById(woodId);
  const project = getProjectTypeById(projectId);
  
  if (!wood || !project) return 0;
  
  const basePrice = project.basePrice;
  const woodMultiplier = wood.price / 100; // Convert to multiplier
  const customizationFee = customizations * 50;
  
  return Math.round(basePrice * woodMultiplier + customizationFee);
}
