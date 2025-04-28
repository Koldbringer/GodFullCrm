"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

export type CalendarProps = {
  children?: React.ReactNode;
  className?: string;
};

function Calendar({ className, children }: CalendarProps) {
  return (
    <div className={className}>{children}</div>
  );
}

Calendar.displayName = "Calendar";

export { Calendar };
