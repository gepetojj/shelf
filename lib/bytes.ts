export const KILOBYTE = 1024;
export const MEGABYTE = 1024 * KILOBYTE;
export const GIGABYTE = 1024 * MEGABYTE;

export const megaToBytes = (mb: number) => {
	return mb * MEGABYTE;
};
