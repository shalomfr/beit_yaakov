import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ReportData } from '@/types/reports';

export async function exportToPdf(report: ReportData): Promise<void> {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  // Set RTL direction
  doc.setR2L(true);

  // Title
  doc.setFontSize(20);
  doc.text(report.title, doc.internal.pageSize.width / 2, 20, { align: 'center' });

  // Generated date
  doc.setFontSize(10);
  doc.text(
    `נוצר בתאריך: ${new Date(report.generatedAt).toLocaleDateString('he-IL')}`,
    doc.internal.pageSize.width / 2,
    30,
    { align: 'center' }
  );

  // Summary section
  doc.setFontSize(14);
  doc.text('סיכום', doc.internal.pageSize.width - 15, 45, { align: 'right' });

  let yPos = 55;
  doc.setFontSize(11);
  Object.entries(report.summary).forEach(([key, value]) => {
    const formattedValue = typeof value === 'number'
      ? value.toLocaleString('he-IL', { style: 'currency', currency: 'ILS' })
      : value;
    doc.text(`${key}: ${formattedValue}`, doc.internal.pageSize.width - 15, yPos, { align: 'right' });
    yPos += 7;
  });

  // Data table
  if (report.data.length > 0) {
    yPos += 10;
    doc.setFontSize(14);
    doc.text('פירוט', doc.internal.pageSize.width - 15, yPos, { align: 'right' });

    const tableData = report.data.map(item => {
      const row: string[] = [];

      if (item.date) {
        row.push(new Date(item.date).toLocaleDateString('he-IL'));
      }
      if (item.description) {
        row.push(item.description.substring(0, 30));
      }
      if (item.category) {
        row.push(item.category);
      }
      if (item.framework) {
        row.push(item.framework);
      }
      if (item.employeeName) {
        row.push(item.employeeName);
      }
      row.push(item.amount.toLocaleString('he-IL', { style: 'currency', currency: 'ILS' }));

      return row;
    });

    const headers: string[] = [];
    if (report.data[0].date) headers.push('תאריך');
    if (report.data[0].description) headers.push('תיאור');
    if (report.data[0].category) headers.push('קטגוריה');
    if (report.data[0].framework) headers.push('מסגרת');
    if (report.data[0].employeeName) headers.push('עובד');
    headers.push('סכום');

    autoTable(doc, {
      startY: yPos + 5,
      head: [headers],
      body: tableData,
      styles: {
        font: 'helvetica',
        halign: 'right',
        fontSize: 9,
      },
      headStyles: {
        fillColor: [59, 130, 246],
        textColor: 255,
        halign: 'right',
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
      margin: { right: 15, left: 15 },
    });
  }

  // Save the PDF
  const filename = `${report.title.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(filename);
}
