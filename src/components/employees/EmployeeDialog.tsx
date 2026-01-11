"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
import { Loader2 } from "lucide-react";
import { useFrameworks } from "@/hooks/useFrameworks";
import {
  useCreateEmployee,
  useUpdateEmployee,
  Employee,
} from "@/hooks/useEmployees";

interface EmployeeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employee?: Employee | null;
}

export function EmployeeDialog({
  open,
  onOpenChange,
  employee,
}: EmployeeDialogProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("");
  const [frameworkId, setFrameworkId] = useState("");

  const { data: frameworks } = useFrameworks();
  const createEmployee = useCreateEmployee();
  const updateEmployee = useUpdateEmployee();

  const isEditing = !!employee;
  const isLoading = createEmployee.isPending || updateEmployee.isPending;

  useEffect(() => {
    if (employee) {
      setFirstName(employee.firstName);
      setLastName(employee.lastName);
      setPhone(employee.phone);
      setRole(employee.role);
      setFrameworkId(employee.frameworkId);
    } else {
      setFirstName("");
      setLastName("");
      setPhone("");
      setRole("");
      setFrameworkId("");
    }
  }, [employee, open]);

  const handleSubmit = async () => {
    if (!firstName || !lastName || !phone || !role || !frameworkId) {
      return;
    }

    try {
      if (isEditing && employee) {
        await updateEmployee.mutateAsync({
          id: employee.id,
          data: { firstName, lastName, phone, role, frameworkId },
        });
      } else {
        await createEmployee.mutateAsync({
          firstName,
          lastName,
          phone,
          role,
          frameworkId,
        });
      }
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to save employee:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "עריכת עובד" : "הוספת עובד חדש"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "ערוך את פרטי העובד"
              : "מלא את הפרטים להוספת עובד חדש למערכת"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">שם פרטי</label>
              <Input
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="שם פרטי"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">שם משפחה</label>
              <Input
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="שם משפחה"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">טלפון</label>
            <Input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="050-0000000"
              dir="ltr"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">תפקיד</label>
            <Input
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="לדוגמה: מורה, גננת, סייעת"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">מסגרת</label>
            <Select value={frameworkId} onValueChange={setFrameworkId}>
              <SelectTrigger>
                <SelectValue placeholder="בחר מסגרת" />
              </SelectTrigger>
              <SelectContent>
                {frameworks?.map((f) => (
                  <SelectItem key={f.id} value={f.id}>
                    {f.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            ביטול
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 ml-2 animate-spin" />
                שומר...
              </>
            ) : isEditing ? (
              "שמור שינויים"
            ) : (
              "הוסף עובד"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
