"use client";
import React, { FC } from "react";
import { DataTable } from "../DataTable";
import { columns } from "./colums";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import LoadingTable from "../LoadingTable";

interface CarTableProps {
  employeeId: string;
}

const CarTable: FC<CarTableProps> = ({ employeeId }) => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["cars"],
    queryFn: async () => {
      const response = await axios.get(`/api/cars/${employeeId}`);
      return response.data;
    },
  });
  return (
    <div>
      {isLoading ? (
        <LoadingTable />
      ) : isError ? (
        <div>{error.message}</div>
      ) : (
        <DataTable columns={columns} data={data} />
      )}
    </div>
  );
};

export default CarTable;
