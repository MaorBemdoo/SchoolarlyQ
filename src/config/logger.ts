import pino, { Logger, transport } from "pino";
import logtailPino from "@logtail/pino";

const isDev = process.env.NODE_ENV === "development";

export default async function initLogger(): Promise<Logger> {
  try {
    if (isDev) {
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
      return pino(devTransport);
    }
    const stream = await logtailPino({
      sourceToken: process.env.BETTERSTACK_TOKEN!,
      options: {},
    });
    return pino(stream);
  } catch {
    return pino({ level: "info" });
  }
}
