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
import { Switch } from "../ui/switch";

interface CarFormProps {
  employeeId: string;
}

const formSchema = z.object({
  carModel: z
    .string()
    .min(2, "إسم المركبة يجب أن يحتوي على حرفين على الأقل")
    .max(50),
  fuelId: z.string().min(1, "يجب اختيار نوع الوقود"),
  plate: z
    .string()
    .min(2, "رقم اللوحة يجب أن يحتوي على حرفين على الأقل")
    .max(50),
  isEaaCar: z.boolean().optional(),
});

const CarForm: React.FC<CarFormProps> = ({ employeeId }) => {
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
  }, [employeeId, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await axios.post(`/api/cars/${employeeId}`, values);
      toast.success("تم إضافة المركبة بنجاح");
      queryClient.invalidateQueries({ queryKey: ["cars"] });
      form.reset();
    } catch (error) {
      console.error("Error submitting the form:", error);
      toast.error("حدث خطأ أثناء تحديث المركبة");
    }
  }

  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex items-start justify-start gap-3"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 w-full flex-1">
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
                <FormItem className="flex items-center gap-3 mt-7 border rounded-md px-3 justify-between">
                  <FormLabel className="text-xs">ملكية للجهاز</FormLabel>
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
          </div>
          <Button
            type="submit"
            className="mt-8 max-w-32 w-32"
            disabled={loading}
          >
            إضافة
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default CarForm;
