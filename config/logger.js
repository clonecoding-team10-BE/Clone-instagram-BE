const { createLogger, transports, format } = require("winston");
const { combine, colorize, timestamp, printf} = format;
const env = process.env

const printLogformat = combine(
    timestamp({
        format: "YYYY-MM-DD HH:mm:dd"
    }),
    printf(({ timestamp, level, message }) => { 
        return `${timestamp} [${level}] ${message}`
    }) 
)
const ConsoleprintLogformat = combine(
    colorize(),
    printf(({ level, message }) => {
        return `[${level}]${message} `
    })
)
const logger = createLogger({
    transports: [
        new transports.File({
            filename: "access.log",
            dirname: "./logs",
            level: "info",
            format: printLogformat
        }),
    ]
});

//배포환경에서는 콘솔에 찍지 않고 파일에만 저장하기
if (env.NODE_ENV !== "production") {
    logger.add(new transports.Console({
        level: "info",
        format: ConsoleprintLogformat
    }))
}

module.exports = logger;