import { Test } from "@nestjs/testing"
import { ContentmetadataService } from "../contentmetadata.service"
import { HttpService } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"

describe("ContentmetadataService", () => {
  let contentmetadataService, httpService

  const mockHttpService = () => ({
    get: jest.fn()
  })

  const mockConfigService = () => ({
    get: jest.fn().mockImplementation((key: string) => {
      switch (key) {
        case "api.contentBaseUrl":
          return "https://api.example.com/v2"
        default:
          break
      }
    })
  })

  const httpServiceGetContentMetaData = {
    data: {
      success: true,
      data: {
        "tag": {},
        "audio": [Array],
        "event": [Object],
        "video": [Array],
        "season": [Object],
        "series": [Object],
        "enabled": true,
        "episode": [Object],
        "duration": 19177.322667,
        "language": "en",
        "priority": "standard",
        "revision": [Object],
        "companion": {},
        "published": true,
        "cue_points": [Array],
        "geo_policy": [Object],
        "uploadType": "standard",
        "video_type": "full_episode",
        "ads_enabled": false,
        "sunset_date": "2099-01-01T00:00:00Z",
        "availability": 2,
        "release_date": "1970-01-01T00:00:00Z",
        "frame_preview": [Array],
        "closed_caption": [Array],
        "content-package": [Object],
        "cue_points_json": [Array],
        "ghost_vod_record": false,
        "programming_block": -1
      }
    }
  }

  const httpServiceGetSeriesMetaData = {
    data: {
      success: true,
      data: {
        series: {
          id: 488,
          name: [
            {
              long: "Zack & Curt Figure It Out",
              short: "Z & C Figure it Out",
              medium: "Zack & Curt Figure It Out",
              language: "en",
              extra_long: "Zack & Curt Figure It Out"
            }
          ],
          type: { contentId: "8e13615a-b200-11e8-9e0c-0ec1498482d4" },
          class: { contentId: "b8dbecd6-8394-11e8-ab20-0ec1498482d4" },
          genre: [{ contentId: "85e49dfa-2606-11e8-ae10-0ec1498482d4" }],
          image: [
            {
              mime: "image/jpeg",
              path: "Z-C-Figure-it-Out_488_Series_KAClean_HD.jpg",
              size: "1755815",
              type: "still",
              width: "3840",
              height: "2160",
              assetid: "-1",
              checksum: "f3c3ce9c6c606fc6e7d061603c60cd07"
            },
            {
              mime: "image/jpeg",
              path: "Z-C-Figure-it-Out_488_Series_KA_HD.jpg",
              size: "1929586",
              type: "still",
              width: "3840",
              height: "2160",
              assetid: "-1",
              checksum: "d40158bd187224f4c427fe6bcdaaf0a1"
            },
            {
              mime: "image/png",
              path: "Z-C-Figure-it-Out_488_Series_Logo_HD.png",
              size: "336636",
              type: "still",
              width: "1650",
              height: "450",
              assetid: "-1",
              checksum: "db802a9380091a94d21250ee96c3a012"
            }
          ],
          contentId: "88d64376-e06a-4c15-8315-e67f718e2580",
          rating: {},
          version: "1.0.0",
          category: { contentId: "4b3c6e0c-8395-11e8-b40b-0ec1498482d4" },
          revision: "1",
          synopsis: [
            {
              long:
                "Two hosts present a toy-hunting show focused on rare and vintage action figures.",
              short:
                "Two hosts present a toy-hunting show focused on rare and vintage action figures.",
              language: "en"
            }
          ],
          franchise: { contentId: "18696c0a-a844-11e7-9ec0-0026b9565d91" }
        }
      }
    }
  }

  const httpServiceGetSeasonMetaData = {
    data: {
      success: true,
      data: {
        season: {
          name: [{ name: "Zack & Curt Figure It Out - 2", language: "en" }],
          year: 2019,
          image: [],
          contentId: "35ac90e3-7817-47c1-86c9-aa15b9b2889d",
          number: 2,
          series: { contentId: "88d64376-e06a-4c15-8315-e67f718e2580" },
          version: "1.0.0",
          revision: "1",
          sequence: 2,
          synopsis: [
            {
              long:
                "Two hosts continue their toy-hunting show, discovering rare collectible figures from different eras.",
              short: "",
              language: "en"
            }
          ],
          programming_block: 30
        }
      }
    }
  }

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ContentmetadataService,
        { provide: HttpService, useFactory: mockHttpService },
        { provide: ConfigService, useFactory: mockConfigService }
      ]
    }).compile()

    contentmetadataService = await module.get<ContentmetadataService>(ContentmetadataService)
    httpService = await module.get<HttpService>(HttpService)
  })

  describe("getVideoById", () => {
    it("Returns content data", async () => {
      const contentId = "contentId"
      const mockHttpServiceGet = {
        toPromise: () => Promise.resolve(httpServiceGetContentMetaData)
      }
      httpService.get = jest.fn().mockImplementationOnce(() => mockHttpServiceGet)
      const content = await contentmetadataService.getVideoById(contentId)
      expect(content).toHaveProperty("video_type")
      expect(content).toHaveProperty("content-package")
      expect(content).toHaveProperty("release_date")
      expect(content).toHaveProperty("sunset_date")
      expect(content).toHaveProperty("ads_enabled")
      expect(content).toHaveProperty("availability")
      expect(content).toHaveProperty("closed_caption")
      expect(content).toHaveProperty("episode")
      expect(content).toHaveProperty("event")
      expect(content).toHaveProperty("tag")
      expect(content).toHaveProperty("series")
      expect(content).toHaveProperty("season")
      expect(content).toHaveProperty("companion")
    })
  })
  describe("getSeriesById", () => {
    it("Returns series data", async () => {
      const contentId = "contentId"
      const mockHttpServiceGet = {
        toPromise: () => Promise.resolve(httpServiceGetSeriesMetaData)
      }
      httpService.get = jest.fn().mockImplementationOnce(() => mockHttpServiceGet)
      const series = await contentmetadataService.getSeriesById(contentId)
      expect(series).toHaveProperty("id")
      expect(series).toHaveProperty("name")
      expect(series).toHaveProperty("type")
      expect(series).toHaveProperty("class")
      expect(series).toHaveProperty("genre")
      expect(series).toHaveProperty("image")
      expect(series).toHaveProperty("contentId")
      expect(series).toHaveProperty("rating")
      expect(series).toHaveProperty("version")
      expect(series).toHaveProperty("category")
      expect(series).toHaveProperty("revision")
      expect(series).toHaveProperty("synopsis")
      expect(series).toHaveProperty("franchise")
    })
  })
  describe("getSeasonById", () => {
    it("Returns season data", async () => {
      const contentId = "contentId"
      const mockHttpServiceGet = {
        toPromise: () => Promise.resolve(httpServiceGetSeasonMetaData)
      }
      httpService.get = jest.fn().mockImplementationOnce(() => mockHttpServiceGet)
      const season = await contentmetadataService.getSeasonById(contentId)
      expect(season).toHaveProperty("name")
      expect(season).toHaveProperty("year")
      expect(season).toHaveProperty("image")
      expect(season).toHaveProperty("contentId")
      expect(season).toHaveProperty("number")
      expect(season).toHaveProperty("series")
      expect(season).toHaveProperty("version")
      expect(season).toHaveProperty("revision")
      expect(season).toHaveProperty("sequence")
      expect(season).toHaveProperty("synopsis")
      expect(season).toHaveProperty("programming_block")
    })
  })
})
