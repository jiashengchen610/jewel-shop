import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"
import { Dialog as SheetPrimitive } from "radix-ui"
import { XIcon } from "@/icons"

// A panel that slides in from the left or right edge, on the Radix Dialog primitive. Colors and shadow come from the
// component tokens in tokens/components/sheet.tokens.json; it moves with the motion tokens and stacks at the dialog
// layer.

function Sheet(props: React.ComponentProps<typeof SheetPrimitive.Root>) {
  return <SheetPrimitive.Root data-slot="sheet" {...props} />
}

function SheetTrigger(props: React.ComponentProps<typeof SheetPrimitive.Trigger>) {
  return <SheetPrimitive.Trigger data-slot="sheet-trigger" {...props} />
}

function SheetClose(props: React.ComponentProps<typeof SheetPrimitive.Close>) {
  return <SheetPrimitive.Close data-slot="sheet-close" {...props} />
}

function SheetOverlay({ className, ...props }: React.ComponentProps<typeof SheetPrimitive.Overlay>) {
  return (
    <SheetPrimitive.Overlay
      data-slot="sheet-overlay"
      className={cn("fixed inset-0 z-(--layer-dialog) bg-sheet-overlay duration-(--duration-slow) data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0", className)}
      {...props}
    />
  )
}

const sheetContentVariants = cva(
  "fixed inset-y-0 z-(--layer-dialog) flex h-full w-3/4 flex-col gap-4 border-sheet-content-border bg-sheet-content-background text-sheet-content-foreground shadow-sheet ease-enter outline-none data-[state=open]:animate-in data-[state=open]:duration-(--duration-slow) data-[state=closed]:animate-out data-[state=closed]:duration-(--duration-normal) data-[state=closed]:ease-exit sm:max-w-sm",
  {
    variants: {
      side: {
        right: "right-0 border-l data-[state=open]:slide-in-from-right data-[state=closed]:slide-out-to-right",
        left: "left-0 border-r data-[state=open]:slide-in-from-left data-[state=closed]:slide-out-to-left",
      },
    },
    defaultVariants: {
      side: "right",
    },
  }
)

function SheetContent({
  className,
  children,
  side = "right",
  showCloseButton = true,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Content> & VariantProps<typeof sheetContentVariants> & { showCloseButton?: boolean }) {
  return (
    <SheetPrimitive.Portal data-slot="sheet-portal">
      <SheetOverlay />
      <SheetPrimitive.Content data-slot="sheet-content" data-side={side} className={cn(sheetContentVariants({ side }), className)} {...props}>
        {children}
        {showCloseButton && (
          <SheetPrimitive.Close
            data-slot="sheet-close"
            className="absolute top-4 right-4 rounded-sheet-close opacity-70 transition-opacity duration-(--duration-fast) hover:opacity-100 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
          >
            <XIcon />
            <span className="sr-only">Close</span>
          </SheetPrimitive.Close>
        )}
      </SheetPrimitive.Content>
    </SheetPrimitive.Portal>
  )
}

function SheetHeader({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="sheet-header" className={cn("flex flex-col gap-1.5 p-4 pr-12", className)} {...props} />
}

function SheetFooter({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="sheet-footer" className={cn("mt-auto flex flex-col gap-2 p-4", className)} {...props} />
}

function SheetTitle({ className, ...props }: React.ComponentProps<typeof SheetPrimitive.Title>) {
  return <SheetPrimitive.Title data-slot="sheet-title" className={cn("type-sheet-title", className)} {...props} />
}

function SheetDescription({ className, ...props }: React.ComponentProps<typeof SheetPrimitive.Description>) {
  return <SheetPrimitive.Description data-slot="sheet-description" className={cn("type-sheet-description text-sheet-description-foreground", className)} {...props} />
}

export { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetOverlay, SheetTitle, SheetTrigger, sheetContentVariants }
