"use client";

import { Button } from "@/components/ui/button";
import { Prisma } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Edit, Printer, Trash2 } from "lucide-react";
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
import { cn, formatLitre } from "@/lib/utils";

export const columns: ColumnDef<
  Prisma.TransactionGetPayload<{
    include: { employee: true; tank: true; car: true };
  }>
>[] = [
  {
    accessorKey: "id",
    header: "رقم العملية",
    cell: ({ row }) => <Badge>{row.original.id}</Badge>,
  },
  {
    id: "tank",
    header: "الخزان",
    cell: ({ row }) => row.original.tank.name,
  },
  {
    id: "employee",
    header: "الموظف",
    cell: ({ row }) => row.original.employee.name,
  },
  {
    id: "car",
    header: "المركبة",
    cell: ({ row }) => row.original.car.carModel,
  },
  {
    id: "plate",
    header: "رقم اللوحة",
    cell: ({ row }) => row.original.car.plate,
  },
  {
    accessorKey: "amount",
    header: "الكمية",
    cell: ({ row }) => (
      <Badge>
        {formatLitre(row.original.amount ? row.original.amount : 0)}
      </Badge>
    ),
  },
  {
    accessorKey: "created",
    header: "تاريخ العملية",
    cell: ({ row }) => (
      <Badge>{format(new Date(row.original.created), "yyyy-MM-dd")}</Badge>
    ),
  },
  {
    accessorKey: "status",
    header: "حالة العملية",
    cell: ({ row }) => {
      const statusColor =
        row.original.status == "معلق"
          ? "bg-amber-500"
          : row.original.status == "مكتمل"
          ? "bg-teal-500"
          : "bg-rose-500";
      return (
        <Badge className={cn("text-white", statusColor)}>
          {row.original.status}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const router = useRouter();

      const mutation = useMutation({
        mutationKey: ["transactions"],
        mutationFn: async () => {
          await axios.delete(`/api/transactions/${row.original.id}`);
        },
        onMutate: () => {
          toast.loading("جاري حذف البيانات...", { id: "delete-transactions" });
        },
        onError: (error) => {
          toast.error("حدث خطأ أثناء حذف البيانات", {
            id: "delete-transactions",
          });
        },
        onSuccess: () => {
          toast.success("تم حذف البيانات بنجاح", { id: "delete-transactions" });
        },
        onSettled: () => {
          queryClient.invalidateQueries({
            queryKey: ["transactions", "transactions-pending"],
          });
        },
      });

      const handlePrintReciept = () => {
        const transaction = row.original;
        const printWindow = window.open("", "_blank");

        const receiptContent = `
        <html>
        <head>
        <title>إيصال عملية وقود</title>
        <style>
        body {
        font-family: 'Arial', sans-serif;
        direction: rtl;
        }
        <body>
        <div></div>
        <div>
        <table>
        <tr>
        <td>رقم العملية</td>
        <td>${transaction.id}</td>
        </tr>
        </table>
        </div>
        </body>
        </head>
        </html>
  `;

        // Write the content to the new window
        printWindow?.document.write(receiptContent);
        printWindow?.document.close();

        // Trigger the print dialog
        printWindow?.print();
      };

      return (
        <div className="flex items-center justify-end gap-2 ml-2">
          <Button variant={"outline"} size={"sm"} onClick={handlePrintReciept}>
            <Printer />
            طباعة
          </Button>
          <Button
            onClick={() => router.push(`/transactions/${row.original.id}`)}
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
