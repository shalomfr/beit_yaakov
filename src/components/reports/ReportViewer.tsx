"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ReportData, ChartData } from "@/types/reports";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
} from "recharts";

interface ReportViewerProps {
  report: ReportData;
}

const COLORS = [
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#ec4899",
  "#06b6d4",
  "#84cc16",
];

export function ReportViewer({ report }: ReportViewerProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("he-IL", {
      style: "currency",
      currency: "ILS",
      maximumFractionDigits: 0,
    }).format(value);
  };

  const renderChart = (chart: ChartData) => {
    const data = chart.data.map((item, index) => ({
      ...item,
      color: item.color || COLORS[index % COLORS.length],
    }));

    if (chart.type === "pie") {
      return (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) =>
                `${name} (${((percent ?? 0) * 100).toFixed(0)}%)`
              }
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => formatCurrency(Number(value ?? 0))}
              contentStyle={{ direction: "rtl" }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      );
    }

    if (chart.type === "bar") {
      return (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis tickFormatter={(value) => `${value / 1000}K`} />
            <Tooltip
              formatter={(value) => formatCurrency(Number(value ?? 0))}
              contentStyle={{ direction: "rtl" }}
            />
            <Bar dataKey="value" fill="#3b82f6">
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      );
    }

    if (chart.type === "line") {
      return (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis tickFormatter={(value) => `${value / 1000}K`} />
            <Tooltip
              formatter={(value) => formatCurrency(Number(value ?? 0))}
              contentStyle={{ direction: "rtl" }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ fill: "#3b82f6" }}
            />
          </LineChart>
        </ResponsiveContainer>
      );
    }

    return null;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "OPEN":
        return <Badge variant="destructive">פתוח</Badge>;
      case "PAID":
        return <Badge className="bg-green-500">שולם</Badge>;
      case "PARTIAL":
        return <Badge variant="secondary">חלקי</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Object.entries(report.summary).map(([key, value]) => (
          <Card key={key}>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">{key}</p>
              <p className="text-2xl font-bold">
                {typeof value === "number"
                  ? key.includes("מספר") || key.includes("חודשים")
                    ? value
                    : formatCurrency(value)
                  : value}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      {report.charts && report.charts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>{report.charts[0].title}</CardTitle>
          </CardHeader>
          <CardContent>{renderChart(report.charts[0])}</CardContent>
        </Card>
      )}

      {/* Data Table */}
      {report.data.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>
              פירוט ({report.data.length} רשומות)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="max-h-[400px] overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    {report.data[0].date && <TableHead>תאריך</TableHead>}
                    {report.data[0].description && <TableHead>תיאור</TableHead>}
                    {report.data[0].category && <TableHead>קטגוריה</TableHead>}
                    {report.data[0].framework && <TableHead>מסגרת</TableHead>}
                    {report.data[0].employeeName && <TableHead>עובד</TableHead>}
                    {report.data[0].status && <TableHead>סטטוס</TableHead>}
                    <TableHead>סכום</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {report.data.slice(0, 100).map((item) => (
                    <TableRow key={item.id}>
                      {item.date && (
                        <TableCell>
                          {new Date(item.date).toLocaleDateString("he-IL")}
                        </TableCell>
                      )}
                      {item.description !== undefined && (
                        <TableCell className="max-w-[200px] truncate">
                          {item.description}
                        </TableCell>
                      )}
                      {item.category && (
                        <TableCell>
                          <span className="flex items-center gap-1">
                            {item.categoryIcon} {item.category}
                          </span>
                        </TableCell>
                      )}
                      {item.framework && (
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={
                              item.frameworkType === "KINDERGARTEN"
                                ? "border-blue-500 text-blue-600"
                                : "border-amber-500 text-amber-600"
                            }
                          >
                            {item.framework}
                          </Badge>
                        </TableCell>
                      )}
                      {item.employeeName && (
                        <TableCell>{item.employeeName}</TableCell>
                      )}
                      {item.status && (
                        <TableCell>{getStatusBadge(item.status)}</TableCell>
                      )}
                      <TableCell className="font-medium">
                        {formatCurrency(item.amount)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {report.data.length > 100 && (
                <p className="text-sm text-muted-foreground text-center mt-4">
                  מוצגות 100 רשומות מתוך {report.data.length}. ייצא לקובץ לצפייה בכל הנתונים.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {report.data.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">אין נתונים להצגה בדוח זה</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
