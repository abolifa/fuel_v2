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
import { Employee } from "@prisma/client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";

const formSchema = z.object({
  name: z.string().min(2).max(50),
});

const Page = () => {
  const { id } = useParams();
  const [data, setData] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      if (id !== "new") {
        try {
          const { data } = await axios.get(`/api/fuels/${id}`);
          if (data.startDate) {
            data.startDate = new Date(data.startDate);
          }
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
        axios.put(`/api/fuels/${id}`, values).then(() => {
          setLoading(false);
        });
        toast.success("تم تحديث البيانات بنجاح");
        router.push("/fuels");
      } else {
        axios.post(`/api/fuels/`, values).then(() => {
          setLoading(false);
        });
        toast.success("تم إضافة البيانات بنجاح");
        router.push("/fuels");
      }
    } catch (error) {
      console.error(error);
      toast.error("حدث خطأ ما");
    }
  }

  return (
    <div className="space-y-4">
      <FormHeading
        title="تعديل بيانات الوقود"
        subTitle="إدارة بيانات الوقود في النظام"
        action="fuels"
        id={data ? data.id : null}
      />
      <Separator />

      <div className="p-10">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-2">
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