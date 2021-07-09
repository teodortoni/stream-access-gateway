import * as crypto from "crypto"
import { BadRequestException } from "@nestjs/common"
import configs from "../config/defaultconfigs"

export const generatePublicPrivateKeyPair = async (secret: string): Promise<object> => {
  try {
    return crypto.generateKeyPairSync("rsa", {
      modulusLength: 4096,
      publicKeyEncoding: {
        type: "spki",
        format: "pem"
      },
      privateKeyEncoding: {
        type: "pkcs8",
        format: "pem",
        cipher: "aes-256-cbc",
        passphrase: secret
      }
    })
  } catch (error) {
    console.error("Method: generatePublicPrivateKeyPair, error:", error)
    throw new BadRequestException()
  }
}

export const generateHmacSignature = async (secret: string): Promise<string> => {
  try {
    const hmac = crypto.createHmac(configs().app.crypto.hmac.algorithm, secret)
    return hmac.digest("hex")
  } catch (error) {
    console.error("Method: generateHmacSignature, error:", error)
    throw new BadRequestException()
  }
}

export const expiresAt = (seconds: number): Date => {
  const dateTime = new Date()
  return new Date(dateTime.getTime() + seconds * 1000)
}

export const getUnixTimestamp = (date: Date): number => {
  return Math.round(date.getTime() / 1000)
}
