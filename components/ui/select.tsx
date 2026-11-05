"use client";

import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "./button";

const Select = SelectPrimitive.Root;
const SelectGroup = SelectPrimitive.Group;
const SelectValue = SelectPrimitive.Value;
const SelectTrigger = SelectPrimitive.Trigger;
const SelectContent = SelectPrimitive.Content;
const SelectLabel = SelectPrimitive.Label;
const SelectItem = SelectPrimitive.Item;
const SelectSeparator = SelectPrimitive.Separator;
const SelectScrollUpButton = SelectPrimitive.ScrollUpButton;
const SelectScrollDownButton = SelectPrimitive.ScrollDownButton;

const SelectTriggerWrapper = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <SelectTrigger
    ref={ref}
    className={cn(
      "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&_span]:line-clamp-1",
      className
    )}
    {...props}
  >
    <SelectValue placeholder="" className="w-full truncate" />
    {children}
  </SelectTrigger>
));
SelectTriggerWrapper.displayName = SelectPrimitive.Trigger.displayName;

const SelectContentWrapper = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = "popper", ...props }, ref) => (
  <SelectPortal>
    <SelectContent
      ref={ref}
      className={cn(
        "relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border border-input bg-background text-popover-foreground shadow-md scale-95 duration-100 outline-none data-[state=open]:scale-100 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        position === "popper" && "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
        className
      )}
      position={position}
      {...props}
    >
      <SelectScrollUpButton className="flex cursor-default items-center justify-center px-1 h-5 text-muted-foreground" />
      <SelectViewport className="p-1">
        {children}
      </SelectViewport>
      <SelectScrollDownButton className="flex cursor-default items-center justify-center px-1 h-5 text-muted-foreground" />
    </SelectContent>
  </SelectPortal>
));
SelectContentWrapper.displayName = SelectPrimitive.Content.displayName;

const SelectPortal = ({ children }: { children: React.ReactNode }) => (
  <SelectPrimitive.Portal>{children}</SelectPrimitive.Portal>
);

const SelectViewport = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Viewport>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Viewport>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Viewport ref={ref} className={cn("p-1", className)} {...props}>
    {children}
  </SelectPrimitive.Viewport>
));
SelectViewport.displayName = SelectPrimitive.Viewport.displayName;

const SelectItemWrapper = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item> & { className?: string }
>(({ className, children, ...props }, ref) => (
  <SelectItem
    ref={ref}
    className={cn("relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50", className)}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <SelectItemIndicator>
        <Check className="h-4 w-4" />
      </SelectItemIndicator>
    </span>
    <SelectItemText>{children}</SelectItemText>
  </SelectItem>
));
SelectItemWrapper.displayName = SelectPrimitive.Item.displayName;

const SelectItemIndicator = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ItemIndicator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ItemIndicator>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ItemIndicator ref={ref} className={cn("flex items-center justify-center", className)} {...props} />
));
SelectItemIndicator.displayName = SelectPrimitive.ItemIndicator.displayName;

const SelectItemText = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ItemText>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ItemText>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ItemText ref={ref} className={cn("truncate", className)} {...props} />
));
SelectItemText.displayName = SelectPrimitive.ItemText.displayName;

const SelectSeparatorWrapper = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator ref={ref} className={cn("-mx-1 h-px bg-border", className)} {...props} />
));
SelectSeparatorWrapper.displayName = SelectPrimitive.Separator.displayName;

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger: SelectTriggerWrapper,
  SelectContent: SelectContentWrapper,
  SelectLabel,
  SelectItem: SelectItemWrapper,
  SelectSeparator: SelectSeparatorWrapper,
  SelectScrollUpButton,
  SelectScrollDownButton,
};
