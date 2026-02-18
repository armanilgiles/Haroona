export const CITIES = [
  { id: "paris", name: "Paris", country: "France", image: "/images/cities/paris.png", followers: 22000, markerColor: "#F5C5A3", latitude: 48.8566, longitude: 2.3522 },
  { id: "tokyo", name: "Tokyo", country: "Japan", image: "/images/cities/tokyo.png", followers: 15000, markerColor: "#E8A87C", latitude: 35.6762, longitude: 139.6503 },
  { id: "london", name: "London", country: "UK", image: "/images/cities/london.png", followers: 12000, markerColor: "#8AABCF", latitude: 51.5074, longitude: -0.1278 },
  { id: "newyork", name: "New York", country: "USA", image: "/images/cities/newyork.png", followers: 19000, markerColor: "#D4A85C", latitude: 40.7128, longitude: -74.006 },
  { id: "italy", name: "Italy", country: "Italy", image: "/images/cities/italy.png", followers: 14000, markerColor: "#C4A882", latitude: 41.9028, longitude: 12.4964 },
  { id: "copenhagen", name: "Copenhagen", country: "Denmark", image: "/images/cities/copenhagen.png", followers: 18000, markerColor: "#A8C4B8", latitude: 55.6761, longitude: 12.5683 },
  { id: "marrakech", name: "Marrakech", country: "Morocco", image: "/images/cities/marrakech.png", followers: 9000, markerColor: "#D4956A", latitude: 31.6295, longitude: -7.9811 },
];

export const PRODUCTS = [
  { id: "1", name: "Linen Dress", price: 320, brand: "Reformation", category: "Dresses", style: "Parisian Chic", cityId: "paris", cityName: "Paris", image: "/images/products/linen-dress.png", isBestSeller: false },
  { id: "2", name: "Leather Bag", price: 1200, brand: "Gucci", category: "Bags", style: "Quiet Luxury", cityId: "italy", cityName: "Italy", image: "/images/products/leather-bag.png", isBestSeller: true },
  { id: "3", name: "Street Sneaker", price: 189, brand: "Nike", category: "Shoes", style: "Tokyo Streetwear", cityId: "tokyo", cityName: "Tokyo", image: "/images/products/street-sneaker.png", isBestSeller: false },
  { id: "4", name: "Silk Blouse", price: 450, brand: "Celine", category: "Dresses", style: "Minimal Summer", cityId: "paris", cityName: "Paris", image: "/images/products/silk-blouse.png", isBestSeller: false },
  { id: "5", name: "Gold Necklace", price: 890, brand: "Cartier", category: "Accessories", style: "Quiet Luxury", cityId: "london", cityName: "London", image: "/images/products/gold-necklace.png", isBestSeller: true },
  { id: "6", name: "Navy Blazer", price: 780, brand: "Tom Ford", category: "Men", style: "Parisian Chic", cityId: "london", cityName: "London", image: "/images/products/navy-blazer.png", isBestSeller: false },
  { id: "7", name: "Designer Sunglasses", price: 520, brand: "Prada", category: "Accessories", style: "Minimal Summer", cityId: "italy", cityName: "Italy", image: "/images/products/sunglasses.png", isBestSeller: false },
  { id: "8", name: "Cashmere Scarf", price: 340, brand: "Loro Piana", category: "Accessories", style: "Quiet Luxury", cityId: "copenhagen", cityName: "Copenhagen", image: "/images/products/cashmere-scarf.png", isBestSeller: false },
];

export const CATEGORIES = ["All", "Dresses", "Bags", "Shoes", "Men", "Accessories"];
export const STYLES = ["All", "Parisian Chic", "Minimal Summer", "Quiet Luxury", "Tokyo Streetwear"];

export const TRENDING_STYLES = [
  { name: "All", icon: "grid" },
  { name: "Parisian Chic", icon: "flame" },
  { name: "Minimal Summer", icon: "sun" },
  { name: "Quiet Luxury", icon: "diamond" },
  { name: "Tokyo Streetwear", icon: "zap" },
];
