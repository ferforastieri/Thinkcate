import { Controller, Post, UseInterceptors, UploadedFile, Body, BadRequestException, UseGuards } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { UploadService } from '../services/upload.service';
import { createMulterConfig } from '../config/multer.config';
import { JwtAuthGuard } from '../../../shared/auth/guards/jwt-auth.guard';

@Controller('upload')
@UseGuards(JwtAuthGuard)
export class UploadController {
  constructor(
    private readonly uploadService: UploadService,
    private readonly configService: ConfigService,
  ) {}

  @Post('file')
  @UseInterceptors(FileInterceptor('file', createMulterConfig(new ConfigService())))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    try {
      await this.uploadService.validateFile(file);
      const filePath = await this.uploadService.saveFile(file);
      const fileInfo = this.uploadService.getFileInfo(file, filePath);
      
      return {
        message: 'File uploaded successfully',
        file: fileInfo,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
