import pino, { Logger } from "pino";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let logger: Logger | any;

try {
  const devTransport = pino.transport({
    targets: [
      {
        target: "pino-pretty",
        options: {
          colorize: true,
        },
      },
      {
        target: "pino/file",
        options: {
          destination: "./logs/output.log",
          mkdir: true,
        },
      },
    ],
  });
  
  const prodTransport = pino.transport({
    target: "@logtail/pino",
    options: { sourceToken: process.env.BETTERSTACK_TOKEN },
  });
  
  const transport =
    process.env.NODE_ENV === "development" ? devTransport : prodTransport;
  
  logger = pino(transport);
  
} catch {
  logger = null
}

export default logger;
