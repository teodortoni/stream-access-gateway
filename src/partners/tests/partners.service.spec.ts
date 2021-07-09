import { Test } from "@nestjs/testing"
import { PartnersService } from "../partners.service"
import { PartnersRepository } from "../partners.repository"
import { v4 as uuid } from "uuid"
import { ApplicationsService } from "../../applications/applications.service"
import { CredentialsService } from "../../credentials/credentials.service"
import { ApplicationRepository } from "../../applications/application.repository"
import { CredentialsRepository } from "../../credentials/credentials.repository"
import { EncryptionKeypairService } from "../../encryptionkeypair/encryptionkeypair.service"
import { EncryptionKeypairRepository } from "../../encryptionkeypair/encryptionkeypair.repository"

describe("PartnerService", () => {
  let partnersService, partnersRepository, applicationsService

  const mockAuthCredentialsDto = {
    name: "testName",
    username: "testUsername",
    password: "Th1s1sat3stpwd"
  }

  const mockPartnersRepository = () => ({
    register: jest.fn()
  })

  const mockApplicationRepository = () => ({})

  const mockCredentialsRepository = () => ({})

  const mockEncryptionKeypairRepository = () => ({})

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        PartnersService,
        { provide: PartnersRepository, useFactory: mockPartnersRepository },
        ApplicationsService,
        { provide: ApplicationRepository, useFactory: mockApplicationRepository },
        CredentialsService,
        { provide: CredentialsRepository, useFactory: mockCredentialsRepository },
        EncryptionKeypairService,
        { provide: EncryptionKeypairRepository, useFactory: mockEncryptionKeypairRepository }
      ]
    }).compile()

    partnersService = await module.get<PartnersService>(PartnersService)
    partnersRepository = await module.get<PartnersRepository>(PartnersRepository)
    applicationsService = await module.get<ApplicationsService>(ApplicationsService)
  })

  describe("register", () => {
    it("Partner and Application registration with Scopes", async () => {
      const clientId = uuid()
      const applciationId = uuid()
      const clientSecret = '"-----BEGIN ENCRYPTED PRIVATE KEY-----\n"'
      const mockRegisterResults = {
        clientId,
        applciationId,
        clientSecret
      }

      // Mock partners.repository register
      partnersRepository.register.mockResolvedValue(mockRegisterResults)

      const result = await partnersService.register(mockAuthCredentialsDto)

      expect(result).toEqual({ clientId, applciationId, clientSecret })
    })
  })

  describe("getAll", () => {
    it("Retrieve all partners", async () => {
      const mockAllPartners = [
        {
          clientId: "f6ae7cbf-52eb-414b-95fa-5d81e949e2f8",
          name: "TestPartner",
          secret: "$2a$10$zq6pbjqcGY8Qem9jQlTmme",
          revokedAt: null,
          createdAt: "2021-06-30T21:35:50.807Z",
          updatedAt: "2021-06-30T21:35:50.807Z"
        }
      ]
      partnersRepository.getAll = jest.fn().mockResolvedValueOnce(mockAllPartners)
      const result = await partnersService.getAll()
      expect(result).toMatchObject(mockAllPartners)
    })
  })

  describe("getApplications", () => {
    it("Retrieve all partner applications", async () => {
      const mockPartnerApplications = [
        {
          id: "a697279f-7394-4ca3-830b-c8cf6b8ff5d0",
          clientId: "f6ae7cbf-52eb-414b-95fa-5d81e949e2f8",
          name: "test-application",
          revokedAt: null,
          createdAt: "2021-06-30T21:35:51.596Z",
          updateAt: "2021-06-30T21:35:51.596Z"
        }
      ]
      applicationsService.getPartnerApplications = jest
        .fn()
        .mockResolvedValueOnce(mockPartnerApplications)
      const result = await partnersService.getApplications("f6ae7cbf-52eb-414b-95fa-5d81e949e2f8")
      expect(result).toMatchObject(mockPartnerApplications)
    })
  })
})
