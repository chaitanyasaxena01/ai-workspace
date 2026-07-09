import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
	variant?: Variant;
	size?: Size;
	children: ReactNode;
};

const variantClass: Record<Variant, string> = {
	primary:
		"bg-primary text-primary-fg hover:brightness-110 shadow-[0_0_0_1px_oklch(0.62_0.14_230_/_0.35)]",
	secondary:
		"bg-surface-2 text-ink border border-border hover:border-border-strong hover:bg-surface",
	ghost: "bg-transparent text-muted hover:text-ink hover:bg-surface-2",
	danger:
		"bg-danger-soft text-danger border border-danger/25 hover:bg-danger/20",
};

const sizeClass: Record<Size, string> = {
	sm: "h-8 px-3 text-xs gap-1.5 rounded-lg",
	md: "h-10 px-4 text-sm gap-2 rounded-[10px]",
	lg: "h-11 px-5 text-sm gap-2 rounded-xl",
};

export function Button({
	children,
	variant = "primary",
	size = "md",
	className = "",
	type = "button",
	disabled,
	...props
}: ButtonProps) {
	return (
		<button
			type={type}
			disabled={disabled}
			className={[
				"inline-flex items-center justify-center font-medium transition-[filter,background-color,border-color,color] duration-150",
				"disabled:opacity-45 disabled:pointer-events-none cursor-pointer",
				variantClass[variant],
				sizeClass[size],
				className,
			]
				.filter(Boolean)
				.join(" ")}
			{...props}
		>
			{children}
		</button>
	);
}
