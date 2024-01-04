"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { DialogFooter } from "@/components/ui/dialog";
import { Form, FormField, FormItem } from "@/components/ui/form";
import { useRouter } from "next/navigation";
import CustomModal from "../custom-modal";
import { Button } from "@/components/ui/button";
import { RHFFormItem } from "@/components/RHF/RHFFormItem";
import { InputField } from "@/components/RHF/RHFInputField";

const formSchema = z.object({
  name: z.string().min(1, {
    message: "Name is required.",
  }),
  imageUrl: z.string(),
});

const InitialModal = () => {
  const router = useRouter();

  const methods = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      imageUrl: "",
    },
  });

  const isLoading = methods.formState.isSubmitting;

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
      methods.reset();
      console.log("Server created successfully");
      router.refresh();
      window.location.reload();
    } catch (error) {
      console.error("Error creating server:", error);
    }
  };

  return (
    <CustomModal
      title="Customize your server"
      description="Give your server a personality with a name and an image. You can always change it later.."
      open={true}
    >
      <Form {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-8">
          <div className="space-y-8 px-6">
            <div className="flex flex-col items-leftr">
              <RHFFormItem>
                <InputField
                  name="name"
                  formLabel="Name"
                  description="your name to display in channel"
                />
              </RHFFormItem>
              <RHFFormItem>
                <InputField
                  name="imageUrl"
                  formLabel="Image"
                  inputProps={{
                    type: "file",
                  }}
                  description="your avatar"
                />
              </RHFFormItem>
            </div>
          </div>
          <DialogFooter className="bg-gray-100 px-6 py-4">
            <Button variant="outline" disabled={isLoading}>
              Create
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </CustomModal>
  );
};
export default InitialModal;
