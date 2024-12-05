"use client";

import { queryClient } from "@/app/(dashboard)/layout";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { FC } from "react";
import toast from "react-hot-toast";
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
import { Button } from "./ui/button";
import { Trash2 } from "lucide-react";

interface FormHeadingProps {
  title: string;
  subTitle: string;
  action: string;
  id: string | null;
}

const FormHeading: FC<FormHeadingProps> = ({ title, subTitle, action, id }) => {
  const router = useRouter();

  const mutation = useMutation({
    mutationKey: [action],
    mutationFn: async () => {
      await axios.delete(`/api/${action}/${id}`);
    },
    onMutate: () => {
      toast.loading("جاري حذف البيانات...", { id: "delete" });
    },
    onError: (error) => {
      toast.error("حدث خطأ أثناء حذف البيانات", { id: "delete" });
    },
    onSuccess: () => {
      toast.success("تم حذف البيانات بنجاح", { id: "delete" });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [action] });
      router.push(`/${action}`);
    },
  });
  return (
    <div className="w-full flex items-center justify-between">
      <div className="flex flex-col items-start justify-start gap-1.5">
        <h1 className="text-2xl font-semibold">{title}</h1>
        <p className="text-sm text-muted-foreground">{subTitle}</p>
      </div>

      {id !== null && (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive">
              <Trash2 />
              حذف البيانات
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
      )}
    </div>
  );
};

export default FormHeading;
