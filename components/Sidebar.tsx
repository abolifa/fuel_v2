"use client";

import { cn } from "@/lib/utils";
import {
  DollarSign,
  FuelIcon,
  LayoutDashboard,
  LogOut,
  Receipt,
  Sparkle,
  Users,
  Wrench,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import UserNav from "./UserNav";
import { Separator } from "./ui/separator";
import axios from "axios";

const Sidebar = () => {
  const pathname = usePathname();
  const [transactionCount, setTransactionCount] = useState<number | null>(null);

  useEffect(() => {
    const fetchPendingTransactions = async () => {
      try {
        const response = await axios.get("/api/transactions/pending");
        setTransactionCount(response.data);
      } catch (error) {
        console.error("Error fetching pending transactions:", error);
      }
    };

    fetchPendingTransactions();
  }, []);

  const pages = [
    {
      title: "الرئيسية",
      href: "/",
      icon: LayoutDashboard,
    },
    {
      title: "المعاملات",
      href: "/transactions",
      icon: DollarSign,
      badge: transactionCount,
    },
    {
      title: "الخزانات",
      href: "/tanks",
      icon: FuelIcon,
    },
    {
      title: "الطلبات",
      href: "/orders",
      icon: Receipt,
    },
    {
      title: "التقارير",
      href: "/reports",
      icon: Sparkle,
    },
    {
      title: "الموظفين",
      href: "/employees",
      icon: Users,
    },
    {
      title: "أنواع الوقود",
      href: "/fuels",
      icon: FuelIcon,
    },
    {
      title: "الصيانة",
      href: "/maintenance",
      icon: Wrench,
    },
  ];

  return (
    <div className="w-[300px] sticky top-0 h-screen border-l p-5 flex flex-col gap-5">
      <div className="flex flex-col items-center justify-center gap-1.5 mt-5">
        <Image alt="Logo" src={"/images/Logo.png"} width={80} height={80} />
      </div>
      <UserNav />
      <Separator className="-mt-3" />

      <div className="flex flex-1 h-full flex-col w-full items-start justify-start gap-3">
        {pages.map((item) => {
          const isActive =
            item.href !== "/"
              ? pathname.startsWith(item.href)
              : pathname === item.href;
          return (
            <Link
              key={item.title}
              href={item.href}
              className={cn(
                "flex items-center justify-between gap-2 px-4 py-2 w-full bg-muted rounded-lg text-muted-foreground transition-all ease-in-out duration-300 hover:text-sidebar-primary-foreground",
                isActive ? "bg-primary text-sidebar-primary-foreground" : null
              )}
            >
              <div className="flex items-center gap-2">
                <item.icon className="w-5 h-5" />
                <p className="text-sm font-semibold">{item.title}</p>
              </div>

              {item.badge != null && item.badge > 0 && (
                <div className="flex items-center justify-center w-5 h-5 rounded-md bg-amber-500 text-black text-xs">
                  {item.badge}
                </div>
              )}
            </Link>
          );
        })}
      </div>

      <div className="mt-auto">
        <Link
          href="/logout"
          className="flex items-center justify-start gap-3 p-2"
        >
          <LogOut className="w-5 h-5" />
          <p className="text-xs font-semibold">تسجيل الخروج</p>
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
