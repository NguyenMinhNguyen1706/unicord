"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useRouter } from "next/navigation";
import { GraduationCap } from "lucide-react";

import { useModal } from "@/components/providers/modal-provider";
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

const formSchema = z.object({
  name: z.string().min(1, { message: "Tên Server không được để trống." }),
  imageUrl: z.string().optional(),
});

export const CreateServerModal = () => {
  const { isOpen, onClose, type } = useModal();
  const router = useRouter();

  const isModalOpen = isOpen && type === "createServer";

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", imageUrl: "" },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.post("/api/servers", values);
      form.reset();
      router.refresh();
      onClose();
    } catch (error) {
      console.log(error);
    }
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 text-foreground p-0 overflow-hidden border-0 shadow-2xl max-w-md">
        <div className="relative">
          <DialogHeader className="pt-8 px-6 space-y-3">
            <div className="flex items-center justify-center gap-2">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                Tạo Server Mới
              </DialogTitle>
            </div>
            <DialogDescription className="text-center text-slate-600 dark:text-slate-400 text-sm">
              Đặt tên và ảnh đại diện cho Server. Bạn có thể thay đổi sau.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 px-6 pb-8">
              <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="flex items-center justify-center pt-4">
                        <FileUpload endpoint="serverImage" value={field.value || ""} onChange={field.onChange} />
                      </div>
                    </FormControl>
                    <FormMessage className="text-xs text-red-500" />
                  </FormItem>
                )}
              />
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
                        className="border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 rounded-lg"
                        placeholder="Nhập tên Server"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs text-red-500" />
                  </FormItem>
                )}
              />
              <DialogFooter className="pt-4">
                <Button disabled={isLoading} variant="outline" onClick={handleClose} type="button">
                  Hủy
                </Button>
                <Button disabled={isLoading} className="bg-gradient-to-r from-primary to-accent text-white" type="submit">
                  {isLoading ? "Đang tạo..." : "Tạo Server"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
