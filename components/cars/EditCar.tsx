"use client";

import React, { useEffect, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { Car, Fuel } from "@prisma/client";
import toast from "react-hot-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { queryClient } from "@/app/(dashboard)/layout";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Switch } from "../ui/switch";

interface EditCarProps {
  employeeId: string;
  car: Car;
  open: boolean;
  onClose: () => void;
}

const formSchema = z.object({
  carModel: z
    .string()
    .min(2, "إسم المركبة يجب أن يحتوي على حرفين على الأقل")
    .max(50),
  fuelId: z.string().min(1, "يجب اختيار نوع الوقود"),
  plate: z.string().max(50).optional(),
  isEaaCar: z.boolean().optional(),
});

const EditCar: React.FC<EditCarProps> = ({
  employeeId,
  car,
  onClose,
  open,
}) => {
  const [fuels, setFuels] = useState<Fuel[]>([]);
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      carModel: "",
      fuelId: "",
      plate: "",
      isEaaCar: false,
    },
  });

  useEffect(() => {
    form.reset({
      carModel: car?.carModel,
      fuelId: car?.fuelId,
      plate: car?.plate as string,
      isEaaCar: car?.isEaaCar,
    });
    const fetchData = async () => {
      try {
        setLoading(true);
        const fuelsResponse = await axios.get("/api/fuels");
        setFuels(fuelsResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("حدث خطأ أثناء تحميل البيانات");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [employeeId, form, car]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await axios.put(`/api/cars/${employeeId}/${car?.id}`, values);
      toast.success("تم إضافة المركبة بنجاح");
      form.reset();
    } catch (error) {
      console.error("Error submitting the form:", error);
      toast.error("حدث خطأ أثناء تحديث المركبة");
    } finally {
      queryClient.invalidateQueries({ queryKey: ["cars"] });
      onClose();
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center">
            تعديل بيانات المركبة
          </DialogTitle>
          <DialogDescription className="text-center">
            يمكنك تعديل بيانات المركبة من هنا
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-5 p-5"
          >
            <FormField
              control={form.control}
              name="carModel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>إسم المركبة</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={loading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="fuelId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>نوع الوقود</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger disabled={loading}>
                        <SelectValue placeholder="إختر نوع الوقود" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {fuels.map((fuel) => (
                        <SelectItem key={fuel.id} value={fuel.id}>
                          {fuel.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="plate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>رقم اللوحة</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={loading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isEaaCar"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">ملكية للجهاز</FormLabel>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      style={{
                        direction: "ltr",
                      }}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button type="submit" disabled={loading}>
              حفظ التعديلات
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditCar;
