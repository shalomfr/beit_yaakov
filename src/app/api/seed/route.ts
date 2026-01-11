import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST() {
  try {
    // Load demo data from seed logic
    // This will be called when user clicks "Load Demo Data" button

    // Create frameworks
    const kindergarten = await prisma.framework.create({
      data: { name: 'גנים', type: 'KINDERGARTEN', currentBalance: 50000 }
    });

    const school = await prisma.framework.create({
      data: { name: 'בית ספר', type: 'SCHOOL', currentBalance: 80000 }
    });

    // Create categories
    const categories = await Promise.all([
      prisma.category.create({ data: { name: 'משכורות', icon: '💰', color: '#10b981' } }),
      prisma.category.create({ data: { name: 'חשמל', icon: '⚡', color: '#f59e0b' } }),
      prisma.category.create({ data: { name: 'תחזוקה', icon: '🔧', color: '#3b82f6' } }),
      prisma.category.create({ data: { name: 'ניקיון', icon: '🧹', color: '#8b5cf6' } }),
      prisma.category.create({ data: { name: 'ציוד', icon: '📦', color: '#ec4899' } }),
    ]);

    // Create sample expenses
    await prisma.expense.createMany({
      data: [
        {
          frameworkId: school.id,
          categoryId: categories[0].id,
          amount: 45000,
          description: 'משכורת ינואר - צוות הוראה',
          expenseDate: new Date('2026-01-05'),
          expenseType: 'FIXED'
        },
        {
          frameworkId: kindergarten.id,
          categoryId: categories[1].id,
          amount: 3200,
          description: 'חשבון חשמל דצמבר',
          expenseDate: new Date('2026-01-04'),
          expenseType: 'FIXED'
        },
        {
          frameworkId: school.id,
          categoryId: categories[2].id,
          amount: 1800,
          description: 'תיקון מזגן כיתה ד\'',
          expenseDate: new Date('2026-01-03'),
          expenseType: 'OCCASIONAL'
        },
        {
          frameworkId: kindergarten.id,
          categoryId: categories[3].id,
          amount: 4500,
          description: 'שירותי ניקיון חודשי',
          expenseDate: new Date('2026-01-02'),
          expenseType: 'FIXED'
        },
        {
          frameworkId: school.id,
          categoryId: categories[4].id,
          amount: 890,
          description: 'ציוד משרדי',
          expenseDate: new Date('2026-01-01'),
          expenseType: 'OCCASIONAL'
        },
      ]
    });

    return NextResponse.json({ success: true, message: 'נתוני דמו נטענו בהצלחה' });
  } catch (error) {
    console.error('Error loading demo data:', error);
    return NextResponse.json({ success: false, error: 'Failed to load demo data' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
