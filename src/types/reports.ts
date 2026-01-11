export type ReportType =
  | 'monthly'        // דוח חודשי
  | 'by-framework'   // דוח לפי מסגרת
  | 'by-category'    // דוח לפי קטגוריה
  | 'trends'         // דוח מגמות
  | 'employee-debts'; // דוח חובות עובדים

export interface ReportFilters {
  type: ReportType;
  startDate?: string;
  endDate?: string;
  frameworkId?: string;
  categoryId?: string;
}

export interface ReportData {
  title: string;
  generatedAt: string;
  filters: ReportFilters;
  summary: Record<string, number>;
  data: ReportDataItem[];
  charts?: ChartData[];
}

export interface ReportDataItem {
  id: string;
  description: string;
  amount: number;
  date: string;
  category?: string;
  categoryIcon?: string;
  framework?: string;
  frameworkType?: string;
  employeeName?: string;
  status?: string;
}

export interface ChartData {
  type: 'pie' | 'bar' | 'line';
  title: string;
  data: { name: string; value: number; color?: string }[];
}

export const REPORT_TYPES: { value: ReportType; label: string; description: string }[] = [
  { value: 'monthly', label: 'דוח חודשי', description: 'סיכום כל ההוצאות לפי חודש' },
  { value: 'by-framework', label: 'דוח לפי מסגרת', description: 'השוואת הוצאות בין גנים לבית ספר' },
  { value: 'by-category', label: 'דוח לפי קטגוריה', description: 'פילוח הוצאות לפי קטגוריות' },
  { value: 'trends', label: 'דוח מגמות', description: 'מגמות הוצאות לאורך זמן' },
  { value: 'employee-debts', label: 'דוח חובות עובדים', description: 'סיכום כל החובות של העובדים' },
];
