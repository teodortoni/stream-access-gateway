import { Module } from '@nestjs/common';
import { EncryptionKeypairService } from './encryptionkeypair.service';
import { EncryptionKeypairRepository} from './encryptionkeypair.repository';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([EncryptionKeypairRepository]),
  ],
  providers: [EncryptionKeypairService, EncryptionKeypairRepository],
  exports: [EncryptionKeypairService, EncryptionKeypairRepository],
})
export class EncryptionKeypairModule {}
