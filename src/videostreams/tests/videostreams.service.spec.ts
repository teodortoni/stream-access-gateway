import { Test } from "@nestjs/testing"
import { VideostreamsService } from "../videostreams.service"
import { VideoStreamsRepository } from "../videostreams.repository"
import {
  HttpService,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException
} from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { VideoStreamParams } from "../dto/video-streams-params.dto"
import * as EdgeAuth from "akamai-edgeauth"
import { LivevideostreamsService } from "../livevideostreams/livevideostreams.service"

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
  let videoStreamsService: VideostreamsService,
    videoStreamsRepo: VideoStreamsRepository,
    httpService: HttpService

  const mockVideoStreamsRepo = () => ({
    store: jest.fn()
  })

  const mockLiveVideoStreamsService = () => ({
    setParams: jest.fn().mockReturnThis(),
    getTokenizedUrl: jest.fn().mockResolvedValue("https://live-test.example.com/master.m3u8")
  })

  const httpServiceGetData = {
    data: {
      data: {
        duration: 19177.322667,
        episode: {
          name: [
            {
              long: "Championship Event 35",
              short: "Championship Event 35",
              medium: "Championship Event 35",
              language: "en",
              extra_long: "Championship Event 35"
            }
          ],
          contentId: "ee7d26cd-e319-428f-b067-ee7d40c9f767",
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
        case "api.contentBaseUrl":
          return "https://api.example.com/v2"
        case "videoStreams.hostName":
          return "vod-test.example.com"
        case "videoStreams.encryptionKey":
          return "acf7eae71cb9f7263c4c5fe0f643c7f7"

        default:
          break
      }
    })
  })

  const videoStreamParams: VideoStreamParams = {
    videoId: "ee7d26cd-e319-428f-b067-ee7d40c9f767",
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
        { provide: HttpService, useFactory: mockHttpService },
        { provide: VideoStreamsRepository, useFactory: mockVideoStreamsRepo },
        { provide: LivevideostreamsService, useFactory: mockLiveVideoStreamsService }
      ]
    }).compile()

    videoStreamsService = await module.get<VideostreamsService>(VideostreamsService)
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
      const mockHttpServiceGet = {
        toPromise: () => Promise.resolve(httpServiceGetData)
      }
      httpService.get = jest.fn().mockImplementation(() => mockHttpServiceGet)
      // console.log("test HttpService: ", httpService)
      const result = await videoStreamsService.setParams(videoStreamParams).getVideoStream()
      expect(result).toMatchObject({
        duration: "05:19:37",
        id: "ee7d26cd-e319-428f-b067-ee7d40c9f767",
        // manifestUrl:
        //   "https://vod-test.example.com/e/ee7d26cd_e319_428f_b067_ee7d40c9f767/hls/ee7d26cd_e319_428f_b067_ee7d40c9f767.m3u8?hdnts=exp=1599133908~acl=/*~hmac=53ce795bb3a29e0d432303aa8897ebfa6697653c8b7e327769c4043310464662",
        manifestUrl:
          "https://vod-test.example.com/e/ee7d26cd_e319_428f_b067_ee7d40c9f767/hls/ee7d26cd_e319_428f_b067_ee7d40c9f767.m3u8?hdnts=exp=1599133908~acl=/*~hmac=53ce795bb3a29e0d432303aa8897ebfa6697653c8b7e327769c4043310464662",
        name: [
          {
            extra_long: "Championship Event 35",
            language: "en",
            long: "Championship Event 35",
            medium: "Championship Event 35",
            short: "Championship Event 35"
          }
        ],
        rating: "TV-PG",
        synopsis: [
          {
            language: "en",
            long: "testLongSynopsis",
            short: "testShortSynopsis"
          }
        ]
      })
    })

    it("Get videoStream failes to set content", () => {
      const mockHttpServiceGet = {
        toPromise: () =>
          Promise.reject(new NotFoundException({ status: 404, data: { message: "Not available" } }))
      }
      httpService.get = jest.fn().mockImplementationOnce(() => mockHttpServiceGet)
      videoStreamParams.videoId = null
      expect(videoStreamsService.setParams(videoStreamParams).getVideoStream()).rejects.toThrow(
        new InternalServerErrorException()
      )
    })

    it("Get videoStream failes to set content path", () => {
      const mockHttpServiceGet = {
        toPromise: () => Promise.resolve(httpServiceGetData)
      }
      httpService.get = jest.fn().mockImplementation(() => mockHttpServiceGet)
      videoStreamParams.videoId = null
      expect(videoStreamsService.setParams(videoStreamParams).getVideoStream()).rejects.toThrow(
        new InternalServerErrorException()
      )
    })

    it("Get videoStream failes to set manifest url", () => {
      const mockHttpServiceGet = {
        // toPromise: () => Promise.resolve(httpServiceGetData)
        toPromise: () => Promise.reject(new UnauthorizedException())
      }
      httpService.get = jest.fn().mockImplementation(() => mockHttpServiceGet)
      const testManifestUrlSpy = jest.spyOn(
        VideostreamsService.prototype as any,
        "testManifestUrlRequest"
      )
      expect(testManifestUrlSpy).not.toHaveBeenCalled()
      videoStreamParams.videoId = null
      expect(videoStreamsService.setParams(videoStreamParams).getVideoStream()).rejects.toThrow(
        new InternalServerErrorException()
      )
    })

    it("Get videoStream failes to set video stream", () => {
      videoStreamParams.videoId = videoId
      delete httpServiceGetData.data.data.episode
      const mockHttpServiceGet = {
        toPromise: () => Promise.resolve(httpServiceGetData)
      }
      httpService.get = jest.fn().mockImplementation(() => mockHttpServiceGet)
      expect(videoStreamsService.setParams(videoStreamParams).getVideoStream()).rejects.toThrow(
        new InternalServerErrorException()
      )
    })

    it("Get videoStream failes to get duration while setting video stream", () => {
      videoStreamParams.videoId = videoId
      delete httpServiceGetData.data.data.duration
      httpServiceGetData.data.data.episode = episode
      const mockHttpServiceGet = {
        toPromise: () => Promise.resolve(httpServiceGetData)
      }
      httpService.get = jest.fn().mockImplementation(() => mockHttpServiceGet)
      expect(videoStreamsService.setParams(videoStreamParams).getVideoStream()).rejects.toThrow(
        new InternalServerErrorException()
      )
    })

    it("Get videoStream failes to store video stream in database", () => {
      videoStreamParams.videoId = videoId
      httpServiceGetData.data.data.duration = duration
      const mockHttpServiceGet = {
        toPromise: () => Promise.resolve(httpServiceGetData)
      }
      httpService.get = jest.fn().mockImplementation(() => mockHttpServiceGet)
      videoStreamsRepo.store = jest.fn().mockRejectedValue(Error)
      expect(videoStreamsService.setParams(videoStreamParams).getVideoStream()).rejects.toThrow(
        new InternalServerErrorException()
      )
    })
  })
})
