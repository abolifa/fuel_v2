"use client";

import { number, z } from "zod";
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
import { Fuel, Order, Tank } from "@prisma/client";
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
import SearchableCombobox from "@/components/ComboSearchField";

const formSchema = z.object({
  number: z.string().optional(),
  tankId: z.string().min(1),
  fuelId: z.string().min(1),
  amount: number().positive(),
});

const Page = () => {
  const { id } = useParams();
  const [data, setData] = useState<Order | null>(null);
  const [fuels, setFuels] = useState<Fuel[]>([]);
  const [tanks, setTanks] = useState<Tank[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      number: "",
      tankId: "",
      fuelId: "",
      // @ts-ignore
      amount: "",
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      await axios.get("/api/fuels").then((res) => {
        setFuels(res.data);
      });

      await axios.get("/api/tanks").then((res) => {
        setTanks(res.data);
      });

      if (id !== "new") {
        try {
          const { data } = await axios.get(`/api/orders/${id}`);
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
    const tank = tanks.find((tank) => tank.id === values.tankId);

    if (!tank) {
      toast.error("الرجاء إختيار خزان صالح");
      return;
    }

    if (tank.capacity - tank.currentLevel < values.amount) {
      toast.error("المكية المطلوبة أكبر مما يتسع له الخزان");
      return;
    }

    if (values.fuelId !== tank.fuelId) {
      toast.error(
        "نوع الوقود المختار لا يتطابق مع نوع الوقود المخزن في الخزان"
      );
      return;
    }

    try {
      setLoading(true);
      if (data) {
        axios.put(`/api/orders/${id}`, values).then(() => {
          setLoading(false);
        });
        toast.success("تم تحديث البيانات بنجاح");
        router.push("/orders");
      } else {
        axios.post(`/api/orders/`, values).then(() => {
          setLoading(false);
        });
        toast.success("تم إضافة البيانات بنجاح");
        router.push("/orders");
      }
    } catch (error) {
      console.error(error);
      toast.error("حدث خطأ ما");
    }
  }

  return (
    <div className="space-y-4">
      <FormHeading
        title="تعديل الطلبات"
        subTitle="إدارة بيانات الطلبات في النظام"
        action="orders"
        id={data ? data.id : null}
      />
      <Separator />

      <div className="p-10">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 gap-5 max-w-4xl">
              <FormField
                control={form.control}
                name="number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>الرقم الداخلي</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={loading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tankId"
                render={({ field }) => (
                  <SearchableCombobox
                    label="الخزان"
                    options={tanks} // Pass the tanks array here
                    field={field}
                    loading={loading} // Optional loading state
                    getOptionLabel={(tank) => tank.name} // Function to display the tank name
                    getOptionValue={(tank) => tank.id} // Function to get the tank ID
                  />
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
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>الكمية</FormLabel>
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
