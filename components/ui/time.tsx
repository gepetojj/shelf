"use client";

import TimeAgo from "javascript-time-ago";
import pt from "javascript-time-ago/locale/pt";
import { memo, useMemo } from "react";

import { seconds } from "@/lib/time";

export interface TimeProps {
	milliseconds: number;
}

export const Time: React.FC<TimeProps> = memo(function Time({ milliseconds }) {
	const timeAgo = useMemo(() => {
		TimeAgo.addLocale(pt);
		return new TimeAgo("pt");
	}, []);

	return <>{timeAgo.format(new Date(seconds(milliseconds) * 1000))}</>;
});
