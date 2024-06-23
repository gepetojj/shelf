export const name = (input: { first: string | null; last: string | null; username: string }): string => {
	if (input.first || input.last) {
		return `${input.first || ""} ${input.last || ""}`.trim().split(" ").slice(0, 2).join(" ");
	}

	if (input.username === "deleted") {
		return "Conta deletada";
	}
	return input.username;
};
