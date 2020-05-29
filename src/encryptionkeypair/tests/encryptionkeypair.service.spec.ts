import { Test } from "@nestjs/testing"
import { EncryptionKeypairRepository } from "../encryptionkeypair.repository"
import { EncryptionKeypairService } from "../encryptionkeypair.service"
import { CreateKeypairDataDto } from "../dto/create-keypair-data.dto"

describe('Encryption Key Pair Service', () => {
    let encryptionKeypairRepository, encryptionKeypairService

    const mockEncryptionKeypairRepository = () => ({
        createKeypair: jest.fn(),
    })

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                EncryptionKeypairService,
                { provide: EncryptionKeypairRepository, useFactory: mockEncryptionKeypairRepository }
            ]
        }).compile()

        encryptionKeypairRepository = await module.get<EncryptionKeypairRepository>(EncryptionKeypairRepository)
        encryptionKeypairService = await module.get<EncryptionKeypairService>(EncryptionKeypairService)
    })

    describe('createKeypair', () => {
        it('Create key pair from service was successful', async () => {
            const dataDto: CreateKeypairDataDto = {
                clientId: 'testClientId',
                secret: 'testSecret'
            }

            const resolvedObject = {
                id: 'testId',
                clientId: 'testClientId',
                publicKey: 'testPublicKey',
                privateKey: 'testPrivateKey'
            }

            encryptionKeypairRepository.createKeypair.mockResolvedValue(resolvedObject);

            expect(encryptionKeypairRepository.createKeypair).not.toHaveBeenCalled()
            const result = await encryptionKeypairService.createKeypair(dataDto)
            expect(result).toEqual(resolvedObject)
        })
    })
})