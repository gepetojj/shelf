export const unique = (arr: string[]) => {
	return arr.sort((a, b) => a.localeCompare(b)).filter((item, index) => arr.indexOf(item) === index);
};
