import { NestFactory } from "@nestjs/core"
import { AppModule } from "./app.module"
import { Logger } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"

async function bootstrap() {
  const logger = new Logger("bootstrap")

  const app = await NestFactory.create(AppModule)
  app.enableCors()
  const dotenv = app.get(ConfigService)

  const port = dotenv.get("app.port")

  logger.verbose(`App running on port ${port}`)
  await app.listen(port)
}
bootstrap()
