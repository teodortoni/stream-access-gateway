import { Field, ID, ObjectType } from "@nestjs/graphql"
import { IsDateString } from "class-validator"
import { ApplicationsType } from "./applications.type"

@ObjectType("Credentials")
export class CredentialsType {
  @Field((type) => ID)
  id: string

  @Field((type) => ID)
  clientId: string

  @Field((type) => ID)
  applicationId: string

  @Field()
  publicKey: string

  @Field()
  privateKey: string

  @Field()
  active: boolean

  @Field({ nullable: true })
  revokedAt: Date

  @IsDateString()
  @Field()
  createdAt: Date

  @IsDateString()
  @Field()
  updatedAt: Date

  @Field((type) => ApplicationsType)
  application: ApplicationsType
}
