import { PrismaClient } from "@prisma/client";
import fs from "fs/promises";
import path from "path";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// Sample venue data for Pattaya
const pattayaVenues = [
  // Soi 6 Bars
  { name: "Happy Beer Bar", type: "BEER_BAR", district: "Soi 6", latitude: 12.933089, longitude: 100.883956 },
  { name: "Lovely Bar", type: "BEER_BAR", district: "Soi 6", latitude: 12.933234, longitude: 100.883789 },
  { name: "Passion Bar", type: "BEER_BAR", district: "Soi 6", latitude: 12.933456, longitude: 100.883678 },
  
  // Walking Street GoGo Bars
  { name: "Baccara", type: "GOGO_BAR", district: "Walking Street", latitude: 12.925678, longitude: 100.873456 },
  { name: "Angelwitch", type: "GOGO_BAR", district: "Walking Street", latitude: 12.925789, longitude: 100.873567 },
  { name: "The Dollhouse", type: "GOGO_BAR", district: "Walking Street", latitude: 12.925890, longitude: 100.873678 },
  
  // Gentlemen's Clubs
  { name: "Crystal Club", type: "GENTLEMENS_CLUB", district: "Pattaya Klang", latitude: 12.929012, longitude: 100.878901 },
  { name: "The Penthouse Club", type: "GENTLEMENS_CLUB", district: "Pattaya Klang", latitude: 12.928901, longitude: 100.878789 },
  
  // Massage Parlors
  { name: "Honey Massage", type: "MASSAGE_PARLOR", district: "Second Road", latitude: 12.931234, longitude: 100.881234 },
  { name: "Sabai Dee", type: "MASSAGE_PARLOR", district: "Second Road", latitude: 12.931345, longitude: 100.881345 },
];

async function seedVenues() {
  console.log("Seeding venues...");
  
  for (const venue of pattayaVenues) {
    await prisma.venue.upsert({
      where: { name: venue.name },
      update: {},
      create: {
        ...venue,
        avgGfeScore: Math.random() * 4 + 6, // Random score between 6-10
        avgPriceST: Math.round((Math.random() * 2000 + 1500) / 100) * 100, // 1500-3500 THB
        avgPriceLT: Math.round((Math.random() * 3000 + 3000) / 100) * 100, // 3000-6000 THB
      },
    });
  }
  
  console.log(`Seeded ${pattayaVenues.length} venues`);
}

async function seedScrapedData() {
  console.log("Importing scraped data...");
  
  try {
    // Read scraped data from JSON file (output from Apify scraper)
    const scrapedDataPath = path.join(process.cwd(), "scraper", "output", "dataset.json");
    const fileExists = await fs.access(scrapedDataPath).then(() => true).catch(() => false);
    
    if (!fileExists) {
      console.log("No scraped data file found. Skipping scraped data import.");
      return;
    }
    
    const scrapedData = await fs.readFile(scrapedDataPath, "utf-8");
    const posts = JSON.parse(scrapedData);
    
    // Get all venues for matching
    const venues = await prisma.venue.findMany();
    const venueMap = new Map(venues.map(v => [v.name.toLowerCase(), v.id]));
    
    let importedCount = 0;
    
    for (const post of posts) {
      // Try to match venue names
      let venueId = null;
      for (const venueName of post.venueNames || []) {
        const venueKey = venueName.toLowerCase();
        if (venueMap.has(venueKey)) {
          venueId = venueMap.get(venueKey);
          break;
        }
      }
      
      await prisma.scrapedPost.create({
        data: {
          postContent: post.postContent,
          username: post.username,
          postDate: new Date(post.postDate),
          venueId,
          pricesMentioned: post.pricesMentioned,
          keywords: post.keywords,
          sourceUrl: post.sourceUrl,
        },
      });
      
      importedCount++;
      
      if (importedCount % 100 === 0) {
        console.log(`Imported ${importedCount} posts...`);
      }
    }
    
    console.log(`Successfully imported ${importedCount} scraped posts`);
  } catch (error) {
    console.error("Error importing scraped data:", error);
  }
}

async function seedTestUsers() {
  console.log("Creating test users...");
  
  const hashedPassword = await bcrypt.hash("testpass123", 10);
  
  const testUsers = [
    {
      username: "alphatester1",
      email: "alpha1@test.com",
      password: hashedPassword,
      forumUsername: "ISGVeteran123",
    },
    {
      username: "premiumuser1",
      email: "premium1@test.com",
      password: hashedPassword,
    },
  ];
  
  for (const user of testUsers) {
    const createdUser = await prisma.user.upsert({
      where: { username: user.username },
      update: {},
      create: user,
    });
    
    // Give premium user an active annual subscription
    if (user.username === "premiumuser1") {
      const endDate = new Date();
      endDate.setFullYear(endDate.getFullYear() + 1);
      
      await prisma.subscription.create({
        data: {
          userId: createdUser.id,
          type: "ANNUAL",
          status: "ACTIVE",
          startDate: new Date(),
          endDate,
          amount: 19900, // $199
        },
      });
    }
  }
  
  console.log("Created test users");
}

async function main() {
  console.log("Starting database seed...");
  
  await seedVenues();
  await seedScrapedData();
  await seedTestUsers();
  
  console.log("Seeding completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });