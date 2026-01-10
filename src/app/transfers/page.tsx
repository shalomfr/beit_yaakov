"use client";

import { useState, useMemo } from "react";
import { Header } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Building2, GraduationCap, ArrowLeftRight, Plus, Check, Clock, X, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { he } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { AddTransferDialog } from "@/components/transfers/AddTransferDialog";
import { useTransfers } from "@/hooks/useTransfers";
import { useFrameworks } from "@/hooks/useFrameworks";

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("he-IL", {
    style: "currency",
    currency: "ILS",
    maximumFractionDigits: 0,
  }).format(amount);
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case "COMPLETED":
      return (
        <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
          <Check className="h-3 w-3 ml-1" />
          הושלם
        </Badge>
      );
    case "PENDING":
      return (
        <Badge className="bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">
          <Clock className="h-3 w-3 ml-1" />
          ממתין
        </Badge>
      );
    case "CANCELLED":
      return (
        <Badge className="bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400">
          <X className="h-3 w-3 ml-1" />
          בוטל
        </Badge>
      );
    default:
      return null;
  }
};

export default function TransfersPage() {
  const [isAddOpen, setIsAddOpen] = useState(false);

  const { data: transfers = [], isLoading: isLoadingTransfers, error: transfersError } = useTransfers();
  const { data: frameworks = [], isLoading: isLoadingFrameworks } = useFrameworks();

  const kindergarten = useMemo(() => {
    return frameworks.find(f => f.type === "KINDERGARTEN");
  }, [frameworks]);

  const school = useMemo(() => {
    return frameworks.find(f => f.type === "SCHOOL");
  }, [frameworks]);

  // Calculate pending debts
  const kindergartenOwesSchool = useMemo(() => {
    return transfers
      .filter(t =>
        t.status === "PENDING" &&
        t.sourceFrameworkId === kindergarten?.id &&
        t.targetFrameworkId === school?.id
      )
      .reduce((sum, t) => sum + t.amount, 0);
  }, [transfers, kindergarten?.id, school?.id]);

  const schoolOwesKindergarten = useMemo(() => {
    return transfers
      .filter(t =>
        t.status === "PENDING" &&
        t.sourceFrameworkId === school?.id &&
        t.targetFrameworkId === kindergarten?.id
      )
      .reduce((sum, t) => sum + t.amount, 0);
  }, [transfers, kindergarten?.id, school?.id]);

  const isLoading = isLoadingTransfers || isLoadingFrameworks;
  const error = transfersError;

  return (
    <div className="min-h-screen">
      <Header title="עובר ושב פנימי" subtitle="הפרדה ובקרה בין מסגרות" />

      <div className="p-6 space-y-6">
        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        {/* Error State */}
        {error && (
          <Card className="border-red-200 bg-red-50 dark:bg-red-900/20">
            <CardContent className="p-6">
              <p className="text-red-800 dark:text-red-200">
                שגיאה בטעינת הנתונים. נסה לרענן את הדף.
              </p>
            </CardContent>
          </Card>
        )}

        {!isLoading && !error && (
          <>
            {/* Balance Cards */}
            <div className="flex flex-col lg:flex-row items-center justify-center gap-8">
              {/* Kindergarten Card */}
              <Card className="w-full lg:w-80">
                <CardContent className="p-6 text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                    <Building2 className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold">{kindergarten?.name || "גנים"}</h3>
                  <p className="text-sm text-muted-foreground mb-3">יתרה נוכחית:</p>
                  <p className="text-3xl font-bold text-primary">
                    {kindergarten ? formatCurrency(kindergarten.currentBalance) : "-"}
                  </p>
                  {kindergartenOwesSchool > 0 && (
                    <p className="mt-3 text-sm font-medium text-amber-600">
                      חייב לבית ספר: {formatCurrency(kindergartenOwesSchool)}
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Arrow */}
              <div className="flex items-center justify-center">
                <div className="rounded-full bg-accent p-4 animate-pulse">
                  <ArrowLeftRight className="h-8 w-8 text-accent-foreground" />
                </div>
              </div>

              {/* School Card */}
              <Card className="w-full lg:w-80">
                <CardContent className="p-6 text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30">
                    <GraduationCap className="h-8 w-8 text-amber-600" />
                  </div>
                  <h3 className="text-xl font-bold">{school?.name || "בית ספר"}</h3>
                  <p className="text-sm text-muted-foreground mb-3">יתרה נוכחית:</p>
                  <p className="text-3xl font-bold text-primary">
                    {school ? formatCurrency(school.currentBalance) : "-"}
                  </p>
                  {schoolOwesKindergarten > 0 && (
                    <p className="mt-3 text-sm font-medium text-amber-600">
                      חייב לגנים: {formatCurrency(schoolOwesKindergarten)}
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Add Transfer Button */}
            <div className="flex justify-center">
              <Button size="lg" onClick={() => setIsAddOpen(true)}>
                <Plus className="h-5 w-5 ml-2" />
                העברה חדשה
              </Button>
            </div>

            {/* Transfer History */}
            <Card>
              <CardHeader>
                <CardTitle>היסטוריית העברות</CardTitle>
              </CardHeader>
              <CardContent>
                {transfers.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <p>אין עדיין העברות במערכת</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>תאריך</TableHead>
                        <TableHead>מקור</TableHead>
                        <TableHead>יעד</TableHead>
                        <TableHead>סכום</TableHead>
                        <TableHead>תיאור</TableHead>
                        <TableHead>סטטוס</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {transfers.map((transfer) => {
                        if (!transfer.sourceFramework || !transfer.targetFramework) return null;

                        return (
                          <TableRow key={transfer.id}>
                            <TableCell>
                              {format(new Date(transfer.transferDate), "dd/MM/yyyy", { locale: he })}
                            </TableCell>
                            <TableCell>
                              <div className={cn(
                                "inline-flex items-center gap-2 px-3 py-1 rounded-md text-sm font-medium",
                                transfer.sourceFramework.type === "SCHOOL"
                                  ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
                                  : "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                              )}>
                                {transfer.sourceFramework.type === "SCHOOL" ? (
                                  <GraduationCap className="h-4 w-4" />
                                ) : (
                                  <Building2 className="h-4 w-4" />
                                )}
                                {transfer.sourceFramework.name}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className={cn(
                                "inline-flex items-center gap-2 px-3 py-1 rounded-md text-sm font-medium",
                                transfer.targetFramework.type === "SCHOOL"
                                  ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
                                  : "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                              )}>
                                {transfer.targetFramework.type === "SCHOOL" ? (
                                  <GraduationCap className="h-4 w-4" />
                                ) : (
                                  <Building2 className="h-4 w-4" />
                                )}
                                {transfer.targetFramework.name}
                              </div>
                            </TableCell>
                            <TableCell className="font-bold">
                              {formatCurrency(transfer.amount)}
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                              {transfer.description}
                            </TableCell>
                            <TableCell>
                              {getStatusBadge(transfer.status)}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>

      <AddTransferDialog open={isAddOpen} onOpenChange={setIsAddOpen} />
    </div>
  );
}
