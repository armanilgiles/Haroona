import {
  type City, type InsertCity,
  type Product, type InsertProduct,
  type Category, type InsertCategory,
  type Newsletter, type InsertNewsletter,
  cities, products, categories, newsletters,
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  getCities(): Promise<City[]>;
  getProducts(): Promise<Product[]>;
  getProductsByCity(cityId: string): Promise<Product[]>;
  getProductsByCategory(category: string): Promise<Product[]>;
  getCategories(): Promise<Category[]>;
  createNewsletter(data: InsertNewsletter): Promise<Newsletter>;
  seedData(): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getCities(): Promise<City[]> {
    return db.select().from(cities);
  }

  async getProducts(): Promise<Product[]> {
    return db.select().from(products);
  }

  async getProductsByCity(cityId: string): Promise<Product[]> {
    return db.select().from(products).where(eq(products.cityId, cityId));
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    return db.select().from(products).where(eq(products.category, category));
  }

  async getCategories(): Promise<Category[]> {
    return db.select().from(categories);
  }

  async createNewsletter(data: InsertNewsletter): Promise<Newsletter> {
    const [result] = await db.insert(newsletters).values(data).returning();
    return result;
  }

  async seedData(): Promise<void> {
    const existingCities = await db.select().from(cities);
    if (existingCities.length > 0) return;

    await db.insert(cities).values([
      { name: "Paris", country: "France", image: "/images/cities/paris.png", followers: 22000, markerColor: "#F5C5A3", latitude: 48.8566, longitude: 2.3522 },
      { name: "Tokyo", country: "Japan", image: "/images/cities/tokyo.png", followers: 15000, markerColor: "#E8A87C", latitude: 35.6762, longitude: 139.6503 },
      { name: "London", country: "UK", image: "/images/cities/london.png", followers: 12000, markerColor: "#8AABCF", latitude: 51.5074, longitude: -0.1278 },
      { name: "New York", country: "USA", image: "/images/cities/newyork.png", followers: 19000, markerColor: "#D4A85C", latitude: 40.7128, longitude: -74.006 },
      { name: "Italy", country: "Italy", image: "/images/cities/italy.png", followers: 14000, markerColor: "#C4A882", latitude: 41.9028, longitude: 12.4964 },
      { name: "Copenhagen", country: "Denmark", image: "/images/cities/copenhagen.png", followers: 18000, markerColor: "#A8C4B8", latitude: 55.6761, longitude: 12.5683 },
      { name: "Marrakech", country: "Morocco", image: "/images/cities/marrakech.png", followers: 9000, markerColor: "#D4956A", latitude: 31.6295, longitude: -7.9811 },
    ]);

    const allCities = await db.select().from(cities);
    const cityMap: Record<string, string> = {};
    allCities.forEach((c) => { cityMap[c.name.toLowerCase()] = c.id; });

    await db.insert(products).values([
      { name: "Linen Dress", price: 320, brand: "Reformation", category: "Dresses", style: "Parisian Chic", cityId: cityMap["paris"], cityName: "Paris", image: "/images/products/linen-dress.png", isBestSeller: false },
      { name: "Leather Bag", price: 1200, brand: "Gucci", category: "Bags", style: "Quiet Luxury", cityId: cityMap["italy"], cityName: "Italy", image: "/images/products/leather-bag.png", isBestSeller: true },
      { name: "Street Sneaker", price: 189, brand: "Nike", category: "Shoes", style: "Tokyo Streetwear", cityId: cityMap["tokyo"], cityName: "Tokyo", image: "/images/products/street-sneaker.png", isBestSeller: false },
      { name: "Silk Blouse", price: 450, brand: "Celine", category: "Dresses", style: "Minimal Summer", cityId: cityMap["paris"], cityName: "Paris", image: "/images/products/silk-blouse.png", isBestSeller: false },
      { name: "Gold Necklace", price: 890, brand: "Cartier", category: "Accessories", style: "Quiet Luxury", cityId: cityMap["london"], cityName: "London", image: "/images/products/gold-necklace.png", isBestSeller: true },
      { name: "Navy Blazer", price: 780, brand: "Tom Ford", category: "Men", style: "Parisian Chic", cityId: cityMap["london"], cityName: "London", image: "/images/products/navy-blazer.png", isBestSeller: false },
      { name: "Designer Sunglasses", price: 520, brand: "Prada", category: "Accessories", style: "Minimal Summer", cityId: cityMap["italy"], cityName: "Italy", image: "/images/products/sunglasses.png", isBestSeller: false },
      { name: "Cashmere Scarf", price: 340, brand: "Loro Piana", category: "Accessories", style: "Quiet Luxury", cityId: cityMap["copenhagen"], cityName: "Copenhagen", image: "/images/products/cashmere-scarf.png", isBestSeller: false },
    ]);

    await db.insert(categories).values([
      { name: "All", slug: "all" },
      { name: "Dresses", slug: "dresses" },
      { name: "Bags", slug: "bags" },
      { name: "Shoes", slug: "shoes" },
      { name: "Men", slug: "men" },
      { name: "Accessories", slug: "accessories" },
    ]);
  }
}

export const storage = new DatabaseStorage();
