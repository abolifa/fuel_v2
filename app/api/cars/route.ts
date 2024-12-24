import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Response) {
  const res = await prisma.car.findMany({
    include: {
      employee: true,
    },
  });

  return NextResponse.json(res);
}
