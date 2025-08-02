import pino, { Logger } from "pino";

const isEdge = process.env.NEXT_RUNTIME === "edge";

let logger: Logger;

if (isEdge) {
  logger = pino({ level: "info" });
} else {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { transport } = require("pino");

  const devTransport = transport({
    targets: [
      {
        target: "pino-pretty",
        options: { colorize: true },
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

  const prodTransport = transport({
    target: "@logtail/pino",
    options: { sourceToken: process.env.BETTERSTACK_TOKEN },
  });

  const resolvedTransport =
    process.env.NODE_ENV === "development" ? devTransport : prodTransport;

  logger = pino(resolvedTransport);
}

export default logger;
