import { prisma } from "@/lib/prisma";

export interface CreateTransferInput {
  sourceFrameworkId: string;
  targetFrameworkId: string;
  amount: number;
  description: string;
  transferDate: Date;
}

export class TransferService {
  /**
   * Get all transfers
   */
  static async getTransfers() {
    const transfers = await prisma.internalTransfer.findMany({
      include: {
        sourceFramework: true,
        targetFramework: true,
      },
      orderBy: {
        transferDate: "desc",
      },
    });

    return transfers;
  }

  /**
   * Get a single transfer by ID
   */
  static async getTransferById(id: string) {
    const transfer = await prisma.internalTransfer.findUnique({
      where: { id },
      include: {
        sourceFramework: true,
        targetFramework: true,
      },
    });

    if (!transfer) {
      throw new Error("Transfer not found");
    }

    return transfer;
  }

  /**
   * Create a new transfer
   */
  static async createTransfer(data: CreateTransferInput) {
    // Validate source and target are different
    if (data.sourceFrameworkId === data.targetFrameworkId) {
      throw new Error("Source and target frameworks must be different");
    }

    // Verify source framework exists and has sufficient balance
    const sourceFramework = await prisma.framework.findUnique({
      where: { id: data.sourceFrameworkId },
    });

    if (!sourceFramework) {
      throw new Error("Source framework not found");
    }

    if (sourceFramework.currentBalance < data.amount) {
      throw new Error("Insufficient balance in source framework");
    }

    // Verify target framework exists
    const targetFramework = await prisma.framework.findUnique({
      where: { id: data.targetFrameworkId },
    });

    if (!targetFramework) {
      throw new Error("Target framework not found");
    }

    // Create transfer
    const transfer = await prisma.internalTransfer.create({
      data: {
        sourceFrameworkId: data.sourceFrameworkId,
        targetFrameworkId: data.targetFrameworkId,
        amount: data.amount,
        description: data.description,
        transferDate: data.transferDate,
        status: "PENDING",
      },
      include: {
        sourceFramework: true,
        targetFramework: true,
      },
    });

    return transfer;
  }

  /**
   * Complete a transfer (update balances)
   */
  static async completeTransfer(id: string) {
    const transfer = await prisma.internalTransfer.findUnique({
      where: { id },
    });

    if (!transfer) {
      throw new Error("Transfer not found");
    }

    if (transfer.status === "COMPLETED") {
      throw new Error("Transfer already completed");
    }

    if (transfer.status === "CANCELLED") {
      throw new Error("Cannot complete a cancelled transfer");
    }

    // Check source framework balance again
    const sourceFramework = await prisma.framework.findUnique({
      where: { id: transfer.sourceFrameworkId },
    });

    if (!sourceFramework || sourceFramework.currentBalance < transfer.amount) {
      throw new Error("Insufficient balance in source framework");
    }

    // Update balances and transfer status in a transaction
    await prisma.$transaction([
      prisma.framework.update({
        where: { id: transfer.sourceFrameworkId },
        data: {
          currentBalance: {
            decrement: transfer.amount,
          },
        },
      }),
      prisma.framework.update({
        where: { id: transfer.targetFrameworkId },
        data: {
          currentBalance: {
            increment: transfer.amount,
          },
        },
      }),
      prisma.internalTransfer.update({
        where: { id },
        data: {
          status: "COMPLETED",
        },
      }),
    ]);

    return this.getTransferById(id);
  }

  /**
   * Cancel a transfer
   */
  static async cancelTransfer(id: string) {
    const transfer = await prisma.internalTransfer.findUnique({
      where: { id },
    });

    if (!transfer) {
      throw new Error("Transfer not found");
    }

    if (transfer.status === "COMPLETED") {
      throw new Error("Cannot cancel a completed transfer");
    }

    const updatedTransfer = await prisma.internalTransfer.update({
      where: { id },
      data: {
        status: "CANCELLED",
      },
      include: {
        sourceFramework: true,
        targetFramework: true,
      },
    });

    return updatedTransfer;
  }

  /**
   * Get balance summary between frameworks
   */
  static async getBalanceSummary() {
    const frameworks = await prisma.framework.findMany({
      select: {
        id: true,
        name: true,
        type: true,
        currentBalance: true,
      },
    });

    const pendingTransfers = await prisma.internalTransfer.findMany({
      where: {
        status: "PENDING",
      },
      select: {
        sourceFrameworkId: true,
        targetFrameworkId: true,
        amount: true,
      },
    });

    // Calculate pending amounts
    const pendingByFramework = pendingTransfers.reduce(
      (acc, transfer) => {
        if (!acc[transfer.sourceFrameworkId]) {
          acc[transfer.sourceFrameworkId] = { outgoing: 0, incoming: 0 };
        }
        if (!acc[transfer.targetFrameworkId]) {
          acc[transfer.targetFrameworkId] = { outgoing: 0, incoming: 0 };
        }

        acc[transfer.sourceFrameworkId].outgoing += transfer.amount;
        acc[transfer.targetFrameworkId].incoming += transfer.amount;

        return acc;
      },
      {} as Record<string, { outgoing: number; incoming: number }>
    );

    return frameworks.map((framework) => ({
      ...framework,
      pendingOutgoing: pendingByFramework[framework.id]?.outgoing || 0,
      pendingIncoming: pendingByFramework[framework.id]?.incoming || 0,
    }));
  }
}
