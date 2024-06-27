import { memo } from "react";
import { Thing, WithContext } from "schema-dts";

export type JsonLDProps = {
	content: WithContext<Thing>;
};

export const JsonLD: React.FC<JsonLDProps> = memo(function JsonLD({ content }) {
	return (
		<script
			type="application/ld+json"
			dangerouslySetInnerHTML={{ __html: JSON.stringify(content) }}
		/>
	);
});
