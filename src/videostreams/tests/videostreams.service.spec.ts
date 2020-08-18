import { Test } from "@nestjs/testing"
import { VideostreamsService } from "../videostreams.service"
import { VideoStreamsRepository } from "../videostreams.repository"
import { HttpService, InternalServerErrorException } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { VideoStreamParams } from "../dto/video-streams-params.dto"
import * as EdgeAuth from "akamai-edgeauth"

jest.mock("akamai-edgeauth", () => {
  return jest.fn().mockImplementation(() => {
    return {
      options: {
        tokenName: "__token__"
      },
      generateURLToken: jest.fn().mockImplementation((url) => {
        if (!url) {
          throw new Error("You must provide url")
        }
        return "exp=1596479508~hmac=de557804aebb84ca52e5bc1db93735ca5ef14f16a134747acd9bc172e0ff54a9"
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
          ]
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
          return "bfdcd7b89fe2359d14d2a9ca5e4178e1"

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
        { provide: VideoStreamsRepository, useFactory: mockVideoStreamsRepo }
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
      httpService.get = jest.fn().mockImplementationOnce(() => mockHttpServiceGet)
      const result = await videoStreamsService.setParams(videoStreamParams).getVideoStream()
      expect(result).toMatchObject({
        duration: "05:19:37",
        id: "ee7d26cd-e319-428f-b067-ee7d40c9f767",
        manifestUrl:
          "http://vod.sonyliv.wwe.com/vod/e/ee7d26cd_e319_428f_b067_ee7d40c9f767/hls/ee7d26cd_e319_428f_b067_ee7d40c9f767.m3u8?hdnts=exp=1596479508~hmac=de557804aebb84ca52e5bc1db93735ca5ef14f16a134747acd9bc172e0ff54a9",
        name: [
          {
            extra_long: "WrestleMania 35",
            language: "en",
            long: "WrestleMania 35",
            medium: "WrestleMania 35",
            short: "WrestleMania 35"
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

    it("Get videoStream failes to set content path", () => {
      const mockHttpServiceGet = {
        toPromise: () => Promise.resolve(httpServiceGetData)
      }
      httpService.get = jest.fn().mockImplementationOnce(() => mockHttpServiceGet)
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
      httpService.get = jest.fn().mockImplementationOnce(() => mockHttpServiceGet)
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
      httpService.get = jest.fn().mockImplementationOnce(() => mockHttpServiceGet)
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
      httpService.get = jest.fn().mockImplementationOnce(() => mockHttpServiceGet)
      videoStreamsRepo.store = jest.fn().mockRejectedValue(Error)
      expect(videoStreamsService.setParams(videoStreamParams).getVideoStream()).rejects.toThrow(
        new InternalServerErrorException()
      )
    })
  })
})
