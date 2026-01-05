"use client";

import { useState } from "react";
import { Header } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Users, Plus, Search, Phone, Building2, GraduationCap, Edit, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

// Demo data
const demoEmployees = [
  { id: "1", firstName: "שרה", lastName: "כהן", phone: "050-1234567", role: "גננת", framework: { name: "גנים", type: "KINDERGARTEN" }, isActive: true },
  { id: "2", firstName: "רחל", lastName: "לוי", phone: "052-9876543", role: "סייעת", framework: { name: "גנים", type: "KINDERGARTEN" }, isActive: true },
  { id: "3", firstName: "מרים", lastName: "אברהם", phone: "054-5551234", role: "מורה למתמטיקה", framework: { name: "בית ספר", type: "SCHOOL" }, isActive: true },
  { id: "4", firstName: "יעל", lastName: "גולדשטיין", phone: "050-7778899", role: "סייעת", framework: { name: "בית ספר", type: "SCHOOL" }, isActive: true },
  { id: "5", firstName: "דינה", lastName: "פרידמן", phone: "053-4445566", role: "גננת", framework: { name: "גנים", type: "KINDERGARTEN" }, isActive: true },
  { id: "6", firstName: "לאה", lastName: "שמעוני", phone: "050-1112233", role: "מורה לעברית", framework: { name: "בית ספר", type: "SCHOOL" }, isActive: true },
  { id: "7", firstName: "חנה", lastName: "דוד", phone: "052-4445556", role: "סייעת", framework: { name: "גנים", type: "KINDERGARTEN" }, isActive: false },
];

const getInitials = (firstName: string, lastName: string) => {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`;
};

export default function EmployeesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "kindergarten" | "school">("all");

  const filteredEmployees = demoEmployees.filter((employee) => {
    const matchesSearch = 
      employee.firstName.includes(searchQuery) ||
      employee.lastName.includes(searchQuery) ||
      employee.role.includes(searchQuery) ||
      employee.phone.includes(searchQuery);
    
    if (filter === "all") return matchesSearch;
    if (filter === "kindergarten") return matchesSearch && employee.framework.type === "KINDERGARTEN";
    if (filter === "school") return matchesSearch && employee.framework.type === "SCHOOL";
    return matchesSearch;
  });

  const kindergartenCount = demoEmployees.filter((e) => e.framework.type === "KINDERGARTEN" && e.isActive).length;
  const schoolCount = demoEmployees.filter((e) => e.framework.type === "SCHOOL" && e.isActive).length;
  const totalActive = demoEmployees.filter((e) => e.isActive).length;

  return (
    <div className="min-h-screen">
      <Header title="ניהול עובדים" subtitle="רשימת כל העובדים במערכת" />

      <div className="p-6 space-y-6">
        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="card-hover">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">סה״כ עובדים</p>
                  <p className="mt-2 text-3xl font-bold">{totalActive}</p>
                  <p className="mt-1 text-sm text-muted-foreground">עובדים פעילים</p>
                </div>
                <div className="rounded-xl bg-purple-100 p-3 dark:bg-purple-900/30">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">עובדי גנים</p>
                  <p className="mt-2 text-3xl font-bold">{kindergartenCount}</p>
                </div>
                <div className="rounded-xl bg-blue-100 p-3 dark:bg-blue-900/30">
                  <Building2 className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">עובדי בית ספר</p>
                  <p className="mt-2 text-3xl font-bold">{schoolCount}</p>
                </div>
                <div className="rounded-xl bg-amber-100 p-3 dark:bg-amber-900/30">
                  <GraduationCap className="h-6 w-6 text-amber-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Employees Table */}
        <Card>
          <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <CardTitle>רשימת עובדים</CardTitle>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="חיפוש..."
                  className="pr-9 w-48"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex rounded-lg border p-1">
                <button
                  onClick={() => setFilter("all")}
                  className={`px-3 py-1 text-sm rounded-md transition-colors ${
                    filter === "all" ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                  }`}
                >
                  הכל
                </button>
                <button
                  onClick={() => setFilter("kindergarten")}
                  className={`px-3 py-1 text-sm rounded-md transition-colors ${
                    filter === "kindergarten" ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                  }`}
                >
                  גנים
                </button>
                <button
                  onClick={() => setFilter("school")}
                  className={`px-3 py-1 text-sm rounded-md transition-colors ${
                    filter === "school" ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                  }`}
                >
                  בי״ס
                </button>
              </div>
              <Button>
                <Plus className="h-4 w-4 ml-2" />
                הוסף עובד
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>עובד/ת</TableHead>
                  <TableHead>תפקיד</TableHead>
                  <TableHead>מסגרת</TableHead>
                  <TableHead>טלפון</TableHead>
                  <TableHead>סטטוס</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmployees.map((employee) => (
                  <TableRow key={employee.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback className="bg-primary text-primary-foreground">
                            {getInitials(employee.firstName, employee.lastName)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium">
                          {employee.firstName} {employee.lastName}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{employee.role}</TableCell>
                    <TableCell>
                      <div className={cn(
                        "inline-flex items-center gap-2 px-3 py-1 rounded-md text-sm font-medium",
                        employee.framework.type === "SCHOOL"
                          ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
                          : "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                      )}>
                        {employee.framework.type === "SCHOOL" ? (
                          <GraduationCap className="h-4 w-4" />
                        ) : (
                          <Building2 className="h-4 w-4" />
                        )}
                        {employee.framework.name}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Phone className="h-4 w-4" />
                        {employee.phone}
                      </div>
                    </TableCell>
                    <TableCell>
                      {employee.isActive ? (
                        <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                          פעיל
                        </Badge>
                      ) : (
                        <Badge variant="secondary">לא פעיל</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start">
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 ml-2" />
                            עריכה
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            השבת עובד
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
