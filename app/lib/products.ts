export type ProductOption = {
  id: string;
  name: string;
  values: { id: string; label: string }[];
};

export type Product = {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  price: number;
  originalPrice?: number;
  rating: number;
  ratingCount: number;
  tags?: string[];
  images: string[]; // public/ placeholders
  options?: ProductOption[];
  description: string;
  details?: { title: string; content: string }[];
  specs?: { label: string; value: string }[];
  badges?: string[];
};

const products: Product[] = [
  {
    id: '1',
    slug: 'farm-fresh-yellow-kernels',
    title: 'Farm‑fresh Yellow Kernels',
    subtitle: 'Classic movie‑night perfection',
    price: 5.99,
    rating: 4.5,
    ratingCount: 214,
    tags: ['Best Seller'],
    images: ['/images/kernels-yellow-1.jpg', '/images/kernels-yellow-2.jpg', '/images/kernels-yellow-3.jpg'],
    options: [
      {
        id: 'size',
        name: 'Size',
        values: [
          { id: '1lb', label: '1 lb' },
          { id: '2lb', label: '2 lb' },
          { id: '5lb', label: '5 lb' },
        ],
      },
    ],
    description:
      "Meet our farm‑fresh yellow kernels—bright, fluffy, and ready to pop. Grown with care and packaged at peak freshness for the perfect bowl every time.",
    details: [
      { title: 'Ingredients', content: '100% Yellow Popcorn Kernels' },
      { title: 'Allergens', content: 'Packaged in a facility that also handles dairy and soy.' },
      { title: 'Storage', content: 'Store in a cool, dry place. Reseal after opening.' },
    ],
    specs: [
      { label: 'Origin', value: 'Local family farm' },
      { label: 'Net weight', value: '1 lb (454 g)' },
      { label: 'Best by', value: '12 months from pack date' },
    ],
    badges: ['Non‑GMO', 'Gluten‑Free', 'Small‑Batch'],
  },
  {
    id: '2',
    slug: 'white-butterfly-popcorn',
    title: 'White Butterfly Popcorn',
    subtitle: 'Tender & light for extra crunch',
    price: 6.49,
    rating: 4.0,
    ratingCount: 134,
    tags: ['New'],
    images: ['/images/kernels-white-1.jpg', '/images/kernels-white-2.jpg'],
    description: 'A delicate pop with big personality—perfect for seasonings and sweet coatings.',
    badges: ['Vegan', 'Air‑pop friendly'],
  },
  {
    id: '3',
    slug: 'caramel-drizzle-pack',
    title: 'Caramel Drizzle Pack',
    subtitle: 'Sweet, glossy, irresistible',
    price: 12.99,
    rating: 4.5,
    ratingCount: 89,
    tags: ['Limited'],
    images: ['/images/caramel-1.jpg'],
    description: 'Everything you need for a quick caramel upgrade at home.',
  },
];

export function getAllProducts(): Product[] {
  return products;
}

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}
