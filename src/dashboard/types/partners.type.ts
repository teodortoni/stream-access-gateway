import { Field, ObjectType } from "@nestjs/graphql"
import { IsDateString } from "class-validator"

@ObjectType("Partners")
export class PartnersType {
  @Field()
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

  // @OneToMany(
  //   (type) => Applications,
  //   (applications) => applications.partner
  // )
  // applications: Applications

  // @OneToOne(
  //   (type) => EncryptionKeypair,
  //   (encryptionKeypair) => encryptionKeypair.partner
  // )
  // encryptionKeypair: EncryptionKeypair
}
