import { Test } from "@nestjs/testing"
import { getRepositoryToken } from "@nestjs/typeorm"
import { FreighterS3 } from "../../../scripts/FreighterS3"
import { freighterdbOrmConfig } from "../../../config/freighterdb.config"
import { FreighterRepository } from "../freighter.repository"
import { FreighterService } from "../freighter.service"
import { ConfigService } from "@nestjs/config"
import mockFreighterGetContent from "./mockFreighterGetContent"
import mockFreighterGetSeriesByWweId from "./mockFreighterGetSeriesByWweId"
import mockGetSeriesByQuery from "./mockGetSeriesByQuery"
import mockGetSeasonByQuery from "./mockGetSeasonByQuery"
import mockVocabEnabled from "./mockVocabEnabled"
import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException
} from "@nestjs/common"
import mockVocabEntries from "./mockVocabEntries"
import mockVocabTypeDetailsByQuery from "./mockVocabTypeDetailsByQuery"
import { S3 } from "aws-sdk"

const mockS3HeadObject = jest.fn()
const mockS3GetSignedUrl = jest.fn()
jest.mock("aws-sdk", () => {
  return {
    S3: jest.fn(() => ({
      headObject: mockS3HeadObject,
      getSignedUrl: mockS3GetSignedUrl
    }))
  }
})

describe("Freighter Service", () => {
  let freighterService: FreighterService,
    freighterRepo: FreighterRepository,
    configService: ConfigService

  beforeEach(async () => {
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
          case "app.freighter.s3.bucket":
            return "wwe-network"
          case "app.freighter.s3.access":
            return "s3accesskeyfortesting"
          case "app.freighter.s3.secret":
            return "s3secretkeyfortesting"
          case "app.freighter.s3.bucketRegion":
            return "us-east-1"
          case "app.freighter.s3.expires":
            return 1200

          default:
            break
        }
      })
    })

    const module = await Test.createTestingModule({
      providers: [
        S3,
        {
          provide: ConfigService,
          useFactory: mockConfigService
        },
        FreighterS3,
        FreighterService,
        {
          provide: getRepositoryToken(FreighterRepository, freighterdbOrmConfig.name),
          useFactory: mockFreighterRepo
        }
      ]
    }).compile()

    freighterService = await module.get<FreighterService>(FreighterService)
    freighterRepo = await module.get<FreighterRepository>(
      getRepositoryToken(FreighterRepository, freighterdbOrmConfig.name)
    )
    configService = await module.get<ConfigService>(ConfigService)
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe("getVideoById", () => {
    it("return video data successfully", async () => {
      freighterService.getContent = jest.fn().mockImplementationOnce(() => mockFreighterGetContent)
      const result = await freighterService.getVideoById(mockFreighterGetContent.cv_wweid)
      expect(result).toHaveProperty("video_type")
      expect(result).toHaveProperty("content-package")
      expect(result).toHaveProperty("release_date")
      expect(result).toHaveProperty("sunset_date")
      expect(result).toHaveProperty("ads_enabled")
      expect(result).toHaveProperty("availability")
      expect(result).toHaveProperty("episode")
      expect(result).toHaveProperty("event")
      expect(result).toHaveProperty("tag")
      expect(result).toHaveProperty("series")
      expect(result).toHaveProperty("season")
      expect(result).toHaveProperty("companion")
    })

    it("return video data fails", async () => {
      const setVideoContentSpy = jest
        .spyOn(FreighterService.prototype as any, "setVideoContent")
        .mockImplementationOnce(() => Promise.reject())
      expect(setVideoContentSpy).not.toHaveBeenCalled()
      // freighterService.getContent = jest.fn().mockImplementationOnce(() => new Error())
      await expect(
        freighterService.getVideoById(mockFreighterGetContent.cv_wweid)
      ).rejects.toThrow()
      expect(setVideoContentSpy).not.toHaveBeenCalled()
    })
  })

  describe("setVideoContent", () => {
    it("return supplemental video type", async () => {
      mockFreighterGetContent.body.video_type = "supplemental"
      freighterService.getSupplementalTo = jest.fn().mockImplementationOnce(() =>
        Promise.resolve({
          wweid: "e4a06935-b521-47ae-85cc-2933b0fd5a87",
          wweid_source: "contents"
        })
      )
      freighterService.getContent = jest.fn().mockImplementationOnce(() => mockFreighterGetContent)
      const result = await freighterService.getVideoById(mockFreighterGetContent.cv_wweid)
      expect(result).toHaveProperty("supplemental_to")
    })

    it("fails to return supplemental video type", async () => {
      mockFreighterGetContent.body.video_type = "supplemental"
      freighterService.getSupplementalTo = jest.fn().mockImplementationOnce(() => Promise.reject())
      freighterService.getContent = jest.fn().mockImplementationOnce(() => mockFreighterGetContent)
      await expect(
        freighterService.getVideoById(mockFreighterGetContent.cv_wweid)
      ).rejects.toThrow()
    })
  })

  describe("getContent", () => {
    it("return content metadata successfully", async () => {
      freighterService.buildImageObject = jest.fn(() =>
        Promise.resolve({
          logo:
            "https://wwe-network.s3.amazonaws.com/series/W/WrestleMania_33/WrestleMania-2021_2451/WM37Sa_Ntwk/WM37Sa_Ntwk_Episodic_Logo_HD.png?AWSAccessKeyId=AKIATKIULXPZ6ODJJG4X&Expires=1625350806&Signature=%2BIuYgDQMQrO%2FvciRSRwX1fGR2Lg%3D",
          tile:
            "https://wwe-network.s3.amazonaws.com/series/W/WrestleMania_33/WrestleMania-2021_2451/WM37Sa_Ntwk/WM37Sa_Ntwk_Episodic_KA_HD.jpg?AWSAccessKeyId=AKIATKIULXPZ6ODJJG4X&Expires=1625350806&Signature=Cpq7NHDV23X7KqTCzOBqRbvrrvc%3D",
          poster:
            "https://wwe-network.s3.amazonaws.com/series/W/WrestleMania_33/WrestleMania-2021_2451/WM37Sa_Ntwk/WM37Sa_Ntwk_Episodic_KA_Pstr.jpg?AWSAccessKeyId=AKIATKIULXPZ6ODJJG4X&Expires=1625350806&Signature=LtFoPLdnKJil5W9chKP5777hGew%3D",
          wallpaper:
            "https://wwe-network.s3.amazonaws.com/series/W/WrestleMania_33/WrestleMania-2021_2451/WM37Sa_Ntwk/WM37Sa_Ntwk_Episodic_KA_HD.jpg?AWSAccessKeyId=AKIATKIULXPZ6ODJJG4X&Expires=1625350806&Signature=Cpq7NHDV23X7KqTCzOBqRbvrrvc%3D"
        })
      )
      freighterRepo.query = jest.fn(() => Promise.resolve([mockFreighterGetContent]))
      const content = await freighterService.getContent(mockFreighterGetContent.cv_wweid)
      expect(content).toHaveProperty("id")
      expect(content).toHaveProperty("delivery_type")
      expect(content).toHaveProperty("production_id")
      expect(content).toHaveProperty("duration")
      expect(content).toHaveProperty("images")
      expect(content).toHaveProperty("body")
    })

    it("return content metadata fails", async () => {
      freighterRepo.query = jest.fn(() => Promise.reject())
      await expect(freighterService.getContent(mockFreighterGetContent.cv_wweid)).rejects.toThrow()
    })

    it("return content metadata empty", async () => {
      freighterRepo.query = jest.fn(() => Promise.resolve({}))
      await expect(freighterService.getContent(mockFreighterGetContent.cv_wweid)).resolves.toEqual(
        null
      )
    })
  })

  describe("getSeriesById", () => {
    it("return series by ID", async () => {
      freighterRepo.query = jest.fn(() => Promise.resolve(mockGetSeriesByQuery))
      const series = await freighterService.getSeriesById(mockGetSeriesByQuery[0].wweid)
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

    it("return series by ID fails", async () => {
      freighterRepo.query = jest.fn(() => Promise.reject())
      await expect(freighterService.getSeriesById(mockGetSeriesByQuery[0].wweid)).rejects.toThrow()
    })
  })

  describe("getSeasonById", () => {
    it("return season by ID", async () => {
      freighterRepo.query = jest.fn(() => Promise.resolve(mockGetSeasonByQuery))
      const season = await freighterService.getSeasonById(mockGetSeasonByQuery[0].wweid)
      expect(season).toHaveProperty("name")
      expect(season).toHaveProperty("year")
      expect(season).toHaveProperty("image")
      expect(season).toHaveProperty("wweid")
      expect(season).toHaveProperty("sequence")
      expect(season).toHaveProperty("version")
      expect(season).toHaveProperty("synopsis")
      expect(season).toHaveProperty("revision")
      expect(season).toHaveProperty("synopsis")
      expect(season).toHaveProperty("production_id")
      expect(season).toHaveProperty("programminag_block")
    })

    it("return season by ID fails", async () => {
      freighterRepo.query = jest.fn(() => Promise.reject())
      await expect(freighterService.getSeasonById(mockGetSeasonByQuery[0].wweid)).rejects.toThrow()
    })
  })

  describe("isVocabEnabled", () => {
    it("return if vocabulary is enabled", async () => {
      freighterRepo.query = jest.fn(() => Promise.resolve([mockVocabEnabled]))
      const vocab = await freighterService.isVocabEnabled()
      expect(vocab).toEqual(mockVocabEnabled.value)
    })

    it("vocabulary is not found", async () => {
      freighterRepo.query = jest.fn(() => Promise.resolve(null))
      await expect(freighterService.isVocabEnabled("testvocabs")).rejects.toThrow(NotFoundException)
    })
  })

  describe("getVocab", () => {
    it("return vocabularies", async () => {
      freighterService.isVocabEnabled = jest.fn(() => Promise.resolve(mockVocabEnabled.value))
      freighterRepo.query = jest.fn(() => Promise.resolve(mockVocabEntries))
      freighterService.getVocabTypeDetails = jest.fn(() =>
        Promise.resolve({
          data: {
            success: true,
            md5: "8c8b0047c2fd02c72aff5f96d722ba19"
          }
        })
      )
      const vocab = await freighterService.getVocab()
      for (const v of JSON.parse(mockVocabEnabled.value)) {
        expect(vocab).toHaveProperty(v)
      }
    })

    it("return vocabularies fails", async () => {
      freighterService.isVocabEnabled = jest.fn(() => Promise.resolve(mockVocabEnabled.value))
      freighterRepo.query = jest.fn(() => Promise.reject(new NotFoundException()))
      await expect(freighterService.getVocab()).rejects.toThrow(NotFoundException)
    })
  })

  describe("getVocabTypeDetails", () => {
    it("return vocab type details successfully", async () => {
      freighterService.isVocabEnabled = jest.fn(() => Promise.resolve(mockVocabEnabled.value))
      const mockVocabTypeDetailsByQueryBodyString = JSON.stringify(
        mockVocabTypeDetailsByQuery[0].body
      )
      freighterRepo.query = jest.fn(() =>
        Promise.resolve([
          {
            body: mockVocabTypeDetailsByQueryBodyString,
            md5: mockVocabTypeDetailsByQuery[0].md5
          }
        ])
      )
      const vocabTypeDetails = await freighterService.getVocabTypeDetails("achievements")
      expect(vocabTypeDetails).toHaveProperty("achievements")
    })

    it("return vocab type details fails", async () => {
      freighterService.isVocabEnabled = jest.fn(() => Promise.resolve(mockVocabEnabled.value))
      freighterRepo.query = jest.fn(() => Promise.reject(new NotFoundException()))
      await expect(freighterService.getVocabTypeDetails("achievements")).rejects.toThrow(
        NotFoundException
      )
    })

    it("return vocab type details fails because vocab is not enabled", async () => {
      freighterService.isVocabEnabled = jest.fn(() => Promise.resolve(false))
      await expect(freighterService.getVocabTypeDetails("notenabledvocab")).rejects.toThrow(
        BadRequestException
      )
    })
  })

  describe("getSupplementalTo", () => {
    it("return supplemental data type", async () => {
      freighterRepo.query = jest.fn().mockImplementationOnce(() =>
        Promise.resolve([
          {
            cv_wweid: "e4a06935-b521-47ae-85cc-2933b0fd5a87",
            wweid_source: "contents"
          }
        ])
      )
      const result = await freighterService.getSupplementalTo(
        "e4a06935-b521-47ae-85cc-2933b0fd5a87"
      )
      expect(result).toHaveProperty("type")
      expect(result).toHaveProperty("wweid")
    })

    it("return supplemental data type fails", async () => {
      freighterRepo.query = jest.fn().mockImplementationOnce(() =>
        Promise.resolve([
          {
            cv_wweid: null,
            wweid_source: "contents"
          }
        ])
      )
      await expect(
        freighterService.getSupplementalTo("e4a06935-b521-47ae-85cc-2933b0fd5a87")
      ).rejects.toThrow()
    })
  })

  describe("buildImageObject", () => {
    it("return signed url image object", async () => {
      const source = {
        logo:
          "series/W/WrestleMania_33/WrestleMania-2021_2451/WM37Sa_Ntwk/WM37Sa_Ntwk_Episodic_Logo_HD.png",
        tile:
          "series/W/WrestleMania_33/WrestleMania-2021_2451/WM37Sa_Ntwk/WM37Sa_Ntwk_Episodic_KA_HD.jpg",
        poster:
          "series/W/WrestleMania_33/WrestleMania-2021_2451/WM37Sa_Ntwk/WM37Sa_Ntwk_Episodic_KA_Pstr.jpg",
        wallpaper:
          "series/W/WrestleMania_33/WrestleMania-2021_2451/WM37Sa_Ntwk/WM37Sa_Ntwk_Episodic_KA_HD.jpg"
      }

      freighterService.getSignedURL = jest.fn(() =>
        Promise.resolve(
          "https://wwe-network.s3.amazonaws.com/series/W/WrestleMania_33/WrestleMania-2021_2451/WM37Sa_Ntwk/WM37Sa_Ntwk_Episodic.jpg?AWSAccessKeyId=AKIATKIULXPZ6ODJJG4X&Expires=1625350806&Signature=Cpq7NHDV23X7KqTCzOBqRbvrrvc%3D"
        )
      )

      const result = await freighterService.buildImageObject(source)
      for (const objKey of Object.keys(source)) {
        expect(result).toHaveProperty(objKey)
      }
    })
  })

  describe("getSignedURL", () => {
    it("return signed url image successfully", async () => {
      mockS3HeadObject.mockImplementationOnce(() => {
        return {
          promise: jest.fn(() => true)
        }
      })
      mockS3GetSignedUrl.mockImplementationOnce(
        () =>
          "https://wwe-network.s3.amazonaws.com/series/W/WrestleMania_33/WrestleMania-2021_2451/WM37Sa_Ntwk/WM37Sa_Ntwk_Episodic.jpg?AWSAccessKeyId=AKIATKIULXPZ6ODJJG4X&Expires=1625350806&Signature=Cpq7NHDV23X7KqTCzOBqRbvrrvc%3D"
      )
      const result = await freighterService.getSignedURL(
        "series/W/WrestleMania_33/WrestleMania-2021_2451/WM37Sa_Ntwk/WM37Sa_Ntwk_Episodic_Logo_HD.png"
      )
      expect(result).toMatch(
        "https://wwe-network.s3.amazonaws.com/series/W/WrestleMania_33/WrestleMania-2021_2451/WM37Sa_Ntwk/WM37Sa_Ntwk_Episodic.jpg?AWSAccessKeyId=AKIATKIULXPZ6ODJJG4X&Expires=1625350806&Signature=Cpq7NHDV23X7KqTCzOBqRbvrrvc%3D"
      )
    })

    it("return signed url image fails", async () => {
      mockS3HeadObject.mockImplementationOnce(() => false)
      await expect(
        freighterService.getSignedURL(
          "series/W/WrestleMania_33/WrestleMania-2021_2451/WM37Sa_Ntwk/WM37Sa_Ntwk_Episodic_Logo_HD.png"
        )
      ).resolves.toEqual(undefined)
    })
  })
})
