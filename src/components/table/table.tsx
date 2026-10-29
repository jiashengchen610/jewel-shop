import * as React from "react"
import { cn } from "cn"

// Colors and text styles come from the component tokens in tokens/components/table.tokens.json. Rows are compact;
// the caller right-aligns number columns with text-right on the head and the cells.

function Table({ className, ...props }: React.ComponentProps<"table">) {
  return (
    <div data-slot="table-container" className="relative w-full overflow-x-auto">
      <table data-slot="table" className={cn("w-full caption-bottom tabular-nums", className)} {...props} />
    </div>
  )
}

function TableHeader({ className, ...props }: React.ComponentProps<"thead">) {
  return (
    <thead
      data-slot="table-header"
      className={cn("bg-table-header-background text-table-header-foreground [&_tr]:border-b [&_tr]:border-table-border", className)}
      {...props}
    />
  )
}

function TableBody({ className, ...props }: React.ComponentProps<"tbody">) {
  return <tbody data-slot="table-body" className={cn("[&_tr:last-child]:border-0", className)} {...props} />
}

function TableFooter({ className, ...props }: React.ComponentProps<"tfoot">) {
  return (
    <tfoot
      data-slot="table-footer"
      className={cn("border-t border-table-border bg-table-footer-background text-table-footer-foreground type-table-footer [&>tr]:last:border-b-0", className)}
      {...props}
    />
  )
}

function TableRow({ className, ...props }: React.ComponentProps<"tr">) {
  return (
    <tr
      data-slot="table-row"
      className={cn(
        "border-b border-table-border text-table-row-foreground transition-colors duration-(--duration-fast) [tbody_&]:hover:bg-table-row-background-hover data-[state=selected]:bg-table-row-background-hover",
        className
      )}
      {...props}
    />
  )
}

function TableHead({ className, scope = "col", ...props }: React.ComponentProps<"th">) {
  return (
    <th
      data-slot="table-head"
      scope={scope}
      className={cn("h-9 px-3 text-left align-middle whitespace-nowrap text-table-header-foreground type-table-head", className)}
      {...props}
    />
  )
}

function TableCell({ className, ...props }: React.ComponentProps<"td">) {
  return <td data-slot="table-cell" className={cn("px-3 py-2 align-middle whitespace-nowrap type-table-cell", className)} {...props} />
}

function TableCaption({ className, ...props }: React.ComponentProps<"caption">) {
  return <caption data-slot="table-caption" className={cn("mt-3 text-table-caption-foreground type-table-caption", className)} {...props} />
}

export { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow }
