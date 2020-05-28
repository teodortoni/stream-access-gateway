import { Test } from "@nestjs/testing"
import { EncryptionKeypairRepository } from "../encryptionkeypair.repository"
import { CreateKeypairDataDto } from "../dto/create-keypair-data.dto"
import { InternalServerErrorException } from "@nestjs/common"
import { EntityManager } from "typeorm"

describe('Encryption Key Pair Repository', () => {
    let encryptionKeypairRepository

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                EncryptionKeypairRepository,
                EntityManager,
            ]
        }).compile()

        encryptionKeypairRepository = await module.get<EncryptionKeypairRepository>(EncryptionKeypairRepository)
    })

    describe('createKeypair', () => {
        let save

        const createKeypairDataDto: CreateKeypairDataDto = {
            clientId: 'testClientId',
            secret: 'testClientSecret'
        }

        beforeEach(() => {
            save = jest.fn()
            encryptionKeypairRepository.manager.create = jest.fn().mockReturnValue({ save })
        })

        it('Creation of key pair was successful', async () => {
            save.mockResolvedValue(true)
            
            const result = await encryptionKeypairRepository.createKeypair(createKeypairDataDto)
            expect(result).toHaveProperty('clientId', 'testClientId')
            expect(result).toHaveProperty('publicKey')
            expect(result).toHaveProperty('privateKey')
        })

        it('Creation of key pair failed with InternalServerErrorException', () => {
            save.mockRejectedValue({ code: undefined })
            expect(encryptionKeypairRepository.createKeypair(createKeypairDataDto)).rejects.toThrow(new InternalServerErrorException)
        })
    })
})