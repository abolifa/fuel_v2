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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { arSA, se } from "date-fns/locale";
import {
  PhoneInput,
  defaultCountries,
  parseCountry,
} from "react-international-phone";
import "react-international-phone/style.css";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Employee } from "@prisma/client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { majorvalue, teamvalue } from "@/constant/enums";
import CarForm from "@/components/cars/CarForm";
import CarTable from "@/components/cars/CarTable";

const formSchema = z.object({
  name: z.string().min(2).max(50),
  phone: z.string().min(10).max(15),
  email: z.string().email(),
  team: z.string(),
  major: z.string(),
  startDate: z.date(),
  address: z.string(),
  quota: z.number().int().positive(),
  initialQuota: z.number().int().positive(),
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
      phone: "",
      email: "",
      team: "",
      major: "",
      startDate: new Date(),
      address: "",
      quota: 200,
      initialQuota: 200,
    },
  });

  const countries = defaultCountries.filter((country) => {
    const { iso2 } = parseCountry(country);
    return ["ly"].includes(iso2);
  });

  useEffect(() => {
    const fetchData = async () => {
      if (id !== "new") {
        try {
          const { data } = await axios.get(`/api/employees/${id}`);
          if (data.startDate) {
            data.startDate = new Date(data.startDate);
          }
          setData(data);
          form.reset(data);
        } catch (error) {
          console.error("Error fetching employee data:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };
    fetchData();
  }, [form.reset, id]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setLoading(true);
      if (data) {
        await axios.put(`/api/employees/${id}`, values).then(() => {
          setLoading(false);
        });
        toast.success("تم تحديث الموظف بنجاح");
        router.push(`/employees/${data.id}`);
      } else {
        const response = await axios.post(`/api/employees`, values);
        const newEmployee = response.data;
        toast.success("تم إضافة الموظف بنجاح");
        router.push(`/employees/${newEmployee.id}`);
      }
    } catch (error) {
      console.error(error);
      toast.error("حدث خطأ ما");
    }
  }

  return (
    <div className="space-y-4">
      <FormHeading
        title="تعديل الموظف"
        subTitle="إدارة بيانات الموظف"
        action="employees"
        id={data ? data.id : null}
      />
      <Separator />

      <div className="p-10">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
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
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>عنوان الموظف</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={loading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col justify-center mt-2">
                    <FormLabel>تاريخ التعيين</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            disabled={loading}
                            variant={"outline"}
                            className={cn(
                              "w-full pr-3 text-right font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP", { locale: arSA })
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="mr-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>رقم الهاتف</FormLabel>
                    <FormControl>
                      <PhoneInput
                        disabled={loading}
                        defaultCountry="ly"
                        countries={countries}
                        value={field.value}
                        onChange={field.onChange}
                        className="w-full border rounded-md !bg-transparent"
                        inputClassName="!bg-transparent !text-primary w-full !border-none"
                        inputStyle={{
                          direction: "ltr",
                        }}
                        countrySelectorStyleProps={{
                          className: "!bg-transparent",
                          buttonClassName: "!bg-transparent !px-5 !border-none",
                        }}
                        style={{
                          direction: "ltr",
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="team"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>الفريق</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger disabled={loading}>
                          <SelectValue placeholder="اختر الفريق" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {teamvalue.map((item) => (
                          <SelectItem key={item.id} value={item.name}>
                            <div className="flex items-center gap-2">
                              <item.icon className="w-4 h-4" />
                              <span>{item.name}</span>
                            </div>
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
                name="major"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>التخصص</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger disabled={loading}>
                          <SelectValue placeholder="اختر التخصص" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {majorvalue.map((item) => (
                          <SelectItem key={item.id} value={item.name}>
                            <div className="flex items-center gap-2">
                              <item.icon className="w-4 h-4" />
                              <span>{item.name}</span>
                            </div>
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
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>البريد الإلكتروني</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={loading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="quota"
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

              {id === "new" && (
                <FormField
                  control={form.control}
                  name="initialQuota"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>الحصة الافتراضية</FormLabel>
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
              )}
            </div>
            <Button type="submit" disabled={loading} className="w-32">
              حفظ
            </Button>
          </form>
        </Form>

        <Separator className="my-4" />

        {data && (
          <div className="mt-8 flex flex-col gap-8">
            <CarForm employeeId={data.id} />
            <CarTable employeeId={data.id} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
