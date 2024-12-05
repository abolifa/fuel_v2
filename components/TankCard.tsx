import { cn } from "@/lib/utils";
import { Prisma } from "@prisma/client";
import React from "react";
import { Badge } from "./ui/badge";

const getLevelColor = (percentage: number) => {
  if (percentage < 20) return "bg-red-500";
  if (percentage < 50) return "bg-yellow-400";
  return "bg-green-500";
};

const TankCard = ({
  tank,
}: {
  tank: Prisma.TankGetPayload<{ include: { fuel: true } }>;
}) => {
  const percentage = Math.round((tank.currentLevel / tank.capacity) * 100);
  const levelColor = getLevelColor(percentage);

  const fuelColor =
    tank.fuel.name === "بنزين"
      ? "bg-yellow-400"
      : tank.fuel.name === "ديزل"
      ? "bg-teal-500"
      : "bg-rose-500";
  return (
    <div
      key={tank.id}
      className="bg-card border shadow-md rounded-lg p-5 flex flex-col space-y-4"
    >
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">{tank.name}</h2>
        <span
          className={cn("text-sm font-medium px-3 py-1 rounded", fuelColor)}
        >
          {tank.fuel.name}
        </span>
      </div>

      <div className="relative w-full h-10 border rounded-lg overflow-hidden">
        <div
          className={`${levelColor} h-full`}
          style={{
            width: `${percentage}%`,
            transition: "width 0.5s ease-in-out",
          }}
        ></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-bold">{percentage}%</span>
        </div>
      </div>

      <div className="text-center flex items-center justify-between">
        <p className="text-base font-medium">{tank.currentLevel} لتر</p>
        <Badge variant={"default"}>السعة القصوى: {tank.capacity} لتر</Badge>
      </div>
    </div>
  );
};

export default TankCard;
