import { Test } from "@nestjs/testing";
import { PartnersRepository } from "../partners.repository";
import { v4 as uuid } from "uuid";
import * as bcrypt from "bcrypt";
import { ConflictException, InternalServerErrorException } from "@nestjs/common";

// Mocks the uuid() methood to generate iss (client_id)
jest.mock('uuid');

describe('PartnersRepository', () => {
    let partnersRepository;
    let salt;

    const mockAuthCredentialsDto = {
        name: 'testName',
        username: 'testUsername',
        password: 'Th1s1sat3stpwd',
    };

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                PartnersRepository,
            ]
        }).compile();

        partnersRepository = await module.get<PartnersRepository>(PartnersRepository);

        salt = await bcrypt.genSalt();
    });

    describe('hashedPassword', () => {
        it('Generate hashed password', async () => {
            bcrypt.hash = jest.fn().mockResolvedValue('testhash');
            expect(bcrypt.hash).not.toHaveBeenCalled();
            const result = await partnersRepository.hashedPassword('testpassword', salt);
            expect(bcrypt.hash).toHaveBeenCalledWith('testpassword', salt);
            expect(result).toEqual('testhash');
        });
    });

    describe('signUp', () => {
        let save;
        let clientId;
        let salt;
        let hash;
        let keyPair;

        beforeEach(async () => {
            save = jest.fn();
            partnersRepository.create = jest.fn().mockReturnValue({ save });

            // Mock variables
            clientId = 'testuuid';
            salt = await bcrypt.genSalt();
            hash = await bcrypt.hash(mockAuthCredentialsDto.password, salt);
            keyPair = { publicKey: 'testpublickey', privateKey: 'testprivatekey' };

            // Mock uuid. Generation of iss
            uuid.mockReturnValue(clientId);

            // Mock hashedPassword
            partnersRepository.hashedPassword = jest.fn().mockResolvedValue(hash);

            // Mock generatePublicPrivateKeyPair
            partnersRepository.generatePublicPrivateKeyPair = jest.fn().mockResolvedValue(keyPair);
        });

        it('Partner sign up was successful', async () => {
            // Mock partners entity save method
            save.mockResolvedValue(true);

            expect(partnersRepository.hashedPassword).not.toHaveBeenCalled();
            expect(partnersRepository.generatePublicPrivateKeyPair).not.toHaveBeenCalled();
            const result = await partnersRepository.signUp(mockAuthCredentialsDto);
            expect(partnersRepository.hashedPassword).toHaveBeenCalled();
            expect(partnersRepository.generatePublicPrivateKeyPair).toHaveBeenCalled();
            expect(result).toMatchObject({
                'client_id': clientId,
                'public_key': keyPair.publicKey,
                'private_key': keyPair.privateKey
            });
        });

        it('Partner sign up failed because of username conflict', () => {
            // Mock partners entity save method
            save.mockRejectedValue({ code: '23505' });
            expect(partnersRepository.signUp(mockAuthCredentialsDto)).rejects.toThrow(new ConflictException('Username entered is already taken.'));
        });

        it('Partner sign up failed with InternalServerErrorException', () => {
            save.mockRejectedValue(InternalServerErrorException);
            expect(partnersRepository.signUp(mockAuthCredentialsDto)).rejects.toThrow(new InternalServerErrorException);
        });
    });

    describe('generatePublicPrivateKeyPair', () => {
        it('Public & Private key pair generated', () => {
            expect(partnersRepository.generatePublicPrivateKeyPair('testsecret')).resolves.not.toThrow(new InternalServerErrorException);
        });

        it('Public & Private key pair failed', () => {
            expect(partnersRepository.generatePublicPrivateKeyPair).rejects.toThrow(new InternalServerErrorException);
        });
    });
});