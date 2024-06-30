export const MILLISECOND = 1;
export const SECOND = MILLISECOND * 1000;
export const MINUTE = SECOND * 60;
export const HOUR = MINUTE * 60;
export const DAY = HOUR * 24;

export const now = () => {
	return new Date().valueOf();
};

export const seconds = (ms: number) => {
	return Math.floor(ms / SECOND);
};

export const daysBetween = (date1: Date, date2: Date) => {
	const diff = date2.getTime() - date1.getTime();
	return Math.floor(diff / (1000 * 60 * 60 * 24));
};

export const removeTime = (date: Date) => {
	return new Date(date.toISOString().split("T")[0] + "T00:00:00Z");
};
