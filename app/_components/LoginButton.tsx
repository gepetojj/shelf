"use client";

import { signIn } from "next-auth/react";
import { memo } from "react";
import { FaGoogle } from "react-icons/fa";

export const LoginButton: React.FC = memo(function Component() {
	return (
		<button
			onClick={() => signIn("google", { callbackUrl: "/app" })}
			className="flex w-full select-none items-center justify-center gap-3 rounded-lg bg-main p-1
			text-black duration-200 hover:brightness-90"
		>
			<FaGoogle className="text-xl" />
			Entre com Google
		</button>
	);
});
