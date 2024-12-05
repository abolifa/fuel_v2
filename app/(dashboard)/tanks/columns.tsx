"use client";

import { Button } from "@/components/ui/button";
import { Prisma, Tank } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Edit, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
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
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import { queryClient } from "../layout";
import { Badge } from "@/components/ui/badge";

export const columns: ColumnDef<
  Prisma.TankGetPayload<{ include: { fuel: true } }>
>[] = [
  {
    accessorKey: "id",
    header: "رقم الخزان",
    cell: ({ row }) => <Badge>{row.original.id}</Badge>,
  },
  {
    accessorKey: "name",
    header: "إسم الخزان",
  },
  {
    accessorKey: "fuelId",
    header: "نوع الوقود",
    cell: ({ row }) => <Badge>{row.original.fuel.name}</Badge>,
  },
  {
    accessorKey: "created",
    header: "تاريخ الإنشاء",
    cell: ({ row }) => format(new Date(row.original.created), "yyyy-MM-dd"),
  },
  {
    accessorKey: "capacity",
    header: "السعة",
    cell: ({ row }) => <Badge>{row.original.capacity}</Badge>,
  },
  {
    accessorKey: "currentLevel",
    header: "المستوى الحالي",
    cell: ({ row }) => <Badge>{row.original.currentLevel}</Badge>,
  },
  {
    accessorKey: "updated",
    header: "آخر التحديث",
    cell: ({ row }) => format(new Date(row.original.updated), "yyyy-MM-dd"),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const router = useRouter();

      const mutation = useMutation({
        mutationKey: ["tanks"],
        mutationFn: async () => {
          await axios.delete(`/api/tanks/${row.original.id}`);
        },
        onMutate: () => {
          toast.loading("جاري حذف البيانات...", { id: "delete-fuel" });
        },
        onError: (error) => {
          toast.error("حدث خطأ أثناء حذف البيانات", { id: "delete-fuel" });
        },
        onSuccess: () => {
          toast.success("تم حذف البيانات بنجاح", { id: "delete-fuel" });
        },
        onSettled: () => {
          queryClient.invalidateQueries({ queryKey: ["tanks"] });
        },
      });
      return (
        <div className="flex items-center justify-end gap-2 ml-2">
          <Button
            onClick={() => router.push(`/tanks/${row.original.id}`)}
            size={"sm"}
            variant={"outline"}
          >
            <Edit />
            تعديل
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size={"sm"}>
                <Trash2 />
                حذف
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>هل أنت متأكد؟</AlertDialogTitle>
                <AlertDialogDescription>
                  أنت على وشك حذف بيانات من النظام، هذا الإجراء لا يمكن التراجع
                  عنه.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="gap-2">
                <AlertDialogCancel>إلغاء</AlertDialogCancel>
                <AlertDialogAction onClick={() => mutation.mutate()}>
                  إستمرار
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      );
    },
  },
];
