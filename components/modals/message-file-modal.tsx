"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Paperclip } from "lucide-react";

import { useModal } from "@/components/providers/modal-provider";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/file-upload";

const formSchema = z.object({
  fileUrl: z.string().min(1, { message: "Vui lòng chọn file đính kèm." }),
});

export const MessageFileModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const router = useRouter();

  const isModalOpen = isOpen && type === "messageFile";
  const { apiUrl, query } = data;

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { fileUrl: "" },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const url = `${apiUrl}?${new URLSearchParams(query as Record<string, string>).toString()}`;
      await axios.post(url, { ...values, content: values.fileUrl });
      form.reset();
      router.refresh();
      handleClose();
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
        <div className="p-6">
          <DialogHeader className="space-y-3 mb-4">
            <div className="flex items-center justify-center">
              <div className="h-12 w-12 rounded-full bg-violet-500/10 flex items-center justify-center">
                <Paperclip className="h-6 w-6 text-violet-500" />
              </div>
            </div>
            <DialogTitle className="text-xl font-bold text-center text-slate-800 dark:text-white">
              Gửi File Đính Kèm
            </DialogTitle>
            <DialogDescription className="text-center text-slate-600 dark:text-slate-400 text-sm">
              Gửi một file dưới dạng tin nhắn.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="fileUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="flex items-center justify-center">
                        <FileUpload endpoint="messageFile" value={field.value} onChange={field.onChange} />
                      </div>
                    </FormControl>
                    <FormMessage className="text-xs text-red-500" />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button disabled={isLoading} variant="outline" onClick={handleClose} type="button">Hủy</Button>
                <Button disabled={isLoading} className="bg-gradient-to-r from-primary to-accent text-white" type="submit">
                  {isLoading ? "Đang gửi..." : "Gửi"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
