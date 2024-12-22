"use client";

import { Button } from "@/components/ui/button";
import { Prisma } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { ArrowUpDown, Edit, Trash2 } from "lucide-react";
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
  Prisma.MaintenanceGetPayload<{
    include: { car: true; types: { include: { maintenanceType: true } } };
  }>
>[] = [
  {
    accessorKey: "id",
    header: "رقم الصيانة",
    cell: ({ row }) => <Badge>{row.original.id}</Badge>,
  },
  {
    accessorKey: "car.carModel",
    header: "موديل السيارة",
    cell: ({ row }) => row.original.car?.carModel || "غير متوفر",
  },
  {
    accessorKey: "odoMeter",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          عداد المركبة
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => row.original.odoMeter || "غير متوفر",
  },
  {
    accessorKey: "types",
    header: "نوع الصيانة",
    cell: ({ row }) =>
      row.original.types.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {row.original.types.map((type) => (
            <Badge key={type.id}>{type.maintenanceType.name}</Badge>
          ))}
        </div>
      ) : (
        "غير متوفر"
      ),
  },
  {
    accessorKey: "cost",
    header: "التكلفة",
    cell: ({ row }) => `${row.original.cost?.toFixed(2) || "0"} ريال`,
  },
  {
    accessorKey: "created",
    header: "تاريخ الإنشاء",
    cell: ({ row }) => format(new Date(row.original.created), "yyyy-MM-dd"),
  },
  {
    accessorKey: "updated",
    header: "تاريخ التحديث",
    cell: ({ row }) => format(new Date(row.original.updated), "yyyy-MM-dd"),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const router = useRouter();

      const mutation = useMutation({
        mutationKey: ["maintenance"],
        mutationFn: async () => {
          await axios.delete(`/api/maintenance/${row.original.id}`);
        },
        onMutate: () => {
          toast.loading("جاري حذف البيانات...", { id: "delete-maintenance" });
        },
        onError: (error) => {
          toast.error("حدث خطأ أثناء حذف البيانات", {
            id: "delete-maintenance",
          });
        },
        onSuccess: () => {
          toast.success("تم حذف البيانات بنجاح", { id: "delete-maintenance" });
        },
        onSettled: () => {
          queryClient.invalidateQueries({ queryKey: ["maintenance"] });
        },
      });

      return (
        <div className="flex items-center justify-end gap-2 ml-2">
          <Button
            onClick={() => router.push(`/maintenance/${row.original.id}`)}
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
