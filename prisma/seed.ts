import { prisma } from "../src/lib/prisma";

async function main() {
  console.log("🌱 Starting database seeding...");

  // Create Frameworks (basic structure needed for the app to work)
  console.log("Creating frameworks...");
  const kindergarten = await prisma.framework.upsert({
    where: { id: "framework-kindergarten" },
    update: {},
    create: {
      id: "framework-kindergarten",
      name: "גנים",
      type: "KINDERGARTEN",
      currentBalance: 0,
    },
  });

  const school = await prisma.framework.upsert({
    where: { id: "framework-school" },
    update: {},
    create: {
      id: "framework-school",
      name: "בית ספר",
      type: "SCHOOL",
      currentBalance: 0,
    },
  });

  console.log(`✓ Created frameworks: ${kindergarten.name}, ${school.name}`);

  // Create Categories (basic categories for expense management)
  console.log("Creating categories...");
  const categories = [
    { name: "משכורות", icon: "💰", color: "#3b82f6" },
    { name: "חשמל", icon: "⚡", color: "#f59e0b" },
    { name: "תחזוקה", icon: "🔧", color: "#10b981" },
    { name: "ניקיון", icon: "🧹", color: "#8b5cf6" },
    { name: "ציוד", icon: "📦", color: "#ec4899" },
    { name: "חינוך", icon: "📚", color: "#06b6d4" },
    { name: "מזון", icon: "🍽️", color: "#f97316" },
    { name: "ביטוח", icon: "🛡️", color: "#6366f1" },
    { name: "דלק", icon: "⛽", color: "#14b8a6" },
    { name: "אחר", icon: "📁", color: "#64748b" },
  ];

  const createdCategories = await Promise.all(
    categories.map((cat) =>
      prisma.category.upsert({
        where: { name: cat.name },
        update: {},
        create: cat,
      })
    )
  );

  console.log(`✓ Created ${createdCategories.length} categories`);

  // No demo data - system starts empty
  // Users can add their own data through the app
  // Or use the /api/seed endpoint to load demo data

  console.log("✅ Database seeding completed successfully!");
  console.log("📝 System initialized with empty data - ready for use!");
}

main()
  .catch((e) => {
    console.error("❌ Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
