"use client";

import React, { ReactNode, useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { SlotProps } from "@radix-ui/react-slot";
import { DialogProps } from "@radix-ui/react-dialog";

interface CustomModalProps {
  title: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
  actions?: ReactNode;
  titleProps?: SlotProps;
  descriptionProps?: SlotProps;
  dialogProps?: DialogProps;
  open?: boolean;
}

const CustomModal: React.FC<CustomModalProps> = ({
  title,
  description,
  children,
  actions,
  titleProps,
  descriptionProps,
  open,
  dialogProps,
}) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <Dialog open={open} {...dialogProps}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          {title && <DialogTitle {...titleProps}>{title}</DialogTitle>}
          {description && (
            <DialogDescription {...descriptionProps}>
              {description}
            </DialogDescription>
          )}
        </DialogHeader>
        {children}
        <DialogFooter className="bg-gray-100 px-6 py-4">
         {actions}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CustomModal;
