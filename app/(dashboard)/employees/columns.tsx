"use client";

import { Button } from "@/components/ui/button";
import { Employee } from "@prisma/client";
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

export const columns: ColumnDef<Employee>[] = [
  {
    accessorKey: "id",
    header: "رقم الموظف",
    cell: ({ row }) => <Badge>{row.original.id}</Badge>,
  },
  {
    accessorKey: "name",
    header: "إسم الموظف",
  },
  {
    accessorKey: "phone",
    header: "رقم الهاتف",
    cell: ({ row }) => (
      <p style={{ direction: "ltr" }} className="text-center">
        {row.original.phone}
      </p>
    ),
  },
  {
    accessorKey: "email",
    header: "البريد الإلكتروني",
  },
  {
    accessorKey: "team",
    header: "الفريق",
  },
  {
    accessorKey: "major",
    header: "التخصص",
  },
  {
    accessorKey: "startDate",
    header: "تاريخ التعيين",
    cell: ({ row }) =>
      format(
        new Date(row.original.startDate ? row.original.startDate : "no date"),
        "yyyy-MM-dd"
      ),
  },
  {
    accessorKey: "quota",
    header: "الحصة الشهرية",
    cell: ({ row }) => <Badge>{row.original.quota}</Badge>,
  },
  {
    accessorKey: "initialQuota",
    header: "الحصة الافتراضية",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const router = useRouter();

      const mutation = useMutation({
        mutationKey: ["employees"],
        mutationFn: async () => {
          await axios.delete(`/api/employees/${row.original.id}`);
        },
        onMutate: () => {
          toast.loading("جاري حذف الموظف...", { id: "delete-employee" });
        },
        onError: (error) => {
          toast.error("حدث خطأ أثناء حذف الموظف", { id: "delete-employee" });
        },
        onSuccess: () => {
          toast.success("تم حذف الموظف بنجاح", { id: "delete-employee" });
        },
        onSettled: () => {
          queryClient.invalidateQueries({ queryKey: ["employees"] });
        },
      });
      return (
        <div className="flex items-center justify-end gap-2 ml-2">
          <Button
            onClick={() => router.push(`/employees/${row.original.id}`)}
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
