"use client";

import { cn } from "@/lib/utils";
import {
  DollarSign,
  FuelIcon,
  LayoutDashboard,
  LogOut,
  Receipt,
  Sparkle,
  UserCheck,
  Users,
  Wrench,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import UserNav from "./UserNav";
import { Separator } from "./ui/separator";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { Button } from "./ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import toast from "react-hot-toast";

const Sidebar = () => {
  const pathname = usePathname();

  const { data } = useQuery({
    queryKey: ["transactions"],
    queryFn: async () => {
      const { data } = await axios.get("/api/transactions/pending");
      return data as number;
    },
  });

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
      badge: data,
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
    // {
    //   title: "التقارير",
    //   href: "/reports",
    //   icon: Sparkle,
    // },
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
      title: "المستخدمين",
      href: "/users",
      icon: UserCheck,
    },
    {
      title: "الصيانة",
      href: "/maintenance",
      icon: Wrench,
    },
  ];

  const router = useRouter();

  async function handleLogout() {
    await axios.post("/api/auth/logout").then(() => {
      toast.success("تم تسجيل الخروج");
      router.push("/login");
    });
  }

  return (
    <div className="w-[300px] sticky top-0 h-screen border-l p-5 flex flex-col gap-5">
      <div className="flex flex-col items-center justify-center gap-1.5 mt-5">
        <Image alt="Logo" src={"/images/Logo.png"} width={90} height={90} />
        <h1 className="text-lg font-black">إدارة الوقود</h1>
      </div>

      <div className="flex flex-1 h-full flex-col w-full items-start justify-start gap-3 mt-5">
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
                "flex items-center justify-between gap-2 px-4 py-2 w-full bg-muted rounded-lg text-muted-foreground border transition-all ease-in-out duration-300 hover:text-sidebar-primary-foreground",
                isActive ? "bg-primary text-secondary" : null
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
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant={"ghost"} className="w-full">
              <LogOut className="w-5 h-5" />
              <p className="text-xs">تسجيل الخروج</p>
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>تسجيل الخروج؟</AlertDialogTitle>
              <AlertDialogDescription>هل أنت متأكد</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>رجوع</AlertDialogCancel>
              <AlertDialogAction onClick={handleLogout}>
                إستمرار
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default Sidebar;
