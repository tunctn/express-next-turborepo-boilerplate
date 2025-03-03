import winston from "winston";

export const logFormat = winston.format.printf(({ timestamp, level, message, ...meta }) => {
  let formattedMessage = `${timestamp} [${level.toUpperCase()}]: `;

  if (typeof message === "object") {
    formattedMessage += `\n${JSON.stringify({ ...message, ...meta }, null, 2)}`;
  } else if (Object.keys(meta).length > 0) {
    if (typeof message === "string") {
      formattedMessage += `${message}`;
    }
    formattedMessage += `\n${JSON.stringify({ ...meta }, null, 2)}`;
  } else {
    formattedMessage += message;
  }

  return formattedMessage;
});
