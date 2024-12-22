"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Image from "next/image";

// Form schema for dynamic validation
const formSchema = z.object({
  emailOrUsername: z
    .string()
    .nonempty("يجب إدخال البريد الإلكتروني أو اسم المستخدم")
    .refine(
      (value) =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ||
        /^[a-zA-Z0-9_]+$/.test(value),
      "يرجى إدخال بريد إلكتروني صالح أو اسم مستخدم صالح"
    ),
  password: z
    .string()
    .min(4, "كلمة المرور قصيرة جدًا")
    .max(50, "كلمة المرور طويلة جدًا"),
});

const Page = () => {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      emailOrUsername: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await axios.post("/api/auth/login", {
        emailOrUsername: values.emailOrUsername,
        password: values.password,
      });
      if (response.status === 200) {
        toast.success("تم تسجيل الدخول بنجاح");
        console.log(response.data);
        router.push("/");
      }
    } catch (error) {
      toast.error("حدث خطآ أثناء تسجيل الدخول");
    }
  }

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-blue-900">
      <div className="w-3/4 md:w-1/2 lg:w-1/3 xl:w-1/4 border py-10 px-5 rounded-lg space-y-5 bg-white dark:bg-muted">
        <div className="flex flex-col items-center justify-center gap-3 mb-10">
          <Image alt="Logo" src={"/images/Logo.png"} width={80} height={80} />
          <h1 className="text-xl font-bold">جهاز الطيران الإلكتروني</h1>
          <p>تسجيل الدخول</p>
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <FormField
              control={form.control}
              name="emailOrUsername"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>البريد الإلكتروني أو اسم المستخدم</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>كلمة المرور</FormLabel>
                  <FormControl>
                    <Input {...field} type="password" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full mt-5 font-bold">
              دخول
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Page;
