import { NextRequest, NextResponse } from "next/server";
import { EmployeeService } from "@/services/employee.service";

/**
 * GET /api/employees
 * Get all employees with optional filters
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const frameworkId = searchParams.get("frameworkId") || undefined;
    const isActiveParam = searchParams.get("isActive");
    const isActive = isActiveParam === "true" ? true : isActiveParam === "false" ? false : undefined;

    const employees = await EmployeeService.getEmployees(frameworkId, isActive);

    return NextResponse.json({
      success: true,
      data: employees,
      count: employees.length,
    });
  } catch (error: any) {
    console.error("GET /api/employees error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch employees",
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/employees
 * Create a new employee
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.firstName || !body.lastName || !body.phone || !body.role || !body.frameworkId) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields: firstName, lastName, phone, role, frameworkId",
        },
        { status: 400 }
      );
    }

    const employee = await EmployeeService.createEmployee({
      firstName: body.firstName,
      lastName: body.lastName,
      phone: body.phone,
      role: body.role,
      frameworkId: body.frameworkId,
    });

    return NextResponse.json(
      {
        success: true,
        data: employee,
        message: "Employee created successfully",
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("POST /api/employees error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to create employee",
      },
      { status: 400 }
    );
  }
}
