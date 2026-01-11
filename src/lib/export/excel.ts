import * as XLSX from 'xlsx';
import { ReportData } from '@/types/reports';

export function exportToExcel(report: ReportData): void {
  // Create workbook
  const wb = XLSX.utils.book_new();

  // Summary sheet
  const summaryData = Object.entries(report.summary).map(([key, value]) => ({
    'שדה': key,
    'ערך': typeof value === 'number' ? value : String(value),
  }));

  const summarySheet = XLSX.utils.json_to_sheet(summaryData);
  XLSX.utils.book_append_sheet(wb, summarySheet, 'סיכום');

  // Data sheet
  if (report.data.length > 0) {
    const dataForExcel = report.data.map(item => {
      const row: Record<string, string | number> = {};

      if (item.date) {
        row['תאריך'] = new Date(item.date).toLocaleDateString('he-IL');
      }
      if (item.description) {
        row['תיאור'] = item.description;
      }
      if (item.category) {
        row['קטגוריה'] = item.category;
      }
      if (item.framework) {
        row['מסגרת'] = item.framework;
      }
      if (item.employeeName) {
        row['עובד'] = item.employeeName;
      }
      if (item.status) {
        row['סטטוס'] = item.status === 'OPEN' ? 'פתוח' : item.status === 'PAID' ? 'שולם' : 'חלקי';
      }
      row['סכום'] = item.amount;

      return row;
    });

    const dataSheet = XLSX.utils.json_to_sheet(dataForExcel);
    XLSX.utils.book_append_sheet(wb, dataSheet, 'פירוט');
  }

  // Set column widths
  const sheets = wb.SheetNames;
  sheets.forEach(sheetName => {
    const sheet = wb.Sheets[sheetName];
    const range = XLSX.utils.decode_range(sheet['!ref'] || 'A1');
    const colWidths: { wch: number }[] = [];

    for (let col = range.s.c; col <= range.e.c; col++) {
      colWidths.push({ wch: 15 });
    }
    sheet['!cols'] = colWidths;
  });

  // Save the file
  const filename = `${report.title.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.xlsx`;
  XLSX.writeFile(wb, filename);
}
