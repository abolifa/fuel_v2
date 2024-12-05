import React from "react";
import { Skeleton } from "./ui/skeleton";

const LoadingTable = () => {
  return (
    <div className="w-full flex flex-col items-start justify-start gap-3">
      <Skeleton className="w-full h-8" />
      <Skeleton className="w-full h-8" />
      <Skeleton className="w-full h-8" />
      <Skeleton className="w-full h-8" />
    </div>
  );
};

export default LoadingTable;
