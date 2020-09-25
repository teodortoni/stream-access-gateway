import { IsString, IsNotEmpty, MaxLength } from "class-validator"

export class PartnerLiveStreamParams {
  @IsString()
  @IsNotEmpty()
  @MaxLength(36)
  clientId: string

  @IsString()
  @IsNotEmpty()
  @MaxLength(36)
  applicationId: string
}
