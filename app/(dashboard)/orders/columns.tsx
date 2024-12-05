"use client";

import { Button } from "@/components/ui/button";
import { Prisma } from "@prisma/client";
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
import { formatLitre } from "@/lib/utils";

export const columns: ColumnDef<
  Prisma.OrderGetPayload<{ include: { fuel: true; tank: true } }>
>[] = [
  {
    accessorKey: "number",
    header: "رقم الطلب",
  },
  {
    accessorKey: "tankId",
    header: "الخزان",
    cell: ({ row }) => <p>{row.original.tank?.name}</p>,
  },
  {
    accessorKey: "amount",
    header: "الكمية",
    cell: ({ row }) => <p>{formatLitre(row.original.amount)}</p>,
  },
  {
    accessorKey: "fuelId",
    header: "الوقود",
    cell: ({ row }) => <p>{row.original.fuel?.name}</p>,
  },
  {
    accessorKey: "created",
    header: "تاريخ الطلب",
    cell: ({ row }) => format(new Date(row.original.created), "yyyy-MM-dd"),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const router = useRouter();

      const mutation = useMutation({
        mutationKey: ["orders"],
        mutationFn: async () => {
          await axios.delete(`/api/orders/${row.original.id}`);
        },
        onMutate: () => {
          toast.loading("جاري حذف البيانات...", { id: "delete-orders" });
        },
        onError: (error) => {
          toast.error("حدث خطأ أثناء حذف البيانات", { id: "delete-orders" });
        },
        onSuccess: () => {
          toast.success("تم حذف البيانات بنجاح", { id: "delete-orders" });
        },
        onSettled: () => {
          queryClient.invalidateQueries({ queryKey: ["orders"] });
        },
      });
      return (
        <div className="flex items-center justify-end gap-2 ml-2">
          <Button
            onClick={() => router.push(`/orders/${row.original.id}`)}
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
