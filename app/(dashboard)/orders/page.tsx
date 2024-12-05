"use client";

import { DataTable } from "@/components/DataTable";
import Heading from "@/components/Heading";
import { Separator } from "@/components/ui/separator";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { columns } from "./columns";
import LoadingTable from "@/components/LoadingTable";

const Page = () => {
  const { data, isError, error, isLoading } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      const res = await axios.get("/api/orders");
      return res.data;
    },
  });

  return (
    <div className="space-y-4">
      <Heading
        title="طلبات الوقود"
        subTitle="إدارة كافة الطلبات في النظام"
        action="orders"
      />
      <Separator />
      {isLoading ? (
        <LoadingTable />
      ) : isError ? (
        <p>{error.message}</p>
      ) : (
        <DataTable data={data} columns={columns} />
      )}
    </div>
  );
};

export default Page;
