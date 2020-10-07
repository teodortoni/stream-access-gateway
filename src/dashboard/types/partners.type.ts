import { Field, ID, ObjectType } from "@nestjs/graphql"
import { IsDateString } from "class-validator"
import { ApplicationsType } from "./applications.type"
import { EncryptionKeypairType } from "./encryption-keypair.type"

@ObjectType("Partners")
export class PartnersType {
  @Field((type) => ID)
  clientId: string

  @Field()
  name: string

  @Field()
  secret: string

  @IsDateString()
  @Field({ nullable: true })
  revokedAt?: string

  @IsDateString()
  @Field()
  createdAt: string

  @IsDateString()
  @Field()
  updatedAt: string

  @Field((type) => [ApplicationsType])
  applications: [ApplicationsType]

  @Field((type) => EncryptionKeypairType)
  encryptionKeypair: EncryptionKeypairType
}
