import { EntityRepository, Repository, EntityManager, getManager } from "typeorm"
import { Credentials } from "../entities/credentials.entity"
import { Logger, InternalServerErrorException } from "@nestjs/common"
import { CredentialDataDto } from "./dto/credential-data.dto"
import { ConfigService } from "@nestjs/config"
import { generatePublicPrivateKeyPair } from "../../scripts/helpers"

@EntityRepository(Credentials)
export class CredentialsRepository extends Repository<Credentials> {
  private logger = new Logger("CredentialsRepository")

  constructor(public manager: EntityManager = getManager(), private configService: ConfigService) {
    super()
  }

  async createCredentials(credentialDataDto: CredentialDataDto): Promise<Credentials> {
    const { clientId, applicationId, secret } = credentialDataDto

    try {
      const credentials = this.manager.create(Credentials)
      credentials.clientId = clientId
      credentials.applicationId = applicationId
      const keyPair = await generatePublicPrivateKeyPair(secret)
      credentials.publicKey = keyPair["publicKey"]
      credentials.privateKey = keyPair["privateKey"]
      credentials.active = true
      await credentials.save()
      return credentials
    } catch (error) {
      this.logger.error(
        `Method: createCredentials, clientId: ${clientId}, applicationId: ${applicationId}, error code: ${error.code}`,
        error.stack
      )
      throw new InternalServerErrorException()
    }
  }

  async getPartnerCredentials(clientId: string): Promise<Credentials[]> {
    try {
      return await this.manager.find(Credentials, { where: { clientId } })
    } catch (error) {
      this.logger.error(
        `Method: getPartnerCredentials, clientId: ${clientId}, error code: ${error.code}`,
        error.stack
      )
      throw new InternalServerErrorException()
    }
  }
}
