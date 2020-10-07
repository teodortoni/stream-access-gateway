import { Field, ID, ObjectType } from "@nestjs/graphql"
import { IsDateString } from "class-validator"
import { ApplicationsType } from "./applications.type"

@ObjectType("AccessTokens")
export class AccessTokensType {
  @Field((type) => ID)
  id: string

  @Field((type) => ID)
  clientId: string

  @Field((type) => ID)
  applicationId: string

  @Field((type) => ID)
  credentialsId: string

  @Field()
  signature: string

  @Field({ nullable: true })
  revokedAt: Date

  @Field()
  expiresIn: number

  @IsDateString()
  @Field()
  expiresAt: Date

  @IsDateString()
  @Field()
  createdAt: Date

  @IsDateString()
  @Field()
  updatedAt: Date

  @Field((type) => ApplicationsType)
  application: ApplicationsType
}
