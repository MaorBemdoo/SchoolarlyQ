import pino, { transport } from "pino";

const isEdge = process.env.NEXT_RUNTIME === "edge";
const isDev = process.env.NODE_ENV === "development"

let logger = pino({ level: "info" });

if (!isEdge) {
  let resolvedTransport;
  if(isDev){
    resolvedTransport = transport({
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
  } else{
    resolvedTransport = transport({
      target: "@logtail/pino",
      options: { sourceToken: process.env.BETTERSTACK_TOKEN },
    });
  }

  logger = pino(resolvedTransport);
}

export default logger;
