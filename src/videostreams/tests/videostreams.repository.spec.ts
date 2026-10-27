import { VideoStreamRecord } from "../dto/video-stream-record.dto"
import { Test } from "@nestjs/testing"
import { VideoStreamsRepository } from "../videostreams.repository"
import { InternalServerErrorException } from "@nestjs/common"

describe("Video Streams Repository", () => {
  let videoStreamsRepo: VideoStreamsRepository, save

  const record: VideoStreamRecord = {
    applicationId: "testApplicationId",
    clientId: "testClientId",
    contentVersionId: "testContentVersionId",
    token: "testToken",
    path: "testPath",
    tokenizedPath: "testTokenizedPath",
    expiresAt: new Date()
  }

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [VideoStreamsRepository]
    }).compile()

    videoStreamsRepo = await module.get<VideoStreamsRepository>(VideoStreamsRepository)
    save = jest.fn()
    videoStreamsRepo.create = jest.fn().mockReturnValue({ save })
  })

  describe("store", () => {
    it("Video stream stored successfully", async () => {
      save.mockReturnValue(true)
      expect(videoStreamsRepo.create).not.toHaveBeenCalled()
      const result = await videoStreamsRepo.store(record)
      expect(videoStreamsRepo.create).toHaveBeenCalled()
      expect(result).toMatchObject(record)
    })

    it("Video stream failed to be stored in the database", () => {
      save.mockRejectedValue(Error)
      expect(videoStreamsRepo.store(record)).rejects.toThrow(new InternalServerErrorException())
    })
  })
})
