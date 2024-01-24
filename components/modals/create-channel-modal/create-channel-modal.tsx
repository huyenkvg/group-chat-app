"use client";

import { Plus } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
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
import { useToast } from "@/components/ui/use-toast";

const createChannelFormSchema = z.object({
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
  // isPrivate: z.boolean(),
});
export type CreateChannelFormValues = z.infer<typeof createChannelFormSchema>;
export const CreateChannelModal = ({
  server,
  isOwner = false,
  mutateServerId,
}: {
  server: Server;
  isOwner?: boolean;
  mutateServerId: () => void;
}) => {
  const [open, setOpen] = useState(false);

  const router = useRouter();
  const { toast } = useToast();
  const methods = useForm({
    resolver: zodResolver(createChannelFormSchema),
    defaultValues: {
      name: "",
      type: ChannelType.TEXT,
      // isPrivate: true,
    },
    mode: "onChange",
  });

  const { isSubmitting } = methods.formState;

  const onSubmit = async (values: CreateChannelFormValues) => {
    try {
      await fetch(`/api/servers/${server?.id}/channels`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      }).then(async (res) => {
        if (!res.ok) {
          throw new Error("Failed to create channel");
        }
        setOpen(false);
        const data = await res.json();
        toast({
          duration: 1500,
          title: "Channel created successfully",
        });
        mutateServerId();
        router.push(`/servers/${server?.id}/channels/${data.id}`);
      });
      setOpen(false);
    } catch (error) {
      console.log(error);
      toast({
        duration: 3000,
        title: "Error creating channel",
        description: (error as any).message,
        variant: "destructive"
      });
    }
  };

  return (
    <>
      {isOwner && (
        <Button
          variant="default"
          size="sm"
          disabled={methods.formState.isSubmitting}
          className="text-xs text-zinc-500 hover:text-zinc-100 rounded-none dark:text-zinc-400 dark:bg-gray-700 dark:hover:bg-gray-700"
          onClick={() => {
            setOpen(true);
          }}
        >
          Create channel
          <Plus className="w-4 h-4 ml-2" />
        </Button>
      )}
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
                    // TODO: Implement voice channels
                    // { label: "Voice", value: ChannelType.AUDIO },
                    { label: "Video", value: ChannelType.VIDEO },
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
