// Mock Headless CMS Data Layer
// This simulates fetching data from a headless CMS like Sanity.io or Contentful.

const mockGalleryData = [
  { id: 1, name: 'Emerald Lehenga', category: 'indian', image: '/gallery/img-1.webp', color: '#2E7D32' },
  { id: 2, name: 'Silk Gown', category: 'gown', image: '/gallery/img-2.webp', color: '#8B2252' },
  { id: 3, name: 'Fusion Saree Dress', category: 'fusion', image: '/gallery/img-3.webp', color: '#C9A96E' },
  { id: 4, name: 'A-Line Midi', category: 'western', image: '/gallery/img-4.webp', color: '#5C3348' },
  { id: 5, name: 'Bridal Lehenga', category: 'indian', image: '/gallery/img-5.webp', color: '#C2185B' },
  { id: 6, name: 'Evening Gown', category: 'gown', image: '/gallery/img-6.webp', color: '#1A0A0F' },
  { id: 7, name: 'Indo-Western Set', category: 'fusion', image: '/gallery/img-7.webp', color: '#9B7B8A' },
  { id: 8, name: 'Tiered Frock', category: 'western', image: '/gallery/img-8.webp', color: '#E8D5A3' },
  { id: 9, name: 'Churidar Set', category: 'indian', image: '/gallery/img-9.webp', color: '#3A1F2A' },
  { id: 10, name: 'Cocktail Gown', category: 'gown', image: '/gallery/img-10.webp', color: '#8B2252' },
  { id: 11, name: 'Fusion Anarkali', category: 'fusion', image: '/gallery/img-11.webp', color: '#C9A96E' },
  { id: 12, name: 'Party Dress', category: 'western', image: '/gallery/img-12.webp', color: '#5C3348' }
];

const mockTestimonialsData = [
  {
    id: 'rev-1',
    name: 'Aanya Sharma',
    role: 'Bridal Client',
    text: 'Stitches created my dream wedding lehenga. The attention to detail and the fit were absolutely flawless. I felt like royalty.',
    rating: 5,
    image: '/gallery/img-1.webp'
  },
  {
    id: 'rev-2',
    name: 'Priya Rajan',
    role: 'Regular Client',
    text: 'Their bespoke western wear is unmatched in Coimbatore. The silk gown they tailored for my reception fit like a second skin.',
    rating: 5,
    image: '/gallery/img-4.webp'
  },
  {
    id: 'rev-3',
    name: 'Meera Menon',
    role: 'Trousseau Client',
    text: 'From the initial sketch to the final fitting, the entire process was seamless. The fusion outfits were a massive hit!',
    rating: 5,
    image: '/gallery/img-7.webp'
  },
];

// Simulate network delay for fetching from CMS
export const fetchGalleryImages = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockGalleryData);
    }, 800);
  });
};

export const fetchTestimonials = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockTestimonialsData);
    }, 600);
  });
};
