import { Repository, EntityRepository, getManager, EntityManager } from "typeorm"
import { InternalServerErrorException, Logger, ConflictException } from "@nestjs/common"
import { ApplicationDataDto } from "./dto/application-data.dto"
import { Applications } from "../entities/applications.entity"
import { ScopesRepository } from "../scopes/scopes.repository"
import { Scopes } from "../entities/scopes.entity"
import { ApplicationScopesDto } from "./dto/application-scopes.dto"

@EntityRepository(Applications)
export class ApplicationRepository extends Repository<Applications> {
  private logger = new Logger("ApplicationRepository")
  private getScopes = false

  constructor(
    public manager: EntityManager = getManager(),
    private scopesRepository: ScopesRepository
  ) {
    super()
  }

  async createApplication(applicationDataDto: ApplicationDataDto): Promise<Applications> {
    const { name, clientId, scopes } = applicationDataDto
    try {
      const application = this.manager.create(Applications)
      application.clientId = clientId
      application.name = name

      // Create scopes relationships
      const applicationScopesDto: ApplicationScopesDto = {
        applicationId: application.id,
        scopes
      }
      /**
       * class variable getScopes = true indicates that we want to get the Scopes[]
       * from the createApplicationScopesRelationship and than save the application
       * with its scopes relationships
       */
      this.getScopes = true
      application.scopes = await this.createApplicationScopesRelationship(applicationScopesDto)
      await application.save()

      return application
    } catch (error) {
      this.logger.error(
        `Method: createApplication, name: ${name}, clientId: ${clientId}, error code: ${error.code}`,
        error.stack
      )
      throw error.code === "ER_DUP_ENTRY"
        ? new ConflictException("Application name entered is already taken.")
        : new InternalServerErrorException()
    }
  }

  async createApplicationScopesRelationship(
    applicationScopesDto: ApplicationScopesDto
  ): Promise<Scopes[]> {
    const { applicationId, scopes } = applicationScopesDto
    const applicationScopes = []
    const scopesArray = scopes.split(",")
    for (let i = 0; i < scopesArray.length; i++) {
      const scope = await this.scopesRepository.manager.findOne(Scopes, {
        where: { name: scopesArray[i].trim() }
      })
      if (!scope) {
        this.logger.error(
          `Method: createApplication, process: create scopes relationship, scope: ${scopesArray[
            i
          ].trim()} not found!`
        )
      } else {
        applicationScopes.push(scope)
      }
    }

    /**
     * If this function is called from the endpoint to add new scope(s) to the application
     */
    if (!this.getScopes) {
      const application = await this.manager.findOne(Applications, {
        where: { id: applicationId },
        relations: ["scopes"]
      })

      // Adds scope relationship if application.scopes don't have it.
      const ids = []
      application.scopes.forEach((as) => {
        ids.push(as.id)
      })
      applicationScopes.filter((s) => {
        !ids.includes(s.id) ? application.scopes.push(s) : null
      })
      application.save()

      return application.scopes
    }

    return applicationScopes
  }

  /**
   * Returns array with names of scopes of an application
   */
  async getApplicationScopesNames(data: string): Promise<string[]> {
    try {
      const applicationId = typeof data === "object" ? data["applicationId"] : data
      const sqlQuery = `SELECT name FROM scopes 
            LEFT JOIN applications_scopes_scopes 
            ON scopes.id=applications_scopes_scopes.scopesId
            WHERE applications_scopes_scopes.applicationsId="${applicationId}"`

      const result = await this.manager.query(sqlQuery)
      if (result) {
        const scopesNames = result.flatMap((scope) => scope.name)
        return scopesNames
      }
      return []
    } catch (error) {
      this.logger.error(
        `Method: getApplicationScopesNames, data: ${JSON.stringify(data)}, error:`,
        error.stack
      )
      throw new InternalServerErrorException()
    }
  }

  async getPartnerApplications(clientId: string): Promise<Applications[]> {
    try {
      const applications = await this.manager.find(Applications, {
        where: { clientId },
        relations: ["scopes", "credentials"]
      })
      return applications
    } catch (error) {
      this.logger.error(
        `Method: getPartnerApplications, clientId: ${JSON.stringify(clientId)}, error:`,
        error.stack
      )
      throw new InternalServerErrorException()
    }
  }
}
