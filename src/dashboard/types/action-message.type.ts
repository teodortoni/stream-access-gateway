import { Field, ObjectType } from "@nestjs/graphql"

@ObjectType("ActionMessage")
export class ActionMessageType {
  @Field()
  status: string

  @Field()
  message: string
}
