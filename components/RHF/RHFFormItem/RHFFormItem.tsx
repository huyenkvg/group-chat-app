"use client";

import {
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/shadcn/ui/form";
import React from "react";

export type TRHFFormItemProps = {
  children: React.ReactNode;
  formLabel?: React.ReactNode;
  description?: React.ReactNode;
  formItemProps?: React.HTMLAttributes<HTMLDivElement>;
  formLabelProps?: React.HTMLAttributes<HTMLLabelElement>;
  formMessageProps?: React.HTMLAttributes<HTMLParagraphElement>;
  descriptionProps?: React.HTMLAttributes<HTMLParagraphElement>;
};

function RHFFormItem({
  children,
  formLabel,
  description,
  formItemProps,
  formLabelProps,
  descriptionProps,
  formMessageProps,
}: TRHFFormItemProps) {
  const testId = "test-RHFFormItem";

  return (
    <FormItem data-testid={testId} className="space-y-2" {...formItemProps}>
      {formLabel && (
        <FormLabel
          data-testid={`${testId}__formLabel`}
          className="text-indigo-900"
          {...formLabelProps}
        >
          {formLabel}
        </FormLabel>
      )}
      {children}
      {description && (
        <FormDescription
          data-testid={`${testId}__description`}
          className="pt-2 text-normal text-gray-500"
          {...descriptionProps}
        >
          {description}
        </FormDescription>
      )}
      <FormMessage
        data-testid={`${testId}__formMessage`}
        className="px-2 text-left text-normal text-red-500"
        {...formMessageProps}
      />
    </FormItem>
  );
}

export default RHFFormItem;
