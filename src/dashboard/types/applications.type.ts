import { Field, ID, ObjectType } from "@nestjs/graphql"
import { IsDateString } from "class-validator"
import { AccessTokensType } from "./access-tokens.type"
import { CredentialsType } from "./credentials.type"
import { PartnersType } from "./partners.type"
import { ScopesType } from "./scopes.type"

@ObjectType("Applications")
export class ApplicationsType {
  @Field((type) => ID)
  id: string

  @Field((type) => ID)
  clientId: string

  @Field()
  name: string

  @IsDateString()
  @Field({ nullable: true })
  revokedAt: Date

  @IsDateString()
  @Field()
  createdAt: Date

  @IsDateString()
  @Field()
  updateAt: Date

  @Field((type) => [ScopesType], { nullable: true })
  scopes?: [ScopesType]

  @Field()
  credentials: CredentialsType

  @Field((type) => AccessTokensType, { nullable: true })
  accessTokens?: AccessTokensType

  @Field((type) => PartnersType, { nullable: true })
  partner?: PartnersType
}
