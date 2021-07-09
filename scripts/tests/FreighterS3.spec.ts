import { S3 } from "aws-sdk"
import { ConfigService } from "@nestjs/config"
import { FreighterS3 } from "../FreighterS3"
import { Test } from "@nestjs/testing"
import { NotFoundException } from "@nestjs/common"

const mockS3GetObject = jest.fn()
jest.mock("aws-sdk", () => {
  return {
    S3: jest.fn(() => ({
      getObject: mockS3GetObject
    }))
  }
})

describe("get", () => {
  let freighterS3: FreighterS3
  beforeEach(async () => {
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
      providers: [{ provide: ConfigService, useFactory: mockConfigService }, FreighterS3]
    }).compile()

    freighterS3 = await module.get<FreighterS3>(FreighterS3)
  })

  it("return results successfully", async () => {
    mockS3GetObject.mockImplementationOnce(() => {
      return {
        promise: jest.fn(
          () =>
            "series/W/WrestleMania_33/WrestleMania-2021_2451/WM37Sa_Ntwk/WM37Sa_Ntwk_Episodic_Logo_HD.png"
        )
      }
    })
    const result = await freighterS3.get("series/W/WrestleMania_33")
    expect(result).toMatch(
      "series/W/WrestleMania_33/WrestleMania-2021_2451/WM37Sa_Ntwk/WM37Sa_Ntwk_Episodic_Logo_HD.png"
    )
  })

  it("fails because file was not found in S3 bucket", async () => {
    mockS3GetObject.mockImplementationOnce(() => {
      return {
        promise: jest.fn(() => Promise.reject())
      }
    })
    await expect(freighterS3.get("series/W/WrestleMania_33")).rejects.toThrow(NotFoundException)
  })
})
