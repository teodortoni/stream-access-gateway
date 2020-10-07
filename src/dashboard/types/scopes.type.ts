import { Field, ID, ObjectType } from "@nestjs/graphql"
import { IsDateString } from "class-validator"

@ObjectType("Scopes")
export class ScopesType {
  @Field((type) => ID)
  id: string

  @Field()
  name: string

  @Field({ nullable: true })
  revokedAt: Date

  @IsDateString()
  @Field()
  createdAt: Date

  @IsDateString()
  @Field()
  updatedAt: Date
}
