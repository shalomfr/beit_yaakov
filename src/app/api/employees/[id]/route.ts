import { NextRequest, NextResponse } from "next/server";
import { EmployeeService } from "@/services/employee.service";

/**
 * GET /api/employees/[id]
 * Get a single employee by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const employee = await EmployeeService.getEmployeeById(params.id);

    return NextResponse.json({
      success: true,
      data: employee,
    });
  } catch (error: any) {
    console.error(`GET /api/employees/${params.id} error:`, error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch employee",
      },
      { status: error.message === "Employee not found" ? 404 : 500 }
    );
  }
}

/**
 * PUT /api/employees/[id]
 * Update an employee
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();

    const updateData: any = {};
    if (body.firstName) updateData.firstName = body.firstName;
    if (body.lastName) updateData.lastName = body.lastName;
    if (body.phone) updateData.phone = body.phone;
    if (body.role) updateData.role = body.role;
    if (body.frameworkId) updateData.frameworkId = body.frameworkId;
    if (body.isActive !== undefined) updateData.isActive = body.isActive;

    const employee = await EmployeeService.updateEmployee(params.id, updateData);

    return NextResponse.json({
      success: true,
      data: employee,
      message: "Employee updated successfully",
    });
  } catch (error: any) {
    console.error(`PUT /api/employees/${params.id} error:`, error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to update employee",
      },
      { status: error.message === "Employee not found" ? 404 : 400 }
    );
  }
}

/**
 * DELETE /api/employees/[id]
 * Delete an employee (soft delete)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await EmployeeService.deleteEmployee(params.id);

    return NextResponse.json({
      success: true,
      message: "Employee deleted successfully",
    });
  } catch (error: any) {
    console.error(`DELETE /api/employees/${params.id} error:`, error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to delete employee",
      },
      { status: error.message === "Employee not found" ? 404 : 400 }
    );
  }
}
