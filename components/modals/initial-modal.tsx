"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { GraduationCap } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/file-upload";

// Định nghĩa quy tắc kiểm tra dữ liệu
const formSchema = z.object({
  name: z.string().min(1, {
    message: "Tên Server không được để trống.",
  }),
  imageUrl: z.string().optional()
});

export const InitialModal = () => {
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  // Fix lỗi Hydration của Next.js
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      imageUrl: "",
    }
  });

  const isLoading = form.formState.isSubmitting;

  // Hàm xử lý gửi dữ liệu lên Server
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.post("/api/servers", values);

      form.reset();
      router.refresh();
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  }

  if (!isMounted) {
    return null;
  }

  return (
    <Dialog open>
      <DialogContent className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 text-foreground p-0 overflow-hidden border-0 shadow-2xl max-w-md">
        {/* Decorative background */}
        <div className="absolute inset-0 bg-grid-small-black/5 dark:bg-grid-small-white/5 pointer-events-none" />
        
        <div className="relative">
          <DialogHeader className="pt-10 px-8 space-y-4">
            <div className="flex items-center justify-center gap-2">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <DialogTitle className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                Tạo Server Lớp Học
              </DialogTitle>
            </div>
            <DialogDescription className="text-center text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
              UniCord sẽ tự động tạo các kênh mặc định cho lớp học: #thông-báo, #bài-tập, #tài-liệu, #hỏi-đáp và phòng học nhóm.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 px-8 pb-10">
              {/* Image Upload Section */}
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                        Ảnh Đại Diện Server
                      </FormLabel>
                      <FormControl>
                        <div className="flex flex-col items-center justify-center gap-4">
                          <div className="rounded-2xl overflow-hidden bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-800 dark:to-slate-700 p-4">
                            <FileUpload
                              endpoint="serverImage"
                              value={field.value || ""}
                              onChange={field.onChange}
                            />
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage className="text-xs text-red-500" />
                    </FormItem>
                  )}
                />
              </div>

              {/* Server Name Section */}
              <div className="space-y-3">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                        Tên Server
                      </FormLabel>
                      <FormControl>
                        <Input
                          disabled={isLoading}
                          className="border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 text-black dark:text-white placeholder-slate-400 focus:border-primary focus:ring-primary/50 rounded-lg transition-all duration-200 font-medium"
                          placeholder="Nhập tên Server của bạn"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-xs text-red-500" />
                    </FormItem>
                  )}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-6">
                <Button
                  disabled={isLoading}
                  variant="outline"
                  className="flex-1 rounded-lg border-2 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors duration-200"
                  type="button"
                  onClick={() => form.reset()}
                >
                  Hủy
                </Button>
                <Button
                  disabled={isLoading}
                  className="flex-1 rounded-lg bg-gradient-to-r from-primary to-accent hover:shadow-lg hover:shadow-primary/30 text-white font-semibold transition-all duration-200"
                  type="submit"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                      Đang tạo...
                    </div>
                  ) : (
                    "Tạo Server"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}