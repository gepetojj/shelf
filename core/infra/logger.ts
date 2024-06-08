import winston from "winston";

const consoleFormat = winston.format.printf(({ level, message, timestamp, ...extra }) => {
	const colors = winston.format.colorize();
	const info = colors.transform({ [Symbol.for("level")]: level, level, message }, { all: true }) as any;
	const splat = extra[Symbol.for("splat")];

	return `[${info.level}] [${timestamp}] ${info.message} ${splat ? JSON.stringify(splat) : ""}`;
});

export const logger = winston.createLogger({
	level: process.env.NODE_ENV === "production" ? "verbose" : "debug",
	format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
	transports: [
		new winston.transports.Console({
			format: winston.format.combine(winston.format.timestamp(), consoleFormat),
		}),
	],
});
