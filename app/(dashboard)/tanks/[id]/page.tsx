"use client";

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
import FormHeading from "@/components/FormHeading";
import { Separator } from "@/components/ui/separator";
import { Employee, Fuel, Tank } from "@prisma/client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const formSchema = z
  .object({
    name: z
      .string()
      .min(2, "الاسم يجب أن يحتوي على حرفين على الأقل")
      .max(50, "الاسم يجب ألا يزيد عن 50 حرفًا"),
    capacity: z.number().min(1, "السعة يجب أن تكون على الأقل 1"),
    currentLevel: z.number().min(0, "المستوى الحالي يجب أن يكون على الأقل 0"),
    fuelId: z.string().min(1, "يجب تحديد نوع الوقود"),
  })
  .refine((data) => data.currentLevel <= data.capacity, {
    message: "المستوى الحالي يجب أن يكون أقل من أو يساوي السعة",
    path: ["currentLevel"],
  });

const Page = () => {
  const { id } = useParams();
  const [data, setData] = useState<Tank | null>(null);
  const [fuels, setFuels] = useState<Fuel[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      // @ts-ignore
      capacity: "",
      // @ts-ignore
      currentLevel: "",
      fuelId: "",
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      await axios.get("/api/fuels").then((res) => {
        setFuels(res.data);
      });

      if (id !== "new") {
        try {
          const { data } = await axios.get(`/api/tanks/${id}`);
          setData(data);
          form.reset(data);
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };
    fetchData();
  }, [form.reset, id]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setLoading(true);
      if (data) {
        axios.put(`/api/tanks/${id}`, values).then(() => {
          setLoading(false);
        });
        toast.success("تم تحديث البيانات بنجاح");
        router.push("/tanks");
      } else {
        axios.post(`/api/tanks/`, values).then(() => {
          setLoading(false);
        });
        toast.success("تم إضافة البيانات بنجاح");
        router.push("/tanks");
      }
    } catch (error) {
      console.error(error);
      toast.error("حدث خطأ ما");
    }
  }

  return (
    <div className="space-y-4">
      <FormHeading
        title="تعديل الخزان"
        subTitle="إدارة بيانات الخزان في النظام"
        action="tanks"
        id={data ? data.id : null}
      />
      <Separator />

      <div className="p-10">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>الإسم</FormLabel>
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
                name="capacity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>السعة</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={loading}
                        type="number"
                        onChange={(e) =>
                          field.onChange(Number(e.target.value) || 0)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="currentLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>المستوى الحالي</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={loading}
                        type="number"
                        onChange={(e) =>
                          field.onChange(Number(e.target.value) || 0)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit" disabled={loading} className="w-32">
              حفظ
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Page;
