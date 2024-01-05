"use client";
import { Check, Copy, Plus, RefreshCw, UserPlus } from "lucide-react";
import { useState } from "react";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { IServer } from "@/typing/model-types";
import CustomModal from "../custom-modal";
import { Form } from "@/components/ui/form";
import { InputField } from "@/components/RHF/RHFInputField";
import { DialogFooter } from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ChannelType, Server } from "@prisma/client";
import { RHFSelect } from "@/components/RHF/RHFSelect";

const formSchema = z.object({
  name: z
    .string()
    .min(1, {
      message: "Channel name is required.",
    })
    .refine((name) => name !== "general", {
      message: "Channel name cannot be 'general'",
    })
    .refine((value) => /^[a-zA-Z-][a-zA-Z0-9-]*$/.test(value), {
      message:
        "Only letters, numbers, and dashes are allowed. Must start with a letter.",
    }),
  type: z.nativeEnum(ChannelType),
});

export const CreateChannelModal = ({ server }: { server: Server }) => {
  const [open, setOpen] = useState(false);

  const router = useRouter();

  const methods = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      type: ChannelType.TEXT,
    },
    mode: "onChange",
  });

  const { isSubmitting } = methods.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await fetch(`/api/servers/${server?.id}/channels`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });
      if (!response.ok) {
        throw new Error("Failed to create channel");
      }
      const data = await response.json();
      router.push(`/servers/${server?.id}/channels/${data.id}`);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Button
        variant="default"
        size="sm"
        className="text-xs text-zinc-500 hover:text-zinc-100 rounded-none"
        onClick={() => {
          setOpen(true);
        }}
      >
        Create channel
        <Plus className="w-4 h-4 ml-2" />
      </Button>
      <CustomModal
        title="Create New Channel"
        open={open}
        dialogProps={{
          onOpenChange: (open) => {
            setOpen(open);
          },
        }}
      >
        <Form {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-8 px-6">
              <div className="flex flex-col items-leftr">
                <InputField
                  name="name"
                  formLabel="Channel Name"
                  description="Enter a name for your channel"
                />
                <RHFSelect
                  name="type"
                  formLabel="Channel Type"
                  description="Select a channel type"
                  options={[
                    { label: "Text", value: ChannelType.TEXT },
                    { label: "Voice", value: ChannelType.AUDIO },
                    { label: "Video", value: ChannelType.VIDIEO },
                  ]}
                />
              </div>
            </div>
            <DialogFooter className="bg-gray-100 px-6 py-4">
              <Button variant="outline" disabled={isSubmitting}>
                Create
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </CustomModal>
    </>
  );
};
