"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Hash, Mic, Video, Settings } from "lucide-react";

import { useModal } from "@/components/providers/modal-provider";
import { ChannelType } from "@/enums";
import {
  Dialog,
  DialogContent,
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
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const formSchema = z.object({
  name: z.string().min(1, { message: "Tên kênh không được để trống." })
    .refine((name) => name !== "general" && name !== "thông-báo", {
      message: "Tên kênh không được đặt là 'general' hoặc 'thông-báo'.",
    }),
  type: z.string().default(ChannelType.TEXT),
});

const channelTypeOptions = [
  { value: ChannelType.TEXT, label: "Kênh Văn Bản", icon: Hash },
  { value: ChannelType.AUDIO, label: "Phòng Thoại", icon: Mic },
  { value: ChannelType.VIDEO, label: "Kênh Video", icon: Video },
];

export const EditChannelModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const router = useRouter();

  const isModalOpen = isOpen && type === "editChannel";
  const { channel, server } = data;

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", type: ChannelType.TEXT },
  });

  useEffect(() => {
    if (channel) {
      form.setValue("name", channel.name);
      form.setValue("type", channel.type);
    }
  }, [channel, form]);

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/channels/${channel?.id}?serverId=${server?.id}`, values);
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
              <Settings className="h-5 w-5 text-violet-500" />
              <DialogTitle className="text-2xl font-bold text-slate-800 dark:text-white">
                Chỉnh Sửa Kênh
              </DialogTitle>
            </div>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 px-6 pb-8">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-slate-700 dark:text-slate-300">Loại kênh</FormLabel>
                    <FormControl>
                      <div className="flex gap-2">
                        {channelTypeOptions.map((option) => {
                          const Icon = option.icon;
                          const isSelected = field.value === option.value;
                          return (
                            <button
                              key={option.value}
                              type="button"
                              onClick={() => field.onChange(option.value)}
                              className={`flex-1 flex items-center justify-center gap-2 p-2.5 rounded-lg border-2 transition-all text-sm ${
                                isSelected
                                  ? "border-violet-500 bg-violet-50 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400"
                                  : "border-slate-200 dark:border-slate-700 text-slate-500"
                              }`}
                            >
                              <Icon className="h-4 w-4" />
                              {option.label}
                            </button>
                          );
                        })}
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-slate-700 dark:text-slate-300">Tên kênh</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        className="border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 rounded-lg"
                        placeholder="tên-kênh"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs text-red-500" />
                  </FormItem>
                )}
              />
              <DialogFooter className="pt-4">
                <Button disabled={isLoading} variant="outline" onClick={handleClose} type="button">Hủy</Button>
                <Button disabled={isLoading} className="bg-gradient-to-r from-primary to-accent text-white" type="submit">
                  {isLoading ? "Đang lưu..." : "Lưu thay đổi"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
