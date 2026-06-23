import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/* ─── H1 ─── */
function H1({ className, ...props }: React.ComponentProps<"h1">) {
  return (
    <h1
      className={cn(
        "scroll-m-20 font-display text-h1 tracking-tight",
        className,
      )}
      {...props}
    />
  );
}

/* ─── H2 ─── */
const h2Variants = cva("scroll-m-20 first:mt-0", {
  variants: {
    variant: {
      display: "font-display text-display-sm tracking-tight",
      section: "font-sans text-label-md font-semibold tracking-[4px]",
    },
  },
  defaultVariants: { variant: "display" },
});

function H2({
  className,
  variant,
  ...props
}: Omit<React.ComponentProps<"h2">, "variant"> &
  VariantProps<typeof h2Variants>) {
  return <h2 className={cn(h2Variants({ variant }), className)} {...props} />;
}

/* ─── H3 ─── */
function H3({ className, ...props }: React.ComponentProps<"h3">) {
  return (
    <h3
      className={cn(
        "scroll-m-20 font-display text-h3 tracking-tight",
        className,
      )}
      {...props}
    />
  );
}

/* ─── H4 ─── */
function H4({ className, ...props }: React.ComponentProps<"h4">) {
  return (
    <h4
      className={cn(
        "scroll-m-20 font-display text-h4 font-semibold tracking-tight",
        className,
      )}
      {...props}
    />
  );
}

/* ─── H5 ─── */
function H5({ className, ...props }: React.ComponentProps<"h5">) {
  return (
    <h5
      className={cn(
        "scroll-m-20 text-h5 font-semibold tracking-tight",
        className,
      )}
      {...props}
    />
  );
}

/* ─── H6 ─── */
function H6({ className, ...props }: React.ComponentProps<"h6">) {
  return (
    <h6
      className={cn(
        "scroll-m-20 text-h6 font-semibold tracking-tight",
        className,
      )}
      {...props}
    />
  );
}

/* ─── P ─── */
const pVariants = cva("", {
  variants: {
    size: {
      lg: "text-body-lg",
      md: "text-body-md",
      sm: "text-body-sm",
      xs: "text-body-xs",
    },
  },
  defaultVariants: { size: "md" },
});

function P({
  className,
  size,
  ...props
}: Omit<React.ComponentProps<"p">, "size"> & VariantProps<typeof pVariants>) {
  return <p className={cn(pVariants({ size }), className)} {...props} />;
}

/* ─── Lead ─── */
function Lead({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      className={cn("text-body-lg text-muted-foreground", className)}
      {...props}
    />
  );
}

/* ─── Large ─── */
function Large({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div className={cn("text-body-lg font-semibold", className)} {...props} />
  );
}

/* ─── Small ─── */
const smallVariants = cva("font-medium", {
  variants: {
    size: {
      lg: "text-body-lg",
      md: "text-body-md",
      sm: "text-body-sm",
      xs: "text-body-xs",
    },
  },
  defaultVariants: { size: "sm" },
});

function Small({
  className,
  size,
  ...props
}: Omit<React.ComponentProps<"small">, "size"> &
  VariantProps<typeof smallVariants>) {
  return (
    <small className={cn(smallVariants({ size }), className)} {...props} />
  );
}

/* ─── Muted ─── */
const mutedVariants = cva("text-muted-foreground", {
  variants: {
    size: {
      lg: "text-body-lg",
      md: "text-body-md",
      sm: "text-body-sm",
      xs: "text-body-xs",
    },
  },
  defaultVariants: { size: "sm" },
});

function Muted({
  className,
  size,
  ...props
}: Omit<React.ComponentProps<"p">, "size"> &
  VariantProps<typeof mutedVariants>) {
  return <p className={cn(mutedVariants({ size }), className)} {...props} />;
}

/* ─── Blockquote ─── */
function Blockquote({
  className,
  ...props
}: React.ComponentProps<"blockquote">) {
  return (
    <blockquote
      className={cn("mt-6 border-l-2 pl-6 italic text-quote", className)}
      {...props}
    />
  );
}

/* ─── InlineCode ─── */
const codeVariants = cva(
  "bg-muted relative rounded px-[0.3rem] py-[0.2rem] font-mono font-semibold",
  {
    variants: {
      size: {
        inline: "text-code-inline",
        block: "text-code-block",
      },
    },
    defaultVariants: { size: "inline" },
  },
);

function InlineCode({
  className,
  size,
  ...props
}: Omit<React.ComponentProps<"code">, "size"> &
  VariantProps<typeof codeVariants>) {
  return <code className={cn(codeVariants({ size }), className)} {...props} />;
}

/* ─── Label ─── */
const labelVariants = cva("font-semibold tracking-wide", {
  variants: {
    size: {
      xs: "text-label-xs",
      sm: "text-label-sm",
      md: "text-label-md",
      lg: "text-label-lg",
    },
  },
  defaultVariants: { size: "md" },
});

function Label({
  className,
  size,
  ...props
}: Omit<React.ComponentProps<"span">, "size"> &
  VariantProps<typeof labelVariants>) {
  return <span className={cn(labelVariants({ size }), className)} {...props} />;
}

/* ─── Stat ─── */
function Stat({
  className,
  title,
  value,
  ...props
}: Omit<React.ComponentProps<"div">, "title"> & {
  title: React.ReactNode;
  value: React.ReactNode;
}) {
  return (
    <div className={cn("flex flex-col", className)} {...props}>
      <span className="text-stat font-display font-bold">{value}</span>
      <span className="text-body-sm text-muted-foreground max-w-1/2">
        {title}
      </span>
    </div>
  );
}

export {
  H1,
  H2,
  H3,
  H4,
  H5,
  H6,
  P,
  Lead,
  Large,
  Small,
  Muted,
  Blockquote,
  InlineCode,
  Label,
  Stat,
  h2Variants,
  pVariants,
  smallVariants,
  mutedVariants,
  codeVariants,
  labelVariants,
};
