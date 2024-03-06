"use client";

import type { Session } from "next-auth";
import { SessionProvider as AuthProvider } from "next-auth/react";
import { memo } from "react";

export interface SessionProviderProps {
	session?: Session | null;
}

export const SessionProvider: React.FC<React.PropsWithChildren<SessionProviderProps>> = memo(function Component({
	children,
	session,
}) {
	return (
		<AuthProvider
			session={session}
			refetchInterval={60}
			refetchOnWindowFocus
		>
			{children}
		</AuthProvider>
	);
});
