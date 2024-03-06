import { type HTMLProps, type RefObject, forwardRef, memo } from "react";

export const TextInput = memo(
	forwardRef(function Component({ placeholder, ...props }: HTMLProps<HTMLInputElement>, ref) {
		return (
			<div className="w-full">
				<label
					htmlFor={props.id}
					className="text-sm font-light text-neutral-200"
				>
					{placeholder}
				</label>
				<input
					{...props}
					ref={ref as RefObject<HTMLInputElement>}
					className="flex w-full items-center gap-2 rounded-lg border border-white/5 bg-main-foreground px-3 py-1.5 outline-none focus:border-white/20"
				/>
			</div>
		);
	}),
);
