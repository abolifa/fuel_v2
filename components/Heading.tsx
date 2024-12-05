"use client";

import Link from "next/link";
import React, { FC } from "react";
import { Button, buttonVariants } from "./ui/button";
import { PlusCircle } from "lucide-react";
import axios from "axios";

interface HeadingProps {
  title: string;
  subTitle: string;
  action: string;
}

const Heading: FC<HeadingProps> = ({ title, subTitle, action }) => {
  const handleSync = async () => {
    try {
      await axios.get("/api/orders/sync");
      alert("تمت مزامنة الخزانات بنجاح");
    } catch (error) {
      console.error(error);
      alert("حدث خطأ أثناء مزامنة الخزانات");
    }
  };
  return (
    <div className="w-full flex items-center justify-between">
      <div className="flex flex-col items-start justify-start gap-1.5">
        <h1 className="text-2xl font-semibold">{title}</h1>
        <p className="text-sm text-muted-foreground">{subTitle}</p>
      </div>

      <div className="flex items-center gap-2">
        {action === "tanks" && (
          <Button variant="outline" onClick={handleSync}>
            مزامنة الخزانات
          </Button>
        )}

        <Link href={`${action}/new`} className={buttonVariants()}>
          <PlusCircle />
          إضافة جديد
        </Link>
      </div>
    </div>
  );
};

export default Heading;
