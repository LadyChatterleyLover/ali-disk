import { Module } from '@nestjs/common'
import { FileService } from './file.service'
import { FileController } from './file.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { File } from './entities/file.entity'
import { User } from '../user/entities/user.entity'
import { ConfigService } from '@nestjs/config'
import { UploadGateway } from '../gateway/upload.gateway'

@Module({
  imports: [TypeOrmModule.forFeature([File, User])],
  controllers: [FileController],
  providers: [FileService, ConfigService, UploadGateway],
})
export class FileModule {}
