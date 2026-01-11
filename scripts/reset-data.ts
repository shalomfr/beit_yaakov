import { PrismaClient } from '@prisma/client';

// Uses DATABASE_URL from environment
const prisma = new PrismaClient();

async function resetData() {
  console.log('🗑️ Starting data reset...');

  try {
    // Delete debts first (foreign key constraint)
    const deletedDebts = await prisma.debt.deleteMany({});
    console.log(`✓ Deleted ${deletedDebts.count} debts`);

    // Delete employees
    const deletedEmployees = await prisma.employee.deleteMany({});
    console.log(`✓ Deleted ${deletedEmployees.count} employees`);

    // Delete tour visitors (so tour shows again for new visitors)
    const deletedTourVisitors = await prisma.tourVisitor.deleteMany({});
    console.log(`✓ Deleted ${deletedTourVisitors.count} tour visitors`);

    // Delete expenses
    const deletedExpenses = await prisma.expense.deleteMany({});
    console.log(`✓ Deleted ${deletedExpenses.count} expenses`);

    // Reset framework balances to 0
    const updatedFrameworks = await prisma.framework.updateMany({
      data: { currentBalance: 0 }
    });
    console.log(`✓ Reset ${updatedFrameworks.count} framework balances to 0`);

    console.log('\n✅ Data reset completed successfully!');
    console.log('📝 Frameworks and categories are preserved.');

  } catch (error) {
    console.error('❌ Error during reset:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

resetData();
