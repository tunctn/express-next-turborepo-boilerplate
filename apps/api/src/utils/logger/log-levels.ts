export const logLevels = {
  levels: {
    error: 0,
    warn: 1,
    success: 2,
    info: 3,
    http: 4,
    verbose: 5,
    debug: 6,
    silly: 7,
  },
  colors: {
    error: "red",
    warn: "yellow",
    success: "green",
    info: "grey",
    http: "magenta",
    verbose: "cyan",
    debug: "blue",
    silly: "rainbow",
  },
} as const;
