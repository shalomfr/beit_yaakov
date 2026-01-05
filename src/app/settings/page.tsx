"use client";

import { Header } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  Building2, 
  GraduationCap, 
  FolderOpen, 
  Plus, 
  Edit, 
  Trash2,
  Save,
  User,
  Lock,
  Bell,
  Palette
} from "lucide-react";

// Demo categories
const demoCategories = [
  { id: "1", name: "משכורות", icon: "💰", color: "#3b82f6", count: 45 },
  { id: "2", name: "חשמל", icon: "⚡", color: "#f59e0b", count: 12 },
  { id: "3", name: "תחזוקה", icon: "🔧", color: "#8b5cf6", count: 18 },
  { id: "4", name: "ניקיון", icon: "🧹", color: "#10b981", count: 24 },
  { id: "5", name: "ציוד", icon: "📦", color: "#ec4899", count: 8 },
  { id: "6", name: "אחר", icon: "📁", color: "#6b7280", count: 5 },
];

export default function SettingsPage() {
  return (
    <div className="min-h-screen">
      <Header title="הגדרות" subtitle="ניהול הגדרות המערכת" />

      <div className="p-6 space-y-6 max-w-4xl">
        {/* Frameworks */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FolderOpen className="h-5 w-5" />
              מסגרות
            </CardTitle>
            <CardDescription>ניהול המסגרות במערכת (גנים, בית ספר)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
                    <Building2 className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">גנים</p>
                    <p className="text-sm text-muted-foreground">KINDERGARTEN</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon">
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-900/30">
                    <GraduationCap className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="font-medium">בית ספר</p>
                    <p className="text-sm text-muted-foreground">SCHOOL</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon">
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Categories */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                קטגוריות הוצאות
              </CardTitle>
              <CardDescription>ניהול קטגוריות ההוצאות במערכת</CardDescription>
            </div>
            <Button>
              <Plus className="h-4 w-4 ml-2" />
              קטגוריה חדשה
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {demoCategories.map((category) => (
                <div
                  key={category.id}
                  className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-10 w-10 items-center justify-center rounded-lg text-xl"
                      style={{ backgroundColor: `${category.color}20` }}
                    >
                      {category.icon}
                    </div>
                    <div>
                      <p className="font-medium">{category.name}</p>
                      <p className="text-sm text-muted-foreground">{category.count} הוצאות</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      className="h-4 w-4 rounded-full"
                      style={{ backgroundColor: category.color }}
                    />
                    <Button variant="ghost" size="icon">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Separator />

        {/* Profile Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              פרטי חשבון
            </CardTitle>
            <CardDescription>עריכת פרטי החשבון שלך</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">שם מלא</label>
                <Input defaultValue="מנהל המערכת" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">אימייל</label>
                <Input defaultValue="admin@beityaakov.org" type="email" />
              </div>
            </div>
            <Button>
              <Save className="h-4 w-4 ml-2" />
              שמור שינויים
            </Button>
          </CardContent>
        </Card>

        {/* Security */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              אבטחה
            </CardTitle>
            <CardDescription>הגדרות סיסמה ואבטחה</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">סיסמה נוכחית</label>
                <Input type="password" placeholder="••••••••" />
              </div>
              <div></div>
              <div className="space-y-2">
                <label className="text-sm font-medium">סיסמה חדשה</label>
                <Input type="password" placeholder="••••••••" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">אימות סיסמה חדשה</label>
                <Input type="password" placeholder="••••••••" />
              </div>
            </div>
            <Button variant="outline">
              <Lock className="h-4 w-4 ml-2" />
              שנה סיסמה
            </Button>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              התראות
            </CardTitle>
            <CardDescription>הגדרות התראות ועדכונים</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg border">
              <div>
                <p className="font-medium">התראות על חובות חדשים</p>
                <p className="text-sm text-muted-foreground">קבל התראה כשנוסף חוב חדש למערכת</p>
              </div>
              <Badge>פעיל</Badge>
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg border">
              <div>
                <p className="font-medium">סיכום שבועי</p>
                <p className="text-sm text-muted-foreground">קבל דוח סיכום שבועי למייל</p>
              </div>
              <Badge variant="secondary">כבוי</Badge>
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg border">
              <div>
                <p className="font-medium">התראות על העברות ממתינות</p>
                <p className="text-sm text-muted-foreground">תזכורת על העברות שלא הושלמו</p>
              </div>
              <Badge>פעיל</Badge>
            </div>
          </CardContent>
        </Card>

        {/* System Info */}
        <Card>
          <CardHeader>
            <CardTitle>פרטי מערכת</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">גרסה:</span>
                <span className="font-medium">1.0.0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">שרת:</span>
                <span className="font-medium">Next.js 14</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">בסיס נתונים:</span>
                <span className="font-medium">SQLite</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
