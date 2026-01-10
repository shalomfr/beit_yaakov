import { prisma } from "@/lib/prisma";

export interface CreateEmployeeInput {
  firstName: string;
  lastName: string;
  phone: string;
  role: string;
  frameworkId: string;
}

export interface UpdateEmployeeInput {
  firstName?: string;
  lastName?: string;
  phone?: string;
  role?: string;
  frameworkId?: string;
  isActive?: boolean;
}

export class EmployeeService {
  /**
   * Get all employees with optional filters
   */
  static async getEmployees(frameworkId?: string, isActive?: boolean) {
    const where: any = {};

    if (frameworkId) {
      where.frameworkId = frameworkId;
    }

    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    const employees = await prisma.employee.findMany({
      where,
      include: {
        framework: true,
        debts: {
          where: {
            status: {
              in: ["OPEN", "PARTIAL"],
            },
          },
          select: {
            id: true,
            amount: true,
            paidAmount: true,
            status: true,
          },
        },
      },
      orderBy: {
        lastName: "asc",
      },
    });

    return employees;
  }

  /**
   * Get a single employee by ID
   */
  static async getEmployeeById(id: string) {
    const employee = await prisma.employee.findUnique({
      where: { id },
      include: {
        framework: true,
        debts: {
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    if (!employee) {
      throw new Error("Employee not found");
    }

    return employee;
  }

  /**
   * Create a new employee
   */
  static async createEmployee(data: CreateEmployeeInput) {
    // Verify framework exists
    const framework = await prisma.framework.findUnique({
      where: { id: data.frameworkId },
    });

    if (!framework) {
      throw new Error("Framework not found");
    }

    // Check for duplicate phone number
    const existingEmployee = await prisma.employee.findFirst({
      where: {
        phone: data.phone,
      },
    });

    if (existingEmployee) {
      throw new Error("Employee with this phone number already exists");
    }

    const employee = await prisma.employee.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        role: data.role,
        frameworkId: data.frameworkId,
        isActive: true,
      },
      include: {
        framework: true,
        debts: true,
      },
    });

    return employee;
  }

  /**
   * Update an employee
   */
  static async updateEmployee(id: string, data: UpdateEmployeeInput) {
    const employee = await prisma.employee.findUnique({
      where: { id },
    });

    if (!employee) {
      throw new Error("Employee not found");
    }

    // If phone is being changed, check for duplicates
    if (data.phone && data.phone !== employee.phone) {
      const existingEmployee = await prisma.employee.findFirst({
        where: {
          phone: data.phone,
          id: {
            not: id,
          },
        },
      });

      if (existingEmployee) {
        throw new Error("Employee with this phone number already exists");
      }
    }

    // If framework is being changed, verify it exists
    if (data.frameworkId) {
      const framework = await prisma.framework.findUnique({
        where: { id: data.frameworkId },
      });

      if (!framework) {
        throw new Error("Framework not found");
      }
    }

    const updatedEmployee = await prisma.employee.update({
      where: { id },
      data,
      include: {
        framework: true,
        debts: true,
      },
    });

    return updatedEmployee;
  }

  /**
   * Delete an employee (soft delete by setting isActive to false)
   */
  static async deleteEmployee(id: string) {
    const employee = await prisma.employee.findUnique({
      where: { id },
      include: {
        debts: {
          where: {
            status: {
              in: ["OPEN", "PARTIAL"],
            },
          },
        },
      },
    });

    if (!employee) {
      throw new Error("Employee not found");
    }

    // Check if employee has outstanding debts
    if (employee.debts.length > 0) {
      throw new Error("Cannot delete employee with outstanding debts");
    }

    // Soft delete by setting isActive to false
    const updatedEmployee = await prisma.employee.update({
      where: { id },
      data: {
        isActive: false,
      },
      include: {
        framework: true,
        debts: true,
      },
    });

    return updatedEmployee;
  }

  /**
   * Get employee statistics
   */
  static async getStatistics() {
    const [totalEmployees, activeEmployees, employeesByFramework, employeesWithDebts] =
      await Promise.all([
        prisma.employee.count(),
        prisma.employee.count({
          where: {
            isActive: true,
          },
        }),
        prisma.employee.groupBy({
          by: ["frameworkId"],
          where: {
            isActive: true,
          },
          _count: true,
        }),
        prisma.employee.count({
          where: {
            isActive: true,
            debts: {
              some: {
                status: {
                  in: ["OPEN", "PARTIAL"],
                },
              },
            },
          },
        }),
      ]);

    return {
      total: totalEmployees,
      active: activeEmployees,
      inactive: totalEmployees - activeEmployees,
      byFramework: employeesByFramework,
      withDebts: employeesWithDebts,
    };
  }
}
