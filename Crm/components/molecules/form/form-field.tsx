"use client"

import * as React from "react"
import { 
  FormControl, 
  FormDescription, 
  FormField as ShadcnFormField,
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"
import { FieldPath, FieldValues, UseFormReturn } from "react-hook-form"
import { Info } from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export interface FormFieldOption {
  label: string
  value: string
}

export interface FormFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> {
  form: UseFormReturn<TFieldValues>
  name: TName
  label?: string
  description?: string
  placeholder?: string
  type?: "text" | "email" | "password" | "number" | "tel" | "url" | "date" | "textarea" | "select" | "checkbox" | "switch"
  options?: FormFieldOption[]
  tooltip?: string
  required?: boolean
  disabled?: boolean
  className?: string
  containerClassName?: string
}

/**
 * Enhanced form field component that combines shadcn/ui form components with better UX.
 * Supports various input types and provides consistent styling and behavior.
 */
export function FormField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  form,
  name,
  label,
  description,
  placeholder,
  type = "text",
  options = [],
  tooltip,
  required = false,
  disabled = false,
  className,
  containerClassName,
}: FormFieldProps<TFieldValues, TName>) {
  return (
    <ShadcnFormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn("space-y-1.5", containerClassName)}>
          {label && (
            <div className="flex items-center gap-1.5">
              <FormLabel className={required ? "after:content-['*'] after:ml-0.5 after:text-destructive" : ""}>
                {label}
              </FormLabel>
              
              {tooltip && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs text-xs">{tooltip}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
          )}
          
          <FormControl>
            {type === "textarea" ? (
              <Textarea
                placeholder={placeholder}
                className={className}
                disabled={disabled}
                {...field}
              />
            ) : type === "select" ? (
              <Select
                disabled={disabled}
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <SelectTrigger className={className}>
                  <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent>
                  {options.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : type === "checkbox" ? (
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={`${name}-checkbox`}
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled={disabled}
                  className={className}
                />
                {label && (
                  <label
                    htmlFor={`${name}-checkbox`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {label}
                  </label>
                )}
              </div>
            ) : type === "switch" ? (
              <div className="flex items-center space-x-2">
                <Switch
                  id={`${name}-switch`}
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled={disabled}
                  className={className}
                />
                {label && (
                  <label
                    htmlFor={`${name}-switch`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {label}
                  </label>
                )}
              </div>
            ) : (
              <Input
                type={type}
                placeholder={placeholder}
                className={className}
                disabled={disabled}
                {...field}
                value={field.value || ""}
                onChange={(e) => {
                  if (type === "number") {
                    const value = e.target.value === "" ? "" : Number(e.target.value);
                    field.onChange(value);
                  } else {
                    field.onChange(e);
                  }
                }}
              />
            )}
          </FormControl>
          
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
