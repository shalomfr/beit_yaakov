"use client";

import { useState } from "react";
import { Header } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Clock, CheckCircle2, Users, Plus, Search, Phone } from "lucide-react";
import { format } from "date-fns";
import { he } from "date-fns/locale";
import { AddDebtDialog } from "@/components/debts/AddDebtDialog";
import { PayDebtDialog } from "@/components/debts/PayDebtDialog";

// Demo data
const demoDebts = [
  {
    id: "1",
    employee: {
      id: "e1",
      firstName: "שרה",
      lastName: "כהן",
      phone: "050-1234567",
      role: "גננת",
    },
    amount: 2400,
    reason: "מקדמה על משכורת",
    debtType: "ADVANCE",
    status: "OPEN",
    createdAt: new Date("2025-11-12"),
  },
  {
    id: "2",
    employee: {
      id: "e2",
      firstName: "רחל",
      lastName: "לוי",
      phone: "052-9876543",
      role: "סייעת",
    },
    amount: 1800,
    reason: "הלוואה לחירום",
    debtType: "LOAN",
    status: "OPEN",
    createdAt: new Date("2025-12-15"),
  },
  {
    id: "3",
    employee: {
      id: "e3",
      firstName: "מרים",
      lastName: "אברהם",
      phone: "054-5551234",
      role: "מורה למתמטיקה",
    },
    amount: 3600,
    reason: "מקדמה על משכורת",
    debtType: "ADVANCE",
    status: "OPEN",
    createdAt: new Date("2025-12-20"),
  },
  {
    id: "4",
    employee: {
      id: "e4",
      firstName: "יעל",
      lastName: "גולדשטיין",
      phone: "050-7778899",
      role: "סייעת",
    },
    amount: 950,
    reason: "החזר הוצאות",
    debtType: "EXPENSE_REFUND",
    status: "OPEN",
    createdAt: new Date("2025-12-28"),
  },
  {
    id: "5",
    employee: {
      id: "e5",
      firstName: "דינה",
      lastName: "פרידמן",
      phone: "053-4445566",
      role: "גננת",
    },
    amount: 2000,
    reason: "הלוואה",
    debtType: "LOAN",
    status: "OPEN",
    createdAt: new Date("2026-01-02"),
  },
];

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
  const [payDialogDebt, setPayDialogDebt] = useState<typeof demoDebts[0] | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "open" | "paid">("open");

  const filteredDebts = demoDebts.filter((debt) => {
    const matchesSearch = 
      debt.employee.firstName.includes(searchQuery) ||
      debt.employee.lastName.includes(searchQuery) ||
      debt.reason.includes(searchQuery);
    
    if (filter === "all") return matchesSearch;
    if (filter === "open") return matchesSearch && debt.status === "OPEN";
    if (filter === "paid") return matchesSearch && debt.status === "PAID";
    return matchesSearch;
  });

  const totalOpen = demoDebts
    .filter((d) => d.status === "OPEN")
    .reduce((sum, d) => sum + d.amount, 0);

  const openCount = demoDebts.filter((d) => d.status === "OPEN").length;
  const employeesWithDebt = new Set(demoDebts.filter((d) => d.status === "OPEN").map((d) => d.employee.id)).size;

  return (
    <div className="min-h-screen">
      <Header title="מעקב חובות" subtitle="שליטה פשוטה בפתוח / שולם" />

      <div className="p-6 space-y-6">
        {/* Stats */}
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
                  <p className="mt-2 text-3xl font-bold">{formatCurrency(4300)}</p>
                  <p className="mt-1 text-sm text-muted-foreground">3 חובות</p>
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

        {/* Debts List */}
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
                filteredDebts.map((debt) => (
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
                        <p className="text-2xl font-bold">{formatCurrency(debt.amount)}</p>
                        <p className="text-sm text-muted-foreground">
                          {debt.reason} • {format(debt.createdAt, "dd/MM/yyyy", { locale: he })}
                        </p>
                      </div>
                      {debt.status === "OPEN" ? (
                        <Button onClick={() => setPayDialogDebt(debt)} className="bg-green-600 hover:bg-green-700">
                          סמן כשולם
                        </Button>
                      ) : (
                        <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 px-4 py-2">
                          <CheckCircle2 className="h-4 w-4 ml-2" />
                          שולם
                        </Badge>
                      )}
                    </div>
                  </div>
                ))
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
