import * as dotenv from "dotenv"
dotenv.config()

export default () => ({
  api: {
    current: "v1",
    contentBaseUrl: process.env.CONTENT_API_BASE_URL || "https://api.example.com/v2"
  },
  app: {
    port: parseInt(process.env.PORT, 10) || 3010,
    db: {
      type: process.env.DB_TYPE || "mysql",
      host: process.env.HOSTNAME,
      port: parseInt(process.env.DB_PORT, 10) || 3306,
      username: process.env.USERNAME,
      password: process.env.PASSWORD,
      database: process.env.DB_NAME,
      migrationsTableName: process.env.MIGRATIONS_TABLE_NAME,
      synchronize: process.env.TYPEORM_SYNCHRONIZE,
      displaySql: process.env.DISPLAY_SQL
    },
    jwt: {
      algorithm: "RS256",
      expiresIn: process.env.JWT_EXPIRES_IN || 86400
    },
    crypto: {
      hmac: {
        algorithm: "sha256"
      }
    }
  },
  videoStreams: {
    hostName: process.env.EDGE_AUTH_HOSTNAME,
    encryptionKey: process.env.ENCRYPTION_KEY,
    windowSeconds: process.env.TOKEN_EXPIRATION_WINDOW_IN_SECONDS,
    liveHostName: process.env.EDGE_AUTH_LIVE_HOSTNAME,
    liveEncryptionKey: process.env.LIVE_ENCRYPTION_KEY,
    formats: process.env.VIDEO_STREAMS_FORMATS
  }
})
