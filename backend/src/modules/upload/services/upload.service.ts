import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class UploadService {
  constructor(private configService: ConfigService) {}

  async validateFile(file: Express.Multer.File): Promise<void> {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const maxSize = this.configService.get<number>('MAX_FILE_SIZE', 52428800); // 50MB
    if (file.size > maxSize) {
      throw new BadRequestException(`File size exceeds ${maxSize} bytes`);
    }

    const allowedMimes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
      'text/plain',
      'text/markdown',
    ];

    if (!allowedMimes.includes(file.mimetype)) {
      throw new BadRequestException('File type not supported');
    }
  }

  async saveFile(file: Express.Multer.File): Promise<string> {
    const uploadDir = this.configService.get<string>('UPLOAD_DIR', 'data/uploads');
    
    // Ensure upload directory exists
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const filename = `file-${uniqueSuffix}${ext}`;
    const filePath = path.join(uploadDir, filename);

    // Save file
    fs.writeFileSync(filePath, file.buffer);

    return filePath;
  }

  async deleteFile(filePath: string): Promise<void> {
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (error) {
      console.error(`Error deleting file ${filePath}:`, error);
    }
  }

  getFileInfo(file: Express.Multer.File, filePath: string) {
    return {
      filename: path.basename(filePath),
      originalFilename: file.originalname,
      filePath: filePath,
      fileType: file.mimetype,
      fileSize: file.size,
    };
  }
}
