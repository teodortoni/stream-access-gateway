import { NestFactory } from "@nestjs/core"
import { ExpressAdapter } from "@nestjs/platform-express"
import { AppModule } from "./app.module"
import { Handler, Context } from "aws-lambda"
import { Server } from "http"
import * as express from "express"
import { eventContext } from "aws-serverless-express/middleware"
import { proxy, createServer } from "aws-serverless-express"
import * as helmet from "helmet"

let cachedServer: Server

// NOTE: If you get ERR_CONTENT_DECODING_FAILED in your browser, this
// is likely due to a compressed response (e.g. gzip) which has not
// been handled correctly by aws-serverless-express and/or API
// Gateway. Add the necessary MIME types to binaryMimeTypes below
const binaryMimeTypes: string[] = []

async function bootstrapServer(): Promise<Server> {
  if (!cachedServer) {
    const expressApp = express()
    const app = await NestFactory.create(AppModule, new ExpressAdapter(expressApp))
    app.use(helmet())
    app.enableCors({
      origin: true,
      preflightContinue: true,
      methods: "GET, POST"
    })
    app.use(eventContext())
    await app.init()
    cachedServer = createServer(expressApp, undefined, binaryMimeTypes)
  }
  return cachedServer
}

export const handler: Handler = async (event: any, context: Context) => {
  cachedServer = await bootstrapServer()
  return proxy(cachedServer, event, context, "PROMISE").promise
}
