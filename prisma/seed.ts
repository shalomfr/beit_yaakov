import { prisma } from "../src/lib/prisma";

async function main() {
  console.log("🌱 Starting database seeding...");

  // Create Frameworks
  console.log("Creating frameworks...");
  const kindergarten = await prisma.framework.upsert({
    where: { id: "framework-kindergarten" },
    update: {},
    create: {
      id: "framework-kindergarten",
      name: "גנים",
      type: "KINDERGARTEN",
      currentBalance: 100000,
    },
  });

  const school = await prisma.framework.upsert({
    where: { id: "framework-school" },
    update: {},
    create: {
      id: "framework-school",
      name: "בית ספר",
      type: "SCHOOL",
      currentBalance: 150000,
    },
  });

  console.log(`✓ Created frameworks: ${kindergarten.name}, ${school.name}`);

  // Create Categories
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

  // Create Employees
  console.log("Creating employees...");
  const employees = [
    {
      firstName: "שרה",
      lastName: "כהן",
      phone: "050-1234567",
      role: "גננת",
      frameworkId: kindergarten.id,
    },
    {
      firstName: "רחל",
      lastName: "לוי",
      phone: "052-9876543",
      role: "סייעת",
      frameworkId: kindergarten.id,
    },
    {
      firstName: "מרים",
      lastName: "אברהם",
      phone: "054-5551234",
      role: "מורה למתמטיקה",
      frameworkId: school.id,
    },
    {
      firstName: "יעל",
      lastName: "דוד",
      phone: "053-7778889",
      role: "מורה לעברית",
      frameworkId: school.id,
    },
    {
      firstName: "דינה",
      lastName: "מזרחי",
      phone: "050-4445556",
      role: "גננת",
      frameworkId: kindergarten.id,
    },
  ];

  const createdEmployees = await Promise.all(
    employees.map((emp) =>
      prisma.employee.upsert({
        where: { phone: emp.phone },
        update: {},
        create: emp,
      })
    )
  );

  console.log(`✓ Created ${createdEmployees.length} employees`);

  // Create sample expenses
  console.log("Creating sample expenses...");
  const salaryCategory = createdCategories.find((c) => c.name === "משכורות");
  const electricityCategory = createdCategories.find((c) => c.name === "חשמל");
  const maintenanceCategory = createdCategories.find((c) => c.name === "תחזוקה");
  const cleaningCategory = createdCategories.find((c) => c.name === "ניקיון");
  const equipmentCategory = createdCategories.find((c) => c.name === "ציוד");

  const expenses = [
    {
      frameworkId: school.id,
      categoryId: salaryCategory!.id,
      amount: 45000,
      description: "משכורת ינואר - צוות הוראה",
      expenseDate: new Date("2026-01-05"),
      expenseType: "FIXED" as const,
    },
    {
      frameworkId: kindergarten.id,
      categoryId: electricityCategory!.id,
      amount: 3200,
      description: "חשבון חשמל דצמבר",
      expenseDate: new Date("2026-01-04"),
      expenseType: "FIXED" as const,
    },
    {
      frameworkId: school.id,
      categoryId: maintenanceCategory!.id,
      amount: 1800,
      description: "תיקון מזגן כיתה ד'",
      expenseDate: new Date("2026-01-03"),
      expenseType: "OCCASIONAL" as const,
    },
    {
      frameworkId: kindergarten.id,
      categoryId: cleaningCategory!.id,
      amount: 4500,
      description: "שירותי ניקיון חודשי",
      expenseDate: new Date("2026-01-02"),
      expenseType: "FIXED" as const,
    },
    {
      frameworkId: school.id,
      categoryId: equipmentCategory!.id,
      amount: 890,
      description: "ציוד משרדי",
      expenseDate: new Date("2026-01-01"),
      expenseType: "OCCASIONAL" as const,
    },
  ];

  const createdExpenses = await Promise.all(
    expenses.map((exp) => prisma.expense.create({ data: exp }))
  );

  console.log(`✓ Created ${createdExpenses.length} sample expenses`);

  // Create sample debts
  console.log("Creating sample debts...");
  const debts = [
    {
      employeeId: createdEmployees[0].id,
      amount: 2400,
      reason: "מקדמה על משכורת",
      debtType: "ADVANCE" as const,
      dueDate: new Date("2026-02-01"),
    },
    {
      employeeId: createdEmployees[1].id,
      amount: 1800,
      reason: "הלוואה לחירום",
      debtType: "LOAN" as const,
      dueDate: new Date("2026-03-01"),
    },
  ];

  const createdDebts = await Promise.all(
    debts.map((debt) => prisma.debt.create({ data: debt }))
  );

  console.log(`✓ Created ${createdDebts.length} sample debts`);

  console.log("✅ Database seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
