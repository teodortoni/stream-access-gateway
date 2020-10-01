import { Injectable } from "@nestjs/common"
import { PartnersRepository } from "./partners.repository"
import { PartnerApplicationRegisterData } from "./dto/partner-application-register.data.dto"
import { ApplicationsService } from "../applications/applications.service"
import { CredentialsService } from "../credentials/credentials.service"
import { EncryptionKeypairService } from "../encryptionkeypair/encryptionkeypair.service"
import { Partners } from "src/entities/partners.entity"
import { Applications } from "src/entities/applications.entity"

@Injectable()
export class PartnersService {
  constructor(
    private applicationsService: ApplicationsService,
    private credentialsService: CredentialsService,
    private encryptionKeypairService: EncryptionKeypairService,
    private partnersRepository: PartnersRepository
  ) {}

  async getAll(): Promise<Partners[]> {
    return await this.partnersRepository.getAll()
  }

  async getApplications(clientId: string): Promise<Applications[]> {
    return await this.applicationsService.getPartnerApplications(clientId)
  }

  register(registerData: PartnerApplicationRegisterData) {
    return this.partnersRepository.register(
      registerData,
      this.applicationsService,
      this.credentialsService,
      this.encryptionKeypairService
    )
  }

  async partner(id: string): Promise<Partners> {
    return await this.partnersRepository.partner(id)
  }

  async delete(partner: Partners) {
    return await this.partnersRepository.manager.remove(partner)
  }
}
