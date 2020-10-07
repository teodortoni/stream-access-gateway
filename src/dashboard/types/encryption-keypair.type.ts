import { Field, ID, ObjectType } from "@nestjs/graphql"
import { IsDateString } from "class-validator"
import { PartnersType } from "./partners.type"

@ObjectType("EncryptionKeypair")
export class EncryptionKeypairType {
  @Field((type) => ID)
  id: string

  @Field((type) => ID)
  clientId: string

  @Field()
  publicKey: string

  @Field()
  privateKey: string

  @IsDateString()
  @Field()
  createdAt: Date

  @IsDateString()
  @Field()
  updatedAt: Date

  @Field((type) => PartnersType)
  partner: PartnersType
}
