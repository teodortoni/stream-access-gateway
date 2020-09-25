import { Injectable } from "@nestjs/common"
import { CredentialsRepository } from "./credentials.repository"
import { Credentials } from "src/entities/credentials.entity"
import { CredentialDataDto } from "./dto/credential-data.dto"

@Injectable()
export class CredentialsService {
  constructor(private repository: CredentialsRepository) {}

  createCredentials(credentialDataDto: CredentialDataDto): Promise<Credentials> {
    return this.repository.createCredentials(credentialDataDto)
  }

  getPartnerCredentials(clientId: string): Promise<Credentials[]> {
    return this.repository.getPartnerCredentials(clientId)
  }
}
