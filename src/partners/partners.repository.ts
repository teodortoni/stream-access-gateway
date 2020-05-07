import { Repository, EntityRepository } from "typeorm";
import * as bcrypt from "bcryptjs";
import { InternalServerErrorException, Logger, ConflictException } from "@nestjs/common";
import { PartnerApplicationRegisterData } from "./dto/partner-application-register.data.dto";
import { Partners } from "src/entities/partners.entity";
import { ApplicationDataDto } from "src/applications/dto/application.data.dto";
import { ApplicationsService } from "src/applications/applications.service";
import { CredentialsService } from "src/credentials/credentials.service";
import { CredentialDataDto } from "src/credentials/dto/credential-data.dto";

@EntityRepository(Partners)
export class PartnersRepository extends Repository<Partners> {
    private logger = new Logger('PartnersRepository');

    async register(
        registerData: PartnerApplicationRegisterData,
        applicationsService: ApplicationsService,
        credentialsService: CredentialsService,
    ): Promise<object> {
        const { clientName, clientApplicationName } = registerData;

        let partner;
        try {
            partner = this.create();
            partner.name = clientName;
            partner.secret = await bcrypt.genSalt();
            partner.revoked = false;
            await partner.save();
        } catch (error) {
            this.logger.error(`Method: register, data: ${JSON.stringify(registerData)}, error code: ${error.code}`, error.stack);
            throw error.code === 'ER_DUP_ENTRY' ? new ConflictException('Partner name entered is already taken.') : new InternalServerErrorException();
        }

        const applicationData: ApplicationDataDto = {
            name: clientApplicationName,
            clientId: partner.clientId
        };

        // Create application
        const application = await applicationsService.createApplication(applicationData);
        
        // Create application credentials
        let credentials;
        if (application) {
            const credentialData: CredentialDataDto = {
                clientId: partner.clientId,
                applicationId: application.id,
                secret: partner.secret
            };

            credentials = await credentialsService.createCredentials(credentialData);
        }

        return {
            clientId: partner.clientId,
            applicationId: application.id,
            clientSecret: credentials.privateKey // potentially private key or hmac signature
        };
    }

    private async hashedPassword(password: string, salt: string): Promise<string> {
        return bcrypt.hash(password, salt);
    }
}