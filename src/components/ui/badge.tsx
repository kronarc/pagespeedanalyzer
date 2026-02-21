import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-lg border px-2.5 py-1 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground border-primary/50 [a&]:hover:bg-primary/90",
        secondary:
          "bg-secondary text-secondary-foreground border-secondary/50 [a&]:hover:bg-secondary/90",
        destructive:
          "bg-destructive text-white border-destructive [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border-border text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
        ghost: "border-transparent [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
        link: "text-primary underline-offset-4 border-transparent [a&]:hover:underline",
        good: "bg-[#0cce6b]/20 text-[#0cce6b] border-[#0cce6b]/40 dark:bg-[#0cce6b]/10 dark:text-[#0cce6b]",
        warning: "bg-[#ffa400]/20 text-[#ffa400] border-[#ffa400]/40 dark:bg-[#ffa400]/10 dark:text-[#ffa400]",
        poor: "bg-[#ff4e42]/20 text-[#ff4e42] border-[#ff4e42]/40 dark:bg-[#ff4e42]/10 dark:text-[#ff4e42]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "span"

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
