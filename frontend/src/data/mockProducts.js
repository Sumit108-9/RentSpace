// Mock product data for frontend-only development
// No backend or database required

export const mockProducts = [
  {
    _id: '1',
    name: 'Premium Leather Sofa - 3 Seater',
    description: 'Experience ultimate comfort with our premium leather sofa. Features high-quality genuine leather upholstery, sturdy wooden frame, and plush cushioning.',
    category: 'sofa',
    subcategory: '3-seater',
    images: [
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800',
      'https://images.unsplash.com/photo-1550254478-ead40cc54513?w=800'
    ],
    rentPrice: 899,
    securityDeposit: 5000,
    buyPrice: 25000,
    rating: 4.8,
    numReviews: 124,
    countInStock: 15,
    features: ['Genuine Leather', 'Sturdy Frame', 'Plush Cushions'],
    dimensions: { length: 210, width: 90, height: 85, unit: 'cm' },
    material: 'Genuine Leather',
    color: 'Brown',
    isActive: true,
    isFeatured: true,
    minRentalPeriod: 3,
    maxRentalPeriod: 24,
    createdAt: '2024-01-15T10:00:00Z'
  },
  {
    _id: '2',
    name: 'Modern Fabric Sofa - L Shape',
    description: 'Contemporary L-shaped sofa with premium fabric upholstery. Modular design allows flexible arrangement.',
    category: 'sofa',
    subcategory: 'l-shape',
    images: [
      'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800',
      'https://images.unsplash.com/photo-1567016432779-094069958ea5?w=800'
    ],
    rentPrice: 899,
    securityDeposit: 8000,
    buyPrice: 25000,
    rating: 4.7,
    numReviews: 89,
    countInStock: 10,
    features: ['Modular Design', 'Premium Fabric', 'Throw Pillows'],
    dimensions: { length: 240, width: 180, height: 80, unit: 'cm' },
    material: 'Polyester Blend',
    color: 'Grey',
    isActive: true,
    isFeatured: true,
    minRentalPeriod: 6,
    maxRentalPeriod: 24,
    createdAt: '2024-01-20T10:00:00Z'
  },
  {
    _id: '3',
    name: 'Queen Size Bed with Storage',
    description: 'Elegant queen size bed with hydraulic storage. Upholstered headboard, solid wood construction.',
    category: 'bed',
    subcategory: 'queen',
    images: [
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800',
      'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=800'
    ],
    rentPrice: 999,
    securityDeposit: 6000,
    buyPrice: 30000,
    rating: 4.9,
    numReviews: 156,
    countInStock: 8,
    features: ['Hydraulic Storage', 'Upholstered Headboard', 'Solid Wood'],
    dimensions: { length: 203, width: 152, height: 110, unit: 'cm' },
    material: 'Engineered Wood',
    color: 'Beige',
    isActive: true,
    isFeatured: true,
    minRentalPeriod: 6,
    maxRentalPeriod: 24,
    createdAt: '2024-02-01T10:00:00Z'
  },
  {
    _id: '4',
    name: 'Single Bed with Mattress',
    description: 'Compact single bed perfect for small spaces. Includes comfortable foam mattress.',
    category: 'bed',
    subcategory: 'single',
    images: ['https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800'],
    rentPrice: 999,
    securityDeposit: 2500,
    buyPrice: 30000,
    rating: 4.5,
    numReviews: 78,
    countInStock: 20,
    features: ['Includes Mattress', 'Metal Frame', 'Compact Size'],
    dimensions: { length: 198, width: 91, height: 40, unit: 'cm' },
    material: 'Metal',
    color: 'Black',
    isActive: true,
    isFeatured: false,
    minRentalPeriod: 3,
    maxRentalPeriod: 24,
    createdAt: '2024-02-10T10:00:00Z'
  },
  {
    _id: '5',
    name: 'Dining Table Set - 4 Seater',
    description: 'Modern dining table set with 4 comfortable chairs. Tempered glass top with metal legs.',
    category: 'dining',
    subcategory: '4-seater',
    images: [
      'https://images.unsplash.com/photo-1577140917170-285929fb55b7?w=800',
      'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=800'
    ],
    rentPrice: 899,
    securityDeposit: 4000,
    buyPrice: 28000,
    rating: 4.6,
    numReviews: 92,
    countInStock: 12,
    features: ['Tempered Glass', '4 Chairs', 'Metal Frame'],
    dimensions: { length: 120, width: 75, height: 75, unit: 'cm' },
    material: 'Glass & Metal',
    color: 'Clear/Black',
    isActive: true,
    isFeatured: true,
    minRentalPeriod: 3,
    maxRentalPeriod: 24,
    createdAt: '2024-02-15T10:00:00Z'
  },
  {
    _id: '6',
    name: 'Study Desk with Chair',
    description: 'Ergonomic study desk with matching chair. Built-in drawer storage and cable management.',
    category: 'table',
    subcategory: 'study',
    images: ['https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=800'],
    rentPrice: 499,
    securityDeposit: 2000,
    buyPrice: 12000,
    rating: 4.4,
    numReviews: 67,
    countInStock: 25,
    features: ['Ergonomic Chair', 'Drawer Storage', 'Cable Management'],
    dimensions: { length: 100, width: 60, height: 75, unit: 'cm' },
    material: 'Engineered Wood',
    color: 'White',
    isActive: true,
    isFeatured: false,
    minRentalPeriod: 3,
    maxRentalPeriod: 24,
    createdAt: '2024-02-20T10:00:00Z'
  },
  {
    _id: '7',
    name: '3-Door Wardrobe with Mirror',
    description: 'Spacious 3-door wardrobe with full-length mirror. Multiple compartments.',
    category: 'wardrobe',
    subcategory: '3-door',
    images: ['https://images.unsplash.com/photo-1558997519-83ea9252edf8?w=800'],
    rentPrice: 799,
    securityDeposit: 4500,
    buyPrice: 22000,
    rating: 4.5,
    numReviews: 71,
    countInStock: 10,
    features: ['Full Mirror', '3 Doors', 'Multiple Shelves'],
    dimensions: { length: 150, width: 60, height: 200, unit: 'cm' },
    material: 'Engineered Wood',
    color: 'Walnut',
    isActive: true,
    isFeatured: true,
    minRentalPeriod: 3,
    maxRentalPeriod: 24,
    createdAt: '2024-03-10T10:00:00Z'
  },
  {
    _id: '8',
    name: 'TV Table - Entertainment Unit',
    description: 'Modern TV entertainment unit with cable management and storage drawers. Perfect for your living room setup.',
    category: 'tv-table',
    subcategory: 'entertainment',
    images: ['https://images.unsplash.com/photo-1611486212557-88be5ff6f941?w=800'],
    rentPrice: 599,
    securityDeposit: 3000,
    buyPrice: 15000,
    rating: 4.6,
    numReviews: 68,
    countInStock: 15,
    features: ['Cable Management', 'Storage Drawers', 'Modern Design'],
    dimensions: { length: 120, width: 40, height: 50, unit: 'cm' },
    material: 'Engineered Wood',
    color: 'Black',
    isActive: true,
    isFeatured: true,
    minRentalPeriod: 3,
    maxRentalPeriod: 24,
    createdAt: '2024-03-12T10:00:00Z'
  },
  {
    _id: '9',
    name: 'Modular Kitchen Cabinet Set',
    description: 'Complete modular kitchen cabinet set with premium finishes. Includes upper and lower cabinets with soft-close drawers.',
    category: 'modular-kitchen',
    subcategory: 'cabinet-set',
    images: ['https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800'],
    rentPrice: 2499,
    securityDeposit: 15000,
    buyPrice: 85000,
    rating: 4.8,
    numReviews: 42,
    countInStock: 5,
    features: ['Soft-Close Drawers', 'Premium Finish', 'Modular Design'],
    dimensions: { length: 240, width: 60, height: 210, unit: 'cm' },
    material: 'Plywood & Laminate',
    color: 'White & Wood',
    isActive: true,
    isFeatured: true,
    minRentalPeriod: 6,
    maxRentalPeriod: 24,
    createdAt: '2024-03-14T10:00:00Z'
  },
  {
    _id: '10',
    name: 'Coffee Table - Modern Design',
    description: 'Stylish coffee table with storage shelf. Perfect centerpiece for your living room.',
    category: 'table',
    subcategory: 'coffee',
    images: ['https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?w=800'],
    rentPrice: 499,
    securityDeposit: 1500,
    buyPrice: 12000,
    rating: 4.3,
    numReviews: 45,
    countInStock: 30,
    features: ['Storage Shelf', 'Modern Design', 'Easy Assembly'],
    dimensions: { length: 100, width: 60, height: 45, unit: 'cm' },
    material: 'Wood',
    color: 'Natural',
    isActive: true,
    isFeatured: false,
    minRentalPeriod: 3,
    maxRentalPeriod: 24,
    createdAt: '2024-03-15T10:00:00Z'
  },
  {
    _id: '11',
    name: 'Accent Chair - Velvet',
    description: 'Elegant velvet accent chair with gold metal legs. Adds a touch of luxury.',
    category: 'chair',
    subcategory: 'accent',
    images: ['https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=800'],
    rentPrice: 599,
    securityDeposit: 2500,
    buyPrice: 18000,
    rating: 4.8,
    numReviews: 52,
    countInStock: 15,
    features: ['Velvet Fabric', 'Gold Legs', 'Ergonomic'],
    dimensions: { length: 70, width: 75, height: 85, unit: 'cm' },
    material: 'Velvet & Metal',
    color: 'Emerald Green',
    isActive: true,
    isFeatured: true,
    minRentalPeriod: 3,
    maxRentalPeriod: 24,
    createdAt: '2024-03-20T10:00:00Z'
  },
  {
    _id: '12',
    name: 'Bookshelf - 5 Tier',
    description: 'Tall 5-tier bookshelf for your library. Open back design.',
    category: 'storage',
    subcategory: 'bookshelf',
    images: ['https://images.unsplash.com/photo-1594620302200-9a762244a156?w=800'],
    rentPrice: 499,
    securityDeposit: 2000,
    buyPrice: 14000,
    rating: 4.4,
    numReviews: 38,
    countInStock: 18,
    features: ['5 Tiers', 'Open Back', 'Sturdy'],
    dimensions: { length: 80, width: 30, height: 180, unit: 'cm' },
    material: 'Wood',
    color: 'White',
    isActive: true,
    isFeatured: false,
    minRentalPeriod: 3,
    maxRentalPeriod: 24,
    createdAt: '2024-03-25T10:00:00Z'
  }
];

// Helper function to get featured products
export const getFeaturedProducts = () => mockProducts.filter(p => p.isFeatured);

// Helper function to get products by category
export const getProductsByCategory = (category) => 
  mockProducts.filter(p => p.category === category);

// Helper function to get product by ID
export const getProductById = (id) => 
  mockProducts.find(p => p._id === id);

// Helper function to get all categories
export const getCategories = () => 
  [...new Set(mockProducts.map(p => p.category))];

// Simulate API delay
export const simulateApiDelay = (ms = 500) => 
  new Promise(resolve => setTimeout(resolve, ms));

// Mock API responses
export const mockApi = {
  getProducts: async (filters = {}) => {
    await simulateApiDelay();
    let products = [...mockProducts];
    
    // Apply filters
    if (filters.category) {
      products = products.filter(p => p.category === filters.category);
    }
    if (filters.search) {
      const search = filters.search.toLowerCase();
      products = products.filter(p => 
        p.name.toLowerCase().includes(search) || 
        p.description.toLowerCase().includes(search)
      );
    }
    if (filters.minPrice) {
      products = products.filter(p => p.rentPrice >= filters.minPrice);
    }
    if (filters.maxPrice) {
      products = products.filter(p => p.rentPrice <= filters.maxPrice);
    }
    if (filters.minRating) {
      products = products.filter(p => p.rating >= filters.minRating);
    }
    
    // Apply sorting
    if (filters.sort === 'price_low') {
      products.sort((a, b) => a.rentPrice - b.rentPrice);
    } else if (filters.sort === 'price_high') {
      products.sort((a, b) => b.rentPrice - a.rentPrice);
    } else if (filters.sort === 'rating') {
      products.sort((a, b) => b.rating - a.rating);
    }
    
    // Apply pagination
    const page = parseInt(filters.page) || 1;
    const limit = parseInt(filters.limit) || 12;
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedProducts = products.slice(start, end);
    
    return {
      success: true,
      products: paginatedProducts,
      pagination: {
        page,
        limit,
        total: products.length,
        pages: Math.ceil(products.length / limit),
        hasMore: end < products.length
      }
    };
  },
  
  getProductById: async (id) => {
    await simulateApiDelay(300);
    const product = mockProducts.find(p => p._id === id);
    if (!product) throw new Error('Product not found');
    return { success: true, product };
  },
  
  getFeaturedProducts: async () => {
    await simulateApiDelay(400);
    return { 
      success: true, 
      products: mockProducts.filter(p => p.isFeatured) 
    };
  },
  
  getCategories: async () => {
    await simulateApiDelay(200);
    return { 
      success: true, 
      categories: [...new Set(mockProducts.map(p => p.category))] 
    };
  }
};
