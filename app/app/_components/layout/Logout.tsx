"use client";

import { signOut } from "next-auth/react";
import { memo } from "react";
import { MdLogout } from "react-icons/md";

export const Logout: React.FC = memo(function Component({}) {
	return (
		<div className="cursor-pointer">
			<MdLogout
				className="text-xl"
				onClick={() => signOut()}
			/>
		</div>
	);
});
