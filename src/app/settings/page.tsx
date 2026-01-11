"use client";

import { useState } from "react";
import { Header } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
  Palette,
  Loader2,
  RotateCcw,
  Info
} from "lucide-react";
import { useCategories, Category } from "@/hooks/useCategories";
import { useFrameworks } from "@/hooks/useFrameworks";
import { CategoryDialog } from "@/components/settings/CategoryDialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTourStore } from "@/stores/useTourStore";
import { toast } from "sonner";

export default function SettingsPage() {
  const { data: categories, isLoading: categoriesLoading } = useCategories();
  const { data: frameworks, isLoading: frameworksLoading } = useFrameworks();
  const queryClient = useQueryClient();
  const { resetTour, setShowWelcomeModal } = useTourStore();

  // Category dialog state
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  // Delete confirmation state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);

  // Profile form state
  const [profileName, setProfileName] = useState("מנהל המערכת");
  const [profileEmail, setProfileEmail] = useState("admin@beityaakov.org");
  const [savingProfile, setSavingProfile] = useState(false);

  // Delete category mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/categories/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete category");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      setDeleteDialogOpen(false);
      setCategoryToDelete(null);
      toast.success("הקטגוריה נמחקה בהצלחה");
    },
    onError: () => {
      toast.error("שגיאה במחיקת הקטגוריה");
    },
  });

  const handleAddCategory = () => {
    setSelectedCategory(null);
    setCategoryDialogOpen(true);
  };

  const handleEditCategory = (category: Category) => {
    setSelectedCategory(category);
    setCategoryDialogOpen(true);
  };

  const handleDeleteCategory = (category: Category) => {
    setCategoryToDelete(category);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (categoryToDelete) {
      deleteMutation.mutate(categoryToDelete.id);
    }
  };

  const handleSaveProfile = async () => {
    setSavingProfile(true);
    // Simulate saving - in a real app, this would call an API
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSavingProfile(false);
    toast.success("פרטי החשבון נשמרו בהצלחה");
  };

  const handleResetTour = () => {
    resetTour();
    setShowWelcomeModal(true);
    toast.success("הסיור המודרך יופעל מחדש");
  };

  const getFrameworkIcon = (type: string) => {
    return type === "KINDERGARTEN" ? Building2 : GraduationCap;
  };

  const getFrameworkColor = (type: string) => {
    return type === "KINDERGARTEN"
      ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600"
      : "bg-amber-100 dark:bg-amber-900/30 text-amber-600";
  };

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
            {frameworksLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : frameworks && frameworks.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2">
                {frameworks.map((framework) => {
                  const IconComponent = getFrameworkIcon(framework.type);
                  return (
                    <div key={framework.id} className="flex items-center justify-between p-4 rounded-lg border">
                      <div className="flex items-center gap-3">
                        <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${getFrameworkColor(framework.type)}`}>
                          <IconComponent className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-medium">{framework.name}</p>
                          <p className="text-sm text-muted-foreground">{framework.type}</p>
                        </div>
                      </div>
                      <div className="text-left">
                        <p className="font-medium">₪{framework.currentBalance.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">יתרה</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <FolderOpen className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>אין מסגרות במערכת</p>
              </div>
            )}
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
            <Button onClick={handleAddCategory}>
              <Plus className="h-4 w-4 ml-2" />
              קטגוריה חדשה
            </Button>
          </CardHeader>
          <CardContent>
            {categoriesLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : categories && categories.length > 0 ? (
              <div className="space-y-2">
                {categories.filter(c => c.isActive).map((category) => (
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
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        className="h-4 w-4 rounded-full"
                        style={{ backgroundColor: category.color }}
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditCategory(category)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive"
                        onClick={() => handleDeleteCategory(category)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Palette className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>אין קטגוריות במערכת</p>
                <Button variant="link" onClick={handleAddCategory}>
                  הוסף קטגוריה ראשונה
                </Button>
              </div>
            )}
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
                <Input
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">אימייל</label>
                <Input
                  value={profileEmail}
                  onChange={(e) => setProfileEmail(e.target.value)}
                  type="email"
                />
              </div>
            </div>
            <Button onClick={handleSaveProfile} disabled={savingProfile}>
              {savingProfile ? (
                <>
                  <Loader2 className="h-4 w-4 ml-2 animate-spin" />
                  שומר...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 ml-2" />
                  שמור שינויים
                </>
              )}
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
            <Button variant="outline" onClick={() => toast.info("שינוי סיסמה יתווסף בקרוב")}>
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

        {/* Tour Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5" />
              סיור מודרך
            </CardTitle>
            <CardDescription>הפעל מחדש את הסיור המודרך במערכת</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" onClick={handleResetTour}>
              <RotateCcw className="h-4 w-4 ml-2" />
              הפעל סיור מחדש
            </Button>
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
                <span className="font-medium">Next.js 15</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">בסיס נתונים:</span>
                <span className="font-medium">PostgreSQL</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category Dialog */}
      <CategoryDialog
        open={categoryDialogOpen}
        onOpenChange={setCategoryDialogOpen}
        category={selectedCategory}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>מחיקת קטגוריה</AlertDialogTitle>
            <AlertDialogDescription>
              האם אתה בטוח שברצונך למחוק את הקטגוריה &quot;{categoryToDelete?.name}&quot;?
              <br />
              פעולה זו תבטל את הקטגוריה אך לא תמחק הוצאות קיימות.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>ביטול</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 ml-2 animate-spin" />
                  מוחק...
                </>
              ) : (
                "מחק קטגוריה"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
