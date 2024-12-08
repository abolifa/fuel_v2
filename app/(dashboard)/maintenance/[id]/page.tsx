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
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import SearchableCombobox from "@/components/ComboSearchField";
import { Checkbox } from "@/components/ui/checkbox";
import { Car, MaintenanceType, Prisma } from "@prisma/client";

const formSchema = z.object({
  carId: z.string().nonempty("يجب اختيار المركبة"),
  description: z.string().min(2, "يجب إدخال وصف للصيانة").max(500),
  odoMeter: z.number().min(1, "يجب إدخال عداد صحيح").max(1000000),
  cost: z.number().optional(),
  types: z.array(z.string()).nonempty("يجب اختيار نوع الصيانة"),
});

const Page = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [customData, setCustomData] = useState<{
    cars: Car[];
    maintenanceTypes: MaintenanceType[];
  }>({
    cars: [],
    maintenanceTypes: [],
  });

  const [data, setData] = useState<Prisma.MaintenanceGetPayload<{
    include: { car: true; types: { include: { maintenance: true } } };
  }> | null>(null);
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      carId: "",
      description: "",
      odoMeter: 0,
      cost: 0,
      types: [],
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/api/custom`);
        console.log("Response data:", response.data);
        setCustomData(response.data);

        if (id !== "new") {
          const res = await axios.get(`/api/maintenance/${id}`);
          console.log("Data fetched:", res.data);

          form.reset({
            carId: res.data.carId,
            description: res.data.description,
            odoMeter: res.data.odoMeter,
            cost: res.data.cost,
            types: res.data.types.map((type) => type.maintenanceTypeId), // Ensure this maps to `maintenanceTypeId`
          });
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("فشل في تحميل البيانات");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, form.reset]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setLoading(true);
      if (id && id !== "new") {
        await axios.put(`/api/maintenance/${id}`, values);
        toast.success("تم تحديث البيانات بنجاح");
      } else {
        await axios.post(`/api/maintenance`, values);
        toast.success("تم إضافة البيانات بنجاح");
      }
      router.push("/maintenance");
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("حدث خطأ أثناء حفظ البيانات");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <FormHeading
        title={id === "new" ? "بطاقة صيانة جديدة" : "تعديل بطاقة الصيانة"}
        subTitle="إدارة بيانات صيانة المركبات"
        action="maintenance"
        id={data?.id ? data.id : null}
      />
      <Separator />

      <div className="p-10">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 gap-5 max-w-3xl">
              <FormField
                control={form.control}
                name="carId"
                render={({ field }) => (
                  <SearchableCombobox
                    label="المركبة"
                    options={customData.cars}
                    field={field}
                    loading={loading}
                    getOptionLabel={(option) => option.carModel}
                    getOptionValue={(option) => option.id}
                  />
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>الوصف</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="أدخل وصفًا للصيانة"
                        disabled={loading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="odoMeter"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>عداد السيارة</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        placeholder="أدخل قراءة العداد"
                        disabled={loading}
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
                name="cost"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>التكلفة</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        placeholder="أدخل التكلفة"
                        disabled={loading}
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
                name="types"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>أنواع الصيانة</FormLabel>
                    <div className="flex flex-wrap gap-5">
                      {customData?.maintenanceTypes?.map((item) => (
                        <div key={item.id} className="flex items-center gap-2">
                          <Checkbox
                            checked={field.value?.includes(item.id)} // Ensure the checkbox reflects selected types
                            onCheckedChange={(checked) => {
                              const newValue = checked
                                ? [...field.value, item.id] // Add the type ID if checked
                                : field.value.filter(
                                    (value) => value !== item.id
                                  ); // Remove the type ID if unchecked
                              field.onChange(newValue); // Update the field value
                            }}
                          />
                          <FormLabel>{item.name}</FormLabel>{" "}
                          {/* Display the maintenance type name */}
                        </div>
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit" disabled={loading} className="w-32">
              {loading ? "جاري الحفظ..." : "حفظ"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Page;
