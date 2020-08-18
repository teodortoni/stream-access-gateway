import { AuthenticatedPartner } from "src/auth/dto/authenticated-partner.dto"

export class VideoStreamParams {
  videoId: string
  format: string
  partner: AuthenticatedPartner
}
