"use client";

import LoadingTable from "@/components/LoadingTable";
import TankCard from "@/components/TankCard";
import { refresh_time } from "@/lib/constant";
import { Prisma, Tank } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export default function Home() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["tanks"],
    queryFn: async () => {
      const res = await axios.get<
        Prisma.TankGetPayload<{ include: { fuel: true } }>[]
      >("/api/tanks");
      return res.data;
    },
    refetchInterval: refresh_time,
  });
  return (
    <div className="w-full h-full p-10 space-y-5">
      {isLoading ? (
        <LoadingTable />
      ) : isError ? (
        <div>{error.message}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-5">
          {data &&
            data.map((tank) => (
              <TankCard
                key={tank.id}
                tank={tank as Tank & { fuel: { name: string } } as any}
              />
            ))}
        </div>
      )}
    </div>
  );
}
