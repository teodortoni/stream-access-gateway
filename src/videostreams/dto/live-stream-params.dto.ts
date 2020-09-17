import { IsString, IsNotEmpty, MaxLength, IsOptional } from "class-validator"

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
  @MaxLength(36)
  @IsOptional()
  contentVersionWweid: string

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  liveStreamPath: string
}
