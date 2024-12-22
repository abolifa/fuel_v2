import prisma from "@/lib/prisma";
import { TransactionStatus } from "@prisma/client";
import { NextResponse } from "next/server";

export async function GET() {
  const pendingTransactions = await prisma.transaction.findMany({
    where: {
      status: "معلق",
    },
  });

  return NextResponse.json(pendingTransactions.length);
}
