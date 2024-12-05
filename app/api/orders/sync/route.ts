import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Fetch all tanks with associated Orders and Transactions
    const tanks = await prisma.tank.findMany({
      include: {
        Order: true,
        Transaction: true, // Include transactions in the query
      },
    });

    // Iterate over each tank and calculate the level
    for (const tank of tanks) {
      // Calculate the total amount from orders
      const orderAmount = tank.Order.reduce(
        (sum, order) => sum + order.amount,
        0
      );

      // Calculate the total amount from transactions
      const transactionAmount = tank.Transaction.reduce(
        (sum, transaction) => sum - transaction.amount!, // Subtract transactions as they consume fuel
        0
      );

      // Calculate the synchronized current level
      const synchronizedLevel = orderAmount + transactionAmount;

      // Update the tank's current level in the database
      await prisma.tank.update({
        where: { id: tank.id },
        data: { currentLevel: synchronizedLevel },
      });
    }

    return NextResponse.json(
      { message: "Tanks synchronized successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "An error occurred" }, { status: 500 });
  }
}
