"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { DialogFooter } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { useRouter } from "next/navigation";
import CustomModal from "../custom-modal";
import { Button } from "@/components/ui/button";
import { RHFFormItem } from "@/components/RHF/RHFFormItem";
import { InputField } from "@/components/RHF/RHFInputField";
import { FileUpload } from "@/components/ui/file-upload";
import { useState } from "react";
import { Plus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const formSchema = z.object({
  name: z.string().min(1, {
    message: "Name is required.",
  }),
  imageUrl: z.string().min(1, {
    message: "Image is required.",
  }),
});

const InitialModal = () => {
  const router = useRouter();
  const [openModal, setOpenModal] = useState(false);
  const methods = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      imageUrl: "",
    },
  });

  const { toast } = useToast();
  const { isSubmitting } = methods.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await fetch("/api/servers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error("Failed to create server");
      }
      setOpenModal(false);
      const data = await response.json();
      methods.reset();
      toast({
        duration: 3000,
        title: "Server created successfully",
        description: "You can now join your server",
        action: (
          <Button
            variant="outline"
            onClick={() => {
              router.push(`/servers/${data?.server?.id}`);
            }}
          >
            Go to servers
          </Button>
        ),
      });
      console.log("Server created successfully");
      router.refresh();
    } catch (error) {
      console.error("Error creating server:", error);
      toast({
        duration: 3000,
        title: "Error creating server",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <Button className="bg-indigo-500" onClick={() => setOpenModal(true)}>
        <Plus className="w-4 h-4 mr-3" />
        Create Server
      </Button>
      <CustomModal
        title="Ceate your own workspace"
        description="Give your server a personality with a name and an image."
        open={openModal}
        dialogProps={{
          onOpenChange: (open) => {
            if (!open) {
              methods.reset();
            }
            setOpenModal(open);
          },
        }}
      >
        <Form {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-8 px-6">
              <div className="flex flex-col items-leftr">
                <InputField
                  name="name"
                  formLabel="Name"
                  description="your name to display in channel"
                />
                <RHFFormItem formLabel={"Upload your workspace image"}>
                  <FormField
                    control={methods.control}
                    name="imageUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <FileUpload endpoint="serverImage" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </RHFFormItem>
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
export default InitialModal;
