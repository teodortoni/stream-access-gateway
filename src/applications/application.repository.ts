import { Repository, EntityRepository } from "typeorm";
import { InternalServerErrorException, Logger, ConflictException } from "@nestjs/common";
import { ApplicationDataDto } from "./dto/application.data.dto";
import { Applications } from "src/entities/applications.entity";

@EntityRepository(Applications)
export class ApplicationRepository extends Repository<Applications> {
    private logger = new Logger('ApplicationRepository');

    async createApplication(applicationDataDto: ApplicationDataDto): Promise<Applications> {
        const { name, clientId } = applicationDataDto;
        try {
            const application = new Applications();
            application.clientId = clientId;
            application.name = name;
            application.revoked = false;
            await application.save();
            return application;
        } catch (error) {
            this.logger.error(`Method: createApplication, name: ${name}, clientId: ${clientId}, error code: ${error.code}`, error.stack);
            throw error.code === 'ER_DUP_ENTRY' ? new ConflictException('Application name entered is already taken.') : new InternalServerErrorException();
        }
    }
}