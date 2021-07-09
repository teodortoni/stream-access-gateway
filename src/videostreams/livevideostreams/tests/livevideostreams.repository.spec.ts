import { BadRequestException } from "@nestjs/common"
import { Test } from "@nestjs/testing"
import { PartnerLiveStreamParams } from "src/videostreams/dto/partner-live-stream-params.dto"
import { LiveVideoStreamsRepository } from "../livevideostreams.repository"

describe("Live Video Streams Repository", () => {
  let liveVideoStreamsRepo: LiveVideoStreamsRepository, save

  const record = {
    applicationId: "testApplicationId",
    clientId: "testClientId",
    // contentVersionWweid: "48b634bb-296f-a04e-a914-0d4ac6f58a45",
    token: "testToken",
    path: "testPath",
    tokenizedPath: "testTokenizedPath",
    expiresAt: new Date()
  }

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [LiveVideoStreamsRepository]
    }).compile()

    liveVideoStreamsRepo = await module.get<LiveVideoStreamsRepository>(LiveVideoStreamsRepository)
    save = jest.fn()
    liveVideoStreamsRepo.create = jest.fn().mockReturnValue({ save })
    liveVideoStreamsRepo.findOne = jest.fn().mockReturnValue({ save })
    liveVideoStreamsRepo.find = jest.fn()
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe("store", () => {
    it("Live video stream stored successfully", async () => {
      save.mockReturnValue(true)
      const deactivateActiveStreamMock = jest
        .spyOn(LiveVideoStreamsRepository.prototype as any, "deactivateActiveStream")
        .mockImplementationOnce(() => true)
      expect(liveVideoStreamsRepo.create).not.toHaveBeenCalled()
      const result = await liveVideoStreamsRepo.store(record)
      expect(liveVideoStreamsRepo.create).toHaveBeenCalled()
      expect(result).toMatchObject(record)
    })

    it("Live video stream stored failed", async () => {
      save.mockReturnValue(true)
      const deactivateActiveStreamMock = jest
        .spyOn(LiveVideoStreamsRepository.prototype as any, "deactivateActiveStream")
        .mockImplementationOnce(() => Promise.reject(new BadRequestException()))
      await expect(liveVideoStreamsRepo.store(record)).rejects.toThrow(BadRequestException)
    })
  })

  describe("deactivateActiveStream", () => {
    it("Deactivate active stream successfully", async () => {
      save.mockReturnValue(true)
      record["isActive"] = true
      record["save"] = jest.fn()
      const getActiveLiveStreamForPartner = jest
        .spyOn(LiveVideoStreamsRepository.prototype as any, "getActiveLiveStreamForPartner")
        .mockImplementationOnce(() => Promise.resolve(record))
      expect(liveVideoStreamsRepo.create).not.toHaveBeenCalled()
      const result = await liveVideoStreamsRepo.store(record)
      expect(liveVideoStreamsRepo.create).toHaveBeenCalled()
      expect(result).toHaveProperty("clientId")
      expect(result).toHaveProperty("applicationId")
      expect(result).toHaveProperty("isActive")
    })

    it("Deactivate active stream fails", async () => {
      save.mockReturnValue(true)
      record["isActive"] = true
      record["save"] = jest.fn()
      const getActiveLiveStreamForPartner = jest
        .spyOn(LiveVideoStreamsRepository.prototype as any, "getActiveLiveStreamForPartner")
        .mockImplementationOnce(() => Promise.reject(new BadRequestException()))
      await expect(liveVideoStreamsRepo.store(record)).rejects.toThrow(BadRequestException)
    })
  })

  describe("updateStream", () => {
    it("Live video stream updated successfully", async () => {
      save.mockReturnValue(record)
      expect(liveVideoStreamsRepo.findOne).not.toHaveBeenCalled()
      const result = await liveVideoStreamsRepo.updateStream(record)
      expect(liveVideoStreamsRepo.findOne).toHaveBeenCalled()
      expect(result).toMatchObject(record)
    })

    it("Live video stream update failed", async () => {
      save.mockRejectedValue(new BadRequestException())
      await expect(liveVideoStreamsRepo.updateStream(record)).rejects.toThrow(BadRequestException)
    })
  })

  describe("getLiveStreamsForPartner", () => {
    it("Get live streams for partner successfully", async () => {
      const params: PartnerLiveStreamParams = {
        clientId: "testClientId",
        applicationId: "testApplicationId"
      }
      liveVideoStreamsRepo.find = jest.fn().mockResolvedValue(record)
      const result = await liveVideoStreamsRepo.getLiveStreamsForPartner(params)
      expect(result).toMatchObject(record)
    })

    it("Get live streams for partner failed", async () => {
      const params: PartnerLiveStreamParams = {
        clientId: "testClientId",
        applicationId: "testApplicationId"
      }
      liveVideoStreamsRepo.find = jest.fn().mockRejectedValue(new BadRequestException())
      await expect(liveVideoStreamsRepo.getLiveStreamsForPartner(params)).rejects.toThrow(
        BadRequestException
      )
    })
  })

  describe("getActiveLiveStreamForPartner", () => {
    it("Get active live streams for partner successfully", async () => {
      const params: PartnerLiveStreamParams = {
        clientId: "testClientId",
        applicationId: "testApplicationId"
      }
      liveVideoStreamsRepo.findOne = jest.fn().mockResolvedValue(record)
      const result = await liveVideoStreamsRepo.getActiveLiveStreamForPartner(params)
      expect(result).toMatchObject(record)
    })

    it("Get active live streams for partner failed", async () => {
      const params: PartnerLiveStreamParams = {
        clientId: "testClientId",
        applicationId: "testApplicationId"
      }
      liveVideoStreamsRepo.findOne = jest.fn().mockRejectedValue(new BadRequestException())
      await expect(liveVideoStreamsRepo.getActiveLiveStreamForPartner(params)).rejects.toThrow(
        BadRequestException
      )
    })
  })
})
