import { Test } from "@nestjs/testing"
import * as EdgeAuth from "akamai-edgeauth"
import { ConfigService } from "@nestjs/config"
import { LiveVideoStreamsRepository } from "../livevideostreams.repository"
import { LivevideostreamsService } from "../livevideostreams.service"
import { BadRequestException, HttpService } from "@nestjs/common"
import { PartnerLiveStreamParams } from "../../../videostreams/dto/partner-live-stream-params.dto"
import { LiveStreamParams } from "src/videostreams/dto/live-stream-params.dto"

jest.mock("akamai-edgeauth", () => {
  return jest.fn().mockImplementation(() => {
    return {
      options: {
        tokenName: "__token__"
      },
      generateACLToken: jest.fn().mockImplementation((url) => {
        if (!url) {
          throw new Error("You must provide url")
        }
        return "exp=1599133908~acl=/*~hmac=53ce795bb3a29e0d432303aa8897ebfa6697653c8b7e327769c4043310464662"
      })
    }
  })
})

describe("Live Video Streams Service", () => {
  let liveVideoStreamsService: LivevideostreamsService,
    liveVideoStreamsRepo: LiveVideoStreamsRepository

  const mockLiveVideoStreamsRepo = () => ({
    store: jest.fn()
  })

  const mockConfigService = () => ({
    get: jest.fn().mockImplementation((key: string) => {
      switch (key) {
        case "videoStreams.encryptionKey":
          return "acf7eae71cb9f7263c4c5fe0f643c7f7"
        case "videoStreams.liveHostName":
          return "vod.sonyliv.wwe.com"

        default:
          break
      }
    })
  })

  const mockHttpService = () => ({
    get: jest.fn()
  })

  const record = {
    clientId: "testClientId",
    applicationId: "testApplicationId",
    path: "testLiveVideoStreamsPath"
  }

  const liveStreamParams: LiveStreamParams = {
    clientId: "testClientId",
    applicationId: "testApplicationId",
    contentVersionWweid: "testContentVersionWweid",
    liveStreamPath: "testLiveStreamPaths"
  }

  const partnerLiveStreamParams: PartnerLiveStreamParams = {
    clientId: "testClientId",
    applicationId: "testApplicationId"
  }

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        EdgeAuth,
        { provide: ConfigService, useFactory: mockConfigService },
        LivevideostreamsService,
        { provide: LiveVideoStreamsRepository, useFactory: mockLiveVideoStreamsRepo },
        { provide: HttpService, useFactory: mockHttpService }
      ]
    }).compile()
    liveVideoStreamsRepo = await module.get<LiveVideoStreamsRepository>(LiveVideoStreamsRepository)
    liveVideoStreamsService = await module.get<LivevideostreamsService>(LivevideostreamsService)
  })
  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe("setParams", () => {
    it("Set params successfully", () => {
      const setParams = liveVideoStreamsService.setParams(liveStreamParams)
      expect(setParams["liveStreamParams"]).toHaveProperty("clientId")
      expect(setParams["liveStreamParams"]).toHaveProperty("applicationId")
      expect(setParams["liveStreamParams"]).toHaveProperty("contentVersionWweid")
      expect(setParams["liveStreamParams"]).toHaveProperty("liveStreamPath")
    })
  })

  describe("storeLiveStreamForPartner", () => {
    it("Store live video stream successfully", async () => {
      liveVideoStreamsRepo.store = jest.fn().mockImplementationOnce(() => Promise.resolve(record))
      const result = await liveVideoStreamsService
        .setParams(liveStreamParams)
        .storeLiveStreamForPartner()
      expect(result).toMatchObject(record)
    })

    it("Store live video stream fails", async () => {
      const liveVideoStreamMock = jest
        .spyOn(LivevideostreamsService.prototype as any, "storeLiveVideoStream")
        .mockImplementationOnce(() => Promise.reject(new BadRequestException()))
      await expect(liveVideoStreamsService.storeLiveStreamForPartner()).rejects.toThrow(
        BadRequestException
      )
    })

    it("storeLiveVideoStream fails", async () => {
      liveVideoStreamsRepo.store = jest
        .fn()
        .mockImplementationOnce(() => Promise.reject(new BadRequestException()))
      await expect(
        liveVideoStreamsService.setParams(liveStreamParams).storeLiveStreamForPartner()
      ).rejects.toThrow(BadRequestException)
    })
  })

  describe("getLiveStreamsForPartner", () => {
    it("Get live video stream for partner successfully", async () => {
      liveVideoStreamsRepo.getLiveStreamsForPartner = jest
        .fn()
        .mockImplementationOnce(() => Promise.resolve(partnerLiveStreamParams))
      const result = await liveVideoStreamsService.getLiveStreamsForPartner(partnerLiveStreamParams)
      expect(result).toMatchObject(partnerLiveStreamParams)
    })

    it("Get live video stream for partner fails", async () => {
      liveVideoStreamsRepo.getLiveStreamsForPartner = jest
        .fn()
        .mockImplementationOnce(() => Promise.reject(new BadRequestException()))
      await expect(
        liveVideoStreamsService.getLiveStreamsForPartner(partnerLiveStreamParams)
      ).rejects.toThrow(BadRequestException)
    })
  })

  describe("getActiveLiveStreamForPartner", () => {
    it("Get active live video stream for partner successfully", async () => {
      liveVideoStreamsRepo.getActiveLiveStreamForPartner = jest
        .fn()
        .mockImplementationOnce(() => Promise.resolve(partnerLiveStreamParams))
      const result = await liveVideoStreamsService.getActiveLiveStreamForPartner(
        partnerLiveStreamParams
      )
      expect(result).toMatchObject(partnerLiveStreamParams)
    })

    it("Get active live video stream for partner fails", async () => {
      liveVideoStreamsRepo.getActiveLiveStreamForPartner = jest
        .fn()
        .mockImplementationOnce(() => Promise.reject(new BadRequestException()))
      await expect(
        liveVideoStreamsService.getActiveLiveStreamForPartner(partnerLiveStreamParams)
      ).rejects.toThrow(BadRequestException)
    })
  })

  describe("getTokenizedUrl", () => {
    it("Get tokenized Url successfully", async () => {
      partnerLiveStreamParams["id"] = "testUuid"
      partnerLiveStreamParams["path"] = "testUrlPath"
      liveVideoStreamsRepo.getActiveLiveStreamForPartner = jest
        .fn()
        .mockImplementationOnce(() => Promise.resolve(partnerLiveStreamParams))
      liveVideoStreamsRepo.updateStream = jest
        .fn()
        .mockImplementationOnce(() => Promise.resolve(record))
      const result = await liveVideoStreamsService.setParams(liveStreamParams).getTokenizedUrl()
      expect(typeof result).toEqual("string")
    })

    it("updateLiveVideoStream fails", async () => {
      partnerLiveStreamParams["id"] = "testUuid"
      partnerLiveStreamParams["path"] = "testUrlPath"
      liveVideoStreamsRepo.getActiveLiveStreamForPartner = jest
        .fn()
        .mockImplementationOnce(() => Promise.resolve(partnerLiveStreamParams))
      liveVideoStreamsRepo.updateStream = jest
        .fn()
        .mockImplementationOnce(() => Promise.reject(new BadRequestException()))

      await expect(
        liveVideoStreamsService.setParams(liveStreamParams).getTokenizedUrl()
      ).rejects.toThrow(BadRequestException)
    })

    it("tokenizeUrl fails", async () => {
      liveVideoStreamsRepo.getActiveLiveStreamForPartner = jest
        .fn()
        .mockImplementationOnce(() => Promise.reject(new BadRequestException()))

      await expect(
        liveVideoStreamsService.setParams(liveStreamParams).getTokenizedUrl()
      ).rejects.toThrow(BadRequestException)
    })
  })
})
