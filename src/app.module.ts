import { Module } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"
import { AuthModule } from "./auth/auth.module"
import { PartnersModule } from "./partners/partners.module"
import { TypeOrmModule } from "@nestjs/typeorm"
import { typeOrmConfig } from "../config/typeorm.config"
import { ApplicationsModule } from "./applications/applications.module"
import { CredentialsModule } from "./credentials/credentials.module"
import { ScopesModule } from "./scopes/scopes.module"
import { AccessTokenModule } from "./access-token/access-token.module"
import { EncryptionKeypairModule } from "./encryptionkeypair/encryptionkeypair.module"
import { ContentmetadataModule } from "./contentmetadata/contentmetadata.module"
import { VideostreamsModule } from "./videostreams/videostreams.module"
import defaultconfigs from "../config/defaultconfigs"
import { APP_GUARD } from "@nestjs/core"
import { ScopesGuard } from "./scopes/scopes.guard"
import { VocabModule } from "./vocab/vocab.module"
import { DashboardModule } from "./dashboard/dashboard.module"

@Module({
  imports: [
    AuthModule,
    PartnersModule,
    ApplicationsModule,
    CredentialsModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [defaultconfigs]
    }),
    TypeOrmModule.forRoot(typeOrmConfig),
    ScopesModule,
    AccessTokenModule,
    EncryptionKeypairModule,
    ContentmetadataModule,
    VocabModule,
    VideostreamsModule,
    DashboardModule
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ScopesGuard
    }
  ]
})
export class AppModule {}
