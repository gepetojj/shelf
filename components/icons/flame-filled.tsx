import { memo } from "react";

import { IconFlame, IconProps } from "@tabler/icons-react";

export const IconFlameFilled: React.FC<IconProps> = memo(function IconFlameFilled({ ...props }) {
	return (
		<IconFlame
			fill="currentColor"
			{...props}
		/>
	);
});
