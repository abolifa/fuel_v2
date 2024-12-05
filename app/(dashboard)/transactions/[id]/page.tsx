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
import FormHeading from "@/components/FormHeading";
import { Separator } from "@/components/ui/separator";
import { Car, Prisma, Tank, Transaction } from "@prisma/client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import SearchableCombobox from "@/components/ComboSearchField";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import toast from "react-hot-toast";

const formSchema = z.object({
  tankId: z.string().nonempty("الرجاء إختيار خزان صالح"),
  employeeId: z.string().nonempty("الرجاء إختيار موظف صالح"),
  carId: z.string().nonempty("الرجاء إختيار مركبة صالحة"),
  amount: z.number().positive("الكمية يجب أن تكون أكبر من صفر"),
  status: z.string().optional(),
});

const Page = () => {
  const { id } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [transactionData, setTransactionData] = useState<Transaction | null>(
    null
  );
  const [data, setData] = useState<{
    tanks: Tank[];
    employees: Prisma.EmployeeGetPayload<{ include: { Car: true } }>[];
    cars: Car[];
  }>({ tanks: [], employees: [], cars: [] });

  const [filteredCars, setFilteredCars] = useState<Car[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tankId: "",
      employeeId: "",
      carId: "",
      // @ts-ignore
      amount: "",
      status: "معلق",
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get("/api/data");
        setData(response.data);

        if (id !== "new") {
          const existingTransaction = await axios.get(
            `/api/transactions/${id}`
          );
          form.reset(existingTransaction.data);
          setTransactionData(existingTransaction.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [form.reset, id]);

  useEffect(() => {
    const employeeId = form.watch("employeeId");
    const selectedEmployee = data.employees.find(
      (employee) => employee.id === employeeId
    );
    setFilteredCars(selectedEmployee?.Car || []);
  }, [form.watch("employeeId"), data.employees]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    const tank = data.tanks.find((tank) => tank.id === values.tankId);
    const employee = data.employees.find(
      (employee) => employee.id === values.employeeId
    );

    if (!tank || !employee) {
      toast.error("الرجاء إختيار خزان وموظف صالحين");
      return;
    }

    if (values.amount > tank.currentLevel) {
      toast.error("الخزان لا يكفي لهذه العملية");
      return;
    }

    const quota = employee.quota;

    if (quota && values.amount > quota) {
      // alert with yes and no
      if (
        !confirm("هذا الموظف قد تجاوز الحصة المسموحة له، هل تريد المتابعة؟")
      ) {
        return;
      }
    }

    try {
      if (transactionData) {
        axios.put(`/api/transactions/${id}`, values);
        toast.success("تم تحديث البيانات بنجاح");
        router.push("/transactions");
      } else {
        axios.post(`/api/transactions`, values);
        toast.success("تم إضافة البيانات بنجاح");
        router.push("/transactions");
      }
    } catch (error) {
      console.error(error);
      toast.error("حدث خطأ ما");
    }
  }

  return (
    <div className="space-y-4">
      <FormHeading
        title="معاملة وقود"
        subTitle="إدارة معاملات الوقود"
        action="orders"
        id={null}
      />
      <Separator />

      <div className="p-10">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 gap-5 max-w-4xl">
              <FormField
                control={form.control}
                name="tankId"
                render={({ field }) => (
                  <SearchableCombobox
                    label="الخزان"
                    options={data.tanks}
                    field={field}
                    loading={loading}
                    getOptionLabel={(tank) => tank.name}
                    getOptionValue={(tank) => tank.id}
                  />
                )}
              />

              <FormField
                control={form.control}
                name="employeeId"
                render={({ field }) => (
                  <SearchableCombobox
                    label="الموظف"
                    options={data.employees}
                    field={field}
                    loading={loading}
                    getOptionLabel={(employee) => employee.name}
                    getOptionValue={(employee) => employee.id}
                  />
                )}
              />

              <FormField
                control={form.control}
                name="carId"
                render={({ field }) => (
                  <SearchableCombobox
                    label="المركبة"
                    options={filteredCars}
                    field={field}
                    loading={loading}
                    getOptionLabel={(car) =>
                      car ? car.carModel : "مركبة غير معروفة"
                    }
                    getOptionValue={(car) => car.id}
                  />
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

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>الحالة</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger disabled={loading}>
                          <SelectValue placeholder="إختر الحالة" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="معلق">معلق</SelectItem>
                        <SelectItem value="موافق">موافق</SelectItem>
                        <SelectItem value="مكتمل">مكتمل</SelectItem>
                        <SelectItem value="مرفوض">مرفوض</SelectItem>
                      </SelectContent>
                    </Select>
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
