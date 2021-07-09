import { Test } from "@nestjs/testing"
import { ContentmetadataService } from "../contentmetadata.service"
import { HttpService, NotFoundException } from "@nestjs/common"
import { FreighterService } from "../../freighter/freighter.service"
import { getRepositoryToken } from "@nestjs/typeorm"
import { FreighterRepository } from "../../freighter/freighter.repository"
import { FreighterS3 } from "../../../scripts/FreighterS3"
import { ConfigService } from "@nestjs/config"
import { freighterdbOrmConfig } from "../../../config/freighterdb.config"
import mockFreighterGetSeriesByWweId from "../../freighter/tests/mockFreighterGetSeriesByWweId"
import mockFreighterGetSeasonByWweId from "../../freighter/tests/mockFreighterGetSeasonByWweId"
import mockFreighterGetVideoById from "../../freighter/tests/mockFreighterGetVideoById"

describe("ContentmetadataService", () => {
  let contentmetadataService, freighterService

  const mockFreighterRepo = () => ({
    query: jest.fn()
  })

  const mockConfigService = () => ({
    get: jest.fn().mockImplementation((key: string) => {
      switch (key) {
        case "videoStreams.encryptionKey":
          return "acf7eae71cb9f7263c4c5fe0f643c7f7"
        case "videoStreams.hostName":
          return "vod.sonyliv.wwe.com"

        default:
          break
      }
    })
  })

  const mockHttpService = () => ({
    get: jest.fn()
  })

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ContentmetadataService,
        { provide: ConfigService, useFactory: mockConfigService },
        FreighterS3,
        FreighterService,
        {
          provide: getRepositoryToken(FreighterRepository, freighterdbOrmConfig.name),
          useValue: mockFreighterRepo()
        },
        { provide: HttpService, useFactory: mockHttpService }
      ]
    }).compile()

    contentmetadataService = await module.get<ContentmetadataService>(ContentmetadataService)
    freighterService = await module.get<FreighterService>(FreighterService)
  })

  describe("getVideoById", () => {
    const wweid = "48b634bb-296f-a04e-a914-0d4ac6f58a45"
    it("Returns content data", async () => {
      freighterService.getVideoById = jest
        .fn()
        .mockImplementationOnce(() => mockFreighterGetVideoById)
      const content = await contentmetadataService.getVideoById(wweid)
      expect(content).toHaveProperty("video_type")
      expect(content).toHaveProperty("content-package")
      expect(content).toHaveProperty("release_date")
      expect(content).toHaveProperty("sunset_date")
      expect(content).toHaveProperty("ads_enabled")
      expect(content).toHaveProperty("availability")
      expect(content).toHaveProperty("episode")
      expect(content).toHaveProperty("event")
      expect(content).toHaveProperty("tag")
      expect(content).toHaveProperty("series")
      expect(content).toHaveProperty("season")
      expect(content).toHaveProperty("companion")
    })

    it("Fails to return content data", async () => {
      freighterService.getVideoById = jest.fn().mockImplementationOnce(() => Promise.reject())
      await expect(contentmetadataService.getVideoById(wweid)).rejects.toThrow()
    })

    it("Fails by returning empty content data object", async () => {
      freighterService.getVideoById = jest.fn().mockImplementationOnce(() => Promise.resolve({}))
      await expect(contentmetadataService.getVideoById(wweid)).rejects.toThrow()
    })
  })

  describe("getSeriesById", () => {
    it("Returns series data", async () => {
      freighterService.getSeriesById = jest
        .fn()
        .mockImplementationOnce(() => mockFreighterGetSeriesByWweId)
      const series = await contentmetadataService.getSeriesById(mockFreighterGetSeriesByWweId.wweid)
      expect(series).toHaveProperty("id")
      expect(series).toHaveProperty("name")
      expect(series).toHaveProperty("type")
      expect(series).toHaveProperty("class")
      expect(series).toHaveProperty("genre")
      expect(series).toHaveProperty("image")
      expect(series).toHaveProperty("wweid")
      expect(series).toHaveProperty("rating")
      expect(series).toHaveProperty("version")
      expect(series).toHaveProperty("category")
      expect(series).toHaveProperty("revision")
      expect(series).toHaveProperty("synopsis")
      expect(series).toHaveProperty("franchise")
    })

    it("Fails to return series data", async () => {
      freighterService.getSeriesById = jest.fn().mockImplementationOnce(() => Promise.reject())
      await expect(
        contentmetadataService.getSeriesById(mockFreighterGetSeriesByWweId.wweid)
      ).rejects.toThrow()
    })

    it("Series data is null", async () => {
      freighterService.getSeriesById = jest.fn().mockImplementationOnce(() => Promise.resolve(null))
      await expect(
        contentmetadataService.getSeriesById(mockFreighterGetSeriesByWweId.wweid)
      ).rejects.toThrow()
    })

    it("Series data not found", async () => {
      freighterService.getSeriesById = jest
        .fn()
        .mockImplementationOnce(() => Promise.reject(new NotFoundException()))
      await expect(
        contentmetadataService.getSeriesById(mockFreighterGetSeriesByWweId.wweid)
      ).rejects.toThrow()
    })
  })

  describe("getSeasonById", () => {
    it("Returns season data", async () => {
      freighterService.getSeasonById = jest
        .fn()
        .mockImplementationOnce(() => mockFreighterGetSeasonByWweId)
      const season = await contentmetadataService.getSeasonById(mockFreighterGetSeasonByWweId.wweid)
      expect(season).toHaveProperty("name")
      expect(season).toHaveProperty("year")
      expect(season).toHaveProperty("image")
      expect(season).toHaveProperty("wweid")
      expect(season).toHaveProperty("number")
      expect(season).toHaveProperty("series")
      expect(season).toHaveProperty("version")
      expect(season).toHaveProperty("revision")
      expect(season).toHaveProperty("sequence")
      expect(season).toHaveProperty("synopsis")
    })
  })

  it("Fails to return season data", async () => {
    freighterService.getSeasonById = jest.fn().mockImplementationOnce(() => Promise.reject())
    await expect(
      contentmetadataService.getSeasonById(mockFreighterGetSeasonByWweId.wweid)
    ).rejects.toThrow()
  })

  it("Season data is null", async () => {
    freighterService.getSeasonById = jest.fn().mockImplementationOnce(() => Promise.resolve(null))
    await expect(
      contentmetadataService.getSeasonById(mockFreighterGetSeasonByWweId.wweid)
    ).rejects.toThrow()
  })

  it("Season data not found", async () => {
    freighterService.getSeasonById = jest
      .fn()
      .mockImplementationOnce(() => Promise.reject(new NotFoundException()))
    await expect(
      contentmetadataService.getSeasonById(mockFreighterGetSeasonByWweId.wweid)
    ).rejects.toThrow()
  })
})
