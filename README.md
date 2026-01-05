# מערכת ניהול פיננסי - בית יעקב

מערכת ניהול פיננסי מודרנית לעמותת בית יעקב, המאפשרת שליטה מלאה בהוצאות, יתרות, חובות והעברות פנימיות בין מסגרות.

## תכונות עיקריות

- 📊 **דשבורד הוצאות** - תמונת מצב יומית של כל ההוצאות לפי מסגרות וקטגוריות
- 🔄 **עובר ושב פנימי** - ניהול העברות כספיות בין גנים לבית ספר
- 💰 **מעקב חובות** - ניהול חובות עובדים עם סטטוס ברור
- 👥 **ניהול עובדים** - רשימת עובדים לפי מסגרות
- ⚙️ **הגדרות** - ניהול קטגוריות, מסגרות והרשאות

## טכנולוגיות

- **Frontend**: Next.js 14 (App Router) + TypeScript
- **Styling**: Tailwind CSS + Shadcn/ui
- **Database**: Prisma ORM + SQLite
- **Charts**: Recharts
- **Icons**: Lucide React

## התקנה מקומית

```bash
# Clone the repository
git clone https://github.com/shalomfr/beit_yaakov.git
cd beit_yaakov

# Install dependencies
npm install

# Setup database
npx prisma generate
npx prisma db push

# Run development server
npm run dev
```

פתח את הדפדפן בכתובת [http://localhost:3000](http://localhost:3000)

## משתני סביבה

צור קובץ `.env` עם המשתנים הבאים:

```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

## מבנה הפרויקט

```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Dashboard
│   ├── transfers/         # Internal transfers
│   ├── debts/             # Debt tracking
│   ├── employees/         # Employee management
│   └── settings/          # Settings
├── components/
│   ├── layout/            # Sidebar, Header
│   ├── dashboard/         # Dashboard components
│   ├── expenses/          # Expense forms
│   ├── transfers/         # Transfer forms
│   ├── debts/             # Debt forms
│   └── ui/                # Shadcn components
├── lib/
│   └── prisma.ts          # Prisma client
└── types/
    └── index.ts           # TypeScript types
```

## Deploy ל-Render

1. חבר את הריפו ל-Render
2. בחר "New Web Service"
3. הגדר:
   - Build Command: `npm install && npx prisma generate && npm run build`
   - Start Command: `npm start`

## רישיון

MIT
