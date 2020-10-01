import { Repository, EntityRepository, EntityManager, getManager } from "typeorm"
import * as bcrypt from "bcryptjs"
import { InternalServerErrorException, Logger, ConflictException } from "@nestjs/common"
import { PartnerApplicationRegisterData } from "./dto/partner-application-register.data.dto"
import { Partners } from "../entities/partners.entity"
import { ApplicationDataDto } from "src/applications/dto/application-data.dto"
import { ApplicationsService } from "../applications/applications.service"
import { CredentialsService } from "src/credentials/credentials.service"
import { CredentialDataDto } from "src/credentials/dto/credential-data.dto"
import { EncryptionKeypairService } from "src/encryptionkeypair/encryptionkeypair.service"
import { CreateKeypairDataDto } from "src/encryptionkeypair/dto/create-keypair-data.dto"

@EntityRepository(Partners)
export class PartnersRepository extends Repository<Partners> {
  private logger = new Logger("PartnersRepository")

  constructor(public manager: EntityManager = getManager()) {
    super()
  }

  async getAll(): Promise<Partners[]> {
    try {
      return await this.find()
    } catch (error) {
      this.logger.error(`Method: getAll, error: ${error}`, error.stack)
      throw new InternalServerErrorException()
    }
  }

  async partner(clientId: string): Promise<Partners> {
    try {
      return await this.manager.findOne(Partners, {
        where: { clientId },
        relations: [
          "applications",
          "applications.scopes",
          "applications.credentials",
          "encryptionKeypair"
        ]
      })
    } catch (error) {
      this.logger.error(`Method: partner, error: ${error}`, error.stack)
      throw new InternalServerErrorException()
    }
  }

  async register(
    registerData: PartnerApplicationRegisterData,
    applicationsService: ApplicationsService,
    credentialsService: CredentialsService,
    encryptionKeypairService: EncryptionKeypairService
  ): Promise<object> {
    const { clientName, clientApplicationName, scopes } = registerData

    let partner
    try {
      partner = this.create()
      partner.name = clientName
      partner.secret = await bcrypt.genSalt()
      await partner.save()
    } catch (error) {
      this.logger.error(
        `Method: register, data: ${JSON.stringify(registerData)}, error code: ${error.code}`,
        error.stack
      )
      throw error.code === "ER_DUP_ENTRY"
        ? new ConflictException("Partner name entered is already taken.")
        : new InternalServerErrorException()
    }

    const createKeypairDataDto: CreateKeypairDataDto = {
      clientId: partner.clientId,
      secret: partner.secret
    }

    // Create partner encryption key pair
    const encryptionKeypair = await encryptionKeypairService.createKeypair(createKeypairDataDto)

    const applicationData: ApplicationDataDto = {
      name: clientApplicationName,
      clientId: partner.clientId,
      scopes
    }

    // Create application
    const application = await applicationsService.createApplication(applicationData)

    // Create application credentials
    let credentials
    if (application) {
      const credentialData: CredentialDataDto = {
        clientId: partner.clientId,
        applicationId: application.id,
        secret: partner.secret
      }

      credentials = await credentialsService.createCredentials(credentialData)
    }

    return {
      clientId: partner.clientId,
      applicationId: application.id,
      clientSecret: credentials.privateKey,
      encryptionPublicKey: encryptionKeypair.publicKey
    }
  }

  private async hashedPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt)
  }
}
