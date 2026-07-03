"use client"

import * as React from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table"

export interface ColumnDef<TData, TValue> {
  header: string
  accessorKey: keyof TData
  cell?: (props: { row: TData; value: TValue }) => React.ReactNode
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  keyExtractor: (item: TData) => string
}

export function DataTable<TData, TValue>({
  columns,
  data,
  keyExtractor
}: DataTableProps<TData, TValue>) {
  return (
    <div className="rounded-md border border-neutral-200 bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead key={String(column.header)}>
                {column.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length ? (
            data.map((row) => (
              <TableRow key={keyExtractor(row)}>
                {columns.map((column) => (
                  <TableCell key={String(column.header)}>
                    {column.cell
                      ? column.cell({ row, value: row[column.accessorKey] as TValue })
                      : (row[column.accessorKey] as React.ReactNode)}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
