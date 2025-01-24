import { ApolloServer } from 'apollo-server-express';
import cors from 'cors';
import express, { Request, Response } from 'express';
import { ERROR_MESSAGES_KEYS, logErrorAsyncMessage, logMessage, STATUS_SERVER } from './common';
import { resolvers, typeDefs } from './graphql';

import dotenv from 'dotenv';
import { handleVerifyToken } from './jwt';

// Load environment variables from .env file
dotenv.config();
const app = express();
app.get('/', (_: object, res: { send: (arg0: string) => void }) => {
  res.send('Example Server');
});

const corsOptions = {
  origin: ['https://studio.apollographql.com', 'http://localhost:3000'],
  credentials: true, // <-- REQUIRED backend setting
};
app.use(cors(corsOptions));
// app.use(cookieParser());
app.use((req: Request, res: Response, next: () => void) => {
  try {
    handleVerifyToken(req);
    next();
  } catch (err: unknown) {
    if (err instanceof Error) {
      logMessage(`${logErrorAsyncMessage('src/server', `Error handleVerifyToken: ${err.message}`)}`);
    } else {
      logMessage(`${logErrorAsyncMessage('src/server', `Error handleVerifyToken: unknown error occured`)}`);
    }
    res
      .status(STATUS_SERVER.FORBIDDEN)
      .json({ status: STATUS_SERVER.FORBIDDEN, isError: true, messageKey: ERROR_MESSAGES_KEYS.NOT_ALLOWED });
  }
});

async function startServer() {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: async () => {},
  });
  await server.start();

  server.applyMiddleware({
    // @ts-expect-error as app is not type of express
    app,
    path: '/',
    cors: false, // disables the apollo-server-express cors to allow the cors middleware use
  });
}

const port: number = process.env.PORT ? parseInt(process.env.PORT) : 4000;

startServer();

app.listen({ port }, () => console.log(`🚀 Server ready at http://localhost:4000`));
