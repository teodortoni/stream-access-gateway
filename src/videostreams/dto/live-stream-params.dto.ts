import { IsString, IsNotEmpty, MaxLength } from "class-validator"

export class LiveStreamParams {
  @IsString()
  @IsNotEmpty()
  @MaxLength(36)
  clientId: string

  @IsString()
  @IsNotEmpty()
  @MaxLength(36)
  applicationId: string

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  liveStreamPath: string
}
