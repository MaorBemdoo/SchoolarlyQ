import pino, { transport } from "pino";

const isEdge = process.env.NEXT_RUNTIME === "edge";

let logger = pino({ level: "info" });

if (!isEdge) {
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
