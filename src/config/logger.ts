import pino from 'pino';

const devTransport = pino.transport({
  targets: [
    {
      target: 'pino-pretty',
      options: {
        colorize: true,
      },
    },
    {
      target: 'pino/file',
      options: {
        destination: './logs/output.log',
        mkdir: true,
      },
    },
  ],
});

const prodTransport = pino.transport({
  target: '@logtail/pino',
  options: { sourceToken: process.env.BETTERSTACK_TOKEN },
});

const transport = process.env.NODE_ENV === 'development' ? devTransport : prodTransport;

const logger = pino(transport);

export default logger;
