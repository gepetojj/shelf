"use client";

import TimeAgo from "javascript-time-ago";
import pt from "javascript-time-ago/locale/pt";
import { memo } from "react";

import { seconds } from "@/lib/time";

export interface TimeProps {
	milliseconds: number;
}

TimeAgo.addDefaultLocale(pt);
const timeAgo = new TimeAgo("pt");

export const Time: React.FC<TimeProps> = memo(function Component({ milliseconds }) {
	return <>{timeAgo.format(new Date(seconds(milliseconds) * 1000))}</>;
});
