"use client";

import { Button } from "@/components/ui/button";
import { Fuel, User } from "@prisma/client";
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

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "id",
    header: "رقم المستخدم",
    cell: ({ row }) => <Badge>{row.original.id}</Badge>,
  },
  {
    accessorKey: "name",
    header: "الإسم",
  },
  {
    accessorKey: "username",
    header: "إسم المستخدم",
  },
  {
    accessorKey: "email",
    header: "البريد الإلكتروني",
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
        mutationKey: ["users"],
        mutationFn: async () => {
          await axios.delete(`/api/users/${row.original.id}`);
        },
        onMutate: () => {
          toast.loading("جاري حذف البيانات...", { id: "delete-user" });
        },
        onError: (error) => {
          toast.error("حدث خطأ أثناء حذف البيانات", { id: "delete-user" });
        },
        onSuccess: () => {
          toast.success("تم حذف البيانات بنجاح", { id: "delete-user" });
        },
        onSettled: () => {
          queryClient.invalidateQueries({ queryKey: ["users"] });
        },
      });
      return (
        <div className="flex items-center justify-end gap-2 ml-2">
          <Button
            onClick={() => router.push(`/users/${row.original.id}`)}
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
