import { BadRequestException } from "@nestjs/common"
import {
  generatePublicPrivateKeyPair,
  generateHmacSignature,
  expiresAt,
  getUnixTimestamp
} from "../helpers"

describe("generatePublicPrivateKeyPair", () => {
  it("key pair successfully generated", async () => {
    const keyPair = await generatePublicPrivateKeyPair("testsecret")
    expect(keyPair).toHaveProperty("publicKey")
    expect(keyPair).toHaveProperty("privateKey")
  })

  it("key pair fails to generate", () => {
    expect(generatePublicPrivateKeyPair(undefined)).rejects.toThrow(BadRequestException)
  })
})

describe("generateHmacSignature", () => {
  it("hmac signature successfully generated", async () => {
    const hmacSignature = await generateHmacSignature("testsecret")
    expect(typeof hmacSignature).toBe("string")
  })

  it("hmac signature fails to generate", () => {
    expect(generateHmacSignature(undefined)).rejects.toThrow(BadRequestException)
  })
})

describe("expiresAt", () => {
  it("generates expiresAt date", () => {
    const expiresAtDate = expiresAt(5)
    expect(typeof expiresAtDate).toBe("object")
  })
})

describe("getUnixTimestamp", () => {
  it("generates getUnixTimestamp", () => {
    const getUnixTimestampDate = getUnixTimestamp(new Date())
    expect(typeof getUnixTimestampDate).toBe("number")
  })
})
