"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "./button";

interface ModalProps extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Root> {
  title?: string;
  children: React.ReactNode;
  onClose: () => void;
  wide?: boolean;
}

export function Modal({ title, children, onClose, wide = false, className, ...props }: ModalProps) {
  return (
    <DialogPrimitive.Root open={true} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm" />
        <DialogPrimitive.Content
          className={cn(
            "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 sm:rounded-lg",
            wide ? "max-w-2xl" : "max-w-lg",
            className
          )}
          {...props}
        >
          {title && (
            <div className="flex flex-col space-y-1.5 text-center sm:text-left mb-4">
              <DialogPrimitive.Title className="text-lg font-semibold leading-none tracking-tight">{title}</DialogPrimitive.Title>
            </div>
          )}
          <div className="text-sm">{children}</div>
          <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
