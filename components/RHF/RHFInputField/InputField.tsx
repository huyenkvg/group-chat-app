'use client';

import type { ReactNode } from 'react';

import { useFormContext } from 'react-hook-form';
import { RHFFormItem } from '../RHFFormItem';
import { FormControl, FormField } from '@/components/ui/form';
import { Input, InputProps } from '@/components/ui/input';

export type TInputFieldProps = {
  name: string;
  description?: string | ReactNode;
  formLabel?: string | ReactNode;
  inputProps?: InputProps;
  formItemProps?: React.HTMLAttributes<HTMLDivElement>;
  formLabelProps?: React.HTMLAttributes<HTMLLabelElement>;
  formMessageProps?: React.HTMLAttributes<HTMLParagraphElement>;
  descriptionProps?: React.HTMLAttributes<HTMLParagraphElement>;
};

export default function InputField({
  name,
  description = '',
  formLabel = '',
  inputProps = {},
  formItemProps = {},
  formLabelProps = {},
  formMessageProps = {},
  descriptionProps = {},
  ...rest
}: TInputFieldProps) {
  const { control } = useFormContext();
  return (
    <FormField
      name={name}
      control={control}
      render={({ field, fieldState: { invalid } }) => {
        const combinedInputProps: InputProps = {
          ...field,
          ...inputProps,
          ... (invalid ? { className: 'border-red-500' } : {}),
        };
        return (
          <RHFFormItem
            formLabel={formLabel}
            description={description}
            formItemProps={formItemProps}
            formLabelProps={formLabelProps}
            descriptionProps={descriptionProps}
            formMessageProps={formMessageProps}
          >
            <FormControl>
                <Input {...combinedInputProps} />
            </FormControl>
          </RHFFormItem>
        );
      }}
      {...rest}
    />
  );
}
