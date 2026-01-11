"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Download,
  FileSpreadsheet,
  Loader2,
  BarChart3,
  PieChart,
  TrendingUp,
  Users,
  Calendar,
} from "lucide-react";
import { ReportType, ReportData, REPORT_TYPES } from "@/types/reports";
import { useFrameworks } from "@/hooks/useFrameworks";
import { exportToPdf } from "@/lib/export/pdf";
import { exportToExcel } from "@/lib/export/excel";
import { ReportViewer } from "./ReportViewer";

interface ReportsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const REPORT_ICONS: Record<ReportType, typeof FileText> = {
  monthly: Calendar,
  'by-framework': BarChart3,
  'by-category': PieChart,
  trends: TrendingUp,
  'employee-debts': Users,
};

export function ReportsDialog({ open, onOpenChange }: ReportsDialogProps) {
  const [selectedType, setSelectedType] = useState<ReportType | null>(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [frameworkId, setFrameworkId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { data: frameworks } = useFrameworks();

  const handleGenerateReport = async () => {
    if (!selectedType) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: selectedType,
          startDate: startDate || undefined,
          endDate: endDate || undefined,
          frameworkId: frameworkId || undefined,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Failed to generate report");
      }

      setReportData(data.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportPdf = () => {
    if (reportData) {
      exportToPdf(reportData);
    }
  };

  const handleExportExcel = () => {
    if (reportData) {
      exportToExcel(reportData);
    }
  };

  const handleBack = () => {
    setReportData(null);
    setSelectedType(null);
  };

  const handleClose = () => {
    setReportData(null);
    setSelectedType(null);
    setStartDate("");
    setEndDate("");
    setFrameworkId("");
    setError(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <FileText className="h-6 w-6" />
            {reportData ? reportData.title : "הפקת דוחות"}
          </DialogTitle>
          <DialogDescription>
            {reportData
              ? `נוצר בתאריך ${new Date(reportData.generatedAt).toLocaleDateString("he-IL")}`
              : "בחר סוג דוח והגדר פילטרים"}
          </DialogDescription>
        </DialogHeader>

        {reportData ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2 justify-end">
              <Button variant="outline" onClick={handleBack}>
                חזור
              </Button>
              <Button variant="outline" onClick={handleExportExcel}>
                <FileSpreadsheet className="h-4 w-4 ml-2" />
                ייצוא ל-Excel
              </Button>
              <Button onClick={handleExportPdf}>
                <Download className="h-4 w-4 ml-2" />
                ייצוא ל-PDF
              </Button>
            </div>
            <ReportViewer report={reportData} />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Report Type Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {REPORT_TYPES.map((type) => {
                const Icon = REPORT_ICONS[type.value];
                const isSelected = selectedType === type.value;

                return (
                  <Card
                    key={type.value}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      isSelected
                        ? "ring-2 ring-blue-500 bg-blue-50"
                        : "hover:bg-slate-50"
                    }`}
                    onClick={() => setSelectedType(type.value)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div
                          className={`p-2 rounded-lg ${
                            isSelected
                              ? "bg-blue-500 text-white"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">{type.label}</h4>
                          <p className="text-sm text-muted-foreground">
                            {type.description}
                          </p>
                        </div>
                        {isSelected && (
                          <Badge className="bg-blue-500">נבחר</Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Filters */}
            {selectedType && (
              <div className="space-y-4 p-4 bg-slate-50 rounded-lg">
                <h4 className="font-medium">פילטרים (אופציונלי)</h4>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {selectedType !== "employee-debts" && (
                    <>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">מתאריך</label>
                        <Input
                          type="date"
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">עד תאריך</label>
                        <Input
                          type="date"
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                        />
                      </div>
                    </>
                  )}

                  {selectedType !== "by-framework" && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium">מסגרת</label>
                      <Select value={frameworkId} onValueChange={setFrameworkId}>
                        <SelectTrigger>
                          <SelectValue placeholder="כל המסגרות" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">כל המסגרות</SelectItem>
                          {frameworks?.map((f) => (
                            <SelectItem key={f.id} value={f.id}>
                              {f.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
              </div>
            )}

            {error && (
              <div className="p-4 bg-red-50 text-red-600 rounded-lg">
                {error}
              </div>
            )}

            {/* Generate Button */}
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={handleClose}>
                ביטול
              </Button>
              <Button
                onClick={handleGenerateReport}
                disabled={!selectedType || isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 ml-2 animate-spin" />
                    מייצר דוח...
                  </>
                ) : (
                  <>
                    <FileText className="h-4 w-4 ml-2" />
                    הפק דוח
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
