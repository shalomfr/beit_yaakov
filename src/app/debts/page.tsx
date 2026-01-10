"use client";

import { useState, useMemo } from "react";
import { Header } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Clock, CheckCircle2, Users, Plus, Search, Phone, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { he } from "date-fns/locale";
import { AddDebtDialog } from "@/components/debts/AddDebtDialog";
import { PayDebtDialog } from "@/components/debts/PayDebtDialog";
import { useDebts } from "@/hooks/useDebts";

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("he-IL", {
    style: "currency",
    currency: "ILS",
    maximumFractionDigits: 0,
  }).format(amount);
};

const getInitials = (firstName: string, lastName: string) => {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`;
};

export default function DebtsPage() {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [payDialogDebt, setPayDialogDebt] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "open" | "paid">("open");

  const { data: debts = [], isLoading, error } = useDebts();

  const filteredDebts = useMemo(() => {
    return debts.filter((debt) => {
      if (!debt.employee) return false;

      const matchesSearch =
        debt.employee.firstName.includes(searchQuery) ||
        debt.employee.lastName.includes(searchQuery) ||
        debt.reason.includes(searchQuery);

      if (filter === "all") return matchesSearch;
      if (filter === "open") return matchesSearch && debt.status === "OPEN";
      if (filter === "paid") return matchesSearch && debt.status === "PAID";
      return matchesSearch;
    });
  }, [debts, searchQuery, filter]);

  const totalOpen = useMemo(() => {
    return debts
      .filter((d) => d.status === "OPEN")
      .reduce((sum, d) => sum + (d.amount - d.paidAmount), 0);
  }, [debts]);

  const totalPaidThisMonth = useMemo(() => {
    const now = new Date();
    return debts
      .filter((d) => {
        if (!d.paidDate) return false;
        const paidDate = new Date(d.paidDate);
        return paidDate.getMonth() === now.getMonth() &&
               paidDate.getFullYear() === now.getFullYear();
      })
      .reduce((sum, d) => sum + d.paidAmount, 0);
  }, [debts]);

  const paidThisMonthCount = useMemo(() => {
    const now = new Date();
    return debts.filter((d) => {
      if (!d.paidDate) return false;
      const paidDate = new Date(d.paidDate);
      return paidDate.getMonth() === now.getMonth() &&
             paidDate.getFullYear() === now.getFullYear();
    }).length;
  }, [debts]);

  const openCount = useMemo(() => {
    return debts.filter((d) => d.status === "OPEN").length;
  }, [debts]);

  const employeesWithDebt = useMemo(() => {
    return new Set(debts.filter((d) => d.status === "OPEN").map((d) => d.employeeId)).size;
  }, [debts]);

  return (
    <div className="min-h-screen">
      <Header title="מעקב חובות" subtitle="שליטה פשוטה בפתוח / שולם" />

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

        {/* Stats */}
        {!isLoading && !error && (
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="card-hover">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">ממתינים לתשלום</p>
                    <p className="mt-2 text-3xl font-bold">{formatCurrency(totalOpen)}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{openCount} חובות פתוחים</p>
                  </div>
                  <div className="rounded-xl bg-amber-100 p-3 dark:bg-amber-900/30">
                    <Clock className="h-6 w-6 text-amber-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="card-hover">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">שולמו החודש</p>
                    <p className="mt-2 text-3xl font-bold">{formatCurrency(totalPaidThisMonth)}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{paidThisMonthCount} חובות</p>
                  </div>
                  <div className="rounded-xl bg-green-100 p-3 dark:bg-green-900/30">
                    <CheckCircle2 className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="card-hover">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">עובדים עם חוב פתוח</p>
                    <p className="mt-2 text-3xl font-bold">{employeesWithDebt}</p>
                  </div>
                  <div className="rounded-xl bg-blue-100 p-3 dark:bg-blue-900/30">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Debts List */}
        {!isLoading && !error && (
          <Card>
            <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <CardTitle>רשימת חובות</CardTitle>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="חיפוש עובד..."
                    className="pr-9 w-48"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex rounded-lg border p-1">
                  <button
                    onClick={() => setFilter("open")}
                    className={`px-3 py-1 text-sm rounded-md transition-colors ${
                      filter === "open" ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                    }`}
                  >
                    פתוחים
                  </button>
                  <button
                    onClick={() => setFilter("paid")}
                    className={`px-3 py-1 text-sm rounded-md transition-colors ${
                      filter === "paid" ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                    }`}
                  >
                    שולמו
                  </button>
                  <button
                    onClick={() => setFilter("all")}
                    className={`px-3 py-1 text-sm rounded-md transition-colors ${
                      filter === "all" ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                    }`}
                  >
                    הכל
                  </button>
                </div>
                <Button onClick={() => setIsAddOpen(true)}>
                  <Plus className="h-4 w-4 ml-2" />
                  חוב חדש
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {filteredDebts.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <p>לא נמצאו חובות</p>
                  </div>
                ) : (
                  filteredDebts.map((debt) => {
                    if (!debt.employee) return null;
                    const remainingAmount = debt.amount - debt.paidAmount;

                    return (
                      <div
                        key={debt.id}
                        className="flex items-center justify-between p-4 rounded-xl border bg-card hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <Avatar className="h-12 w-12">
                            <AvatarFallback className="bg-primary text-primary-foreground font-bold">
                              {getInitials(debt.employee.firstName, debt.employee.lastName)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-bold text-lg">
                              {debt.employee.firstName} {debt.employee.lastName}
                            </p>
                            <div className="flex items-center gap-3 text-sm text-muted-foreground">
                              <span>{debt.employee.role}</span>
                              <span className="flex items-center gap-1">
                                <Phone className="h-3 w-3" />
                                {debt.employee.phone}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-6">
                          <div className="text-left">
                            <p className="text-2xl font-bold">
                              {formatCurrency(debt.status === "PAID" ? debt.amount : remainingAmount)}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {debt.reason} • {format(new Date(debt.createdAt), "dd/MM/yyyy", { locale: he })}
                            </p>
                            {debt.status === "PARTIAL" && (
                              <p className="text-xs text-amber-600">
                                שולם {formatCurrency(debt.paidAmount)} מתוך {formatCurrency(debt.amount)}
                              </p>
                            )}
                          </div>
                          {debt.status === "OPEN" || debt.status === "PARTIAL" ? (
                            <Button onClick={() => setPayDialogDebt(debt)} className="bg-green-600 hover:bg-green-700">
                              {debt.status === "PARTIAL" ? "המשך תשלום" : "סמן כשולם"}
                            </Button>
                          ) : (
                            <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 px-4 py-2">
                              <CheckCircle2 className="h-4 w-4 ml-2" />
                              שולם
                            </Badge>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Total Summary */}
              {filteredDebts.length > 0 && filter === "open" && (
                <div className="mt-6 p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 flex items-center justify-between">
                  <span className="font-bold text-amber-800 dark:text-amber-300">סה״כ חובות פתוחים:</span>
                  <span className="text-2xl font-bold text-primary">{formatCurrency(totalOpen)}</span>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      <AddDebtDialog open={isAddOpen} onOpenChange={setIsAddOpen} />
      <PayDebtDialog 
        debt={payDialogDebt} 
        open={!!payDialogDebt} 
        onOpenChange={(open) => !open && setPayDialogDebt(null)} 
      />
    </div>
  );
}
