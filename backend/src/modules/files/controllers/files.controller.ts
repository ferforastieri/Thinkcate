import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe, UseInterceptors, UploadedFile, UseGuards } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { FilesService } from '../services/files.service';
import { CreateFileDto } from '../dto/create-file.dto';
import { UpdateFileDto } from '../dto/update-file.dto';
import { UploadService } from '../../upload/services/upload.service';
import { createMulterConfig } from '../../upload/config/multer.config';
import { JwtAuthGuard } from '../../../shared/auth/guards/jwt-auth.guard';

@Controller('files')
@UseGuards(JwtAuthGuard)
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    private readonly uploadService: UploadService,
    private readonly configService: ConfigService,
  ) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', createMulterConfig(new ConfigService())))
  async uploadFile(@UploadedFile() file: Express.Multer.File, @Body() createFileDto: CreateFileDto) {
    await this.uploadService.validateFile(file);
    const filePath = await this.uploadService.saveFile(file);
    const fileInfo = this.uploadService.getFileInfo(file, filePath);
    return this.filesService.create(createFileDto, fileInfo);
  }

  @Get()
  findAll(
    @Query('page', new ParseIntPipe({ optional: true })) page: number = 1,
    @Query('limit', new ParseIntPipe({ optional: true })) limit: number = 10,
  ) {
    return this.filesService.findAll(page, limit);
  }

  @Get('search')
  search(@Query('q') query: string) {
    return this.filesService.search(query);
  }

  @Get('favorites')
  findFavorites() {
    return this.filesService.findFavorites();
  }

  @Get('type/:type')
  findByType(@Param('type') type: string) {
    return this.filesService.findByType(type);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.filesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateFileDto: UpdateFileDto) {
    return this.filesService.update(id, updateFileDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.filesService.remove(id);
  }
}