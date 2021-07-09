import { Test } from "@nestjs/testing"
import { ApplicationRepository } from "../application.repository"
import { ScopesRepository } from "../../scopes/scopes.repository"
import { EntityManager } from "typeorm"
import { ApplicationDataDto } from "../dto/application-data.dto"
import { ConflictException, InternalServerErrorException } from "@nestjs/common"
import { ApplicationScopesDto } from "../dto/application-scopes.dto"

describe("Applications Repository", () => {
  let applicationRepository, scopesRepository, save

  beforeEach(async () => {
    const model = await Test.createTestingModule({
      providers: [ApplicationRepository, EntityManager, ScopesRepository]
    }).compile()

    applicationRepository = model.get<ApplicationRepository>(ApplicationRepository)
    scopesRepository = model.get<ScopesRepository>(ScopesRepository)

    save = jest.fn()
    applicationRepository.manager.create = jest.fn().mockReturnValue({ save })
    applicationRepository.manager.findOne = jest.fn().mockReturnValue({ save })
    scopesRepository.manager.findOne = jest.fn()
  })

  describe("createApplication", () => {
    const applicationDataDto: ApplicationDataDto = {
      name: "testApplicationName",
      clientId: "testClientUuid",
      scopes: "test_scopes_all"
    }

    it("Create application successfully", async () => {
      save.mockResolvedValue(true)
      scopesRepository.manager.findOne.mockResolvedValue({ name: "test_scopes_all" })

      const result = await applicationRepository.createApplication(applicationDataDto)
      expect(result).toMatchObject({
        name: "testApplicationName",
        clientId: "testClientUuid",
        scopes: [{ name: "test_scopes_all" }]
      })
    })

    it("Create application successfully scope not found", async () => {
      save.mockResolvedValue(true)

      scopesRepository.manager.findOne.mockResolvedValue(null)

      expect(scopesRepository.manager.findOne).not.toHaveBeenCalled()
      const result = await applicationRepository.createApplication(applicationDataDto)
      expect(scopesRepository.manager.findOne).toHaveBeenCalled()
      expect(result).toMatchObject({
        name: "testApplicationName",
        clientId: "testClientUuid",
        scopes: []
      })
    })

    it("Create application failed due to application name conflict", () => {
      save.mockRejectedValue({ code: "ER_DUP_ENTRY" })
      expect(scopesRepository.manager.findOne).not.toHaveBeenCalled()
      expect(applicationRepository.createApplication(applicationDataDto)).rejects.toThrow(
        new ConflictException("Application name entered is already taken.")
      )
      expect(scopesRepository.manager.findOne).toHaveBeenCalled()
    })

    it("Create application failed with InternalServerErrorException", () => {
      save.mockRejectedValue({ code: undefined })
      expect(scopesRepository.manager.findOne).not.toHaveBeenCalled()
      expect(applicationRepository.createApplication(applicationDataDto)).rejects.toThrow(
        new InternalServerErrorException()
      )
      expect(scopesRepository.manager.findOne).toHaveBeenCalled()
    })
  })

  describe("createApplicationScopesRelationship", () => {
    it("Application / scopes relationship created successfully", async () => {
      const applicationScopesDto: ApplicationScopesDto = {
        applicationId: "testApplicationUuid",
        scopes: "test_scopes_all"
      }

      scopesRepository.manager.findOne.mockResolvedValue({ name: "test_scopes_all" })
      applicationRepository.forEach = jest.fn()
      save.mockResolvedValue(true)
      const mockFindOneResult = {
        id: "testApplicationUuid",
        clientId: "testClientUuid",
        name: "testApplicationName",
        scopes: [
          {
            id: "testScopeUuid",
            name: "test_scopes_all"
          }
        ],
        save
      }
      applicationRepository.manager.findOne.mockResolvedValue(mockFindOneResult)

      expect(scopesRepository.manager.findOne).not.toHaveBeenCalled()
      const result = await applicationRepository.createApplicationScopesRelationship(
        applicationScopesDto
      )
      expect(scopesRepository.manager.findOne).toHaveBeenCalled()
      expect(result).toContainEqual(mockFindOneResult)
    })
  })

  describe("getApplicationScopesNames", () => {
    it("Get names of scopes related to the application", async () => {
      applicationRepository.manager.query = jest
        .fn()
        .mockResolvedValue([{ name: "test_scopes_all" }])

      expect(applicationRepository.manager.query).not.toHaveBeenCalled()
      const result = await applicationRepository.getApplicationScopesNames("testApplicationUuid")
      expect(applicationRepository.manager.query).toHaveBeenCalled()
      expect(result).toMatchObject(["test_scopes_all"])
    })

    it("Get names of scopes returns empty array", async () => {
      applicationRepository.manager.query = jest.fn().mockResolvedValue(null)

      expect(applicationRepository.manager.query).not.toHaveBeenCalled()
      const result = await applicationRepository.getApplicationScopesNames("testApplicationUuid")
      expect(applicationRepository.manager.query).toHaveBeenCalled()
      expect(result).toEqual([])
    })

    it("Get names of scopes fails with InternalServerErrorException", () => {
      applicationRepository.manager.query = jest
        .fn()
        .mockRejectedValue(new InternalServerErrorException())

      expect(applicationRepository.manager.query).not.toHaveBeenCalled()
      expect(
        applicationRepository.getApplicationScopesNames("testApplicationUuid")
      ).rejects.toThrow(new InternalServerErrorException())
      expect(applicationRepository.manager.query).toHaveBeenCalled()
    })
  })

  describe("getPartnerApplications", () => {
    it("Get all the applications related to the clientId entered", async () => {
      applicationRepository.manager.find = jest.fn().mockResolvedValue([
        {
          id: "a697279f-7394-4ca3-830b-c8cf6b8ff5d0",
          clientId: "f6ae7cbf-52eb-414b-95fa-5d81e949e2f8",
          name: "test-application",
          revokedAt: null,
          createdAt: "2021-06-30T21:35:51.596Z",
          updateAt: "2021-06-30T21:35:51.596Z"
        }
      ])

      expect(applicationRepository.manager.find).not.toHaveBeenCalled()
      const result = await applicationRepository.getPartnerApplications(
        "f6ae7cbf-52eb-414b-95fa-5d81e949e2f8"
      )
      expect(applicationRepository.manager.find).toHaveBeenCalled()
      expect(result).toMatchObject([
        {
          id: "a697279f-7394-4ca3-830b-c8cf6b8ff5d0",
          clientId: "f6ae7cbf-52eb-414b-95fa-5d81e949e2f8",
          name: "test-application",
          revokedAt: null,
          createdAt: "2021-06-30T21:35:51.596Z",
          updateAt: "2021-06-30T21:35:51.596Z"
        }
      ])
    })

    it("Get all the applications related to the clientId entered fails with InternalServerErrorException", async () => {
      applicationRepository.manager.find = jest
        .fn()
        .mockRejectedValue(new InternalServerErrorException())

      expect(applicationRepository.manager.find).not.toHaveBeenCalled()
      await expect(
        applicationRepository.getPartnerApplications("f6ae7cbf-52eb-414b-95fa-5d81e949e2f8")
      ).rejects.toThrow(new InternalServerErrorException())
      expect(applicationRepository.manager.find).toHaveBeenCalled()
    })
  })
})
