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
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import UserNav from "./UserNav";
import { Separator } from "./ui/separator";

const pages = [
  {
    title: "الرئيسية",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    title: "الموظفين",
    href: "/employees",
    icon: Users,
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
    title: "المعاملات",
    href: "/transactions",
    icon: DollarSign,
  },
  {
    title: "التقارير",
    href: "/reports",
    icon: Sparkle,
  },
  {
    title: "أنواع الوقود",
    href: "/fuels",
    icon: FuelIcon,
  },
];

const Sidebar = () => {
  const router = useRouter();
  const pathname = usePathname();
  return (
    <div className="w-[250px] sticky top-0 h-screen border-l p-5 flex flex-col gap-10">
      <div className="flex items-center justify-start gap-2">
        <Image alt="Logo" src={"/images/Logo.png"} width={50} height={50} />
        <h1 className="text-xl font-black">إدارة الوقود</h1>
      </div>
      <UserNav />
      <Separator className="-mt-3" />

      <div className="flex flex-1 h-full flex-col w-full items-start justify-start gap-5 last:mt-auto">
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
                "flex items-center justify-start gap-3 p-2 text-muted-foreground",
                isActive ? "text-blue-500" : null
              )}
            >
              <item.icon className="w-5 h-5" />
              <p className="text-sm font-semibold">{item.title}</p>
            </Link>
          );
        })}
      </div>

      {/* Logout button at the bottom */}
      <div className="mt-auto">
        <Link
          href="/logout"
          className="flex items-center justify-start gap-3 p-2"
        >
          <LogOut className="w-5 h-5" />
          <p className="text-sm font-semibold">تسجيل الخروج</p>
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
