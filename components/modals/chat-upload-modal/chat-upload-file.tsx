import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { Paperclip } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import CustomModal from "../custom-modal";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { DialogFooter } from "@/components/ui/dialog";
import { FileUpload } from "@/components/ui/file-upload";
import qs, { StringifiableRecord } from "query-string";
import { DialogProps } from "@radix-ui/react-dialog";
import { RHFFormItem } from "@/components/RHF/RHFFormItem";
import { InputField } from "@/components/RHF/RHFInputField";
const formSchema = z.object({
  fileUrl: z.string().min(1, {
    message: "Attachment is required.",
  }),
  content: z.string().min(1, {
    message: "Message is required.",
  }),
});

const ChatUploadFile = ({
  open,
  apiUrl,
  onClose,
  query,
}: {
  open: boolean;
  apiUrl: string;
  query: StringifiableRecord;
  onClose: () => void;
}) => {
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fileUrl: "",
      content: "",
    },
    mode: "onChange",
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const url = qs.stringifyUrl({
        url: apiUrl,
        query,
      });
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });
      if (!response.ok) {
        throw new Error("failed to send file");
      }
      onClose();
      form.reset();
      router.refresh();
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <CustomModal
      title="Add an attachment"
      description="Send a file"
      open={open}
      dialogProps={{
        onOpenChange: onClose,
      }}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="space-y-8 px-6">
            <div className="flex items-center justify-center text-center">
              <FormField
                control={form.control}
                name="fileUrl"
                render={({ field }) => (
                  <RHFFormItem description="uload a file">
                    <FormItem>
                      <FormControl>
                        <FileUpload
                          endpoint="messageFile"
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  </RHFFormItem>
                )}
              />
            </div>
            <InputField
              name="content"
              formLabel="write a message"
              inputProps={{
                disabled: Boolean(
                  form.formState.isSubmitting || !form.getValues("fileUrl")
                ),
              }}
            />
          </div>
          <DialogFooter className="bg-gray-50 px-6 py-4 ">
            <Button
              variant="outline"
              type="submit"
              className="dark:text-gray-100 dark:border-none"
              disabled={Boolean(form.formState.isSubmitting)}
            >
              SEND
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </CustomModal>
  );
};

export default ChatUploadFile;
