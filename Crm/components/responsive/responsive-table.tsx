"use client"

import React, { ReactNode } from "react"
import { cn } from "@/lib/utils"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card } from "@/components/ui/card"

interface Column<T> {
  header: string
  accessorKey: keyof T | ((row: T) => any)
  cell?: (row: T) => ReactNode
  className?: string
  headerClassName?: string
  enableSorting?: boolean
  meta?: Record<string, any>
  hideOnMobile?: boolean
}

interface ResponsiveTableProps<T> {
  data: T[]
  columns: Column<T>[]
  className?: string
  cardClassName?: string
  tableClassName?: string
  rowClassName?: (row: T, index: number) => string | undefined
  onRowClick?: (row: T) => void
  isLoading?: boolean
  emptyState?: ReactNode
  keyExtractor?: (row: T) => string | number
}

/**
 * A responsive table component that adapts to different screen sizes.
 * On mobile, it can display data in a card-like format.
 */
export function ResponsiveTable<T extends object>({
  data,
  columns,
  className,
  cardClassName,
  tableClassName,
  rowClassName,
  onRowClick,
  isLoading = false,
  emptyState,
  keyExtractor = (row: any) => row.id || Math.random().toString(),
}: ResponsiveTableProps<T>) {
  // Filter columns that should be visible on mobile
  const mobileVisibleColumns = columns.filter(col => !col.hideOnMobile)
  
  // Helper to get cell value
  const getCellValue = (row: T, column: Column<T>) => {
    if (column.cell) {
      return column.cell(row)
    }
    
    if (typeof column.accessorKey === 'function') {
      return column.accessorKey(row)
    }
    
    return row[column.accessorKey] as ReactNode
  }
  
  // If no data and we have an empty state
  if (data.length === 0 && emptyState) {
    return <div className={className}>{emptyState}</div>
  }
  
  return (
    <div className={cn("w-full", className)}>
      {/* Desktop view */}
      <div className="hidden md:block overflow-auto">
        <Table className={tableClassName}>
          <TableHeader>
            <TableRow>
              {columns.map((column, index) => (
                <TableHead 
                  key={index} 
                  className={column.headerClassName}
                >
                  {column.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row, rowIndex) => (
              <TableRow 
                key={keyExtractor(row)}
                className={cn(
                  onRowClick && "cursor-pointer hover:bg-muted",
                  rowClassName && rowClassName(row, rowIndex)
                )}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
              >
                {columns.map((column, colIndex) => (
                  <TableCell 
                    key={colIndex}
                    className={column.className}
                  >
                    {getCellValue(row, column)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      {/* Mobile view */}
      <div className="md:hidden space-y-4">
        {data.map((row, index) => (
          <Card 
            key={keyExtractor(row)}
            className={cn(
              "p-4",
              onRowClick && "cursor-pointer hover:bg-muted",
              cardClassName,
              rowClassName && rowClassName(row, index)
            )}
            onClick={onRowClick ? () => onRowClick(row) : undefined}
          >
            <div className="space-y-2">
              {mobileVisibleColumns.map((column, colIndex) => (
                <div key={colIndex} className="flex justify-between items-start gap-2">
                  <div className="font-medium text-sm text-muted-foreground">{column.header}</div>
                  <div className={cn("text-right", column.className)}>
                    {getCellValue(row, column)}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
