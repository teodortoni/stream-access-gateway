import { Injectable } from '@nestjs/common';
import { EncryptionKeypair } from 'src/entities/encryption-keypair.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { EncryptionKeypairRepository } from './encryptionkeypair.repository';
import { CreateKeypairDataDto } from './dto/create-keypair-data.dto';

@Injectable()
export class EncryptionKeypairService {
    constructor(
        @InjectRepository(EncryptionKeypairRepository)
        private encryptionKeypairRepository: EncryptionKeypairRepository,
    ){}
    createKeypair(createKeypairDataDto: CreateKeypairDataDto): Promise<EncryptionKeypair> {
        return this.encryptionKeypairRepository.createKeypair(createKeypairDataDto);
    }
}
