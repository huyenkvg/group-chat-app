"use client";

import * as z from "zod";
// import qs from "query-string";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Paperclip, Plus, Send, SendHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";

import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";

interface MessageInputProps {
  apiUrl: string;
  query: Record<string, any>;
  name: string;
  type: "conversation" | "channel";
}

const formSchema = z.object({
  content: z.string().min(1),
});

export const MessageInput = ({ apiUrl, query, name, type }: MessageInputProps) => {
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log("values", values);
      // TODO: Integration send message to server
      form.reset();
      router.refresh();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="relative p-2">
                  <div className="rounded-t-lg bg-zinc-200/90 py-2 dark:bg-zinc-700/75 border-none border-0 focus-visible:ring-0  text-zinc-600 dark:text-zinc-200">
                    <Textarea
                      disabled={isLoading}
                      className="px-4 py-2 w-full bg-transparent border-none text-black dark:text-zinc-200"
                      placeholder={`Message to ${
                        type === "conversation" ? "@" + name : "#" + name
                      }`}
                      {...field}
                    />
                  </div>
                  <div className="bg-zinc-200/90 justify-between px-4 flex flex-row pb-2 dark:bg-zinc-700/75 border-none border-0 focus-visible:ring-0  text-zinc-600 dark:text-zinc-200 rounded-b-lg">
                    <Button
                      type="button"
                      className=" h-[24px] w-[24px] bg-zinc-500 dark:bg-zinc-400 hover:bg-zinc-600 dark:hover:bg-zinc-300 transition rounded-full p-1 flex items-center justify-center"
                    >
                      <Paperclip className="text-white dark:text-[#313338]" />
                    </Button>
                    <Button
                      type="submit"
                      className=" h-[24px] px-4 bg-zinc-500 dark:bg-zinc-400 hover:bg-zinc-600 dark:hover:bg-zinc-300 transition rounded-full p-1 flex items-center justify-center"
                    >
                      Send
                      <SendHorizontal className="text-white dark:text-[#313338] p-1" />
                    </Button>
                  </div>
                </div>
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};
