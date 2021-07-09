import { Test } from "@nestjs/testing"
import { VideostreamsService } from "../videostreams.service"
import { VideoStreamsRepository } from "../videostreams.repository"
import { LivevideostreamsService } from "../livevideostreams/livevideostreams.service"
import { LiveVideoStreamsRepository } from "../livevideostreams/livevideostreams.repository"
import { FreighterS3 } from "../../../scripts/FreighterS3"
import { FreighterService } from "../../freighter/freighter.service"
import {
  HttpService,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException
} from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { VideoStreamParams } from "../dto/video-streams-params.dto"
import * as EdgeAuth from "akamai-edgeauth"
import { FreighterRepository } from "../../freighter/freighter.repository"
import { getRepositoryToken } from "@nestjs/typeorm"
import { freighterdbOrmConfig } from "../../../config/freighterdb.config"
import mockFreighterGetContent from "../../freighter/tests/mockFreighterGetContent"

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

describe("Video Streams Service", () => {
  let freighterRepository: FreighterRepository,
    videoStreamsService: VideostreamsService,
    videoStreamsRepo: VideoStreamsRepository,
    liveVideoStreamService: LivevideostreamsService,
    liveVideoStreamRepo: LiveVideoStreamsRepository,
    freighterS3: FreighterS3,
    freighterService: FreighterService,
    httpService: HttpService

  const mockVideoStreamsRepo = () => ({
    store: jest.fn()
  })

  const mockLiveVideoStreamsRepo = () => ({
    store: jest.fn()
  })

  const mockFreighterRepo = () => ({
    query: jest.fn()
  })

  const httpServiceGetData = {
    data: {
      data: {
        duration: 19177.322667,
        episode: {
          name: [
            {
              long: "WrestleMania 35",
              short: "WrestleMania 35",
              medium: "WrestleMania 35",
              language: "en",
              extra_long: "WrestleMania 35"
            }
          ],
          wweid: "ee7d26cd-e319-428f-b067-ee7d40c9f767",
          rating: {
            mpaa: "TV-PG"
          },
          synopsis: [
            {
              long: "testLongSynopsis",
              short: "testShortSynopsis",
              language: "en"
            }
          ],
          productionid: "nxt34_ntwk"
        }
      }
    }
  }

  const mockHttpService = () => ({
    get: jest.fn()
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

  const videoStreamParams: VideoStreamParams = {
    videoId: "48b634bb-296f-a04e-a914-0d4ac6f58a45",
    format: "m3u8",
    partner: {
      clientId: "testClientId",
      applicationId: "testApplicationId",
      credentialsId: "testCredentialsId",
      scopes: "testScopes",
      iat: 1929293123412,
      exp: 1929293123412
    }
  }

  const episode = httpServiceGetData.data.data.episode
  const duration = httpServiceGetData.data.data.duration
  const videoId = videoStreamParams.videoId

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        EdgeAuth,
        { provide: ConfigService, useFactory: mockConfigService },
        VideostreamsService,
        LivevideostreamsService,
        FreighterS3,
        FreighterService,
        {
          provide: getRepositoryToken(FreighterRepository, freighterdbOrmConfig.name),
          useValue: mockFreighterRepo()
        },
        { provide: HttpService, useFactory: mockHttpService },
        { provide: VideoStreamsRepository, useFactory: mockVideoStreamsRepo },
        { provide: LiveVideoStreamsRepository, useFactory: mockLiveVideoStreamsRepo }
      ]
    }).compile()

    videoStreamsService = await module.get<VideostreamsService>(VideostreamsService)
    liveVideoStreamService = await module.get<LivevideostreamsService>(LivevideostreamsService)
    freighterS3 = await module.get<FreighterS3>(FreighterS3)
    freighterService = await module.get<FreighterService>(FreighterService)
    videoStreamsRepo = await module.get<VideoStreamsRepository>(VideoStreamsRepository)
    httpService = await module.get<HttpService>(HttpService)
  })

  describe("setParams()", () => {
    it("Params set successfully", () => {
      const result = videoStreamsService.setParams(videoStreamParams)
      expect(result).toBe(videoStreamsService)
    })
  })

  describe("getVideoStream", () => {
    it("Get videoStream successfully", async () => {
      freighterService.getContent = jest.fn().mockImplementationOnce(() => mockFreighterGetContent)
      const result = await videoStreamsService.setParams(videoStreamParams).getVideoStream()
      expect(result).toMatchObject({
        duration: "02:36:15",
        id: "48b634bb-296f-a04e-a914-0d4ac6f58a45",
        // manifestUrl:
        //   "https://vod-test.sonyliv.wwe.com/e/ee7d26cd_e319_428f_b067_ee7d40c9f767/hls/ee7d26cd_e319_428f_b067_ee7d40c9f767.m3u8?hdnts=exp=1599133908~acl=/*~hmac=53ce795bb3a29e0d432303aa8897ebfa6697653c8b7e327769c4043310464662",
        manifestUrl:
          "https://vod.sonyliv.wwe.com/4/48b634bb_296f_a04e_a914_0d4ac6f58a45/hls/48b634bb_296f_a04e_a914_0d4ac6f58a45.m3u8?hdnts=exp=1599133908~acl=/*~hmac=53ce795bb3a29e0d432303aa8897ebfa6697653c8b7e327769c4043310464662",
        name: [
          {
            long: "King of the Ring 1998",
            short: "King of the Ring",
            medium: "King of the Ring 1998",
            language: "en",
            extra_long: "King of the Ring"
          }
        ],
        rating: "TV-14",
        synopsis: [
          {
            long:
              '"Stone Cold" Steve Austin puts the WWE Championship on the line against the demonic Kane in a brutal First Blood Match. The Undertaker and Mankind make history inside Hell in a Cell. Semi-Final matches to crown the WWE King of the Ring include Ken Shamrock vs. Jeff Jarrett and The Rock vs. Dan Severn. X-Pac battles Owen Hart.',
            short:
              "Steve Austin defends WWE Championship against Kane in a First Blood match. Undertaker and Mankind make history inside Hell in a Cell.",
            language: "en"
          }
        ]
      })
    })

    it("Get videoStream could not find content", async () => {
      freighterService.getContent = jest.fn().mockResolvedValue({})
      await expect(
        videoStreamsService.setParams(videoStreamParams).getVideoStream()
      ).rejects.toThrow(
        new NotFoundException(`Could not find a record given the ID: ${videoStreamParams.videoId}`)
      )
    })

    it("Get videoStream failes to set content", async () => {
      freighterService.getContent = jest.fn().mockImplementationOnce(() => {
        toPromise: () =>
          Promise.reject(
            new NotFoundException({
              status: 404,
              data: {
                message: "Not available"
              }
            })
          )
      })
      await expect(
        videoStreamsService.setParams(videoStreamParams).getVideoStream()
      ).rejects.toThrow(
        new NotFoundException(`Could not find a record given the ID: ${videoStreamParams.videoId}`)
      )
    })

    it("Get videoStream failes to set content path", async () => {
      const setManifestUrlSpy = jest
        .spyOn(VideostreamsService.prototype as any, "setManifestUrl")
        .mockImplementationOnce(() => Promise.reject())
      freighterService.getContent = jest.fn().mockImplementationOnce(() => mockFreighterGetContent)
      expect(setManifestUrlSpy).not.toHaveBeenCalled()
      await expect(
        videoStreamsService.setParams(videoStreamParams).getVideoStream()
      ).rejects.toThrow(
        new NotFoundException(`Could not find a record given the ID: ${videoStreamParams.videoId}`)
      )
      expect(setManifestUrlSpy).toHaveBeenCalled()
    })

    it("Get videoStream failes to set manifest url", async () => {
      const setVideoStreamSpy = jest
        .spyOn(VideostreamsService.prototype as any, "setVideoStream")
        .mockImplementationOnce(() => Promise.reject())
      freighterService.getContent = jest.fn().mockImplementationOnce(() => mockFreighterGetContent)
      expect(setVideoStreamSpy).not.toHaveBeenCalled()
      await expect(
        videoStreamsService.setParams(videoStreamParams).getVideoStream()
      ).rejects.toThrow()
      expect(setVideoStreamSpy).toHaveBeenCalled()
    })

    it("Get videoStream set content paths for json format", async () => {
      freighterService.getContent = jest.fn().mockImplementationOnce(() => mockFreighterGetContent)
      videoStreamParams.format = "json"
      await expect(
        videoStreamsService.setParams(videoStreamParams).getVideoStream()
      ).rejects.toThrow(
        new NotFoundException(`Could not find a record given the ID: ${videoStreamParams.videoId}`)
      )
      videoStreamParams.format = "m3u8"
    })

    it("Get videoStream set content paths for live format", async () => {
      freighterService.getContent = jest.fn().mockImplementationOnce(() => mockFreighterGetContent)
      videoStreamParams.format = "live"
      await expect(
        videoStreamsService.setParams(videoStreamParams).getVideoStream()
      ).rejects.toThrow(
        new NotFoundException(`Could not find a record given the ID: ${videoStreamParams.videoId}`)
      )
      videoStreamParams.format = "m3u8"
    })

    it("Get videoStream fails to get tokenized url by format", async () => {
      const testManifestUrlRequestSpy = jest
        .spyOn(VideostreamsService.prototype as any, "testManifestUrlRequest")
        .mockImplementationOnce(() => Promise.reject())
      freighterService.getContent = jest.fn().mockImplementationOnce(() => mockFreighterGetContent)
      expect(testManifestUrlRequestSpy).not.toHaveBeenCalled()
      videoStreamParams.format = "json"
      await expect(
        videoStreamsService.setParams(videoStreamParams).getVideoStream()
      ).rejects.toThrow()
      expect(testManifestUrlRequestSpy).toHaveBeenCalled()
      videoStreamParams.format = "m3u8"
    })

    it("Get videoStream fails to get manifest url string", async () => {
      freighterService.getContent = jest.fn().mockImplementationOnce(() => mockFreighterGetContent)
      const testManifestUrlRequestSpy = jest
        .spyOn(VideostreamsService.prototype as any, "testManifestUrlRequest")
        .mockImplementationOnce(() => Promise.reject())
      await expect(
        videoStreamsService.setParams(videoStreamParams).getVideoStream()
      ).rejects.toThrow()
      expect(testManifestUrlRequestSpy).toHaveBeenCalled()
    })

    it("Get videoStream failes to set video stream", async () => {
      const storeVideoStreamSpy = jest
        .spyOn(VideostreamsService.prototype as any, "storeVideoStream")
        .mockImplementationOnce(() => Promise.reject())
      freighterService.getContent = jest.fn().mockImplementationOnce(() => mockFreighterGetContent)
      expect(storeVideoStreamSpy).not.toHaveBeenCalled()
      await expect(
        videoStreamsService.setParams(videoStreamParams).getVideoStream()
      ).rejects.toThrow()
      expect(storeVideoStreamSpy).toHaveBeenCalled()
    })

    it("Get videoStream failes to get duration while setting video stream", async () => {
      const durationSpy = jest.spyOn(VideostreamsService.prototype as any, "duration")
      const duration = mockFreighterGetContent.duration
      const bodyDuration = mockFreighterGetContent.body.duration
      delete mockFreighterGetContent.duration
      delete mockFreighterGetContent.body.duration
      freighterService.getContent = jest.fn().mockImplementationOnce(() => mockFreighterGetContent)
      expect(durationSpy).not.toHaveBeenCalled()
      await expect(
        videoStreamsService.setParams(videoStreamParams).getVideoStream()
      ).rejects.toThrow()
      expect(durationSpy).toHaveBeenCalled()
      mockFreighterGetContent.duration = duration
      mockFreighterGetContent.body.duration = bodyDuration
    })

    it("Get videoStream failes to store video stream in database", async () => {
      videoStreamsRepo.store = jest.fn(() => Promise.reject())
      freighterService.getContent = jest.fn().mockImplementationOnce(() => mockFreighterGetContent)
      expect(videoStreamsRepo.store).not.toHaveBeenCalled()
      await expect(
        videoStreamsService.setParams(videoStreamParams).getVideoStream()
      ).rejects.toThrow()
      expect(videoStreamsRepo.store).toHaveBeenCalled()
    })
  })
})
