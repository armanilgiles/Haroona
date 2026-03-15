import { MOCK_RAKUTEN_PRODUCTS } from "./mock-rakuten";

export const CITIES = [
  {
    id: "paris",
    name: "Paris",
    country: "France",
    image: "/images/cities/paris.png",
    followers: 22000,
    markerColor: "#F5C5A3",
    latitude: 48.8566,
    longitude: 2.3522,
  },
  {
    id: "tokyo",
    name: "Tokyo",
    country: "Japan",
    image: "/images/cities/tokyo.png",
    followers: 15000,
    markerColor: "#E8A87C",
    latitude: 35.6762,
    longitude: 139.6503,
  },
  {
    id: "london",
    name: "London",
    country: "UK",
    image: "/images/cities/london.png",
    followers: 12000,
    markerColor: "#8AABCF",
    latitude: 51.5074,
    longitude: -0.1278,
  },
  {
    id: "newyork",
    name: "New York",
    country: "USA",
    image: "/images/cities/newyork.png",
    followers: 19000,
    markerColor: "#D4A85C",
    latitude: 40.7128,
    longitude: -74.006,
  },
  {
    id: "losangeles",
    name: "Los Angeles",
    country: "USA",

    image: "/images/cities/losangeles.png",
    followers: 14000,
    markerColor: "#C4A882",
    latitude: 34.0522,
    longitude: -118.2437,
  },
  {
    id: "copenhagen",
    name: "Copenhagen",
    country: "Denmark",
    image: "/images/cities/copenhagen.png",
    followers: 18000,
    markerColor: "#A8C4B8",
    latitude: 55.6761,
    longitude: 12.5683,
  },
  {
    id: "marrakech",
    name: "Marrakech",
    country: "Morocco",
    image: "/images/cities/marrakech.png",
    followers: 9000,
    markerColor: "#D4956A",
    latitude: 31.6295,
    longitude: -7.9811,
  },
  {
    name: "Lagos",
    country: "Nigeria",
    latitude: 6.5244,
    longitude: 3.3792,
    countryCode: "NG",
    followers: 12000,
    markerColor: "#8AABCF",
    image: "/clothes_placeholders/AkuluunoPatchwokPantsSkirt.gif",
  },
];

export const PRODUCTS = [
  {
    id: "1",
    name: "Linen Dress",
    price: 320,
    brand: "Reformation",
    category: "Dresses",
    style: "Parisian Chic",
    vibe: "Parisian Chic",
    cityId: "paris",
    cityName: "Paris",
    image: "/images/products/linen-dress.png",
    isBestSeller: false,
  },
  {
    id: "2",
    name: "Leather Bag",
    price: 1200,
    brand: "Gucci",
    category: "Bags",
    style: "Quiet Luxury",
    vibe: "Quiet Luxury",
    cityId: "losangeles",
    cityName: "Los Angeles",
    image: "/images/products/leather-bag.png",
    isBestSeller: true,
  },
  {
    id: "3",
    name: "Street Sneaker",
    price: 189,
    brand: "Nike",
    category: "Shoes",
    style: "Tokyo Streetwear",
    vibe: "Tokyo Streetwear",
    cityId: "tokyo",
    cityName: "Tokyo",
    image: "/images/products/street-sneaker.png",
    isBestSeller: false,
  },
  {
    id: "4",
    name: "Silk Blouse",
    price: 450,
    brand: "Celine",
    category: "Dresses",
    style: "Minimal Summer",
    vibe: "Minimal Summer",
    cityId: "paris",
    cityName: "Paris",
    image: "/images/products/silk-blouse.png",
    isBestSeller: false,
  },
  {
    id: "5",
    name: "Gold Necklace",
    price: 890,
    brand: "Cartier",
    category: "Accessories",
    style: "Quiet Luxury",
    vibe: "Quiet Luxury",
    cityId: "london",
    cityName: "London",
    image: "/images/products/gold-necklace.png",
    isBestSeller: true,
  },
  {
    id: "6",
    name: "Navy Blazer",
    price: 780,
    brand: "Tom Ford",
    category: "Men",
    style: "Parisian Chic",
    vibe: "Parisian Chic",
    cityId: "london",
    cityName: "London",
    image: "/images/products/navy-blazer.png",
    isBestSeller: false,
  },
  {
    id: "7",
    name: "Designer Sunglasses",
    price: 520,
    brand: "Prada",
    category: "Accessories",
    style: "Minimal Summer",
    vibe: "Minimal Summer",
    cityId: "losangeles",
    cityName: "Los Angeles",
    image: "/images/products/sunglasses.png",
    isBestSeller: false,
  },
  {
    id: "8",
    name: "Cashmere Scarf",
    price: 340,
    brand: "Loro Piana",
    category: "Accessories",
    style: "Quiet Luxury",
    vibe: "Quiet Luxury",
    cityId: "copenhagen",
    cityName: "Copenhagen",
    image: "/images/products/cashmere-scarf.png",
    isBestSeller: false,
  },
  {
    id: "9",
    name: "Graphic Tee",
    price: 95,
    brand: "Comme des Garcons",
    category: "Men",
    style: "Tokyo Streetwear",
    vibe: "Tokyo Streetwear",
    cityId: "tokyo",
    cityName: "Tokyo",
    image: "/images/products/street-sneaker.png",
    isBestSeller: false,
  },
  {
    id: "10",
    name: "Woven Basket Bag",
    price: 680,
    brand: "Loewe",
    category: "Bags",
    style: "Minimal Summer",
    vibe: "Minimal Summer",
    cityId: "marrakech",
    cityName: "Marrakech",
    image: "/images/products/leather-bag.png",
    isBestSeller: false,
  },
  {
    id: "11",
    name: "Tailored Trousers",
    price: 560,
    brand: "Brunello Cucinelli",
    category: "Men",
    style: "Quiet Luxury",
    vibe: "Quiet Luxury",
    cityId: "copenhagen",
    cityName: "Copenhagen",
    image: "/images/products/navy-blazer.png",
    isBestSeller: false,
  },
  {
    id: "12",
    name: "Midi Skirt",
    price: 290,
    brand: "Sezane",
    category: "Dresses",
    style: "Parisian Chic",
    vibe: "Parisian Chic",
    cityId: "paris",
    cityName: "Paris",
    image: "/images/products/silk-blouse.png",
    isBestSeller: true,
  },
];

export const CATEGORIES = [
  "All",
  "Dresses",
  "Bags",
  "Shoes",
  "Men",
  "Accessories",
];
export const STYLES = [
  "All",
  "Parisian Chic",
  "Minimal Summer",
  "Quiet Luxury",
  "Tokyo Streetwear",
];
export const VIBES = [
  "Parisian Chic",
  "Minimal Summer",
  "Quiet Luxury",
  "Tokyo Streetwear",
];

export const TRENDING_STYLES = [
  { name: "All", icon: "grid" },
  { name: "Parisian Chic", icon: "flame" },
  { name: "Minimal Summer", icon: "sun" },
  { name: "Quiet Luxury", icon: "diamond" },
  { name: "Tokyo Streetwear", icon: "zap" },
];

// --- Optional: Rakuten-style mock products (ported from Haroona) ---
// These are adapted into Luxury Style Finder's Product shape so they can show
// up in the same city-based filtering flow.
// NOTE: Their original image paths (/logos/* and /clothes_placeholders/*)
// will 404 unless you add those files under: client/public/logos and
// client/public/clothes_placeholders.

const ADVERTISER_TO_CITY: Record<
  string,
  {
    cityId: string;
    cityName: string;
    style: string;
    vibe: string;
    category: string;
  }
> = {
  macys: {
    cityId: "newyork",
    cityName: "New York",
    style: "Quiet Luxury",
    vibe: "Quiet Luxury",
    category: "Men",
  },
  anthropologie: {
    cityId: "paris",
    cityName: "Paris",
    style: "Minimal Summer",
    vibe: "Minimal Summer",
    category: "Dresses",
  },
  yesstyle: {
    cityId: "tokyo",
    cityName: "Tokyo",
    style: "Tokyo Streetwear",
    vibe: "Tokyo Streetwear",
    category: "Men",
  },
  italist: {
    cityId: "losangeles",
    cityName: "Los Angeles",
    style: "Quiet Luxury",
    vibe: "Quiet Luxury",
    category: "Men",
  },
  havaianas: {
    cityId: "marrakech",
    cityName: "Marrakech",
    style: "Minimal Summer",
    vibe: "Minimal Summer",
    category: "Shoes",
  },
  myobioma: {
    cityId: "marrakech",
    cityName: "Marrakech",
    style: "Minimal Summer",
    vibe: "Minimal Summer",
    category: "Dresses",
  },
  kipfashion: {
    cityId: "london",
    cityName: "London",
    style: "Parisian Chic",
    vibe: "Parisian Chic",
    category: "Men",
  },
  lojasrenner: {
    cityId: "marrakech",
    cityName: "Marrakech",
    style: "Minimal Summer",
    vibe: "Minimal Summer",
    category: "Men",
  },
};

export const RAKUTEN_PRODUCTS_ADAPTED = MOCK_RAKUTEN_PRODUCTS.map((p, idx) => {
  const meta =
    ADVERTISER_TO_CITY[p.advertiserId] ??
    ({
      cityId: "paris",
      cityName: "Paris",
      style: "Quiet Luxury",
      vibe: "Quiet Luxury",
      category: "Accessories",
    } as const);

  // In this repo, price is an integer (dollars).
  // We round for simplicity so it stays compatible with the existing UI + DB schema.
  const parsedPrice = Math.round(Number.parseFloat(p.price) || 0);

  return {
    id: `rk_${p.productId}_${idx}`,
    name: p.productName,
    price: parsedPrice,
    brand: p.brandName,
    category: meta.category,
    style: meta.style,
    vibe: meta.vibe,
    cityId: meta.cityId,
    cityName: meta.cityName,
    image: p.productImage.url,
    isBestSeller: false,
  };
});
