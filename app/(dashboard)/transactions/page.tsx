"use client";

import { DataTable } from "@/components/DataTable";
import Heading from "@/components/Heading";
import { Separator } from "@/components/ui/separator";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import LoadingTable from "@/components/LoadingTable";
import { columns } from "./columns";

const Page = () => {
  const { data, isError, error, isLoading } = useQuery({
    queryKey: ["transactions", "transactions-pending"],
    queryFn: async () => {
      const res = await axios.get("/api/transactions");
      return res.data;
    },
  });

  return (
    <div className="space-y-4">
      <Heading
        title="معاملات الوقود"
        subTitle="إدارة كافة المعاملات في النظام"
        action="transactions"
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
