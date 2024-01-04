'use client';

import type { ReactNode } from 'react';

import { FormControl, FormField } from '@/components/ui/form';
import { useFormContext } from 'react-hook-form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RHFFormItem } from '../RHFFormItem';

export type TRHFSelectOption = {
  label: string;
  value: string;
};

export type TRHFSelectProps = {
  name: string;
  options: TRHFSelectOption[];
  required?: boolean;
  placeholder?: string;
  description?: ReactNode;
  formLabel?: ReactNode;
  formItemProps?: React.HTMLAttributes<HTMLDivElement>;
  formLabelProps?: React.HTMLAttributes<HTMLLabelElement>;
  formMessageProps?: React.HTMLAttributes<HTMLParagraphElement>;
  descriptionProps?: React.HTMLAttributes<HTMLParagraphElement>;
};

export default function RHFSelect({
  name,
  options = [],
  required,
  placeholder = '---',
  description = '',
  formLabel = '',
  formItemProps = {},
  formLabelProps = {},
  formMessageProps = {},
  descriptionProps = {},
  ...rest
}: TRHFSelectProps) {
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState: { invalid } }) => (
        <RHFFormItem
          description={description}
          formItemProps={formItemProps}
          formLabelProps={formLabelProps}
          descriptionProps={descriptionProps}
          formMessageProps={formMessageProps}
        >
          <Select onValueChange={field.onChange} value={field.value}>
            <FormControl>
              <SelectTrigger
                formLabel={formLabel}
                required={required}
                isError={invalid}
              >
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value={undefined}>{placeholder}</SelectItem>
              {options.map(({ label, value }) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </RHFFormItem>
      )}
      {...rest}
    />
  );
}
