"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { Hash, Mic, Video } from "lucide-react";

import { useModal } from "@/components/providers/modal-provider";
import { ChannelType } from "@/enums";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
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
  { value: ChannelType.TEXT, label: "Kênh Văn Bản", icon: Hash, desc: "Gửi tin nhắn, ảnh, và file" },
  { value: ChannelType.AUDIO, label: "Phòng Thoại", icon: Mic, desc: "Họp nhóm bằng giọng nói" },
  { value: ChannelType.VIDEO, label: "Kênh Video", icon: Video, desc: "Học trực tuyến với camera" },
];

export const CreateChannelModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const router = useRouter();
  const params = useParams();

  const isModalOpen = isOpen && type === "createChannel";

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", type: ChannelType.TEXT },
  });

  useEffect(() => {
    if (data.channelType) {
      form.setValue("type", data.channelType);
    }
  }, [data.channelType, form]);

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.post(`/api/channels?serverId=${params?.serverId}`, values);
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
            <DialogTitle className="text-2xl font-bold text-center text-slate-800 dark:text-white">
              Tạo Kênh Mới
            </DialogTitle>
            <DialogDescription className="text-center text-slate-600 dark:text-slate-400 text-sm">
              Chọn loại kênh và đặt tên cho kênh mới.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 px-6 pb-8">
              {/* Channel Type Selection */}
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Loại kênh
                    </FormLabel>
                    <FormControl>
                      <div className="space-y-2">
                        {channelTypeOptions.map((option) => {
                          const Icon = option.icon;
                          const isSelected = field.value === option.value;
                          return (
                            <button
                              key={option.value}
                              type="button"
                              onClick={() => field.onChange(option.value)}
                              className={`w-full flex items-center gap-3 p-3 rounded-lg border-2 transition-all ${
                                isSelected
                                  ? "border-violet-500 bg-violet-50 dark:bg-violet-500/10"
                                  : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
                              }`}
                            >
                              <Icon className={`h-5 w-5 ${isSelected ? "text-violet-500" : "text-slate-400"}`} />
                              <div className="text-left">
                                <p className={`text-sm font-medium ${isSelected ? "text-violet-600 dark:text-violet-400" : "text-slate-700 dark:text-slate-300"}`}>
                                  {option.label}
                                </p>
                                <p className="text-xs text-slate-500">{option.desc}</p>
                              </div>
                              {isSelected && (
                                <div className="ml-auto h-4 w-4 rounded-full bg-violet-500 flex items-center justify-center">
                                  <div className="h-2 w-2 rounded-full bg-white" />
                                </div>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </FormControl>
                    <FormMessage className="text-xs text-red-500" />
                  </FormItem>
                )}
              />

              {/* Channel Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Tên kênh
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        className="border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 rounded-lg"
                        placeholder="tên-kênh-mới"
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
                  {isLoading ? "Đang tạo..." : "Tạo Kênh"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
