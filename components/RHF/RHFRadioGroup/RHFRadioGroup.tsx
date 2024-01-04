"use client";

import type { InputProps } from "@/components/shadcn/ui/input";
import type { ReactNode } from "react";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/shadcn/ui/form";
import { useFormContext } from "react-hook-form";
import { RadioGroup, RadioGroupItem } from "@/components/shadcn/ui/radio-group";
import { RHFFormItem } from "../RHFFormItem";

export type TRHFRadioGroupOption = {
  label: string;
  value: string;
};

export type TRHFRadioGroupProps = {
  name: string;
  options: TRHFRadioGroupOption[];
  description?: ReactNode;
  formLabel?: ReactNode;
  inputProps?: InputProps;
  formItemProps?: React.HTMLAttributes<HTMLDivElement>;
  formLabelProps?: React.HTMLAttributes<HTMLLabelElement>;
  formMessageProps?: React.HTMLAttributes<HTMLParagraphElement>;
  descriptionProps?: React.HTMLAttributes<HTMLParagraphElement>;
};

export default function RHFRadioGroup({
  name,
  options = [],
  description = "",
  formLabel = "",
  inputProps = {},
  formItemProps = {},
  formLabelProps = {},
  formMessageProps = {},
  descriptionProps = {},
  ...rest
}: TRHFRadioGroupProps) {
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <RHFFormItem
          formLabel={formLabel}
          description={description}
          formItemProps={formItemProps}
          formLabelProps={formLabelProps}
          descriptionProps={descriptionProps}
          formMessageProps={formMessageProps}
        >
          <FormControl>
            <RadioGroup
              onValueChange={field.onChange}
              value={field.value}
              className="flex items-center gap-3"
            >
              {options.map(({ label, value }) => (
                <FormItem
                  key={value}
                  className="flex items-center space-x-2 space-y-0"
                >
                  <FormControl>
                    <RadioGroupItem value={value} />
                  </FormControl>
                  <FormLabel className="text-[0.8rem] font-normal">
                    {label}
                  </FormLabel>
                </FormItem>
              ))}
            </RadioGroup>
          </FormControl>
        </RHFFormItem>
      )}
      {...rest}
    />
  );
}
