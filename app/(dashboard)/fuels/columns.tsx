"use client";

import { Button } from "@/components/ui/button";
import { Fuel } from "@prisma/client";
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

export const columns: ColumnDef<Fuel>[] = [
  {
    accessorKey: "id",
    header: "رقم الوقود",
    cell: ({ row }) => <Badge>{row.original.id}</Badge>,
  },
  {
    accessorKey: "name",
    header: "إسم الوقود",
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
        mutationKey: ["fuels"],
        mutationFn: async () => {
          await axios.delete(`/api/fuels/${row.original.id}`);
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
          queryClient.invalidateQueries({ queryKey: ["fuels"] });
        },
      });
      return (
        <div className="flex items-center justify-end gap-2 ml-2">
          <Button
            onClick={() => router.push(`/fuels/${row.original.id}`)}
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