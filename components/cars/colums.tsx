"use client";

import { Button } from "@/components/ui/button";
import { Prisma } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { Edit, Trash2 } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
import { queryClient } from "@/app/(dashboard)/layout";
import EditCar from "./EditCar";
import { useState } from "react";

export const columns: ColumnDef<
  Prisma.CarGetPayload<{ include: { fuel: true; employee: true } }>
>[] = [
  {
    accessorKey: "carModel",
    header: "إسم المركبة",
  },
  {
    accessorKey: "fuelId",
    header: "نوع الوقود",
    cell: ({ row }) => {
      const fuel = row.original.fuel.name;
      return <Badge>{fuel}</Badge>;
    },
  },
  {
    accessorKey: "plate",
    header: "رقم اللوحة",
  },
  {
    accessorKey: "isEaaCar",
    header: "الملكية",
    cell: ({ row }) => {
      const isEaaCar = row.original.isEaaCar;
      return isEaaCar ? <Badge>الجهاز</Badge> : <Badge>الموظف</Badge>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const [open, setOpen] = useState(false);

      const handleOpen = () => {
        setOpen(true);
      };

      const handleClose = () => {
        setOpen(false);
      };

      const mutation = useMutation({
        mutationKey: ["cars"],
        mutationFn: async () => {
          await axios.delete(
            `/api/cars/${row.original.employeeId}/${row.original.id}`
          );
        },
        onMutate: () => {
          toast.loading("جاري حذف البيانات...", { id: "delete-car" });
        },
        onError: () => {
          toast.error("حدث خطأ أثناء حذف البيانات", { id: "delete-car" });
        },
        onSuccess: () => {
          toast.success("تم حذف البيانات بنجاح", { id: "delete-car" });
        },
        onSettled: () => {
          queryClient.invalidateQueries({ queryKey: ["cars"] });
        },
      });
      return (
        <div className="flex items-center justify-end gap-2 ml-2">
          <Button onClick={handleOpen} size={"sm"} variant={"outline"}>
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

          <EditCar
            open={open}
            onClose={handleClose}
            car={row.original}
            employeeId={row.original.employee.id}
          />
        </div>
      );
    },
  },
];
