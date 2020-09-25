import { Injectable } from "@nestjs/common"
import { EncryptionKeypair } from "src/entities/encryption-keypair.entity"
import { EncryptionKeypairRepository } from "./encryptionkeypair.repository"
import { CreateKeypairDataDto } from "./dto/create-keypair-data.dto"

@Injectable()
export class EncryptionKeypairService {
  constructor(private repository: EncryptionKeypairRepository) {}

  createKeypair(createKeypairDataDto: CreateKeypairDataDto): Promise<EncryptionKeypair> {
    return this.repository.createKeypair(createKeypairDataDto)
  }

  getPartnerEncryptionKeypairs(clientId: string): Promise<EncryptionKeypair[]> {
    return this.repository.getPartnerEncryptionKeypairs(clientId)
  }
}
